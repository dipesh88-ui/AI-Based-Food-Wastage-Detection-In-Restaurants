import Groq from 'groq-sdk';

export interface AnalyzeUploadedFoodImageInput {
  foodImageDataUri: string;
}

export interface AnalyzeUploadedFoodImageOutput {
  foodWasteAnalysis: {
    foodType: string;
    estimatedQuantity: string;
    analysisDetails: {
      total_waste: number;
      total_weight_kg: number;
      total_distinct_items: number;
      items: {
        name: string;
        grams: number;
        weight_kg: number;
        quantity: number;
        unit: string;
        quantity_type: 'count_based' | 'volume_based';
        estimated_count?: number;
        percentage: number;
        color: string;
        confidence: number;
        assumptions: string[];
      }[];
      non_food_detected?: {
        name: string;
        included_in_food_weight: boolean;
      }[];
      method_summary: {
        estimation_mode: string;
        scale_reference_used: string;
        estimation_basis: string[];
        consistency_rules_applied: boolean;
      };
      confidence: number;
      summary: string;
    };
  };
}

const FIXED_COLOR_MAP: Record<string, string> = {
  "Tomato": "#E74C3C",
  "Cherry Tomatoes": "#E74C3C",
  "Leafy Greens": "#2ECC71",
  "Carrot": "#F39C12",
  "Carrot Sticks": "#F39C12",
  "Broccoli": "#27AE60",
  "Potato": "#F1C40F",
  "Radish": "#E84393",
  "Grapes": "#8E44AD",
  "Watermelon": "#16A085",
  "Melon": "#1ABC9C",
  "Cabbage": "#58D68D",
  "Mixed Fruits": "#FF8A65",
  "Root Vegetables": "#D68910"
};

function getStableColor(name: string): string {
    const normalized = name.trim();
    if (FIXED_COLOR_MAP[normalized]) return FIXED_COLOR_MAP[normalized];
    
    // Fallback for sub-matches
    for (const [key, color] of Object.entries(FIXED_COLOR_MAP)) {
        if (normalized.includes(key) || key.includes(normalized)) return color;
    }
    
    // Generate a consistent color based on string if not in map
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
}

function stableRound(grams: number): number {
    if (grams < 1000) return Math.round(grams / 10) * 10;
    if (grams <= 10000) return Math.round(grams / 50) * 50;
    return Math.round(grams / 100) * 100;
}

export async function analyzeUploadedFoodImage(input: AnalyzeUploadedFoodImageInput): Promise<AnalyzeUploadedFoodImageOutput> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'INSERT_YOUR_GROQ_API_KEY_HERE') {
    console.warn('Using mock response because NEXT_PUBLIC_GROQ_API_KEY is not configured properly.');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      foodWasteAnalysis: {
        foodType: 'Leafy Greens, Tomato',
        estimatedQuantity: '1.2 kg (1200 g)',
        analysisDetails: {
          total_waste: 1200,
          total_weight_kg: 1.2,
          total_distinct_items: 2,
          items: [
            { 
              name: "Leafy Greens", 
              grams: 650, 
              weight_kg: 0.65, 
              quantity: 1, 
              unit: "pile", 
              quantity_type: 'volume_based', 
              percentage: 54, 
              color: "#2ECC71", 
              confidence: 84, 
              assumptions: ["container used as scale reference", "low-density leafy pile with air-gap correction"] 
            },
            { 
              name: "Tomato", 
              grams: 550, 
              weight_kg: 0.55, 
              quantity: 5, 
              unit: "pieces", 
              quantity_type: 'count_based', 
              estimated_count: 5, 
              percentage: 46, 
              color: "#E74C3C", 
              confidence: 90, 
              assumptions: ["Count based on visible top-layer objects"] 
            }
          ],
          non_food_detected: [
             { name: "Plastic lid", included_in_food_weight: false }
          ],
          method_summary: {
            estimation_mode: "deterministic",
            scale_reference_used: "container or visible pile boundary",
            estimation_basis: ["count estimation", "area estimation", "depth estimation", "volume approximation", "fixed food-density assumptions"],
            consistency_rules_applied: true
          },
          confidence: 87,
          summary: '1200g of waste detected with deterministic consistency.'
        }
      }
    };
  }

  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  
  // Extract base64 and mime type from data URI
  const match = input.foodImageDataUri.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URI format. Please ensure you are uploading a valid image.');
  }
  const mimeType = match[1];
  const base64Data = match[2];

  try {
    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0,
      top_p: 1,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `You are a deterministic food-waste estimation engine.

PRIMARY GOAL:
Consistency. Same image must produce the same result every time.

STRICT RULES:
- ROUNDING: <1kg -> nearest 10g, 1-10kg -> nearest 50g, >10kg -> nearest 100g.
- LABELING: Use stable, normalized labels (Tomato, Leafy Greens, Carrot Sticks). No broad/narrow switching.
- EXCLUSION: Exclude trays, lids, plastic, packaging from food weight.
- LOGIC: Detect container -> Identify Categories -> Estimate Count/Area/Depth -> Volume -> Fixed Density -> Rounding -> Sum.
- SAFETY: Do not hallucinate. Do not inflate. Reject unrealistic totals.

--------------------------------------------------

OUTPUT FORMAT (STRICT JSON ONLY):
Return response inside "foodWasteAnalysis" key:
{
  "detected_food_items": [
    {
      "name": "Normalized Item Name",
      "quantity_type": "count_based or volume_based",
      "estimated_count": number or null,
      "estimated_net_weight_gm": number,
      "estimated_net_weight_kg": number,
      "percentage_of_total": number,
      "confidence": 0.0-1.0,
      "assumptions": ["string"]
    }
  ],
  "non_food_detected": [
    { "name": "string", "included_in_food_weight": false }
  ],
  "summary": {
    "total_wastage_gm": number,
    "total_wastage_kg": number,
    "overall_confidence": 0.0-1.0
  },
  "method_summary": {
    "scale_reference_used": "string",
    "estimation_basis": ["string"]
  }
}` },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
          ]
        }
      ],
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      throw new Error('Groq returned an empty response.');
    }

    const rawResult = JSON.parse(text);
    const analysis = rawResult.foodWasteAnalysis;

    // Apply Server-Side Deterministic Post-Processing
    let totalGrams = 0;
    const processedItems = analysis.detected_food_items.map((item: any) => {
      const roundedGrams = stableRound(item.estimated_net_weight_gm);
      totalGrams += roundedGrams;
      
      return {
        name: item.name,
        grams: roundedGrams,
        weight_kg: Number((roundedGrams / 1000).toFixed(3)),
        quantity: item.estimated_count || 1,
        unit: item.quantity_type === 'count_based' ? 'pieces' : 'portion',
        quantity_type: item.quantity_type,
        estimated_count: item.estimated_count,
        percentage: 0, // Calculated after total is known
        color: getStableColor(item.name),
        confidence: Math.round(item.confidence * 100),
        assumptions: item.assumptions
      };
    });

    // Finalize percentages and totals
    processedItems.forEach((item: any) => {
        item.percentage = Math.round((item.grams / (totalGrams || 1)) * 100);
    });

    return {
      foodWasteAnalysis: {
        foodType: processedItems.map((i: any) => i.name).join(', '),
        estimatedQuantity: `${(totalGrams / 1000).toFixed(3)} kg (${totalGrams} g)`,
        analysisDetails: {
          total_waste: totalGrams,
          total_weight_kg: Number((totalGrams / 1000).toFixed(3)),
          total_distinct_items: processedItems.length,
          analysis_timestamp: new Date().toISOString(),
          image_record_date: new Date().toISOString().split('T')[0],
          items: processedItems,
          non_food_detected: analysis.non_food_detected,
          method_summary: {
              ...analysis.method_summary,
              estimation_mode: "deterministic",
              consistency_rules_applied: true
          },
          confidence: Math.round(analysis.summary.overall_confidence * 100),
          summary: `${(totalGrams / 1000).toFixed(3)}kg of waste detected with stable deterministic logic.`
        }
      }
    } as AnalyzeUploadedFoodImageOutput;
  } catch (error: any) {
    console.error('Groq API Error:', error);
    if (error.message?.includes('API key not valid') || error.status === 401) {
      throw new Error('The provided Groq API key is invalid. Please check your configuration.');
    }
    if (error.message?.includes('quota') || error.status === 429) {
      throw new Error('Groq API quota exceeded. Please try again later.');
    }
    throw new Error(`AI Analysis failed: ${error.message || 'Unknown error'}`);
  }
}

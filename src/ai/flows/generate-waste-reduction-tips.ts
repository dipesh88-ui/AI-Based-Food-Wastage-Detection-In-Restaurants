import Groq from 'groq-sdk';

export interface WasteReductionTipsInput {
  wasteAnalytics: string;
  restaurantType: string;
  menuItems: string;
}

export interface WasteReductionTipsOutput {
  tips: string[];
}

export async function generateWasteReductionTips(
  input: WasteReductionTipsInput
): Promise<WasteReductionTipsOutput> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey || apiKey === 'INSERT_YOUR_GROQ_API_KEY_HERE') {
    return {
      tips: [
        "Reduce portion sizes for dishes with high wastage (Mocked).",
        "Implement a FIFO (First In, First Out) system for food storage (Mocked).",
        "Offer discounts on nearing expiry date items (Mocked)."
      ]
    };
  }
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an expert in food waste reduction for restaurants. Based on the provided waste analytics, restaurant type and menu items, generate personalized tips for the restaurant to reduce food waste.

Waste Analytics: ${input.wasteAnalytics}
Restaurant Type: ${input.restaurantType}
Menu Items: ${input.menuItems}

Provide specific and actionable tips that the restaurant can implement immediately. Focus on solutions tailored to their specific situation.

Tips should be clear, concise, and easy to understand. The tips should be returned as an array of strings in a JSON object with the key "tips".

Example JSON output:
{
  "tips": [
    "Reduce portion sizes for dishes with high wastage.",
    "Implement a FIFO (First In, First Out) system for food storage.",
    "Offer discounts on nearing expiry date items.",
    "Compost food waste."
  ]
}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('No response from Groq');
  }

  return JSON.parse(text) as WasteReductionTipsOutput;
}

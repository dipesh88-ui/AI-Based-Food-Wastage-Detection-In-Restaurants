export interface WasteData {
  id: string;
  foodType: string;
  estimatedQuantity: string;
  timestamp: string;
  imageUrl?: string;
  analysisDetails?: {
    total_waste: number;
    total_weight_kg: number;
    total_distinct_items: number;
    analysis_timestamp?: string;
    image_record_date?: string;
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
}

export interface WasteReductionTip {
  id: string;
  title: string;
  description: string;
  category: 'inventory' | 'preparation' | 'storage' | 'portioning';
}

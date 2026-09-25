export type AlgorithmMode = 'icmr_16_nutrient' | 'full_39_nutrient' | 'official_nutri_score';

export interface NutrientScoreDetail {
  nutrient_key: string;
  label: string;
  unit: string;
  value: number;
  points_awarded: number;
  max_possible_points: number;
  category: 'negative' | 'positive_macro' | 'positive_fatty_acid' | 'positive_mineral' | 'positive_vitamin' | 'positive_phytonutrient' | 'positive_fvl';
  percentage_of_dv?: number;
  threshold_explanation?: string;
}

export interface ScoreSummary {
  health_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  grade_color: string;
  grade_label: string;
  grade_description: string;
  positive_score: number;
  negative_penalty: number;
  raw_score: number;
  positive_max: number;
  negative_max: number;
}

export interface NutrientAnalysisSummary {
  positive_contributors: NutrientScoreDetail[];
  negative_contributors: NutrientScoreDetail[];
  all_nutrients: NutrientScoreDetail[];
  missing_values?: string[];
}

export interface AlgorithmInfo {
  mode: AlgorithmMode;
  title: string;
  version: string;
  description: string;
}

export interface FoodAnalysisResponse {
  success: boolean;
  food_name: string;
  food_category?: string;
  serving_size: number;
  serving_unit: string;
  algorithm_info: AlgorithmInfo;
  score: ScoreSummary;
  nutrient_analysis: NutrientAnalysisSummary;
  recommendations: string[];
  warnings?: string[];
  disclaimer: string;
  timestamp?: string;
}

export interface FoodFormData {
  food_name: string;
  food_category: string;
  serving_size: number | '';
  serving_unit: string;
  recipe_description: string;
  algorithm_mode: AlgorithmMode;
  
  // Negative nutrients
  energy_kcal: number | '';
  free_sugars: number | '';
  saturated_fat: number | '';
  sodium: number | '';
  cholesterol: number | '';
  
  // Positive macros
  protein: number | '';
  fibre: number | '';
  total_carbs: number | '';
  complex_carbs: number | '';
  
  // Fatty acids
  mufa: number | '';
  pufa: number | '';
  
  // Core micronutrients
  iron: number | '';
  calcium: number | '';
  vitamin_a: number | '';
  vitamin_c: number | '';
  vitamin_d: number | '';
  potassium: number | '';
  
  // Extended minerals
  zinc?: number | '';
  magnesium?: number | '';
  phosphorus?: number | '';
  copper?: number | '';
  manganese?: number | '';
  selenium?: number | '';
  chromium?: number | '';
  molybdenum?: number | '';
  
  // Extended vitamins
  vitamin_e?: number | '';
  vitamin_k?: number | '';
  thiamin_b1?: number | '';
  riboflavin_b2?: number | '';
  niacin_b3?: number | '';
  pantothenic_acid_b5?: number | '';
  vitamin_b6?: number | '';
  biotin_b7?: number | '';
  folate_b9?: number | '';
  vitamin_b12?: number | '';
  
  // Phytonutrients & official
  carotenoids?: number | '';
  fruit_veg_legume_pct?: number | '';
}

export interface SampleRecipe {
  id: string;
  name: string;
  category: string;
  description: string;
  data: Partial<FoodFormData>;
}

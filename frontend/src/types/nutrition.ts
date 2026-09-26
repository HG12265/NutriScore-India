export type AlgorithmMode = 'personalised_pndpq' | 'icmr_nin_2024' | 'full_39_nutrient' | 'icmr_16_nutrient';

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
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | string;
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

export interface DiagnosticPanelItem {
  nutrient_key: string;
  label: string;
  unit: string;
  amount_per_serving: number;
  individual_requirement: number;
  requirement_fulfilled_pct: number;
  score_points: number;
  status: string;
}

export interface PersonalisedNutriScoreResult {
  food_name: string;
  serving_size_g: number;
  demographic_key: string;
  demographic_label: string;
  demographic_description: string;
  nutriscore: number;
  grade: string;
  grade_color: string;
  grade_label: string;
  grade_description: string;
  positive_nutrient_score: number;
  negative_risk_score: number;
  benefit_risk_balance: number;
  weighted_amino_acid_score: number;
  limiting_amino_acid?: string;
  complementary_protein_label: string;
  complementary_protein_score: number;
  nutrient_density_panel: DiagnosticPanelItem[];
  protein_quality_panel: {
    weighted_amino_acid_score: number;
    limiting_amino_acid?: string;
    complementary_combination: string;
    complementary_score: number;
    complementary_description: string;
    amino_acid_coverages: Record<string, {
      mg_in_serving: number;
      daily_requirement_mg: number;
      coverage_pct: number;
      score: number;
    }>;
    biological_value_tier: string;
  };
  chronic_risk_panel: DiagnosticPanelItem[];
  demographic_insights: string[];
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
  personalised_result?: PersonalisedNutriScoreResult;
}

export interface DemographicProfile {
  key: string;
  label: string;
  age_range: string;
  sex: string;
  description: string;
  body_weight_kg: number;
  energy_kcal: number;
  protein_g: number;
  fibre_g: number;
  calcium_mg: number;
  iron_mg: number;
  zinc_mg: number;
  potassium_mg: number;
  vitamin_a_mcg: number;
  vitamin_c_mg: number;
  vitamin_d_mcg: number;
  vitamin_b1_mg: number;
  vitamin_b2_mg: number;
  vitamin_b6_mg: number;
  vitamin_b9_mcg: number;
  vitamin_b12_mcg: number;
  omega3_g: number;
  max_sodium_mg: number;
  max_saturated_fat_g: number;
  max_added_sugar_g: number;
  max_trans_fat_g: number;
  max_cholesterol_mg: number;
  max_total_fat_g: number;
  eaa_requirements_mg?: Record<string, number>;
}

export interface FoodFormData {
  food_name: string;
  food_category: string;
  serving_size: number | '';
  serving_unit: string;
  recipe_description: string;
  algorithm_mode: AlgorithmMode;
  
  // Demographic and Complementary settings
  demographic_profile?: string;
  complementary_protein_source?: string;
  auto_estimate_eaas?: boolean;

  // Negative nutrients
  energy_kcal: number | '';
  free_sugars: number | '';
  added_sugars?: number | '';
  saturated_fat: number | '';
  trans_fat?: number | '';
  total_fat?: number | '';
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
  omega3?: number | '';
  
  // Essential Amino Acids (Optional / mg)
  leucine?: number | '';
  lysine?: number | '';
  threonine?: number | '';
  histidine?: number | '';
  methionine_cysteine?: number | '';
  tryptophan?: number | '';
  valine?: number | '';
  isoleucine?: number | '';
  phenylalanine_tyrosine?: number | '';

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

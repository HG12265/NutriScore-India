import { FoodFormData, FoodAnalysisResponse, DemographicProfile } from '../types/nutrition';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function analyzeFood(formData: FoodFormData): Promise<FoodAnalysisResponse> {
  // Clean payload by converting empty strings to numbers or appropriate defaults
  const payload: Record<string, any> = {
    food_name: formData.food_name.trim(),
    food_category: formData.food_category ? formData.food_category.trim() : null,
    serving_size: Number(formData.serving_size) || 100,
    serving_unit: formData.serving_unit || 'g',
    recipe_description: formData.recipe_description || null,
    algorithm_mode: formData.algorithm_mode,
    demographic_profile: formData.demographic_profile || 'adult_male',
    complementary_protein_source: formData.complementary_protein_source || 'cereal_pulse',
  };

  const nutrientKeys = [
    'energy_kcal', 'free_sugars', 'added_sugars', 'saturated_fat', 'trans_fat', 'total_fat',
    'sodium', 'cholesterol', 'protein', 'fibre', 'total_carbs', 'complex_carbs',
    'mufa', 'pufa', 'omega3',
    'iron', 'calcium', 'vitamin_a', 'vitamin_c', 'vitamin_d', 'potassium',
    'zinc', 'magnesium', 'phosphorus', 'copper', 'manganese', 'selenium',
    'chromium', 'molybdenum', 'vitamin_e', 'vitamin_k', 'thiamin_b1',
    'riboflavin_b2', 'niacin_b3', 'pantothenic_acid_b5', 'vitamin_b6',
    'biotin_b7', 'folate_b9', 'vitamin_b12', 'carotenoids', 'fruit_veg_legume_pct',
    // 9 Essential Amino Acids
    'leucine', 'lysine', 'threonine', 'histidine', 'methionine_cysteine',
    'tryptophan', 'valine', 'isoleucine', 'phenylalanine_tyrosine'
  ];

  for (const key of nutrientKeys) {
    const val = (formData as any)[key];
    if (val !== undefined && val !== null && val !== '') {
      payload[key] = Number(val);
    } else {
      payload[key] = 0;
    }
  }

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorMessage = Array.isArray(errorJson.detail)
          ? errorJson.detail.map((d: any) => d.msg || JSON.stringify(d)).join('; ')
          : errorJson.detail;
      }
    } catch {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function fetchDemographics(): Promise<DemographicProfile[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/demographics`);
    if (res.ok) {
      const data = await res.json();
      return data.profiles || [];
    }
  } catch (err) {
    console.warn("Could not fetch demographics from API, using defaults:", err);
  }
  return [];
}

export async function fetchComplementarityRules(): Promise<Record<string, any>> {
  try {
    const res = await fetch(`${API_BASE_URL}/complementarity-rules`);
    if (res.ok) {
      const data = await res.json();
      return data.rules || {};
    }
  } catch (err) {
    console.warn("Could not fetch complementarity rules:", err);
  }
  return {};
}

export async function fetchAnalysisHistory(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/analysis-history?limit=15`);
    if (res.ok) {
      const data = await res.json();
      return data.records || [];
    }
  } catch (err) {
    console.warn("Could not fetch analysis history:", err);
  }
  return [];
}

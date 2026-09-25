import { FoodFormData, FoodAnalysisResponse } from '../types/nutrition';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function analyzeFood(formData: FoodFormData): Promise<FoodAnalysisResponse> {
  // Clean payload by converting empty strings to 0
  const payload: Record<string, any> = {
    food_name: formData.food_name.trim(),
    food_category: formData.food_category ? formData.food_category.trim() : null,
    serving_size: Number(formData.serving_size) || 100,
    serving_unit: formData.serving_unit || 'g',
    recipe_description: formData.recipe_description || null,
    algorithm_mode: formData.algorithm_mode,
  };

  const nutrientKeys = [
    'energy_kcal', 'free_sugars', 'saturated_fat', 'sodium', 'cholesterol',
    'protein', 'fibre', 'total_carbs', 'complex_carbs', 'mufa', 'pufa',
    'iron', 'calcium', 'vitamin_a', 'vitamin_c', 'vitamin_d', 'potassium',
    'zinc', 'magnesium', 'phosphorus', 'copper', 'manganese', 'selenium',
    'chromium', 'molybdenum', 'vitamin_e', 'vitamin_k', 'thiamin_b1',
    'riboflavin_b2', 'niacin_b3', 'pantothenic_acid_b5', 'vitamin_b6',
    'biotin_b7', 'folate_b9', 'vitamin_b12', 'carotenoids', 'fruit_veg_legume_pct'
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
      // Fallback to text if not json
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

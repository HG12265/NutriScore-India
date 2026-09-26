"""Request validation schemas for food analysis."""
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from ..algorithms.models import AlgorithmMode


class FoodAnalysisRequest(BaseModel):
    # Food Identification
    food_name: str = Field(..., min_length=1, max_length=150, description="Name of the recipe or food item")
    food_category: Optional[str] = Field(None, max_length=100, description="Optional food category e.g., Legumes, Cereals")
    serving_size: float = Field(100.0, gt=0, description="Serving size in specified units")
    serving_unit: str = Field("g", max_length=20, description="Unit e.g., g, ml, katori, bowl")
    recipe_description: Optional[str] = Field(None, max_length=500, description="Optional recipe notes or ingredient list")
    
    # Algorithm Selection & Personalised Demographic Profile
    algorithm_mode: AlgorithmMode = Field(AlgorithmMode.ICMR_16, description="Scoring model version to utilize")
    demographic_profile: Optional[str] = Field("adult_male", description="Life stage profile e.g. toddler, child, adolescent_male, adolescent_female, adult_male, adult_female, pregnant_woman, lactating_woman, senior_citizen, athlete")
    complementary_protein_source: Optional[str] = Field("cereal_pulse", description="Protein complementarity matrix source e.g. cereal_pulse, pulse_dairy, soy_cereal, egg_pulse, animal_source, single_cereal, single_pulse")

    # Negative Nutrients (Core)
    energy_kcal: float = Field(0.0, ge=0, description="Energy density in kcal per serving")
    free_sugars: float = Field(0.0, ge=0, description="Free / added sugars in grams")
    added_sugars: Optional[float] = Field(None, ge=0, description="Explicit added sugars in grams")
    saturated_fat: float = Field(0.0, ge=0, description="Saturated fat in grams")
    trans_fat: Optional[float] = Field(0.0, ge=0, description="Trans fatty acids in grams")
    total_fat: Optional[float] = Field(0.0, ge=0, description="Total fat in grams")
    sodium: float = Field(0.0, ge=0, description="Sodium in milligrams")
    cholesterol: float = Field(0.0, ge=0, description="Cholesterol in milligrams")

    # Core Positive Macronutrients
    protein: float = Field(0.0, ge=0, description="Protein in grams")
    fibre: float = Field(0.0, ge=0, description="Dietary fibre in grams")
    total_carbs: Optional[float] = Field(None, ge=0, description="Total carbohydrates in grams")
    complex_carbs: Optional[float] = Field(None, ge=0, description="Complex carbs in grams (or auto-derived)")

    # Beneficial Fatty Acids
    mufa: Optional[float] = Field(0.0, ge=0, description="Monounsaturated fatty acids in grams")
    pufa: Optional[float] = Field(0.0, ge=0, description="Polyunsaturated fatty acids in grams")
    omega3: Optional[float] = Field(0.0, ge=0, description="Omega-3 fatty acids in grams")

    # Essential Amino Acids (Optional - auto-estimated from protein source if omitted)
    leucine: Optional[float] = Field(None, ge=0, description="Leucine in mg")
    lysine: Optional[float] = Field(None, ge=0, description="Lysine in mg")
    threonine: Optional[float] = Field(None, ge=0, description="Threonine in mg")
    histidine: Optional[float] = Field(None, ge=0, description="Histidine in mg")
    methionine_cysteine: Optional[float] = Field(None, ge=0, description="Methionine + Cysteine in mg")
    tryptophan: Optional[float] = Field(None, ge=0, description="Tryptophan in mg")
    valine: Optional[float] = Field(None, ge=0, description="Valine in mg")
    isoleucine: Optional[float] = Field(None, ge=0, description="Isoleucine in mg")
    phenylalanine_tyrosine: Optional[float] = Field(None, ge=0, description="Phenylalanine + Tyrosine in mg")

    # Core Micronutrients (ICMR 16 Model)
    iron: Optional[float] = Field(0.0, ge=0, description="Iron in milligrams")
    calcium: Optional[float] = Field(0.0, ge=0, description="Calcium in milligrams")
    vitamin_a: Optional[float] = Field(0.0, ge=0, description="Vitamin A in micrograms RAE")
    vitamin_c: Optional[float] = Field(0.0, ge=0, description="Vitamin C in milligrams")
    vitamin_d: Optional[float] = Field(0.0, ge=0, description="Vitamin D in micrograms")
    potassium: Optional[float] = Field(0.0, ge=0, description="Potassium in milligrams")

    # Extended Minerals (Full 39 Model)
    zinc: Optional[float] = Field(0.0, ge=0, description="Zinc in milligrams")
    magnesium: Optional[float] = Field(0.0, ge=0, description="Magnesium in milligrams")
    phosphorus: Optional[float] = Field(0.0, ge=0, description="Phosphorus in milligrams")
    copper: Optional[float] = Field(0.0, ge=0, description="Copper in milligrams")
    manganese: Optional[float] = Field(0.0, ge=0, description="Manganese in milligrams")
    selenium: Optional[float] = Field(0.0, ge=0, description="Selenium in micrograms")
    chromium: Optional[float] = Field(0.0, ge=0, description="Chromium in micrograms")
    molybdenum: Optional[float] = Field(0.0, ge=0, description="Molybdenum in micrograms")

    # Extended Vitamins (Full 39 Model)
    vitamin_e: Optional[float] = Field(0.0, ge=0, description="Vitamin E in milligrams")
    vitamin_k: Optional[float] = Field(0.0, ge=0, description="Vitamin K in micrograms")
    thiamin_b1: Optional[float] = Field(0.0, ge=0, description="Thiamin (B1) in milligrams")
    riboflavin_b2: Optional[float] = Field(0.0, ge=0, description="Riboflavin (B2) in milligrams")
    niacin_b3: Optional[float] = Field(0.0, ge=0, description="Niacin (B3) in milligrams")
    pantothenic_acid_b5: Optional[float] = Field(0.0, ge=0, description="Pantothenic Acid (B5) in milligrams")
    vitamin_b6: Optional[float] = Field(0.0, ge=0, description="Vitamin B6 in milligrams")
    biotin_b7: Optional[float] = Field(0.0, ge=0, description="Biotin (B7) in micrograms")
    folate_b9: Optional[float] = Field(0.0, ge=0, description="Folate (B9) in micrograms")
    vitamin_b12: Optional[float] = Field(0.0, ge=0, description="Vitamin B12 in micrograms")

    # Phytonutrients & Official Nutri-Score Fields
    carotenoids: Optional[float] = Field(0.0, ge=0, description="Carotenoids in micrograms")
    fruit_veg_legume_pct: Optional[float] = Field(0.0, ge=0, le=100, description="Fruits, veg, legumes, nuts % (0-100)")

    @field_validator("food_name")
    def clean_name(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Food name cannot be empty or purely whitespace.")
        return cleaned

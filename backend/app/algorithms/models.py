"""Data models and enums for scoring calculations."""
from enum import Enum
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class AlgorithmMode(str, Enum):
    ICMR_16 = "icmr_16_nutrient"
    FULL_39 = "full_39_nutrient"
    OFFICIAL_NS = "official_nutri_score"


class NutrientCategory(str, Enum):
    NEGATIVE = "negative"
    POSITIVE_MACRO = "positive_macro"
    POSITIVE_FATTY_ACID = "positive_fatty_acid"
    POSITIVE_MINERAL = "positive_mineral"
    POSITIVE_VITAMIN = "positive_vitamin"
    POSITIVE_PHYTO = "positive_phytonutrient"
    POSITIVE_FVL = "positive_fvl"  # Fruits, Vegetables, Legumes


class NutrientScoreDetail(BaseModel):
    nutrient_key: str
    label: str
    unit: str
    value: float
    points_awarded: float
    max_possible_points: float
    category: NutrientCategory
    percentage_of_dv: Optional[float] = None
    threshold_explanation: Optional[str] = None


class FoodScoreResult(BaseModel):
    food_name: str
    food_category: Optional[str] = None
    serving_size: float = 100.0
    serving_unit: str = "g"
    algorithm_mode: AlgorithmMode
    algorithm_version: str
    algorithm_title: str
    
    # Core score metrics
    negative_points: float
    positive_points: float
    raw_score: float
    health_score: float  # 0 to 100
    
    # Grade outputs
    grade: str  # A, B, C, D, E
    grade_color: str  # Hex color code
    grade_label: str  # e.g., "High Nutritional Quality"
    grade_description: str
    
    # Detailed breakdown
    nutrient_scores: List[NutrientScoreDetail]
    positive_contributors: List[NutrientScoreDetail]
    negative_contributors: List[NutrientScoreDetail]
    missing_nutrients: List[str] = Field(default_factory=list)
    
    # Health and dietary recommendations
    recommendations: List[str]
    disclaimer: str

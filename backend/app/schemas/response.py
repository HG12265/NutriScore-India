"""Response validation schemas for food analysis."""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from ..algorithms.models import NutrientScoreDetail
from ..algorithms.personalised_scoring import PersonalisedNutriScoreResult


class ScoreSummary(BaseModel):
    health_score: float = Field(..., description="Normalized health score from 0 to 100")
    grade: str = Field(..., description="Nutritional grade: A, B, C, D, or E")
    grade_color: str = Field(..., description="Hex color matching standard Nutri-Score color scheme")
    grade_label: str = Field(..., description="Descriptive grade classification")
    grade_description: str
    positive_score: float = Field(..., description="Total points awarded for health-promoting nutrients")
    negative_penalty: float = Field(..., description="Total points penalized for nutrients to limit")
    raw_score: float = Field(..., description="N_total - P_total")
    positive_max: float
    negative_max: float


class NutrientAnalysisSummary(BaseModel):
    positive_contributors: List[NutrientScoreDetail]
    negative_contributors: List[NutrientScoreDetail]
    all_nutrients: List[NutrientScoreDetail]
    missing_values: List[str] = Field(default_factory=list)


class FoodAnalysisResponse(BaseModel):
    success: bool = True
    food_name: str
    food_category: Optional[str] = None
    serving_size: float
    serving_unit: str
    algorithm_info: Dict[str, Any]
    score: ScoreSummary
    nutrient_analysis: NutrientAnalysisSummary
    recommendations: List[str]
    warnings: List[str] = Field(default_factory=list)
    personalised_result: Optional[PersonalisedNutriScoreResult] = None
    disclaimer: str
    timestamp: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    database_connected: bool


class AlgorithmInfoResponse(BaseModel):
    modes: Dict[str, Any]
    reference_daily_values: Dict[str, Any]
    nutrients: List[Dict[str, Any]]

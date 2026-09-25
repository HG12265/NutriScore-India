"""Analysis coordinator connecting schema validation, scoring, and response formatting."""
from datetime import datetime, timezone
from typing import Dict, Any, Tuple
from ..schemas.request import FoodAnalysisRequest
from ..schemas.response import (
    FoodAnalysisResponse,
    ScoreSummary,
    NutrientAnalysisSummary,
)
from ..algorithms.validation import validate_nutrient_inputs
from ..algorithms.scoring import calculate_nutriscore
from ..algorithms.configuration import ALGORITHM_METADATA
from .database import save_analysis_history


async def analyze_food_request(request: FoodAnalysisRequest) -> Tuple[FoodAnalysisResponse, List[str]]:
    """
    Validates food data, calculates score metrics, and produces structured response.
    """
    req_dict = request.model_dump()
    
    # 1. Run physical and numeric validations
    is_valid, errors, warnings = validate_nutrient_inputs(req_dict)
    if not is_valid:
        raise ValueError("; ".join(errors))

    # 2. Run scoring calculation engine
    result = calculate_nutriscore(req_dict, mode=request.algorithm_mode)
    meta = ALGORITHM_METADATA.get(request.algorithm_mode.value, ALGORITHM_METADATA["icmr_16_nutrient"])

    # 3. Assemble response payload
    timestamp_str = datetime.now(timezone.utc).isoformat()
    
    response = FoodAnalysisResponse(
        success=True,
        food_name=result.food_name,
        food_category=result.food_category,
        serving_size=result.serving_size,
        serving_unit=result.serving_unit,
        algorithm_info={
            "mode": request.algorithm_mode.value,
            "title": result.algorithm_title,
            "version": result.algorithm_version,
            "description": meta["description"],
        },
        score=ScoreSummary(
            health_score=result.health_score,
            grade=result.grade,
            grade_color=result.grade_color,
            grade_label=result.grade_label,
            grade_description=result.grade_description,
            positive_score=result.positive_points,
            negative_penalty=result.negative_points,
            raw_score=result.raw_score,
            positive_max=meta["positive_max"],
            negative_max=meta["negative_max"],
        ),
        nutrient_analysis=NutrientAnalysisSummary(
            positive_contributors=result.positive_contributors,
            negative_contributors=result.negative_contributors,
            all_nutrients=result.nutrient_scores,
            missing_values=result.missing_nutrients,
        ),
        recommendations=result.recommendations,
        warnings=warnings,
        disclaimer=result.disclaimer,
        timestamp=timestamp_str,
    )

    # 4. Optional background persistence to MongoDB
    try:
        await save_analysis_history({
            "food_name": result.food_name,
            "serving_size": result.serving_size,
            "health_score": result.health_score,
            "grade": result.grade,
            "algorithm_mode": request.algorithm_mode.value,
            "positive_points": result.positive_points,
            "negative_points": result.negative_points,
            "timestamp": timestamp_str,
        })
    except Exception:
        pass

    return response, warnings

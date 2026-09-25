"""Food nutrient analysis endpoint."""
import logging
from fastapi import APIRouter, HTTPException, status
from ...schemas.request import FoodAnalysisRequest
from ...schemas.response import FoodAnalysisResponse
from ...services.analyzer import analyze_food_request

logger = logging.getLogger("nutriscore.analyze")
router = APIRouter()


@router.post(
    "/analyze",
    response_model=FoodAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze food nutrient values and compute NutriScore"
)
async def analyze_food(request: FoodAnalysisRequest):
    """
    Computes nutritional profiling score, letter grade (A-E), point breakdown,
    and dietary recommendations based on configured algorithm mode.
    """
    try:
        response, warnings = await analyze_food_request(request)
        return response
    except ValueError as ve:
        logger.warning(f"Validation error in food analysis: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected server error during food analysis: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while calculating the nutritional score. Please review inputs."
        )

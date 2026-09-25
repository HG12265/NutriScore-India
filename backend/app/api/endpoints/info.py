"""Algorithm information and configuration metadata endpoint."""
from fastapi import APIRouter
from ...schemas.response import AlgorithmInfoResponse
from ...algorithms.configuration import (
    ALGORITHM_METADATA,
    ICMR_DAILY_VALUES,
    NUTRIENT_DEFINITIONS,
)

router = APIRouter()


@router.get("/algorithm-info", response_model=AlgorithmInfoResponse, summary="Get algorithm configuration and nutrient specifications")
async def get_algorithm_info():
    """Returns all available scoring modes, reference daily values, and nutrient field schemas."""
    return AlgorithmInfoResponse(
        modes=ALGORITHM_METADATA,
        reference_daily_values=ICMR_DAILY_VALUES,
        nutrients=NUTRIENT_DEFINITIONS
    )

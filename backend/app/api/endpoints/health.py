"""Health check endpoint."""
from fastapi import APIRouter
from ...schemas.response import HealthResponse
from ...services.database import check_db_health
from ...config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Check API health and status")
async def health_check():
    """Returns application status, version, and optional database connectivity."""
    db_connected = await check_db_health()
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        database_connected=db_connected
    )

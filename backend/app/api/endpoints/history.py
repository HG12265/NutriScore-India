"""Analysis history endpoints (backed by optional MongoDB)."""
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from ...services.database import get_analysis_history, save_analysis_history
from ...config import settings

router = APIRouter()


@router.get("/analysis-history", summary="Get recent food analysis history")
async def list_history(limit: int = 20):
    """Returns saved analysis records if MongoDB integration is enabled."""
    if not settings.ENABLE_HISTORY:
        return {
            "enabled": False,
            "message": "Database history is disabled. Configure ENABLE_HISTORY=true with MongoDB to persist calculations.",
            "records": []
        }
    records = await get_analysis_history(limit=limit)
    return {
        "enabled": True,
        "count": len(records),
        "records": records
    }


@router.post("/analysis-history", status_code=status.HTTP_201_CREATED, summary="Save analysis result manually")
async def record_history(data: Dict[str, Any]):
    """Manually persist an analysis result to MongoDB history."""
    if not settings.ENABLE_HISTORY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="History storage is disabled in server configuration (ENABLE_HISTORY=false)."
        )
    doc_id = await save_analysis_history(data)
    if not doc_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save record to database."
        )
    return {"success": True, "id": doc_id}

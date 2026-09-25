"""Optional MongoDB database client and history persistence service."""
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from ..config import settings

logger = logging.getLogger("nutriscore.database")

_client = None
_db = None


async def get_db():
    """Lazily initializes MongoDB client if history is enabled."""
    global _client, _db
    if not settings.ENABLE_HISTORY:
        return None
        
    if _db is None:
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            _client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
            _db = _client[settings.MONGODB_DATABASE]
            logger.info("MongoDB client connected successfully.")
        except Exception as e:
            logger.warning(f"Could not connect to MongoDB: {e}")
            _db = None
    return _db


async def check_db_health() -> bool:
    """Checks whether MongoDB is enabled and reachable."""
    if not settings.ENABLE_HISTORY:
        return False
    try:
        db = await get_db()
        if db is not None:
            await db.command("ping")
            return True
    except Exception:
        pass
    return False


async def save_analysis_history(data: Dict[str, Any]) -> Optional[str]:
    """
    Saves an analysis record to MongoDB if enabled.
    Returns the string ID of the inserted document or None.
    """
    if not settings.ENABLE_HISTORY:
        return None
        
    try:
        db = await get_db()
        if db is not None:
            record = dict(data)
            record["created_at"] = datetime.now(timezone.utc)
            result = await db.analysis_history.insert_one(record)
            return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Failed to save analysis history to MongoDB: {e}")
        return None


async def get_analysis_history(limit: int = 20) -> List[Dict[str, Any]]:
    """
    Retrieves recent analysis history records.
    """
    if not settings.ENABLE_HISTORY:
        return []
        
    try:
        db = await get_db()
        if db is not None:
            cursor = db.analysis_history.find().sort("created_at", -1).limit(limit)
            records = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                if "created_at" in doc and isinstance(doc["created_at"], datetime):
                    doc["created_at"] = doc["created_at"].isoformat()
                records.append(doc)
            return records
    except Exception as e:
        logger.error(f"Failed to retrieve analysis history: {e}")
    return []

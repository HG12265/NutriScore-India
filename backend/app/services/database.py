"""
Strictly MongoDB database service and repository layer for NutriScore AI.
Handles life-stage demographics, protein complementarity, amino acid references,
preset recipe catalogues, and calculation history.
"""
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from ..config import settings
from ..algorithms.demographics import DEMOGRAPHIC_PROFILES
from ..algorithms.amino_acids import COMPLEMENTARITY_RULES, REFERENCE_AA_PER_GRAM_PROTEIN

logger = logging.getLogger("nutriscore.database")

_client = None
_db = None
_initialized = False


import asyncio

async def get_db():
    """Lazily initializes MongoDB client if history is enabled."""
    global _client, _db, _initialized
    if not settings.ENABLE_HISTORY:
        return None
        
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        loop = asyncio.get_running_loop()
        if _client is None or getattr(_client, "_nutriscore_loop", None) != loop:
            _client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2500)
            _client._nutriscore_loop = loop
            _db = _client[settings.MONGODB_DATABASE]
            logger.info(f"Connected to MongoDB database: '{settings.MONGODB_DATABASE}' at {settings.MONGODB_URI}")
            
            if not _initialized:
                await seed_database_if_empty(_db)
                _initialized = True
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


async def seed_database_if_empty(db):
    """
    Seeds MongoDB collections on startup with demographic requirements,
    complementary protein matrices, reference amino acid tables, and presets.
    """
    try:
        # 1. Seed Demographics Collection
        demographics_col = db["demographics"]
        demo_count = await demographics_col.count_documents({})
        if demo_count == 0:
            demo_docs = []
            for key, profile in DEMOGRAPHIC_PROFILES.items():
                doc = profile.model_dump()
                doc["_id"] = key
                demo_docs.append(doc)
            if demo_docs:
                await demographics_col.insert_many(demo_docs)
                logger.info(f"Seeded {len(demo_docs)} demographic profiles into MongoDB 'demographics' collection.")

        # 2. Seed Complementarity Rules Collection
        comp_col = db["complementarity_rules"]
        comp_count = await comp_col.count_documents({})
        if comp_count == 0:
            comp_docs = []
            for key, rule in COMPLEMENTARITY_RULES.items():
                doc = dict(rule)
                doc["_id"] = key
                comp_docs.append(doc)
            if comp_docs:
                await comp_col.insert_many(comp_docs)
                logger.info(f"Seeded {len(comp_docs)} complementarity rules into MongoDB 'complementarity_rules'.")

        # 3. Seed Reference Amino Acids Collection
        aa_col = db["amino_acid_references"]
        aa_count = await aa_col.count_documents({})
        if aa_count == 0:
            aa_docs = []
            for source, profile in REFERENCE_AA_PER_GRAM_PROTEIN.items():
                doc = {"_id": source, "source": source, "amino_acids_mg_per_g_protein": profile}
                aa_docs.append(doc)
            if aa_docs:
                await aa_col.insert_many(aa_docs)
                logger.info(f"Seeded {len(aa_docs)} amino acid reference profiles into MongoDB.")

        # 4. Seed Preset Recipes Collection
        recipes_col = db["preset_recipes"]
        recipe_count = await recipes_col.count_documents({})
        if recipe_count == 0:
            sample_recipes = [
                {
                    "_id": "moong_dal_tadka",
                    "name": "Moong Dal Tadka",
                    "category": "Legumes & Pulses",
                    "description": "Yellow split gram tempered with cumin, turmeric, ghee, and fresh coriander.",
                    "serving_size": 150.0,
                    "serving_unit": "g",
                    "complementary_protein_source": "cereal_pulse",
                    "nutrients": {
                        "energy_kcal": 185.0,
                        "protein": 11.2,
                        "total_carbs": 24.5,
                        "fibre": 6.8,
                        "free_sugars": 0.8,
                        "saturated_fat": 1.4,
                        "mufa": 1.8,
                        "pufa": 0.9,
                        "sodium": 280.0,
                        "calcium": 62.0,
                        "iron": 3.1,
                        "zinc": 1.9,
                        "potassium": 410.0,
                        "vitamin_a": 45.0,
                        "vitamin_c": 4.5,
                        "folate_b9": 85.0,
                        "cholesterol": 3.0,
                    }
                },
                {
                    "_id": "palak_paneer",
                    "name": "Palak Paneer",
                    "category": "Dairy & Vegetables",
                    "description": "Blanched spinach puree simmered with cottage cheese cubes and mild aromatic spices.",
                    "serving_size": 200.0,
                    "serving_unit": "g",
                    "complementary_protein_source": "pulse_dairy",
                    "nutrients": {
                        "energy_kcal": 265.0,
                        "protein": 14.8,
                        "total_carbs": 8.5,
                        "fibre": 4.2,
                        "free_sugars": 1.2,
                        "saturated_fat": 8.2,
                        "mufa": 5.1,
                        "pufa": 1.2,
                        "sodium": 340.0,
                        "calcium": 380.0,
                        "iron": 4.6,
                        "zinc": 2.8,
                        "potassium": 520.0,
                        "vitamin_a": 620.0,
                        "vitamin_c": 18.0,
                        "folate_b9": 110.0,
                        "cholesterol": 28.0,
                    }
                },
                {
                    "_id": "idli_sambar",
                    "name": "Steamed Idli with Drumstick Sambar",
                    "category": "Cereal-Pulse Blend",
                    "description": "Fermented rice and black gram cakes served with lentil and vegetable stew.",
                    "serving_size": 250.0,
                    "serving_unit": "g",
                    "complementary_protein_source": "cereal_pulse",
                    "nutrients": {
                        "energy_kcal": 210.0,
                        "protein": 8.6,
                        "total_carbs": 38.0,
                        "fibre": 5.5,
                        "free_sugars": 1.5,
                        "saturated_fat": 0.6,
                        "mufa": 1.2,
                        "pufa": 0.8,
                        "sodium": 310.0,
                        "calcium": 75.0,
                        "iron": 2.2,
                        "zinc": 1.4,
                        "potassium": 380.0,
                        "vitamin_a": 85.0,
                        "vitamin_c": 9.5,
                        "folate_b9": 65.0,
                        "cholesterol": 0.0,
                    }
                },
                {
                    "_id": "chana_masala",
                    "name": "Amritsari Chana Masala",
                    "category": "Legumes & Pulses",
                    "description": "Whole chickpeas cooked in a tangy onion, ginger, and spiced tomato gravy.",
                    "serving_size": 180.0,
                    "serving_unit": "g",
                    "complementary_protein_source": "cereal_pulse",
                    "nutrients": {
                        "energy_kcal": 240.0,
                        "protein": 12.5,
                        "total_carbs": 32.0,
                        "fibre": 9.2,
                        "free_sugars": 2.0,
                        "saturated_fat": 1.1,
                        "mufa": 2.4,
                        "pufa": 1.5,
                        "sodium": 390.0,
                        "calcium": 95.0,
                        "iron": 4.8,
                        "zinc": 2.4,
                        "potassium": 480.0,
                        "vitamin_a": 40.0,
                        "vitamin_c": 12.0,
                        "folate_b9": 140.0,
                        "cholesterol": 0.0,
                    }
                }
            ]
            await recipes_col.insert_many(sample_recipes)
            logger.info(f"Seeded {len(sample_recipes)} preset recipes into MongoDB 'preset_recipes'.")

    except Exception as e:
        logger.error(f"Error during MongoDB auto-seeding: {e}")


async def get_demographics_from_db() -> List[Dict[str, Any]]:
    """
    Returns demographic profiles from MongoDB, falling back to static definitions if needed.
    """
    try:
        db = await get_db()
        if db is not None:
            cursor = db.demographics.find()
            records = []
            async for doc in cursor:
                records.append(doc)
            if records:
                return records
    except Exception as e:
        logger.warning(f"Error querying demographics from MongoDB: {e}")
        
    # In-memory fallback
    return [profile.model_dump() for profile in DEMOGRAPHIC_PROFILES.values()]


async def get_complementarity_rules_from_db() -> Dict[str, Any]:
    """
    Returns protein complementarity synergy rules from MongoDB.
    """
    try:
        db = await get_db()
        if db is not None:
            cursor = db.complementarity_rules.find()
            rules = {}
            async for doc in cursor:
                key = doc.get("_id") or doc.get("key")
                rules[key] = doc
            if rules:
                return rules
    except Exception as e:
        logger.warning(f"Error querying complementarity rules from MongoDB: {e}")
        
    return COMPLEMENTARITY_RULES


async def get_preset_recipes_from_db() -> List[Dict[str, Any]]:
    """
    Returns preset recipes from MongoDB.
    """
    try:
        db = await get_db()
        if db is not None:
            cursor = db.preset_recipes.find()
            recipes = []
            async for doc in cursor:
                recipes.append(doc)
            if recipes:
                return recipes
    except Exception as e:
        logger.warning(f"Error querying preset recipes from MongoDB: {e}")
    return []


async def save_analysis_history(data: Dict[str, Any]) -> Optional[str]:
    """
    Saves an analysis record to MongoDB.
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
    Retrieves recent analysis history records from MongoDB.
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
        logger.error(f"Failed to retrieve analysis history from MongoDB: {e}")
    return []

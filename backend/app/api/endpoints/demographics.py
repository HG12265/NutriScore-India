"""API endpoints for demographic RDA requirements and protein complementarity."""
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from ...services.database import (
    get_demographics_from_db,
    get_complementarity_rules_from_db,
    get_preset_recipes_from_db
)
from ...algorithms.demographics import get_demographic_profile

router = APIRouter()


@router.get("/demographics", summary="Get all 11 demographic life-stage profiles with RDAs")
async def list_demographics():
    """
    Returns demographic RDA reference values based on ICMR-NIN 2024 / WHO / FAO standards.
    Loaded from MongoDB with fallback to verified reference datasets.
    """
    profiles = await get_demographics_from_db()
    return {
        "count": len(profiles),
        "profiles": profiles
    }


@router.get("/demographics/{key}", summary="Get demographic RDA requirements for a specific life stage")
async def get_demographic(key: str):
    """
    Returns energy, macronutrient, micronutrient, and 9 Essential Amino Acid requirements.
    """
    try:
        profile = get_demographic_profile(key)
        return profile.model_dump()
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Demographic profile '{key}' not found. Please choose from registered life stages."
        )


@router.get("/complementarity-rules", summary="Get protein complementarity pairing matrix")
async def list_complementarity():
    """
    Returns pairing synergy ratings (e.g. Cereal + Pulse = 8/10, Pulse + Dairy = 9/10).
    """
    rules = await get_complementarity_rules_from_db()
    return {
        "rules": rules
    }


@router.get("/preset-recipes", summary="Get preset Indian recipes stored in MongoDB")
async def list_presets():
    """
    Returns sample Indian recipes with nutrient breakdowns for quick evaluation.
    """
    recipes = await get_preset_recipes_from_db()
    return {
        "count": len(recipes),
        "recipes": recipes
    }

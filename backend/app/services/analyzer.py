"""Analysis coordinator connecting schema validation, scoring, and response formatting."""
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Tuple, List, Optional
from ..schemas.request import FoodAnalysisRequest
from ..schemas.response import (
    FoodAnalysisResponse,
    ScoreSummary,
    NutrientAnalysisSummary,
)
from ..algorithms.models import (
    AlgorithmMode,
    NutrientCategory,
    NutrientScoreDetail,
)
from ..algorithms.validation import validate_nutrient_inputs
from ..algorithms.scoring import calculate_nutriscore
from ..algorithms.configuration import ALGORITHM_METADATA
from ..algorithms.personalised_scoring import (
    calculate_personalised_pndpq_score,
    PersonalisedNutriScoreResult,
)
from .database import save_analysis_history

logger = logging.getLogger("nutriscore.analyzer")


async def analyze_food_request(request: FoodAnalysisRequest) -> Tuple[FoodAnalysisResponse, List[str]]:
    """
    Validates food data, calculates score metrics, and produces structured response.
    Dispatches to Personalised PPQND engine or Standard/Extended models.
    """
    req_dict = request.model_dump()
    timestamp_str = datetime.now(timezone.utc).isoformat()
    
    # 1. Run physical and numeric validations
    is_valid, errors, warnings = validate_nutrient_inputs(req_dict)
    if not is_valid:
        raise ValueError("; ".join(errors))

    # 2. Check if Personalised PPQND mode is requested
    if request.algorithm_mode == AlgorithmMode.PERSONALISED_PNDPQ:
        # Prepare nutrients per serving
        nutrients_per_serving: Dict[str, float] = {
            "energy_kcal": request.energy_kcal,
            "protein": request.protein,
            "fibre": request.fibre,
            "sodium": request.sodium,
            "saturated_fat": request.saturated_fat,
            "trans_fat": request.trans_fat or 0.0,
            "total_fat": request.total_fat or 0.0,
            "added_sugars": request.added_sugars if request.added_sugars is not None else request.free_sugars,
            "cholesterol": request.cholesterol,
            "calcium": request.calcium or 0.0,
            "iron": request.iron or 0.0,
            "zinc": request.zinc or 0.0,
            "potassium": request.potassium or 0.0,
            "vitamin_a": request.vitamin_a or 0.0,
            "vitamin_c": request.vitamin_c or 0.0,
            "vitamin_d": request.vitamin_d or 0.0,
            "thiamin_b1": request.thiamin_b1 or 0.0,
            "riboflavin_b2": request.riboflavin_b2 or 0.0,
            "vitamin_b6": request.vitamin_b6 or 0.0,
            "folate_b9": request.folate_b9 or 0.0,
            "vitamin_b12": request.vitamin_b12 or 0.0,
            "omega3": request.omega3 or 0.0,
            "pufa": request.pufa or 0.0,
            "mufa": request.mufa or 0.0,
        }

        # Check for user-provided custom EAAs
        custom_eaas: Dict[str, float] = {}
        for aa in [
            "leucine", "lysine", "threonine", "histidine",
            "methionine_cysteine", "tryptophan", "valine",
            "isoleucine", "phenylalanine_tyrosine"
        ]:
            val = getattr(request, aa, None)
            if val is not None and val > 0:
                custom_eaas[aa] = float(val)

        p_result: PersonalisedNutriScoreResult = calculate_personalised_pndpq_score(
            food_name=request.food_name,
            serving_size_g=request.serving_size,
            nutrients_per_serving=nutrients_per_serving,
            demographic_key=request.demographic_profile or "adult_male",
            complementary_protein_key=request.complementary_protein_source or "cereal_pulse",
            custom_eaas=custom_eaas if custom_eaas else None
        )

        meta = ALGORITHM_METADATA.get("personalised_pndpq", {
            "title": "Personalised Protein Quality & Nutrient Density (PPQND) NutriScore",
            "version": "2024-ICMR/FAO",
            "description": "Demographic-adjusted 19 positive and 7 chronic risk factor algorithm.",
            "positive_max": 100.0,
            "negative_max": 100.0,
            "span": 100.0,
        })

        # Convert diagnostic panel items into NutrientScoreDetail for compatibility
        pos_details: List[NutrientScoreDetail] = []
        for item in p_result.nutrient_density_panel:
            pos_details.append(
                NutrientScoreDetail(
                    nutrient_key=item.nutrient_key,
                    label=item.label,
                    unit=item.unit,
                    value=item.amount_per_serving,
                    points_awarded=item.score_points,
                    max_possible_points=10.0,
                    category=NutrientCategory.POSITIVE_MINERAL if "mg" in item.unit else NutrientCategory.POSITIVE_MACRO,
                    percentage_of_dv=item.requirement_fulfilled_pct,
                    threshold_explanation=f"{item.status}: {item.requirement_fulfilled_pct}% of daily RDA fulfilled ({item.individual_requirement}{item.unit})"
                )
            )

        neg_details: List[NutrientScoreDetail] = []
        for item in p_result.chronic_risk_panel:
            neg_details.append(
                NutrientScoreDetail(
                    nutrient_key=item.nutrient_key,
                    label=item.label,
                    unit=item.unit,
                    value=item.amount_per_serving,
                    points_awarded=item.score_points,
                    max_possible_points=10.0,
                    category=NutrientCategory.NEGATIVE,
                    percentage_of_dv=item.requirement_fulfilled_pct,
                    threshold_explanation=f"{item.status}: {item.requirement_fulfilled_pct}% of upper daily limit ({item.individual_requirement}{item.unit})"
                )
            )

        all_details = pos_details + neg_details

        response = FoodAnalysisResponse(
            success=True,
            food_name=p_result.food_name,
            food_category=request.food_category,
            serving_size=p_result.serving_size_g,
            serving_unit=request.serving_unit,
            algorithm_info={
                "mode": "personalised_pndpq",
                "title": meta["title"],
                "version": meta["version"],
                "description": f"{meta['description']} Demographic Target: {p_result.demographic_label}.",
            },
            score=ScoreSummary(
                health_score=p_result.nutriscore,
                grade=p_result.grade,
                grade_color=p_result.grade_color,
                grade_label=p_result.grade_label,
                grade_description=p_result.grade_description,
                positive_score=p_result.positive_nutrient_score,
                negative_penalty=p_result.negative_risk_score,
                raw_score=p_result.benefit_risk_balance,
                positive_max=100.0,
                negative_max=100.0,
            ),
            nutrient_analysis=NutrientAnalysisSummary(
                positive_contributors=sorted(pos_details, key=lambda x: x.points_awarded, reverse=True)[:5],
                negative_contributors=sorted(neg_details, key=lambda x: x.points_awarded, reverse=True)[:5],
                all_nutrients=all_details,
                missing_values=[],
            ),
            recommendations=p_result.demographic_insights,
            warnings=warnings,
            personalised_result=p_result,
            disclaimer=(
                "Personalised PPQND estimates are based on ICMR-NIN 2024, WHO, and FAO protein quality guidelines. "
                "Individual clinical or medical requirements may vary. Consult a registered dietitian for medical therapy."
            ),
            timestamp=timestamp_str,
        )

        # Persist to MongoDB
        try:
            await save_analysis_history({
                "food_name": p_result.food_name,
                "serving_size": p_result.serving_size_g,
                "health_score": p_result.nutriscore,
                "grade": p_result.grade,
                "algorithm_mode": "personalised_pndpq",
                "demographic_key": p_result.demographic_key,
                "demographic_label": p_result.demographic_label,
                "positive_score": p_result.positive_nutrient_score,
                "negative_penalty": p_result.negative_risk_score,
                "weighted_amino_acid_score": p_result.weighted_amino_acid_score,
                "limiting_amino_acid": p_result.limiting_amino_acid,
                "complementary_protein_label": p_result.complementary_protein_label,
                "timestamp": timestamp_str,
            })
        except Exception as db_err:
            logger.warning(f"Could not persist personalised analysis to MongoDB: {db_err}")

        return response, warnings

    # 3. Standard / Extended / Official scoring calculation engine
    result = calculate_nutriscore(req_dict, mode=request.algorithm_mode)
    meta = ALGORITHM_METADATA.get(request.algorithm_mode.value, ALGORITHM_METADATA["icmr_16_nutrient"])

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

    # 4. Background persistence to MongoDB
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
    except Exception as db_err:
        logger.warning(f"Could not persist analysis to MongoDB: {db_err}")

    return response, warnings

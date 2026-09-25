"""Core NutriScore calculation engine implementing ICMR, Extended 39, and FSA-NPS models."""
from typing import Dict, Any, List, Tuple
from .models import (
    AlgorithmMode,
    NutrientCategory,
    NutrientScoreDetail,
    FoodScoreResult,
)
from .configuration import (
    ALGORITHM_METADATA,
    ICMR_DAILY_VALUES,
)
from .grade_mapping import map_health_score_to_grade, map_official_raw_to_grade


# -------------------------------------------------------------
# STEP 1: NEGATIVE SCORING HELPERS (0 to 10 points each)
# -------------------------------------------------------------

def score_energy_density(kcal: float) -> Tuple[float, str]:
    """Score energy density per 100g (0 to 10 points)."""
    if kcal <= 80: return 0.0, "<= 80 kcal (Low caloric density)"
    if kcal <= 160: return 1.0, "81-160 kcal"
    if kcal <= 240: return 2.0, "161-240 kcal"
    if kcal <= 320: return 3.0, "241-320 kcal"
    if kcal <= 400: return 4.0, "321-400 kcal"
    if kcal <= 480: return 5.0, "401-480 kcal"
    if kcal <= 560: return 6.0, "481-560 kcal"
    if kcal <= 640: return 7.0, "561-640 kcal"
    if kcal <= 720: return 8.0, "641-720 kcal"
    if kcal <= 800: return 9.0, "721-800 kcal"
    return 10.0, "> 800 kcal (Extremely high energy density)"


def score_free_sugars(sugars_g: float) -> Tuple[float, str]:
    """Score free sugars per 100g (0 to 10 points)."""
    if sugars_g <= 4.5: return 0.0, "<= 4.5g (Low sugar)"
    if sugars_g <= 9.0: return 1.0, "4.6-9.0g"
    if sugars_g <= 13.5: return 2.0, "9.1-13.5g"
    if sugars_g <= 18.0: return 3.0, "13.6-18.0g"
    if sugars_g <= 22.5: return 4.0, "18.1-22.5g"
    if sugars_g <= 27.0: return 5.0, "22.6-27.0g"
    if sugars_g <= 31.0: return 6.0, "27.1-31.0g"
    if sugars_g <= 36.0: return 7.0, "31.1-36.0g"
    if sugars_g <= 40.0: return 8.0, "36.1-40.0g"
    if sugars_g <= 45.0: return 9.0, "40.1-45.0g"
    return 10.0, "> 45.0g (Very high free sugar)"


def score_saturated_fat(sat_fat_g: float) -> Tuple[float, str]:
    """Score saturated fatty acids per 100g (0 to 10 points)."""
    if sat_fat_g <= 1.0: return 0.0, "<= 1.0g"
    if sat_fat_g <= 2.0: return 1.0, "1.1-2.0g"
    if sat_fat_g <= 3.0: return 2.0, "2.1-3.0g"
    if sat_fat_g <= 4.0: return 3.0, "3.1-4.0g"
    if sat_fat_g <= 5.0: return 4.0, "4.1-5.0g"
    if sat_fat_g <= 6.0: return 5.0, "5.1-6.0g"
    if sat_fat_g <= 7.0: return 6.0, "6.1-7.0g"
    if sat_fat_g <= 8.0: return 7.0, "7.1-8.0g"
    if sat_fat_g <= 9.0: return 8.0, "8.1-9.0g"
    if sat_fat_g <= 10.0: return 9.0, "9.1-10.0g"
    return 10.0, "> 10.0g (High saturated fat)"


def score_sodium(sodium_mg: float) -> Tuple[float, str]:
    """Score sodium per 100g (0 to 10 points)."""
    if sodium_mg <= 90: return 0.0, "<= 90 mg (Low sodium)"
    if sodium_mg <= 180: return 1.0, "91-180 mg"
    if sodium_mg <= 270: return 2.0, "181-270 mg"
    if sodium_mg <= 360: return 3.0, "271-360 mg"
    if sodium_mg <= 450: return 4.0, "361-450 mg"
    if sodium_mg <= 540: return 5.0, "451-540 mg"
    if sodium_mg <= 630: return 6.0, "541-630 mg"
    if sodium_mg <= 720: return 7.0, "631-720 mg"
    if sodium_mg <= 810: return 8.0, "721-810 mg"
    if sodium_mg <= 900: return 9.0, "811-900 mg"
    return 10.0, "> 900 mg (High sodium / salt)"


def score_cholesterol(cholesterol_mg: float) -> Tuple[float, str]:
    """Score dietary cholesterol per 100g (0 to 10 points)."""
    if cholesterol_mg <= 10: return 0.0, "<= 10 mg"
    if cholesterol_mg <= 25: return 1.0, "11-25 mg"
    if cholesterol_mg <= 50: return 2.0, "26-50 mg"
    if cholesterol_mg <= 75: return 3.0, "51-75 mg"
    if cholesterol_mg <= 100: return 4.0, "76-100 mg"
    if cholesterol_mg <= 130: return 5.0, "101-130 mg"
    if cholesterol_mg <= 165: return 6.0, "131-165 mg"
    if cholesterol_mg <= 200: return 7.0, "166-200 mg"
    if cholesterol_mg <= 240: return 8.0, "201-240 mg"
    if cholesterol_mg <= 300: return 9.0, "241-300 mg"
    return 10.0, "> 300 mg (High cholesterol)"


# -------------------------------------------------------------
# STEP 2: POSITIVE MACRONUTRIENT SCORING (0 to 10 points each)
# -------------------------------------------------------------

def score_protein(protein_g: float) -> Tuple[float, str]:
    """Score protein per 100g (0 to 10 points)."""
    if protein_g <= 1.6: return 0.0, "<= 1.6g"
    if protein_g <= 3.2: return 1.0, "1.7-3.2g"
    if protein_g <= 4.8: return 2.0, "3.3-4.8g"
    if protein_g <= 6.4: return 3.0, "4.9-6.4g"
    if protein_g <= 8.0: return 4.0, "6.5-8.0g"
    if protein_g <= 9.6: return 5.0, "8.1-9.6g"
    if protein_g <= 11.2: return 6.0, "9.7-11.2g"
    if protein_g <= 12.8: return 7.0, "11.3-12.8g"
    if protein_g <= 14.4: return 8.0, "12.9-14.4g"
    if protein_g <= 16.0: return 9.0, "14.5-16.0g"
    return 10.0, "> 16.0g (Rich in protein)"


def score_fibre(fibre_g: float) -> Tuple[float, str]:
    """Score dietary fibre per 100g (0 to 10 points)."""
    if fibre_g <= 0.9: return 0.0, "<= 0.9g"
    if fibre_g <= 1.9: return 1.0, "1.0-1.9g"
    if fibre_g <= 2.8: return 2.0, "2.0-2.8g"
    if fibre_g <= 3.7: return 3.0, "2.9-3.7g"
    if fibre_g <= 4.7: return 4.0, "3.8-4.7g"
    if fibre_g <= 5.6: return 5.0, "4.8-5.6g"
    if fibre_g <= 6.5: return 6.0, "5.7-6.5g"
    if fibre_g <= 7.5: return 7.0, "6.6-7.5g"
    if fibre_g <= 8.4: return 8.0, "7.6-8.4g"
    if fibre_g <= 9.4: return 9.0, "8.5-9.4g"
    return 10.0, "> 9.4g (High dietary fibre)"


def score_complex_carbs(carbs_g: float) -> Tuple[float, str]:
    """Score complex carbohydrates per 100g (0 to 10 points)."""
    if carbs_g <= 5.0: return 0.0, "<= 5.0g"
    if carbs_g <= 10.0: return 1.0, "5.1-10.0g"
    if carbs_g <= 15.0: return 2.0, "10.1-15.0g"
    if carbs_g <= 20.0: return 3.0, "15.1-20.0g"
    if carbs_g <= 25.0: return 4.0, "20.1-25.0g"
    if carbs_g <= 30.0: return 5.0, "25.1-30.0g"
    if carbs_g <= 35.0: return 6.0, "30.1-35.0g"
    if carbs_g <= 40.0: return 7.0, "35.1-40.0g"
    if carbs_g <= 45.0: return 8.0, "40.1-45.0g"
    if carbs_g <= 50.0: return 9.0, "45.1-50.0g"
    return 10.0, "> 50.0g (Complex energy source)"


# -------------------------------------------------------------
# STEP 3: BENEFICIAL FATTY ACIDS (0 to 5 points each)
# -------------------------------------------------------------

def score_mufa(mufa_g: float) -> Tuple[float, str]:
    """Score MUFA per 100g (0 to 5 points)."""
    if mufa_g < 2.0: return 0.0, "< 2.0g"
    if mufa_g < 4.0: return 1.0, "2.0-3.9g"
    if mufa_g < 6.0: return 2.0, "4.0-5.9g"
    if mufa_g < 8.0: return 3.0, "6.0-7.9g"
    if mufa_g < 10.0: return 4.0, "8.0-9.9g"
    return 5.0, ">= 10.0g"


def score_pufa(pufa_g: float) -> Tuple[float, str]:
    """Score PUFA per 100g (0 to 5 points)."""
    if pufa_g < 1.0: return 0.0, "< 1.0g"
    if pufa_g < 2.0: return 1.0, "1.0-1.9g"
    if pufa_g < 3.0: return 2.0, "2.0-2.9g"
    if pufa_g < 4.0: return 3.0, "3.0-3.9g"
    if pufa_g < 5.0: return 4.0, "4.0-4.9g"
    return 5.0, ">= 5.0g"


# -------------------------------------------------------------
# STEP 4: MICRONUTRIENT % DAILY VALUE SCORING (0 to 5 points each)
# -------------------------------------------------------------

def score_micronutrient_by_dv(value: float, dv: float, nutrient_label: str) -> Tuple[float, float, str]:
    """
    Score micronutrient based on % Daily Value:
      0: < 5%
      1: 5 - 9.9%
      2: 10 - 14.9%
      3: 15 - 19.9%
      4: 20 - 24.9%
      5: >= 25% (Significant nutritional contribution)
    Returns: (points, pct_dv, explanation)
    """
    if dv <= 0:
        return 0.0, 0.0, "No DV defined"
        
    pct_dv = (value / dv) * 100.0
    
    if pct_dv < 5.0:
        return 0.0, pct_dv, f"{pct_dv:.1f}% DV (< 5%)"
    if pct_dv < 10.0:
        return 1.0, pct_dv, f"{pct_dv:.1f}% DV (5-9.9%)"
    if pct_dv < 15.0:
        return 2.0, pct_dv, f"{pct_dv:.1f}% DV (10-14.9%)"
    if pct_dv < 20.0:
        return 3.0, pct_dv, f"{pct_dv:.1f}% DV (15-19.9%)"
    if pct_dv < 25.0:
        return 4.0, pct_dv, f"{pct_dv:.1f}% DV (20-24.9%)"
    return 5.0, pct_dv, f"{pct_dv:.1f}% DV (>= 25% High source)"


def score_carotenoids(mcg: float) -> Tuple[float, str]:
    """Score carotenoids in mcg per 100g (0 to 5 points)."""
    if mcg < 500: return 0.0, "< 500 mcg"
    if mcg < 1500: return 1.0, "500-1499 mcg"
    if mcg < 3000: return 2.0, "1500-2999 mcg"
    if mcg < 5000: return 3.0, "3000-4999 mcg"
    if mcg < 8000: return 4.0, "5000-7999 mcg"
    return 5.0, ">= 8000 mcg"


# -------------------------------------------------------------
# MAIN CALCULATION FUNCTION
# -------------------------------------------------------------

def calculate_nutriscore(data: Dict[str, Any], mode: AlgorithmMode = AlgorithmMode.ICMR_16) -> FoodScoreResult:
    """
    Calculates NutriScore based on validated inputs and chosen algorithm mode.
    """
    meta = ALGORITHM_METADATA.get(mode.value, ALGORITHM_METADATA["icmr_16_nutrient"])
    
    food_name = str(data.get("food_name", "Unnamed Food")).strip()
    food_category = data.get("food_category")
    serving_size = float(data.get("serving_size", 100.0) or 100.0)
    serving_unit = str(data.get("serving_unit", "g"))
    
    # Normalization factor to 100g
    # If the user enters values per serving, we normalize to per-100g baseline
    norm_factor = 100.0 / serving_size if serving_size > 0 else 1.0
    
    def get_val(key: str, default: float = 0.0) -> float:
        val = data.get(key)
        if val is None or val == "":
            return default
        try:
            return float(val)
        except (ValueError, TypeError):
            return default

    # Values normalized to per-100g
    energy_kcal = get_val("energy_kcal") * norm_factor
    free_sugars = get_val("free_sugars") * norm_factor
    saturated_fat = get_val("saturated_fat") * norm_factor
    sodium = get_val("sodium") * norm_factor
    cholesterol = get_val("cholesterol") * norm_factor
    
    protein = get_val("protein") * norm_factor
    fibre = get_val("fibre") * norm_factor
    
    # Auto-derive complex carbs if not directly supplied
    raw_complex_carbs = data.get("complex_carbs")
    total_carbs = get_val("total_carbs") * norm_factor
    if raw_complex_carbs is not None and str(raw_complex_carbs).strip() != "":
        complex_carbs = float(raw_complex_carbs) * norm_factor
    else:
        complex_carbs = max(0.0, total_carbs - free_sugars - fibre)
        
    mufa = get_val("mufa") * norm_factor
    pufa = get_val("pufa") * norm_factor

    nutrient_scores: List[NutrientScoreDetail] = []
    
    # ---------------------------------------------------------
    # 1. EVALUATE NEGATIVE NUTRIENTS (Common across models)
    # ---------------------------------------------------------
    pts_energy, expl_energy = score_energy_density(energy_kcal)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="energy_kcal", label="Energy Density", unit="kcal/100g",
        value=round(energy_kcal, 1), points_awarded=pts_energy, max_possible_points=10.0,
        category=NutrientCategory.NEGATIVE, threshold_explanation=expl_energy
    ))
    
    pts_sugar, expl_sugar = score_free_sugars(free_sugars)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="free_sugars", label="Free Sugars", unit="g/100g",
        value=round(free_sugars, 1), points_awarded=pts_sugar, max_possible_points=10.0,
        category=NutrientCategory.NEGATIVE, threshold_explanation=expl_sugar
    ))
    
    pts_sat_fat, expl_sat_fat = score_saturated_fat(saturated_fat)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="saturated_fat", label="Saturated Fat", unit="g/100g",
        value=round(saturated_fat, 1), points_awarded=pts_sat_fat, max_possible_points=10.0,
        category=NutrientCategory.NEGATIVE, threshold_explanation=expl_sat_fat
    ))
    
    pts_sodium, expl_sodium = score_sodium(sodium)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="sodium", label="Sodium", unit="mg/100g",
        value=round(sodium, 1), points_awarded=pts_sodium, max_possible_points=10.0,
        category=NutrientCategory.NEGATIVE, threshold_explanation=expl_sodium
    ))
    
    pts_chol, expl_chol = score_cholesterol(cholesterol)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="cholesterol", label="Cholesterol", unit="mg/100g",
        value=round(cholesterol, 1), points_awarded=pts_chol, max_possible_points=10.0,
        category=NutrientCategory.NEGATIVE, threshold_explanation=expl_chol
    ))
    
    negative_points = pts_energy + pts_sugar + pts_sat_fat + pts_sodium + pts_chol

    # ---------------------------------------------------------
    # 2. EVALUATE POSITIVE NUTRIENTS
    # ---------------------------------------------------------
    # Macros
    pts_protein, expl_protein = score_protein(protein)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="protein", label="Protein", unit="g/100g",
        value=round(protein, 1), points_awarded=pts_protein, max_possible_points=10.0,
        category=NutrientCategory.POSITIVE_MACRO, threshold_explanation=expl_protein
    ))
    
    pts_fibre, expl_fibre = score_fibre(fibre)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="fibre", label="Dietary Fibre", unit="g/100g",
        value=round(fibre, 1), points_awarded=pts_fibre, max_possible_points=10.0,
        category=NutrientCategory.POSITIVE_MACRO, threshold_explanation=expl_fibre
    ))
    
    pts_ccarbs, expl_ccarbs = score_complex_carbs(complex_carbs)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="complex_carbs", label="Complex Carbohydrates", unit="g/100g",
        value=round(complex_carbs, 1), points_awarded=pts_ccarbs, max_possible_points=10.0,
        category=NutrientCategory.POSITIVE_MACRO, threshold_explanation=expl_ccarbs
    ))
    
    # Fatty Acids
    pts_mufa, expl_mufa = score_mufa(mufa)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="mufa", label="MUFA (Healthy Fats)", unit="g/100g",
        value=round(mufa, 1), points_awarded=pts_mufa, max_possible_points=5.0,
        category=NutrientCategory.POSITIVE_FATTY_ACID, threshold_explanation=expl_mufa
    ))
    
    pts_pufa, expl_pufa = score_pufa(pufa)
    nutrient_scores.append(NutrientScoreDetail(
        nutrient_key="pufa", label="PUFA (Essential Fats)", unit="g/100g",
        value=round(pufa, 1), points_awarded=pts_pufa, max_possible_points=5.0,
        category=NutrientCategory.POSITIVE_FATTY_ACID, threshold_explanation=expl_pufa
    ))

    # Core Micronutrients (6 items: iron, calcium, vit A, vit C, vit D, potassium)
    core_micros = [
        ("iron", "Iron", "mg", NutrientCategory.POSITIVE_MINERAL),
        ("calcium", "Calcium", "mg", NutrientCategory.POSITIVE_MINERAL),
        ("vitamin_a", "Vitamin A", "mcg", NutrientCategory.POSITIVE_VITAMIN),
        ("vitamin_c", "Vitamin C", "mg", NutrientCategory.POSITIVE_VITAMIN),
        ("vitamin_d", "Vitamin D", "mcg", NutrientCategory.POSITIVE_VITAMIN),
        ("potassium", "Potassium", "mg", NutrientCategory.POSITIVE_MINERAL),
    ]
    
    for key, label, unit, cat in core_micros:
        val = get_val(key) * norm_factor
        dv_info = ICMR_DAILY_VALUES.get(key, {"dv": 1.0})
        pts, pct, expl = score_micronutrient_by_dv(val, dv_info["dv"], label)
        nutrient_scores.append(NutrientScoreDetail(
            nutrient_key=key, label=label, unit=f"{unit}/100g",
            value=round(val, 2), points_awarded=pts, max_possible_points=5.0,
            category=cat, percentage_of_dv=round(pct, 1), threshold_explanation=expl
        ))

    # Extended Nutrients (If mode is full_39_nutrient)
    if mode == AlgorithmMode.FULL_39:
        ext_minerals = [
            ("zinc", "Zinc", "mg"),
            ("magnesium", "Magnesium", "mg"),
            ("phosphorus", "Phosphorus", "mg"),
            ("copper", "Copper", "mg"),
            ("manganese", "Manganese", "mg"),
            ("selenium", "Selenium", "mcg"),
            ("chromium", "Chromium", "mcg"),
            ("molybdenum", "Molybdenum", "mcg"),
        ]
        for key, label, unit in ext_minerals:
            val = get_val(key) * norm_factor
            dv_info = ICMR_DAILY_VALUES.get(key, {"dv": 1.0})
            pts, pct, expl = score_micronutrient_by_dv(val, dv_info["dv"], label)
            nutrient_scores.append(NutrientScoreDetail(
                nutrient_key=key, label=label, unit=f"{unit}/100g",
                value=round(val, 2), points_awarded=pts, max_possible_points=5.0,
                category=NutrientCategory.POSITIVE_MINERAL, percentage_of_dv=round(pct, 1),
                threshold_explanation=expl
            ))
            
        ext_vitamins = [
            ("vitamin_e", "Vitamin E", "mg"),
            ("vitamin_k", "Vitamin K", "mcg"),
            ("thiamin_b1", "Thiamin (B1)", "mg"),
            ("riboflavin_b2", "Riboflavin (B2)", "mg"),
            ("niacin_b3", "Niacin (B3)", "mg"),
            ("pantothenic_acid_b5", "Pantothenic Acid (B5)", "mg"),
            ("vitamin_b6", "Vitamin B6", "mg"),
            ("biotin_b7", "Biotin (B7)", "mcg"),
            ("folate_b9", "Folate (B9)", "mcg"),
            ("vitamin_b12", "Vitamin B12", "mcg"),
        ]
        for key, label, unit in ext_vitamins:
            val = get_val(key) * norm_factor
            dv_info = ICMR_DAILY_VALUES.get(key, {"dv": 1.0})
            pts, pct, expl = score_micronutrient_by_dv(val, dv_info["dv"], label)
            nutrient_scores.append(NutrientScoreDetail(
                nutrient_key=key, label=label, unit=f"{unit}/100g",
                value=round(val, 2), points_awarded=pts, max_possible_points=5.0,
                category=NutrientCategory.POSITIVE_VITAMIN, percentage_of_dv=round(pct, 1),
                threshold_explanation=expl
            ))
            
        # Carotenoids
        carot_val = get_val("carotenoids") * norm_factor
        pts_carot, expl_carot = score_carotenoids(carot_val)
        nutrient_scores.append(NutrientScoreDetail(
            nutrient_key="carotenoids", label="Carotenoids", unit="mcg/100g",
            value=round(carot_val, 1), points_awarded=pts_carot, max_possible_points=5.0,
            category=NutrientCategory.POSITIVE_PHYTO, threshold_explanation=expl_carot
        ))

    # Calculate total positive points
    positive_points = sum(
        item.points_awarded for item in nutrient_scores if item.category != NutrientCategory.NEGATIVE
    )

    # ---------------------------------------------------------
    # 3. SCORE NORMALIZATION & GRADE MAPPING
    # ---------------------------------------------------------
    raw_score = negative_points - positive_points
    
    if mode == AlgorithmMode.ICMR_16:
        # Range: -70 to +50 (span = 120). health_score = 100 * (50 - raw_score) / 120
        health_score = 100.0 * (50.0 - raw_score) / 120.0
        health_score = max(0.0, min(100.0, health_score))
        grade, grade_color, grade_label, grade_desc = map_health_score_to_grade(health_score)
        
    elif mode == AlgorithmMode.FULL_39:
        # Range: -165 to +50 (span = 215). health_score = 100 * (50 - raw_score) / 215
        health_score = 100.0 * (50.0 - raw_score) / 215.0
        health_score = max(0.0, min(100.0, health_score))
        grade, grade_color, grade_label, grade_desc = map_health_score_to_grade(health_score)
        
    else:  # OFFICIAL_NS
        # Official FSA-NPS solid food formula
        fvl_pct = get_val("fruit_veg_legume_pct")
        # In FSA-NPS, if N >= 11, protein is counted only if fruit/veg/legume >= 80%
        effective_positive = positive_points
        if negative_points >= 11.0 and fvl_pct < 80.0:
            effective_positive -= pts_protein
        fsa_raw = negative_points - effective_positive
        grade, grade_color, grade_label, grade_desc = map_official_raw_to_grade(fsa_raw)
        health_score = max(0.0, min(100.0, 100.0 * (40.0 - fsa_raw) / 55.0))

    # Contributors
    positive_contributors = sorted(
        [item for item in nutrient_scores if item.category != NutrientCategory.NEGATIVE and item.points_awarded > 0],
        key=lambda x: x.points_awarded,
        reverse=True
    )
    negative_contributors = sorted(
        [item for item in nutrient_scores if item.category == NutrientCategory.NEGATIVE and item.points_awarded > 0],
        key=lambda x: x.points_awarded,
        reverse=True
    )

    # ---------------------------------------------------------
    # 4. EVIDENCE-BASED RECOMMENDATIONS
    # ---------------------------------------------------------
    recommendations: List[str] = []
    if pts_sugar >= 4:
        recommendations.append("Free sugar level is elevated. Consider moderating refined sugars, syrups, and sweetened gravies.")
    if pts_sodium >= 4:
        recommendations.append("Sodium concentration is substantial. Reducing added salt can support healthy blood pressure.")
    if pts_sat_fat >= 4:
        recommendations.append("Contains elevated saturated fat. Consider substituting part of ghee/butter with cold-pressed MUFA oils (mustard, groundnut, sesame).")
    if pts_fibre < 2:
        recommendations.append("Dietary fibre is low. Incorporating whole pulses, millets, sprouts, or leafy vegetables will significantly boost satiety and gut health.")
    if pts_protein >= 5:
        recommendations.append("Excellent protein density, supporting lean muscle mass and metabolic equilibrium.")
    if pts_ccarbs >= 5:
        recommendations.append("Wholesome complex carbohydrates provide steady glucose release without sharp glycemic spikes.")
    if not recommendations:
        recommendations.append("The food displays a balanced nutrient composition for its food group.")

    disclaimer = (
        "This tool provides an algorithmic nutritional estimate based on entered values and ICMR-NIN 2020 reference guidelines. "
        "It is designed for educational and profiling research purposes, not for medical diagnosis or clinical treatment."
    )

    return FoodScoreResult(
        food_name=food_name,
        food_category=food_category,
        serving_size=serving_size,
        serving_unit=serving_unit,
        algorithm_mode=mode,
        algorithm_version=meta["version"],
        algorithm_title=meta["title"],
        negative_points=round(negative_points, 1),
        positive_points=round(positive_points, 1),
        raw_score=round(raw_score, 1),
        health_score=round(health_score, 1),
        grade=grade,
        grade_color=grade_color,
        grade_label=grade_label,
        grade_description=grade_desc,
        nutrient_scores=nutrient_scores,
        positive_contributors=positive_contributors,
        negative_contributors=negative_contributors,
        recommendations=recommendations,
        disclaimer=disclaimer,
    )

"""
Personalised Protein Quality & Nutrient Density (PPQND) NutriScore Engine.
Evaluates mixed dishes against individual demographic RDA requirements (ICMR-NIN 2024 / WHO / FAO).
"""
from typing import Dict, Any, List, Optional, Tuple
from pydantic import BaseModel, Field
from .demographics import get_demographic_profile, DemographicRequirement
from .amino_acids import (
    evaluate_amino_acid_quality,
    get_complementary_protein_score,
    estimate_eaas_from_protein,
    COMPLEMENTARITY_RULES
)


class DiagnosticPanelItem(BaseModel):
    nutrient_key: str
    label: str
    unit: str
    amount_per_serving: float
    individual_requirement: float
    requirement_fulfilled_pct: float
    score_points: float  # 0 to 10
    status: str  # optimal, adequate, low, excessive, etc.


class PersonalisedNutriScoreResult(BaseModel):
    food_name: str
    serving_size_g: float
    demographic_key: str
    demographic_label: str
    demographic_description: str
    
    # Core scores
    nutriscore: float  # 0 to 100
    grade: str  # A+, A, B, C, D, E, F
    grade_color: str  # Hex code
    grade_label: str
    grade_description: str
    
    # Domain Scores
    positive_nutrient_score: float  # PNS 0 to 100
    negative_risk_score: float  # NRS 0 to 100
    benefit_risk_balance: float  # (0.75*PNS - 0.25*NRS)
    
    # Protein Quality specifics
    weighted_amino_acid_score: float  # 0 to 10
    limiting_amino_acid: Optional[str] = None
    complementary_protein_label: str
    complementary_protein_score: float
    
    # The 4 Diagnostic Panels
    nutrient_density_panel: List[DiagnosticPanelItem]
    protein_quality_panel: Dict[str, Any]
    chronic_risk_panel: List[DiagnosticPanelItem]
    demographic_insights: List[str]


def score_positive_fulfilment(pct: float) -> float:
    """
    10-point saturation scale capping at 100% daily requirement coverage.
    Based on Codex Alimentarius & Nutrient Rich Food (NRF) principles.
    """
    if pct < 5.0: return 0.0
    elif pct < 10.0: return 1.0
    elif pct < 15.0: return 2.0
    elif pct < 20.0: return 3.0
    elif pct < 30.0: return 4.0
    elif pct < 40.0: return 5.0
    elif pct < 50.0: return 6.0
    elif pct < 65.0: return 7.0
    elif pct < 80.0: return 8.0
    elif pct < 100.0: return 9.0
    return 10.0


def score_negative_penalty(pct: float) -> float:
    """
    10-point progressive penalty scale based on percentage of WHO daily maximum limit.
    """
    if pct < 5.0: return 0.0
    elif pct < 10.0: return 1.0
    elif pct < 20.0: return 2.0
    elif pct < 30.0: return 3.0
    elif pct < 40.0: return 4.0
    elif pct < 50.0: return 5.0
    elif pct < 60.0: return 6.0
    elif pct < 70.0: return 7.0
    elif pct < 80.0: return 8.0
    elif pct < 100.0: return 9.0
    return 10.0


def score_pufa_energy(pufa_g: float, total_kcal: float) -> float:
    """
    Scores PUFA based on optimal physiological energy contribution (6% to 12% of kcal).
    Both deficiency (<2%) and excessive thermal peroxidation risk (>16%) are penalized.
    """
    if total_kcal <= 0: return 0.0
    pufa_kcal = pufa_g * 9.0
    pct_kcal = (pufa_kcal / total_kcal) * 100.0
    
    if pct_kcal < 2.0: return 0.0
    elif pct_kcal < 4.0: return 3.0
    elif pct_kcal < 6.0: return 6.0
    elif 6.0 <= pct_kcal <= 12.0: return 10.0
    elif pct_kcal <= 16.0: return 8.0
    return 5.0


def score_mufa_energy(mufa_g: float, total_kcal: float) -> float:
    """
    Scores MUFA based on optimal cardioprotective energy contribution (10% to 20% of kcal).
    """
    if total_kcal <= 0: return 0.0
    mufa_kcal = mufa_g * 9.0
    pct_kcal = (mufa_kcal / total_kcal) * 100.0
    
    if pct_kcal < 4.0: return 0.0
    elif pct_kcal < 8.0: return 4.0
    elif pct_kcal < 10.0: return 7.0
    elif 10.0 <= pct_kcal <= 20.0: return 10.0
    elif pct_kcal <= 25.0: return 8.0
    return 5.0


def score_energy_density_penalty(kcal_per_100g: float) -> float:
    """
    Penalizes food energy density (kcal / 100g). Foods >225-275 kcal/100g become obesogenic.
    """
    if kcal_per_100g < 75.0: return 0.0
    elif kcal_per_100g < 125.0: return 1.0
    elif kcal_per_100g < 175.0: return 2.0
    elif kcal_per_100g < 225.0: return 3.0
    elif kcal_per_100g < 275.0: return 4.0
    elif kcal_per_100g < 325.0: return 5.0
    elif kcal_per_100g < 375.0: return 6.0
    elif kcal_per_100g < 450.0: return 7.0
    elif kcal_per_100g < 550.0: return 8.0
    elif kcal_per_100g < 650.0: return 9.0
    return 10.0


def assign_7tier_grade(score: float) -> Tuple[str, str, str, str]:
    """
    7-Tier Grade Classification (A+ to F):
    Returns (grade, hex_color, grade_label, grade_description)
    """
    if score >= 90.0:
        return (
            "A+",
            "#059669",
            "Optimal Therapeutic Quality",
            "Exceptional biological protein quality, complete amino acid spectrum, and superior micronutrient density with negligible chronic risk factors."
        )
    elif score >= 80.0:
        return (
            "A",
            "#16a34a",
            "High Nutrient Density",
            "High protein quality with complete complementarity, high fibre, and protective lipids. Highly encouraged for daily consumption."
        )
    elif score >= 70.0:
        return (
            "B",
            "#84cc16",
            "Good Quality Staple",
            "Balanced macronutrient and micronutrient density. Excellent foundation for everyday nutritious Indian meals."
        )
    elif score >= 60.0:
        return (
            "C",
            "#eab308",
            "Moderate Quality",
            "Adequate calories and basic protein, but contains moderate sodium/fats or lacks optimal micronutrient coverage."
        )
    elif score >= 50.0:
        return (
            "D",
            "#f97316",
            "Sub-optimal / Caution",
            "High in one or more risk factors (sodium, refined oils, or free sugars). Recommend portion control and nutritional fortification."
        )
    elif score >= 40.0:
        return (
            "E",
            "#ef4444",
            "Poor Quality",
            "Ultra-energy-dense with high saturated fat or sugar and negligible protective fibre or essential micronutrients."
        )
    else:
        return (
            "F",
            "#b91c1c",
            "High Health Risk",
            "Severe excess of sodium, trans fat, saturated fat, or free sugars. High chronic disease burden; strictly limit intake."
        )


def calculate_personalised_pndpq_score(
    food_name: str,
    serving_size_g: float,
    nutrients_per_serving: Dict[str, float],
    demographic_key: str = "adult_male",
    complementary_protein_key: str = "cereal_pulse",
    custom_eaas: Optional[Dict[str, float]] = None
) -> PersonalisedNutriScoreResult:
    """
    Executes the Personalised Protein Quality & Nutrient Density (PPQND) scoring pipeline.
    """
    demo = get_demographic_profile(demographic_key)
    
    # -------------------------------------------------------------------------
    # 1. PROTEIN QUALITY & ESSENTIAL AMINO ACID EVALUATION (40% Weight Domain)
    # -------------------------------------------------------------------------
    protein_g = nutrients_per_serving.get("protein", 0.0)
    
    # If custom EAAs not provided, intelligently estimate based on protein source
    if custom_eaas and any(custom_eaas.values()):
        eaas = custom_eaas
    else:
        eaas = estimate_eaas_from_protein(protein_g, complementary_protein_key)
        
    aa_score, aa_details, limiting_aa = evaluate_amino_acid_quality(
        eaas, demo.eaa_requirements_mg
    )
    
    # Complementary Protein Index (5% weight)
    comp_score, comp_label, comp_desc = get_complementary_protein_score(complementary_protein_key)
    
    # Protein Quantity Score (10% weight)
    protein_coverage_pct = round((protein_g / demo.protein_g) * 100.0, 1) if demo.protein_g > 0 else 0.0
    protein_qty_score = score_positive_fulfilment(protein_coverage_pct)
    
    # -------------------------------------------------------------------------
    # 2. FIBRE & SATIETY (10% Weight Domain)
    # -------------------------------------------------------------------------
    fibre_g = nutrients_per_serving.get("fibre", 0.0)
    fibre_coverage_pct = round((fibre_g / demo.fibre_g) * 100.0, 1) if demo.fibre_g > 0 else 0.0
    fibre_score = score_positive_fulfilment(fibre_coverage_pct)

    # -------------------------------------------------------------------------
    # 3. MICRONUTRIENT DENSITY (30% Weight Domain: 15% Minerals + 15% Vitamins)
    # -------------------------------------------------------------------------
    # Minerals
    ca = nutrients_per_serving.get("calcium", 0.0)
    fe = nutrients_per_serving.get("iron", 0.0)
    zn = nutrients_per_serving.get("zinc", 0.0)
    k = nutrients_per_serving.get("potassium", 0.0)
    
    ca_cov = round((ca / demo.calcium_mg) * 100.0, 1) if demo.calcium_mg > 0 else 0.0
    fe_cov = round((fe / demo.iron_mg) * 100.0, 1) if demo.iron_mg > 0 else 0.0
    zn_cov = round((zn / demo.zinc_mg) * 100.0, 1) if demo.zinc_mg > 0 else 0.0
    k_cov = round((k / demo.potassium_mg) * 100.0, 1) if demo.potassium_mg > 0 else 0.0
    
    s_ca = score_positive_fulfilment(ca_cov)
    s_fe = score_positive_fulfilment(fe_cov)
    s_zn = score_positive_fulfilment(zn_cov)
    s_k = score_positive_fulfilment(k_cov)
    minerals_score = (s_ca + s_fe + s_zn + s_k) / 4.0
    
    # Vitamins
    va = nutrients_per_serving.get("vitamin_a", 0.0)
    vc = nutrients_per_serving.get("vitamin_c", 0.0)
    vd = nutrients_per_serving.get("vitamin_d", 0.0)
    vb1 = nutrients_per_serving.get("vitamin_b1", 0.0)
    vb2 = nutrients_per_serving.get("vitamin_b2", 0.0)
    vb6 = nutrients_per_serving.get("vitamin_b6", 0.0)
    vb9 = nutrients_per_serving.get("vitamin_b9", 0.0)
    vb12 = nutrients_per_serving.get("vitamin_b12", 0.0)
    
    va_cov = round((va / demo.vitamin_a_mcg) * 100.0, 1) if demo.vitamin_a_mcg > 0 else 0.0
    vc_cov = round((vc / demo.vitamin_c_mg) * 100.0, 1) if demo.vitamin_c_mg > 0 else 0.0
    vd_cov = round((vd / demo.vitamin_d_mcg) * 100.0, 1) if demo.vitamin_d_mcg > 0 else 0.0
    vb1_cov = round((vb1 / demo.vitamin_b1_mg) * 100.0, 1) if demo.vitamin_b1_mg > 0 else 0.0
    vb2_cov = round((vb2 / demo.vitamin_b2_mg) * 100.0, 1) if demo.vitamin_b2_mg > 0 else 0.0
    vb6_cov = round((vb6 / demo.vitamin_b6_mg) * 100.0, 1) if demo.vitamin_b6_mg > 0 else 0.0
    vb9_cov = round((vb9 / demo.vitamin_b9_mcg) * 100.0, 1) if demo.vitamin_b9_mcg > 0 else 0.0
    vb12_cov = round((vb12 / demo.vitamin_b12_mcg) * 100.0, 1) if demo.vitamin_b12_mcg > 0 else 0.0
    
    s_va = score_positive_fulfilment(va_cov)
    s_vc = score_positive_fulfilment(vc_cov)
    s_vd = score_positive_fulfilment(vd_cov)
    s_vb1 = score_positive_fulfilment(vb1_cov)
    s_vb2 = score_positive_fulfilment(vb2_cov)
    s_vb6 = score_positive_fulfilment(vb6_cov)
    s_vb9 = score_positive_fulfilment(vb9_cov)
    s_vb12 = score_positive_fulfilment(vb12_cov)
    vitamins_score = (s_va + s_vc + s_vd + s_vb1 + s_vb2 + s_vb6 + s_vb9 + s_vb12) / 8.0

    # -------------------------------------------------------------------------
    # 4. HEALTHY FAT QUALITY (20% Weight Domain: Omega-3 8%, PUFA 6%, MUFA 6%)
    # -------------------------------------------------------------------------
    omega3 = nutrients_per_serving.get("omega3", 0.0)
    omega3_cov = round((omega3 / demo.omega3_g) * 100.0, 1) if demo.omega3_g > 0 else 0.0
    s_omega3 = score_positive_fulfilment(omega3_cov)
    
    total_kcal = nutrients_per_serving.get("energy_kcal", 0.0)
    pufa_g = nutrients_per_serving.get("pufa", 0.0)
    mufa_g = nutrients_per_serving.get("mufa", 0.0)
    s_pufa = score_pufa_energy(pufa_g, total_kcal)
    s_mufa = score_mufa_energy(mufa_g, total_kcal)

    # -------------------------------------------------------------------------
    # 5. POSITIVE NUTRIENT SCORE (PNS: Scale 0 to 100)
    # -------------------------------------------------------------------------
    pns = 10.0 * (
        (0.25 * aa_score) +
        (0.10 * protein_qty_score) +
        (0.05 * comp_score) +
        (0.10 * fibre_score) +
        (0.15 * minerals_score) +
        (0.15 * vitamins_score) +
        (0.08 * s_omega3) +
        (0.06 * s_pufa) +
        (0.06 * s_mufa)
    )
    pns = round(min(100.0, max(0.0, pns)), 1)

    # -------------------------------------------------------------------------
    # 6. NEGATIVE RISK PENALTIES (NRS: Scale 0 to 100)
    # -------------------------------------------------------------------------
    sodium_mg = nutrients_per_serving.get("sodium", 0.0)
    sfa_g = nutrients_per_serving.get("saturated_fat", 0.0)
    added_sugar_g = nutrients_per_serving.get("added_sugars", nutrients_per_serving.get("free_sugars", 0.0))
    trans_fat_g = nutrients_per_serving.get("trans_fat", 0.0)
    cholesterol_mg = nutrients_per_serving.get("cholesterol", 0.0)
    total_fat_g = nutrients_per_serving.get("total_fat", 0.0)
    
    na_cov = round((sodium_mg / demo.max_sodium_mg) * 100.0, 1) if demo.max_sodium_mg > 0 else 0.0
    sfa_cov = round((sfa_g / demo.max_saturated_fat_g) * 100.0, 1) if demo.max_saturated_fat_g > 0 else 0.0
    sugar_cov = round((added_sugar_g / demo.max_added_sugar_g) * 100.0, 1) if demo.max_added_sugar_g > 0 else 0.0
    trans_cov = round((trans_fat_g / demo.max_trans_fat_g) * 100.0, 1) if demo.max_trans_fat_g > 0 else 0.0
    chol_cov = round((cholesterol_mg / demo.max_cholesterol_mg) * 100.0, 1) if demo.max_cholesterol_mg > 0 else 0.0
    fat_cov = round((total_fat_g / demo.max_total_fat_g) * 100.0, 1) if demo.max_total_fat_g > 0 else 0.0
    
    p_sodium = score_negative_penalty(na_cov)
    p_sfa = score_negative_penalty(sfa_cov)
    p_sugar = score_negative_penalty(sugar_cov)
    p_trans = score_negative_penalty(trans_cov)
    p_chol = score_negative_penalty(chol_cov)
    p_fat = score_negative_penalty(fat_cov)
    
    # Energy density per 100g
    kcal_per_100g = (total_kcal / serving_size_g) * 100.0 if serving_size_g > 0 else total_kcal
    p_energy = score_energy_density_penalty(kcal_per_100g)

    nrs = 10.0 * (
        (0.30 * p_sodium) +
        (0.20 * p_sfa) +
        (0.20 * p_sugar) +
        (0.15 * p_trans) +
        (0.10 * p_energy) +
        (0.03 * p_chol) +
        (0.02 * p_fat)
    )
    nrs = round(min(100.0, max(0.0, nrs)), 1)

    # -------------------------------------------------------------------------
    # 7. BENEFIT-RISK EQUATION & FINAL NUTRISCORE (0 to 100)
    # -------------------------------------------------------------------------
    balance = (0.75 * pns) - (0.25 * nrs)
    final_score = round(min(100.0, max(0.0, 50.0 + balance)), 1)

    grade, grade_color, grade_label, grade_desc = assign_7tier_grade(final_score)

    # -------------------------------------------------------------------------
    # 8. DIAGNOSTIC PANELS PREPARATION
    # -------------------------------------------------------------------------
    nutrient_density_panel = [
        DiagnosticPanelItem(
            nutrient_key="protein",
            label="Protein",
            unit="g",
            amount_per_serving=protein_g,
            individual_requirement=demo.protein_g,
            requirement_fulfilled_pct=protein_coverage_pct,
            score_points=protein_qty_score,
            status="High Source" if protein_coverage_pct >= 20.0 else "Adequate" if protein_coverage_pct >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="fibre",
            label="Dietary Fibre",
            unit="g",
            amount_per_serving=fibre_g,
            individual_requirement=demo.fibre_g,
            requirement_fulfilled_pct=fibre_coverage_pct,
            score_points=fibre_score,
            status="High Source" if fibre_coverage_pct >= 20.0 else "Adequate" if fibre_coverage_pct >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="calcium",
            label="Calcium",
            unit="mg",
            amount_per_serving=ca,
            individual_requirement=demo.calcium_mg,
            requirement_fulfilled_pct=ca_cov,
            score_points=s_ca,
            status="High Source" if ca_cov >= 20.0 else "Adequate" if ca_cov >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="iron",
            label="Iron",
            unit="mg",
            amount_per_serving=fe,
            individual_requirement=demo.iron_mg,
            requirement_fulfilled_pct=fe_cov,
            score_points=s_fe,
            status="High Source" if fe_cov >= 20.0 else "Adequate" if fe_cov >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="zinc",
            label="Zinc",
            unit="mg",
            amount_per_serving=zn,
            individual_requirement=demo.zinc_mg,
            requirement_fulfilled_pct=zn_cov,
            score_points=s_zn,
            status="High Source" if zn_cov >= 20.0 else "Adequate" if zn_cov >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="potassium",
            label="Potassium",
            unit="mg",
            amount_per_serving=k,
            individual_requirement=demo.potassium_mg,
            requirement_fulfilled_pct=k_cov,
            score_points=s_k,
            status="High Source" if k_cov >= 20.0 else "Adequate" if k_cov >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="vitamin_a",
            label="Vitamin A",
            unit="mcg",
            amount_per_serving=va,
            individual_requirement=demo.vitamin_a_mcg,
            requirement_fulfilled_pct=va_cov,
            score_points=s_va,
            status="High Source" if va_cov >= 20.0 else "Adequate" if va_cov >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="vitamin_c",
            label="Vitamin C",
            unit="mg",
            amount_per_serving=vc,
            individual_requirement=demo.vitamin_c_mg,
            requirement_fulfilled_pct=vc_cov,
            score_points=s_vc,
            status="High Source" if vc_cov >= 20.0 else "Adequate" if vc_cov >= 10.0 else "Low"
        ),
        DiagnosticPanelItem(
            nutrient_key="vitamin_b12",
            label="Vitamin B12",
            unit="mcg",
            amount_per_serving=vb12,
            individual_requirement=demo.vitamin_b12_mcg,
            requirement_fulfilled_pct=vb12_cov,
            score_points=s_vb12,
            status="High Source" if vb12_cov >= 20.0 else "Adequate" if vb12_cov >= 10.0 else "Low"
        ),
    ]

    chronic_risk_panel = [
        DiagnosticPanelItem(
            nutrient_key="sodium",
            label="Sodium (Salt)",
            unit="mg",
            amount_per_serving=sodium_mg,
            individual_requirement=demo.max_sodium_mg,
            requirement_fulfilled_pct=na_cov,
            score_points=p_sodium,
            status="Excessive Risk" if na_cov > 50.0 else "Moderate" if na_cov > 20.0 else "Safe"
        ),
        DiagnosticPanelItem(
            nutrient_key="saturated_fat",
            label="Saturated Fat",
            unit="g",
            amount_per_serving=sfa_g,
            individual_requirement=demo.max_saturated_fat_g,
            requirement_fulfilled_pct=sfa_cov,
            score_points=p_sfa,
            status="Excessive Risk" if sfa_cov > 50.0 else "Moderate" if sfa_cov > 20.0 else "Safe"
        ),
        DiagnosticPanelItem(
            nutrient_key="added_sugars",
            label="Added Sugars",
            unit="g",
            amount_per_serving=added_sugar_g,
            individual_requirement=demo.max_added_sugar_g,
            requirement_fulfilled_pct=sugar_cov,
            score_points=p_sugar,
            status="Excessive Risk" if sugar_cov > 50.0 else "Moderate" if sugar_cov > 20.0 else "Safe"
        ),
        DiagnosticPanelItem(
            nutrient_key="trans_fat",
            label="Trans Fat",
            unit="g",
            amount_per_serving=trans_fat_g,
            individual_requirement=demo.max_trans_fat_g,
            requirement_fulfilled_pct=trans_cov,
            score_points=p_trans,
            status="Unsafe" if trans_fat_g > 0.0 else "Zero Safe"
        ),
    ]

    protein_quality_panel = {
        "weighted_amino_acid_score": aa_score,
        "limiting_amino_acid": limiting_aa,
        "complementary_combination": comp_label,
        "complementary_score": comp_score,
        "complementary_description": comp_desc,
        "amino_acid_coverages": aa_details,
        "biological_value_tier": "High Biological Value" if aa_score >= 7.5 else "Moderate Biological Value" if aa_score >= 5.0 else "Low Biological Value",
    }

    # Generate Tailored Demographic Insights
    insights: List[str] = []
    insights.append(
        f"For a {demo.label}, this single serving fulfills {protein_coverage_pct}% of daily protein requirement and {fibre_coverage_pct}% of dietary fibre."
    )
    
    if limiting_aa:
        insights.append(
            f"Protein Quality Note: The primary limiting amino acid is {limiting_aa.replace('_', ' ').title()}. Pairing with diverse protein sources can improve total DIAAS utilization."
        )
        
    if fe_cov < 20.0 and demo.key in ["adolescent_female", "adult_female", "pregnant_woman"]:
        insights.append(
            f"Iron Alert: This serving supplies only {fe_cov}% of this demographic's elevated iron needs ({demo.iron_mg}mg). Pairing with a Vitamin C source (lemon, amla, tomato) enhances iron absorption."
        )
    elif fe_cov >= 25.0:
        insights.append(
            f"Iron Benefit: Provides {fe_cov}% of daily iron, substantially assisting with anemia prevention in this life stage."
        )

    if na_cov > 30.0:
        insights.append(
            f"Sodium Moderation: Salt accounts for {na_cov}% of the daily upper limit ({demo.max_sodium_mg}mg). Reducing salt by 20% can improve the NutriScore by +3 to +6 points."
        )

    return PersonalisedNutriScoreResult(
        food_name=food_name,
        serving_size_g=serving_size_g,
        demographic_key=demo.key,
        demographic_label=demo.label,
        demographic_description=demo.description,
        nutriscore=final_score,
        grade=grade,
        grade_color=grade_color,
        grade_label=grade_label,
        grade_description=grade_desc,
        positive_nutrient_score=pns,
        negative_risk_score=nrs,
        benefit_risk_balance=round(balance, 1),
        weighted_amino_acid_score=aa_score,
        limiting_amino_acid=limiting_aa,
        complementary_protein_label=comp_label,
        complementary_protein_score=comp_score,
        nutrient_density_panel=nutrient_density_panel,
        protein_quality_panel=protein_quality_panel,
        chronic_risk_panel=chronic_risk_panel,
        demographic_insights=insights
    )

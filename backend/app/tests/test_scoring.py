"""Unit tests for scoring functions, normalization, and grade mapping."""
import pytest
from ..algorithms.models import AlgorithmMode
from ..algorithms.scoring import (
    score_energy_density,
    score_free_sugars,
    score_saturated_fat,
    score_sodium,
    score_cholesterol,
    score_protein,
    score_fibre,
    score_complex_carbs,
    score_mufa,
    score_pufa,
    score_micronutrient_by_dv,
    calculate_nutriscore,
)
from ..algorithms.grade_mapping import map_health_score_to_grade, map_official_raw_to_grade


def test_negative_thresholds_zero_and_boundaries():
    # Energy: <=80 is 0 pts, >800 is 10 pts
    assert score_energy_density(0)[0] == 0.0
    assert score_energy_density(80)[0] == 0.0
    assert score_energy_density(81)[0] == 1.0
    assert score_energy_density(480)[0] == 5.0
    assert score_energy_density(850)[0] == 10.0

    # Free sugars: <=4.5 is 0 pts, >45 is 10 pts
    assert score_free_sugars(0)[0] == 0.0
    assert score_free_sugars(4.5)[0] == 0.0
    assert score_free_sugars(27.0)[0] == 5.0
    assert score_free_sugars(50.0)[0] == 10.0

    # Saturated fat: <=1.0 is 0 pts, >10.0 is 10 pts
    assert score_saturated_fat(0.5)[0] == 0.0
    assert score_saturated_fat(5.0)[0] == 4.0
    assert score_saturated_fat(11.0)[0] == 10.0

    # Sodium: <=90 is 0 pts, >900 is 10 pts
    assert score_sodium(50)[0] == 0.0
    assert score_sodium(540)[0] == 5.0
    assert score_sodium(1000)[0] == 10.0

    # Cholesterol: <=10 is 0 pts, >300 is 10 pts
    assert score_cholesterol(5)[0] == 0.0
    assert score_cholesterol(100)[0] == 4.0
    assert score_cholesterol(350)[0] == 10.0


def test_positive_thresholds():
    # Protein: <=1.6 is 0, >16 is 10
    assert score_protein(1.0)[0] == 0.0
    assert score_protein(8.0)[0] == 4.0
    assert score_protein(20.0)[0] == 10.0

    # Fibre: <=0.9 is 0, >9.4 is 10
    assert score_fibre(0.5)[0] == 0.0
    assert score_fibre(4.7)[0] == 4.0
    assert score_fibre(10.0)[0] == 10.0

    # Complex carbs: <=5 is 0, >50 is 10
    assert score_complex_carbs(5.0)[0] == 0.0
    assert score_complex_carbs(30.0)[0] == 5.0
    assert score_complex_carbs(60.0)[0] == 10.0

    # MUFA & PUFA
    assert score_mufa(1.5)[0] == 0.0
    assert score_mufa(8.5)[0] == 4.0
    assert score_mufa(12.0)[0] == 5.0

    assert score_pufa(0.5)[0] == 0.0
    assert score_pufa(3.5)[0] == 3.0
    assert score_pufa(6.0)[0] == 5.0


def test_micronutrient_percentage_dv_scoring():
    # Iron DV = 19mg. 5% of 19 = 0.95mg. 25% of 19 = 4.75mg
    assert score_micronutrient_by_dv(0.5, 19.0, "Iron")[0] == 0.0  # ~2.6% (<5%)
    assert score_micronutrient_by_dv(1.5, 19.0, "Iron")[0] == 1.0  # ~7.9% (5-9.9%)
    assert score_micronutrient_by_dv(2.5, 19.0, "Iron")[0] == 2.0  # ~13.1% (10-14.9%)
    assert score_micronutrient_by_dv(5.0, 19.0, "Iron")[0] == 5.0  # ~26.3% (>=25%)


def test_grade_mapping_boundaries():
    assert map_health_score_to_grade(85.0)[0] == "A"
    assert map_health_score_to_grade(80.0)[0] == "A"
    assert map_health_score_to_grade(79.9)[0] == "B"
    assert map_health_score_to_grade(65.0)[0] == "B"
    assert map_health_score_to_grade(64.9)[0] == "C"
    assert map_health_score_to_grade(50.0)[0] == "C"
    assert map_health_score_to_grade(49.9)[0] == "D"
    assert map_health_score_to_grade(35.0)[0] == "D"
    assert map_health_score_to_grade(34.9)[0] == "E"
    assert map_health_score_to_grade(0.0)[0] == "E"


def test_lentils_vs_sugary_snack_scoring():
    # Healthy Moong Dal Tadka (Lentils)
    lentils_data = {
        "food_name": "Moong Dal Tadka",
        "food_category": "Legumes & Pulses",
        "serving_size": 100.0,
        "energy_kcal": 130.0,
        "free_sugars": 0.5,
        "saturated_fat": 1.2,
        "sodium": 280.0,
        "cholesterol": 2.0,
        "protein": 8.5,
        "fibre": 5.2,
        "total_carbs": 18.0,
        "mufa": 2.5,
        "pufa": 1.2,
        "iron": 3.2,
        "calcium": 65.0,
        "vitamin_a": 120.0,
        "vitamin_c": 8.0,
        "vitamin_d": 0.0,
        "potassium": 420.0,
    }
    lentil_result = calculate_nutriscore(lentils_data, mode=AlgorithmMode.ICMR_16)
    
    # Deep Fried Jalebi (High sugar & fat sweet)
    jalebi_data = {
        "food_name": "Jalebi",
        "food_category": "Sweets",
        "serving_size": 100.0,
        "energy_kcal": 450.0,
        "free_sugars": 52.0,
        "saturated_fat": 8.5,
        "sodium": 120.0,
        "cholesterol": 15.0,
        "protein": 2.0,
        "fibre": 0.2,
        "total_carbs": 70.0,
        "mufa": 3.0,
        "pufa": 1.0,
        "iron": 0.5,
        "calcium": 15.0,
        "vitamin_a": 0.0,
        "vitamin_c": 0.0,
        "vitamin_d": 0.0,
        "potassium": 40.0,
    }
    jalebi_result = calculate_nutriscore(jalebi_data, mode=AlgorithmMode.ICMR_16)

    # Lentils should score significantly higher than Jalebi
    assert lentil_result.health_score > jalebi_result.health_score
    assert lentil_result.grade in ("A", "B", "C")
    assert jalebi_result.grade in ("D", "E")
    assert lentil_result.positive_points > lentil_result.negative_points
    assert jalebi_result.negative_points > jalebi_result.positive_points


def test_icmr_baseline_scoring():
    food = {
        "food_name": "Sambar Rice",
        "serving_size": 200.0,
        "energy_kcal": 210.0,
        "free_sugars": 1.0,
        "saturated_fat": 1.0,
        "sodium": 320.0,
        "cholesterol": 0.0,
        "protein": 8.0,
        "fibre": 5.0,
        "iron": 2.5,
        "calcium": 60.0,
    }
    result = calculate_nutriscore(food, mode=AlgorithmMode.ICMR_16)
    assert result.health_score > 0
    assert result.grade in ("A", "B", "C", "D", "E")

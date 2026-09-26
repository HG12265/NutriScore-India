"""Integration tests for FastAPI endpoints."""
import pytest
from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)


def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "NutriScore AI"
    assert "disclaimer" in data


def test_api_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_api_algorithm_info():
    response = client.get("/api/v1/algorithm-info")
    assert response.status_code == 200
    data = response.json()
    assert "modes" in data
    assert "icmr_16_nutrient" in data["modes"]
    assert "personalised_pndpq" in data["modes"]
    assert "reference_daily_values" in data
    assert "nutrients" in data


def test_api_demographics_list():
    response = client.get("/api/v1/demographics")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 11
    assert len(data["profiles"]) == 11
    # Check that adult_male and toddler are present
    keys = [p["key"] for p in data["profiles"]]
    assert "adult_male" in keys
    assert "toddler" in keys
    assert "pregnant_woman" in keys


def test_api_demographic_single():
    response = client.get("/api/v1/demographics/adult_male")
    assert response.status_code == 200
    data = response.json()
    assert data["key"] == "adult_male"
    assert data["protein_g"] == 54.0
    assert "eaa_requirements_mg" in data


def test_api_complementarity_rules():
    response = client.get("/api/v1/complementarity-rules")
    assert response.status_code == 200
    data = response.json()
    assert "rules" in data
    assert "cereal_pulse" in data["rules"]


def test_api_analyze_valid():
    payload = {
        "food_name": "Multigrain Khichdi",
        "food_category": "Cereals & Millets",
        "serving_size": 150.0,
        "serving_unit": "g",
        "algorithm_mode": "icmr_16_nutrient",
        "energy_kcal": 140.0,
        "free_sugars": 0.8,
        "saturated_fat": 1.5,
        "sodium": 220.0,
        "cholesterol": 0.0,
        "protein": 7.0,
        "fibre": 4.5,
        "total_carbs": 24.0,
        "mufa": 2.0,
        "pufa": 1.5,
        "iron": 2.5,
        "calcium": 45.0,
        "vitamin_a": 80.0,
        "vitamin_c": 5.0,
        "vitamin_d": 0.0,
        "potassium": 320.0,
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["food_name"] == "Multigrain Khichdi"
    assert "score" in data
    assert 0 <= data["score"]["health_score"] <= 100
    assert data["score"]["grade"] in ["A", "B", "C", "D", "E"]
    assert "nutrient_analysis" in data
    assert len(data["recommendations"]) > 0


def test_api_analyze_personalised_pndpq():
    payload = {
        "food_name": "Paneer Sprouted Moong Bowl",
        "food_category": "Mixed Dishes",
        "serving_size": 200.0,
        "serving_unit": "g",
        "algorithm_mode": "personalised_pndpq",
        "demographic_profile": "adult_female",
        "complementary_protein_source": "pulse_dairy",
        "energy_kcal": 280.0,
        "protein": 18.0,
        "fibre": 6.0,
        "total_carbs": 22.0,
        "free_sugars": 1.0,
        "saturated_fat": 3.5,
        "trans_fat": 0.0,
        "total_fat": 8.0,
        "sodium": 280.0,
        "cholesterol": 12.0,
        "calcium": 320.0,
        "iron": 4.2,
        "zinc": 2.8,
        "potassium": 450.0,
        "vitamin_a": 350.0,
        "vitamin_c": 22.0,
        "vitamin_d": 2.0,
        "folate_b9": 90.0,
        "vitamin_b12": 0.8,
        "omega3": 0.4,
        "pufa": 2.2,
        "mufa": 3.8,
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "personalised_result" in data
    p_res = data["personalised_result"]
    assert p_res is not None
    assert p_res["demographic_key"] == "adult_female"
    assert p_res["grade"] in ["A+", "A", "B", "C", "D", "E", "F"]
    assert "nutrient_density_panel" in p_res
    assert "protein_quality_panel" in p_res
    assert "chronic_risk_panel" in p_res
    assert "demographic_insights" in p_res
    assert p_res["weighted_amino_acid_score"] > 0


def test_api_analyze_negative_value_fails():
    payload = {
        "food_name": "Test Snack",
        "serving_size": 100.0,
        "energy_kcal": -100.0,
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 422


def test_api_history_endpoint():
    response = client.get("/api/v1/analysis-history")
    assert response.status_code == 200
    data = response.json()
    assert "enabled" in data

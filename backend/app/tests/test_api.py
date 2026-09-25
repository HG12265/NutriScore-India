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
    assert "reference_daily_values" in data
    assert "nutrients" in data


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


def test_api_analyze_missing_name_fails():
    payload = {
        "food_name": "",
        "serving_size": 100.0,
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_api_analyze_negative_value_fails():
    payload = {
        "food_name": "Test Snack",
        "serving_size": 100.0,
        "energy_kcal": -100.0,
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 422


def test_api_history_disabled_mode():
    response = client.get("/api/v1/analysis-history")
    assert response.status_code == 200
    data = response.json()
    assert data["enabled"] is False

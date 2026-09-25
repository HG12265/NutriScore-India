"""Unit tests for nutrient validation rules."""
import pytest
from ..algorithms.validation import validate_nutrient_inputs


def test_validation_empty_food_name():
    is_valid, errors, _ = validate_nutrient_inputs({"food_name": "   ", "serving_size": 100})
    assert not is_valid
    assert any("Food name is required" in err for err in errors)


def test_validation_invalid_serving_size():
    is_valid, errors, _ = validate_nutrient_inputs({"food_name": "Roti", "serving_size": -50})
    assert not is_valid
    assert any("Serving size must be greater than zero" in err for err in errors)

    is_valid2, errors2, _ = validate_nutrient_inputs({"food_name": "Roti", "serving_size": 0})
    assert not is_valid2


def test_validation_negative_nutrient():
    is_valid, errors, _ = validate_nutrient_inputs({
        "food_name": "Sambar",
        "serving_size": 100,
        "energy_kcal": 120,
        "free_sugars": -2.0,
    })
    assert not is_valid
    assert any("cannot be negative" in err for err in errors)


def test_validation_free_sugar_exceeding_total_carbs():
    is_valid, errors, _ = validate_nutrient_inputs({
        "food_name": "Sweet Dish",
        "serving_size": 100,
        "total_carbs": 20.0,
        "free_sugars": 35.0,
    })
    assert not is_valid
    assert any("cannot exceed Total Carbohydrates" in err for err in errors)


def test_validation_plausible_inputs_pass():
    is_valid, errors, warnings = validate_nutrient_inputs({
        "food_name": "Palak Paneer",
        "serving_size": 150.0,
        "energy_kcal": 210.0,
        "free_sugars": 2.0,
        "saturated_fat": 6.5,
        "sodium": 340.0,
        "cholesterol": 22.0,
        "protein": 11.0,
        "fibre": 3.8,
        "total_carbs": 8.0,
    })
    assert is_valid
    assert len(errors) == 0

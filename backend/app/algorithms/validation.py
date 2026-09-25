"""Nutrient input validation rules and physical consistency checks."""
from typing import Dict, Any, List, Tuple


def validate_nutrient_inputs(data: Dict[str, Any]) -> Tuple[bool, List[str], List[str]]:
    """
    Validates food information and nutrient values.
    
    Returns:
        (is_valid, errors, warnings)
    """
    errors: List[str] = []
    warnings: List[str] = []
    
    # 1. Food Name Validation
    food_name = data.get("food_name", "").strip()
    if not food_name:
        errors.append("Food name is required.")
        
    # 2. Serving Size Validation
    serving_size = data.get("serving_size", 100.0)
    try:
        serving_size = float(serving_size)
        if serving_size <= 0:
            errors.append("Serving size must be greater than zero.")
    except (ValueError, TypeError):
        errors.append("Serving size must be a valid positive number.")
        
    # 3. Numeric & Non-Negative Validation on All Nutrient Fields
    for key, value in data.items():
        if key in ("food_name", "food_category", "serving_unit", "recipe_description", "algorithm_mode"):
            continue
        if value is None:
            continue
            
        try:
            num_val = float(value)
            if num_val < 0:
                errors.append(f"Nutrient '{key}' cannot be negative (got {num_val}).")
        except (ValueError, TypeError):
            errors.append(f"Nutrient '{key}' must be a valid numeric value.")
            
    # 4. Consistency & Plausibility Checks (Warnings or Errors)
    try:
        free_sugars = float(data.get("free_sugars", 0.0) or 0.0)
        total_carbs = data.get("total_carbs")
        fibre = float(data.get("fibre", 0.0) or 0.0)
        
        if total_carbs is not None:
            tc_float = float(total_carbs)
            if tc_float > 0 and free_sugars > tc_float:
                errors.append(f"Free sugars ({free_sugars}g) cannot exceed Total Carbohydrates ({tc_float}g).")
            if tc_float > 0 and fibre > tc_float:
                warnings.append(f"Dietary fibre ({fibre}g) is reported higher than Total Carbohydrates ({tc_float}g). Please verify.")
                
        # Energy density warning for normal foods (>900 kcal/100g is pure oil/fat limit)
        energy_kcal = float(data.get("energy_kcal", 0.0) or 0.0)
        if energy_kcal > 900.0:
            warnings.append(f"Energy value ({energy_kcal} kcal/100g) exceeds the caloric density of pure fats (900 kcal/100g).")
            
        # Free sugars per 100g cannot exceed 100g
        if free_sugars > 100.0:
            errors.append(f"Free sugars ({free_sugars}g) cannot exceed 100g per 100g serving.")
            
        # Saturated fat cannot exceed 100g per 100g
        sat_fat = float(data.get("saturated_fat", 0.0) or 0.0)
        if sat_fat > 100.0:
            errors.append(f"Saturated fat ({sat_fat}g) cannot exceed 100g per 100g serving.")
            
    except Exception:
        pass
        
    is_valid = len(errors) == 0
    return is_valid, errors, warnings

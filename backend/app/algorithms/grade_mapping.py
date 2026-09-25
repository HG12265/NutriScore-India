"""Grade mapping functions and color/label definitions."""
from typing import Tuple, Dict


GRADE_DETAILS = {
    "A": {
        "color": "#1b8a43",
        "textColor": "#ffffff",
        "label": "High Nutritional Quality",
        "description": "Rich in protective nutrients (dietary fibre, protein, micronutrients) with minimal negative penalties.",
    },
    "B": {
        "color": "#85bb2f",
        "textColor": "#ffffff",
        "label": "Good Nutritional Quality",
        "description": "Favourable overall profile; healthy everyday choice with wholesome nutritional value.",
    },
    "C": {
        "color": "#fecb02",
        "textColor": "#1a1a1a",
        "label": "Moderate Nutritional Quality",
        "description": "Average nutrient profile; balance with nutrient-dense foods.",
    },
    "D": {
        "color": "#ee8100",
        "textColor": "#ffffff",
        "label": "Low Nutritional Quality",
        "description": "Elevated in negative nutrients (fats, free sugars, or sodium) relative to beneficial nutrients.",
    },
    "E": {
        "color": "#e63e11",
        "textColor": "#ffffff",
        "label": "Poor Nutritional Quality",
        "description": "Heavily skewed toward high calorie density, saturated fats, sugars, or sodium.",
    },
}


def map_health_score_to_grade(health_score: float) -> Tuple[str, str, str, str]:
    """
    Maps 0-100 normalized Health Score to letter grade A-E.
    
    Cutoffs:
      Grade A: >= 80.0
      Grade B: 65.0 - 79.9
      Grade C: 50.0 - 64.9
      Grade D: 35.0 - 49.9
      Grade E: < 35.0
    
    Returns: (grade, color, label, description)
    """
    clamped_score = max(0.0, min(100.0, health_score))
    
    if clamped_score >= 80.0:
        grade = "A"
    elif clamped_score >= 65.0:
        grade = "B"
    elif clamped_score >= 50.0:
        grade = "C"
    elif clamped_score >= 35.0:
        grade = "D"
    else:
        grade = "E"
        
    details = GRADE_DETAILS[grade]
    return grade, details["color"], details["label"], details["description"]


def map_official_raw_to_grade(fsa_raw_score: float) -> Tuple[str, str, str, str]:
    """
    Official European Nutri-Score (FSA-NPS) raw score mapping for solid general foods.
    Cutoffs:
      Grade A: raw_score <= -1
      Grade B: 0 to 2
      Grade C: 3 to 10
      Grade D: 11 to 18
      Grade E: >= 19
    """
    if fsa_raw_score <= -1:
        grade = "A"
    elif fsa_raw_score <= 2:
        grade = "B"
    elif fsa_raw_score <= 10:
        grade = "C"
    elif fsa_raw_score <= 18:
        grade = "D"
    else:
        grade = "E"
        
    details = GRADE_DETAILS[grade]
    return grade, details["color"], details["label"], details["description"]

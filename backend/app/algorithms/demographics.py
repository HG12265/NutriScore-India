"""
Demographic Nutritional Requirements Database.
Based on ICMR-NIN 2024 Recommended Dietary Allowances (RDA) and FAO/WHO guidelines.
"""
from typing import Dict, Any, List
from pydantic import BaseModel, Field


class DemographicRequirement(BaseModel):
    key: str
    label: str
    age_range: str
    sex: str
    description: str
    body_weight_kg: float
    energy_kcal: float
    protein_g: float
    fibre_g: float
    
    # Minerals (mg)
    calcium_mg: float
    iron_mg: float
    zinc_mg: float
    potassium_mg: float
    
    # Vitamins
    vitamin_a_mcg: float
    vitamin_c_mg: float
    vitamin_d_mcg: float
    vitamin_b1_mg: float
    vitamin_b2_mg: float
    vitamin_b6_mg: float
    vitamin_b9_mcg: float  # Folate
    vitamin_b12_mcg: float
    
    # Healthy Fats (g)
    omega3_g: float
    
    # Upper Daily Risk Limits (WHO / ICMR)
    max_sodium_mg: float = 2000.0
    max_saturated_fat_g: float = 20.0
    max_added_sugar_g: float = 25.0
    max_trans_fat_g: float = 2.0
    max_cholesterol_mg: float = 300.0
    max_total_fat_g: float = 30.0

    # Essential Amino Acid daily requirements (mg/day)
    # Computed from FAO/WHO pattern (mg/kg body weight)
    eaa_requirements_mg: Dict[str, float] = Field(default_factory=dict)


def compute_eaa_requirements(weight_kg: float) -> Dict[str, float]:
    """
    FAO/WHO reference amino acid intake requirements (mg/kg/day):
    - Leucine: 39 mg/kg
    - Lysine: 30 mg/kg
    - Valine: 26 mg/kg
    - Isoleucine: 20 mg/kg
    - Threonine: 15 mg/kg
    - Methionine + Cysteine: 15 mg/kg
    - Phenylalanine + Tyrosine: 25 mg/kg
    - Histidine: 10 mg/kg
    - Tryptophan: 4 mg/kg
    """
    return {
        "leucine": round(39.0 * weight_kg, 1),
        "lysine": round(30.0 * weight_kg, 1),
        "valine": round(26.0 * weight_kg, 1),
        "isoleucine": round(20.0 * weight_kg, 1),
        "threonine": round(15.0 * weight_kg, 1),
        "methionine_cysteine": round(15.0 * weight_kg, 1),
        "phenylalanine_tyrosine": round(25.0 * weight_kg, 1),
        "histidine": round(10.0 * weight_kg, 1),
        "tryptophan": round(4.0 * weight_kg, 1),
    }


DEMOGRAPHIC_DATABASE: Dict[str, DemographicRequirement] = {
    "adult_male": DemographicRequirement(
        key="adult_male",
        label="Adult Male (19–59 y)",
        age_range="19–59 years",
        sex="Male",
        description="Standard reference sedentary adult male with moderate physical activity.",
        body_weight_kg=65.0,
        energy_kcal=2110.0,
        protein_g=54.0,
        fibre_g=30.0,
        calcium_mg=1000.0,
        iron_mg=19.0,
        zinc_mg=17.0,
        potassium_mg=3500.0,
        vitamin_a_mcg=1000.0,
        vitamin_c_mg=80.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=1.4,
        vitamin_b2_mg=2.0,
        vitamin_b6_mg=1.9,
        vitamin_b9_mcg=300.0,
        vitamin_b12_mcg=2.5,
        omega3_g=1.6,
        max_sodium_mg=2000.0,
        max_saturated_fat_g=20.0,
        max_added_sugar_g=25.0,
        max_trans_fat_g=2.0,
        max_cholesterol_mg=300.0,
        max_total_fat_g=30.0,
        eaa_requirements_mg=compute_eaa_requirements(65.0),
    ),
    "adult_female": DemographicRequirement(
        key="adult_female",
        label="Adult Female (19–59 y)",
        age_range="19–59 years",
        sex="Female",
        description="Reference adult female with higher iron allowances for menstrual replacement.",
        body_weight_kg=55.0,
        energy_kcal=1660.0,
        protein_g=46.0,
        fibre_g=25.0,
        calcium_mg=1000.0,
        iron_mg=29.0,
        zinc_mg=13.0,
        potassium_mg=3500.0,
        vitamin_a_mcg=840.0,
        vitamin_c_mg=65.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=1.1,
        vitamin_b2_mg=1.5,
        vitamin_b6_mg=1.6,
        vitamin_b9_mcg=220.0,
        vitamin_b12_mcg=2.5,
        omega3_g=1.4,
        max_sodium_mg=2000.0,
        max_saturated_fat_g=18.0,
        max_added_sugar_g=25.0,
        max_trans_fat_g=2.0,
        max_cholesterol_mg=300.0,
        max_total_fat_g=25.0,
        eaa_requirements_mg=compute_eaa_requirements(55.0),
    ),
    "adolescent_female": DemographicRequirement(
        key="adolescent_female",
        label="Adolescent Female (14–18 y)",
        age_range="14–18 years",
        sex="Female",
        description="Growth acceleration phase with high iron (29mg) and calcium (1050mg) needs.",
        body_weight_kg=48.0,
        energy_kcal=2060.0,
        protein_g=46.0,
        fibre_g=25.0,
        calcium_mg=1050.0,
        iron_mg=29.0,
        zinc_mg=13.0,
        potassium_mg=3300.0,
        vitamin_a_mcg=860.0,
        vitamin_c_mg=65.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=1.2,
        vitamin_b2_mg=1.6,
        vitamin_b6_mg=1.6,
        vitamin_b9_mcg=250.0,
        vitamin_b12_mcg=2.5,
        omega3_g=1.4,
        max_sodium_mg=2000.0,
        max_saturated_fat_g=18.0,
        max_added_sugar_g=25.0,
        max_trans_fat_g=2.0,
        max_cholesterol_mg=300.0,
        max_total_fat_g=28.0,
        eaa_requirements_mg=compute_eaa_requirements(48.0),
    ),
    "adolescent_male": DemographicRequirement(
        key="adolescent_male",
        label="Adolescent Male (14–18 y)",
        age_range="14–18 years",
        sex="Male",
        description="Peak skeletal and muscle mass accretion with elevated energy and zinc needs.",
        body_weight_kg=55.0,
        energy_kcal=2650.0,
        protein_g=54.0,
        fibre_g=30.0,
        calcium_mg=1050.0,
        iron_mg=22.0,
        zinc_mg=14.0,
        potassium_mg=3500.0,
        vitamin_a_mcg=1000.0,
        vitamin_c_mg=70.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=1.5,
        vitamin_b2_mg=1.9,
        vitamin_b6_mg=1.9,
        vitamin_b9_mcg=300.0,
        vitamin_b12_mcg=2.5,
        omega3_g=1.6,
        max_sodium_mg=2000.0,
        max_saturated_fat_g=22.0,
        max_added_sugar_g=25.0,
        max_trans_fat_g=2.0,
        max_cholesterol_mg=300.0,
        max_total_fat_g=30.0,
        eaa_requirements_mg=compute_eaa_requirements(55.0),
    ),
    "pregnant_woman": DemographicRequirement(
        key="pregnant_woman",
        label="Pregnant Woman (2nd/3rd Tri)",
        age_range="Adult Pregnancy",
        sex="Female",
        description="Elevated protein (+19.5g), maternal iron (40mg), and folate for fetal organogenesis.",
        body_weight_kg=65.0,
        energy_kcal=2350.0,
        protein_g=65.5,
        fibre_g=30.0,
        calcium_mg=1200.0,
        iron_mg=40.0,
        zinc_mg=14.5,
        potassium_mg=3500.0,
        vitamin_a_mcg=900.0,
        vitamin_c_mg=90.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=1.6,
        vitamin_b2_mg=2.0,
        vitamin_b6_mg=2.0,
        vitamin_b9_mcg=570.0,
        vitamin_b12_mcg=2.8,
        omega3_g=1.8,
        max_sodium_mg=2000.0,
        max_saturated_fat_g=20.0,
        max_added_sugar_g=25.0,
        max_trans_fat_g=1.5,
        max_cholesterol_mg=250.0,
        max_total_fat_g=30.0,
        eaa_requirements_mg=compute_eaa_requirements(65.0),
    ),
    "lactating_woman": DemographicRequirement(
        key="lactating_woman",
        label="Lactating Mother (0–6 mo)",
        age_range="Adult Lactation",
        sex="Female",
        description="Milk synthesis requirements with elevated vitamin A (1150mcg), vitamin C (115mg), and calcium.",
        body_weight_kg=60.0,
        energy_kcal=2400.0,
        protein_g=60.0,
        fibre_g=30.0,
        calcium_mg=1200.0,
        iron_mg=23.0,
        zinc_mg=14.0,
        potassium_mg=3500.0,
        vitamin_a_mcg=1150.0,
        vitamin_c_mg=115.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=1.7,
        vitamin_b2_mg=2.1,
        vitamin_b6_mg=2.1,
        vitamin_b9_mcg=330.0,
        vitamin_b12_mcg=3.2,
        omega3_g=1.8,
        max_sodium_mg=2000.0,
        max_saturated_fat_g=20.0,
        max_added_sugar_g=25.0,
        max_trans_fat_g=1.5,
        max_cholesterol_mg=250.0,
        max_total_fat_g=30.0,
        eaa_requirements_mg=compute_eaa_requirements(60.0),
    ),
    "senior_citizen": DemographicRequirement(
        key="senior_citizen",
        label="Senior Citizen (> 60 y)",
        age_range="> 60 years",
        sex="Both",
        description="Sarcopenia prevention requires higher protein per kg; lower sodium limit (1800mg) for cardiovascular protection.",
        body_weight_kg=60.0,
        energy_kcal=1700.0,
        protein_g=61.5,
        fibre_g=28.0,
        calcium_mg=1200.0,
        iron_mg=19.0,
        zinc_mg=17.0,
        potassium_mg=3500.0,
        vitamin_a_mcg=1000.0,
        vitamin_c_mg=80.0,
        vitamin_d_mcg=20.0,
        vitamin_b1_mg=1.4,
        vitamin_b2_mg=1.9,
        vitamin_b6_mg=1.9,
        vitamin_b9_mcg=300.0,
        vitamin_b12_mcg=2.5,
        omega3_g=1.6,
        max_sodium_mg=1800.0,
        max_saturated_fat_g=15.0,
        max_added_sugar_g=20.0,
        max_trans_fat_g=1.0,
        max_cholesterol_mg=200.0,
        max_total_fat_g=22.0,
        eaa_requirements_mg=compute_eaa_requirements(60.0),
    ),
    "child": DemographicRequirement(
        key="child",
        label="Child (4–8 y)",
        age_range="4–8 years",
        sex="Both",
        description="Active early childhood growth with scaled down energy, lower sodium threshold (1200mg).",
        body_weight_kg=18.0,
        energy_kcal=1350.0,
        protein_g=16.0,
        fibre_g=15.0,
        calcium_mg=550.0,
        iron_mg=11.0,
        zinc_mg=4.5,
        potassium_mg=1600.0,
        vitamin_a_mcg=510.0,
        vitamin_c_mg=35.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=0.9,
        vitamin_b2_mg=1.1,
        vitamin_b6_mg=1.0,
        vitamin_b9_mcg=135.0,
        vitamin_b12_mcg=1.5,
        omega3_g=0.9,
        max_sodium_mg=1200.0,
        max_saturated_fat_g=12.0,
        max_added_sugar_g=18.0,
        max_trans_fat_g=1.0,
        max_cholesterol_mg=200.0,
        max_total_fat_g=18.0,
        eaa_requirements_mg=compute_eaa_requirements(18.0),
    ),
    "older_child": DemographicRequirement(
        key="older_child",
        label="Older Child (9–13 y)",
        age_range="9–13 years",
        sex="Both",
        description="Pre-pubertal development with intermediate bone mineralization requirements.",
        body_weight_kg=32.0,
        energy_kcal=1800.0,
        protein_g=30.0,
        fibre_g=20.0,
        calcium_mg=750.0,
        iron_mg=16.0,
        zinc_mg=7.0,
        potassium_mg=2500.0,
        vitamin_a_mcg=700.0,
        vitamin_c_mg=45.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=1.1,
        vitamin_b2_mg=1.4,
        vitamin_b6_mg=1.3,
        vitamin_b9_mcg=200.0,
        vitamin_b12_mcg=2.0,
        omega3_g=1.2,
        max_sodium_mg=1500.0,
        max_saturated_fat_g=16.0,
        max_added_sugar_g=20.0,
        max_trans_fat_g=1.5,
        max_cholesterol_mg=250.0,
        max_total_fat_g=22.0,
        eaa_requirements_mg=compute_eaa_requirements(32.0),
    ),
    "toddler": DemographicRequirement(
        key="toddler",
        label="Toddler (1–3 y)",
        age_range="1–3 years",
        sex="Both",
        description="High brain development velocity; strict sodium (1000mg) and saturated fat ceilings.",
        body_weight_kg=12.0,
        energy_kcal=1010.0,
        protein_g=12.5,
        fibre_g=10.0,
        calcium_mg=500.0,
        iron_mg=8.0,
        zinc_mg=3.3,
        potassium_mg=1100.0,
        vitamin_a_mcg=390.0,
        vitamin_c_mg=30.0,
        vitamin_d_mcg=15.0,
        vitamin_b1_mg=0.7,
        vitamin_b2_mg=0.8,
        vitamin_b6_mg=0.9,
        vitamin_b9_mcg=110.0,
        vitamin_b12_mcg=1.2,
        omega3_g=0.7,
        max_sodium_mg=1000.0,
        max_saturated_fat_g=10.0,
        max_added_sugar_g=12.0,
        max_trans_fat_g=0.5,
        max_cholesterol_mg=150.0,
        max_total_fat_g=15.0,
        eaa_requirements_mg=compute_eaa_requirements(12.0),
    ),
    "active_athlete": DemographicRequirement(
        key="active_athlete",
        label="Active Athlete / Sports",
        age_range="Adult Athletic",
        sex="Both",
        description="Elevated protein (85g) for hypertrophy/repair; increased electrolyte and antioxidant requirements.",
        body_weight_kg=70.0,
        energy_kcal=2900.0,
        protein_g=85.0,
        fibre_g=35.0,
        calcium_mg=1300.0,
        iron_mg=25.0,
        zinc_mg=20.0,
        potassium_mg=4000.0,
        vitamin_a_mcg=1200.0,
        vitamin_c_mg=120.0,
        vitamin_d_mcg=25.0,
        vitamin_b1_mg=2.0,
        vitamin_b2_mg=2.5,
        vitamin_b6_mg=2.5,
        vitamin_b9_mcg=400.0,
        vitamin_b12_mcg=3.5,
        omega3_g=2.2,
        max_sodium_mg=2500.0,
        max_saturated_fat_g=25.0,
        max_added_sugar_g=35.0,
        max_trans_fat_g=2.0,
        max_cholesterol_mg=300.0,
        max_total_fat_g=35.0,
        eaa_requirements_mg=compute_eaa_requirements(70.0),
    ),
}

DEMOGRAPHIC_PROFILES = DEMOGRAPHIC_DATABASE


def get_demographic_profile(key: str) -> DemographicRequirement:
    """Returns the demographic requirement profile, defaulting to adult_male."""
    return DEMOGRAPHIC_DATABASE.get(key, DEMOGRAPHIC_DATABASE["adult_male"])


def list_demographic_profiles() -> List[Dict[str, Any]]:
    """Returns a serializable list of all demographic profiles."""
    return [
        {
            "key": item.key,
            "label": item.label,
            "age_range": item.age_range,
            "sex": item.sex,
            "description": item.description,
            "energy_kcal": item.energy_kcal,
            "protein_g": item.protein_g,
            "calcium_mg": item.calcium_mg,
            "iron_mg": item.iron_mg,
        }
        for item in DEMOGRAPHIC_DATABASE.values()
    ]

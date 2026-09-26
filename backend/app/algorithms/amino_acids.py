"""
Essential Amino Acid (EAA) and Protein Quality Engine.
Derived from FAO/WHO Reference Patterns, DIAAS principles, and Indian food matrices.
"""
from typing import Dict, Any, Tuple, Optional
from pydantic import BaseModel


class EssentialAminoAcids(BaseModel):
    leucine: float = 0.0
    lysine: float = 0.0
    threonine: float = 0.0
    histidine: float = 0.0
    methionine_cysteine: float = 0.0
    tryptophan: float = 0.0
    valine: float = 0.0
    isoleucine: float = 0.0
    phenylalanine_tyrosine: float = 0.0


# Scientific weighting factors for the 9 EAAs (Sum = 1.0)
# Leucine and Lysine receive higher weights because Leucine drives muscle protein synthesis (MPS)
# and Lysine is the primary limiting amino acid in cereal-based Indian diets.
EAA_WEIGHTS: Dict[str, float] = {
    "leucine": 0.18,
    "lysine": 0.16,
    "methionine_cysteine": 0.12,
    "threonine": 0.10,
    "valine": 0.10,
    "isoleucine": 0.10,
    "tryptophan": 0.08,
    "histidine": 0.08,
    "phenylalanine_tyrosine": 0.08,
}

# Protein Complementarity Matrix Scores (0 to 10 scale)
COMPLEMENTARITY_RULES: Dict[str, Dict[str, Any]] = {
    "cereal_pulse": {
        "score": 8.0,
        "label": "Cereal + Pulse (e.g. Rice + Dal, Roti + Chana)",
        "description": "Classic complementary synergy: Pulse supplies abundant Lysine missing in cereal; cereal supplies Methionine missing in pulse.",
        "category": "complementary_plant"
    },
    "cereal_dairy": {
        "score": 8.0,
        "label": "Cereal + Dairy (e.g. Dalia + Milk, Kheer)",
        "description": "Dairy casein and whey provide high DIAAS amino acid coverage for cereal grains.",
        "category": "complementary_dairy"
    },
    "pulse_dairy": {
        "score": 9.0,
        "label": "Pulse + Dairy (e.g. Palak Paneer with Dal)",
        "description": "High biological value blend with optimal leucine and sulfur amino acid content.",
        "category": "high_quality"
    },
    "soy_cereal": {
        "score": 9.0,
        "label": "Soybean + Cereal (e.g. Soya Chunk Pulao)",
        "description": "Soy isolate protein approaches animal protein biological value with high PDCAAS.",
        "category": "high_quality"
    },
    "egg_pulse": {
        "score": 10.0,
        "label": "Egg + Plant Protein (e.g. Egg Curry with Lentils)",
        "description": "Complete reference protein standard blended with complex plant matrix.",
        "category": "complete_complementary"
    },
    "animal_source": {
        "score": 9.0,
        "label": "Complete Animal / Fish Protein",
        "description": "High biological value with all 9 indispensable amino acids.",
        "category": "complete"
    },
    "single_cereal": {
        "score": 2.0,
        "label": "Single Cereal Grain alone (e.g. Plain Rice, Maida)",
        "description": "Incomplete protein severely limited by low Lysine content.",
        "category": "incomplete"
    },
    "single_pulse": {
        "score": 4.0,
        "label": "Single Pulse alone (e.g. Plain Boiled Dal)",
        "description": "Good protein content but moderately limited by Methionine and Cysteine.",
        "category": "incomplete"
    },
    "mixed_legumes": {
        "score": 5.0,
        "label": "Mixed Legumes & Seeds",
        "description": "Improved amino acid variety, though still moderately limited in sulfur amino acids.",
        "category": "moderate"
    }
}

# Standard amino acid profiles (mg per gram of crude protein) for typical food sources
# Used for intelligent estimation when user enters crude protein without lab EAA breakdown
REFERENCE_AA_PER_GRAM_PROTEIN: Dict[str, Dict[str, float]] = {
    "cereal_pulse": {
        "leucine": 75.0,
        "lysine": 55.0,
        "methionine_cysteine": 32.0,
        "threonine": 38.0,
        "valine": 50.0,
        "isoleucine": 40.0,
        "tryptophan": 12.0,
        "histidine": 24.0,
        "phenylalanine_tyrosine": 78.0,
    },
    "cereal": {
        "leucine": 70.0,
        "lysine": 28.0,  # Lysine deficient
        "methionine_cysteine": 38.0,
        "threonine": 32.0,
        "valine": 46.0,
        "isoleucine": 36.0,
        "tryptophan": 11.0,
        "histidine": 22.0,
        "phenylalanine_tyrosine": 75.0,
    },
    "pulse": {
        "leucine": 76.0,
        "lysine": 65.0,  # High lysine
        "methionine_cysteine": 22.0,  # Methionine deficient
        "threonine": 39.0,
        "valine": 48.0,
        "isoleucine": 41.0,
        "tryptophan": 10.0,
        "histidine": 26.0,
        "phenylalanine_tyrosine": 80.0,
    },
    "dairy": {
        "leucine": 95.0,
        "lysine": 78.0,
        "methionine_cysteine": 34.0,
        "threonine": 45.0,
        "valine": 62.0,
        "isoleucine": 52.0,
        "tryptophan": 14.0,
        "histidine": 27.0,
        "phenylalanine_tyrosine": 92.0,
    },
    "egg": {
        "leucine": 88.0,
        "lysine": 70.0,
        "methionine_cysteine": 48.0,
        "threonine": 47.0,
        "valine": 66.0,
        "isoleucine": 54.0,
        "tryptophan": 16.0,
        "histidine": 24.0,
        "phenylalanine_tyrosine": 90.0,
    }
}


def score_amino_acid_coverage(coverage_pct: float) -> float:
    """
    10-point threshold for amino acid coverage against daily requirement:
    <10%: 0, 10-19%: 1, ..., >=100%: 10
    """
    if coverage_pct < 10.0:
        return 0.0
    elif coverage_pct >= 100.0:
        return 10.0
    else:
        return float(int(coverage_pct // 10))


def estimate_eaas_from_protein(
    protein_g: float,
    protein_source_type: str = "cereal_pulse"
) -> Dict[str, float]:
    """Estimates EAA amounts (in mg) based on crude protein grams and source type."""
    ref_pattern = REFERENCE_AA_PER_GRAM_PROTEIN.get(
        protein_source_type,
        REFERENCE_AA_PER_GRAM_PROTEIN["cereal_pulse"]
    )
    return {
        aa: round(ref_pattern[aa] * protein_g, 1)
        for aa in ref_pattern
    }


def evaluate_amino_acid_quality(
    eaas_mg: Dict[str, float],
    demographic_eaa_rdas: Dict[str, float]
) -> Tuple[float, Dict[str, Any], Optional[str]]:
    """
    Calculates weighted AA score (0 to 10), coverage percentages, and identifies limiting amino acid.
    Returns: (weighted_aa_score, coverage_details, limiting_aa_name)
    """
    total_weighted_score = 0.0
    coverage_details: Dict[str, Any] = {}
    lowest_coverage = float("inf")
    limiting_aa: Optional[str] = None

    for aa, weight in EAA_WEIGHTS.items():
        amount_provided = eaas_mg.get(aa, 0.0)
        daily_req = demographic_eaa_rdas.get(aa, 1000.0)
        
        coverage_pct = round((amount_provided / daily_req) * 100.0, 1) if daily_req > 0 else 0.0
        score = score_amino_acid_coverage(coverage_pct)
        
        total_weighted_score += score * weight
        
        coverage_details[aa] = {
            "amount_mg": amount_provided,
            "required_mg": daily_req,
            "coverage_pct": coverage_pct,
            "score": score,
            "weight": weight
        }
        
        if coverage_pct < lowest_coverage:
            lowest_coverage = coverage_pct
            limiting_aa = aa

    final_aa_score = round(min(10.0, max(0.0, total_weighted_score)), 2)
    return final_aa_score, coverage_details, limiting_aa


def get_complementary_protein_score(combination_key: str) -> Tuple[float, str, str]:
    """Returns (score, label, description) for the chosen complementary protein strategy."""
    rule = COMPLEMENTARITY_RULES.get(
        combination_key,
        COMPLEMENTARITY_RULES["cereal_pulse"]
    )
    return float(rule["score"]), rule["label"], rule["description"]

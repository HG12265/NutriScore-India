# NUTRISCORE AI

**Understand Your Food. Improve Your Choices.**

NutriScore AI is an advanced, evidence-based nutritional profiling and scoring web application calibrated for Indian traditional and contemporary recipes. It implements the two-step nutrient profiling algorithm benchmarked against the **Indian Nutrient Databank (INDB)** and the **ICMR-NIN 2020 Recommended Dietary Allowances (RDA)** for Indian adults.

---

## 🌟 Key Features

1. **Seamless Single-Page Experience (No Compulsory Navigation)**:
   - Complete food nutrient input form directly on the Home Page.
   - Enter food details, portion size, and nutrient breakdown.
   - Click **Calculate Result** to compute the Health Score and Nutri-Score grade on the **SAME PAGE**.
   - Auto-scrolls smoothly to the detailed result dashboard.

2. **Calibrated Profiling Models**:
   - **ICMR 16-Nutrient Standard (Recommended Default)**:
     - **5 Negative Nutrients to Limit (0–10 points each, Max 50 pts)**: Energy density, free sugars, saturated fat, sodium, and cholesterol.
     - **11 Positive Nutrients to Encourage (Max 70 pts)**:
       - *Macronutrients & Lipids*: Protein (0–10 pts), Dietary Fibre (0–10 pts), Complex Carbohydrates (0–10 pts), MUFA (0–5 pts), PUFA (0–5 pts).
       - *Micronutrients (0–5 pts based on % ICMR-NIN 2020 RDA)*: Iron (19mg), Calcium (1000mg), Vitamin A (1000mcg RAE), Vitamin C (80mg), Vitamin D (20mcg), Potassium (3500mg).
     - *Mathematical Normalization*:
       $$\text{Raw Score} = N_{\text{total}} - P_{\text{total}} \quad [-70, +50]$$
       $$\text{Health Score} = 100 \times \frac{50 - \text{Raw Score}}{120} \quad [0, 100]$$
   - **Extended 39-Nutrient Comprehensive Model**:
     - Includes all 39 food components from INDB (trace minerals: zinc, magnesium, phosphorus, copper, manganese, selenium, chromium, molybdenum; vitamins: E, K, B1, B2, B3, B5, B6, B7, B9, B12; and carotenoids).
   - **Official Nutri-Score (FSA-NPS Solid Foods Model)**:
     - European FSA-NPS algorithm incorporating the protein exclusion rule when $N \ge 11$ unless fruit/veg/legume/nut proportion exceeds 80%.

3. **5-Level Color-Coded Nutri-Score Classification**:
   - **Grade A (Dark Green, $\ge 80$)**: High Nutritional Quality
   - **Grade B (Light Green, $65 - 79$)**: Good Nutritional Quality
   - **Grade C (Yellow, $50 - 64$)**: Moderate Nutritional Quality
   - **Grade D (Orange, $35 - 49$)**: Low Nutritional Quality
   - **Grade E (Red, $< 35$)**: Poor Nutritional Quality

4. **Rich Nutritional Analytics & Visualizations**:
   - Top positive contributors vs penalty nutrients.
   - Interactive bar charts powered by Recharts.
   - Rule-based, non-medical dietary optimization recommendations.

5. **Sample Indian Recipe Presets**:
   - Moong Dal Tadka (Grade B - pulse-rich)
   - Vegetable & Millet Khichdi (Grade C - balanced cereal-pulse)
   - Palak Paneer (Grade B - micronutrient & protein dense)
   - Aloo Paratha with Butter (Grade D - energy & saturated fat dense)
   - Gulab Jamun (Grade E - high free sugar & fat)

---

## 🏗️ Project Architecture

```
NutriScore-India/
├── backend/
│   ├── app/
│   │   ├── algorithms/
│   │   │   ├── configuration.py   # Nutrient schemas, ICMR DVs, threshold definitions
│   │   │   ├── grade_mapping.py   # Grade cutoffs (A-E) and official color standards
│   │   │   ├── models.py          # Data classes and enums
│   │   │   ├── scoring.py         # Pure calculation engine (ICMR, 39-nutrient, FSA)
│   │   │   └── validation.py      # Numeric consistency and boundary validators
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── analyze.py     # POST /api/v1/analyze
│   │   │   │   ├── health.py      # GET /api/v1/health
│   │   │   │   ├── history.py     # GET/POST /api/v1/analysis-history
│   │   │   │   └── info.py        # GET /api/v1/algorithm-info
│   │   │   └── router.py
│   │   ├── schemas/               # Pydantic request & response schemas
│   │   ├── services/              # Analyzer coordinator and optional MongoDB client
│   │   ├── tests/                 # Comprehensive pytest suite (18 unit/integration tests)
│   │   ├── config.py              # Environment settings
│   │   └── main.py                # FastAPI entrypoint
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActionButtons.tsx      # Calculate, Reset & Sample Loader
│   │   │   ├── AlgorithmInfoModal.tsx # Scientific background & documentation
│   │   │   ├── AlgorithmSelector.tsx  # Model switcher tabs
│   │   │   ├── Disclaimer.tsx         # Academic & medical disclaimers
│   │   │   ├── FoodDetailsForm.tsx    # Food identification & serving portion
│   │   │   ├── Header.tsx             # Brand banner & controls
│   │   │   ├── NutrientAnalysis.tsx   # Positive & penalty contributors
│   │   │   ├── NutrientInputForm.tsx  # Negative, Macro, Micro & Extended inputs
│   │   │   ├── Recommendations.tsx    # Evidence-aligned dietary tips
│   │   │   ├── ResultCard.tsx         # Score card & official Nutri-Score badge banner
│   │   │   ├── ScoreBreakdown.tsx     # Step-wise calculations & equations
│   │   │   └── Visualizations.tsx     # Recharts analytical profiles
│   │   ├── services/
│   │   │   ├── api.ts                 # FastAPI client
│   │   │   └── sampleData.ts          # Curated Indian recipe presets
│   │   ├── types/
│   │   │   └── nutrition.ts           # TypeScript interfaces
│   │   ├── App.tsx                    # Single Home Page layout
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ and npm
- (Optional) MongoDB 6+ for analysis history

---

### Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment configuration:
   ```bash
   cp .env.example .env
   ```
5. Run the test suite:
   ```bash
   pytest -v
   ```
6. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API will be accessible at: `http://localhost:8000`
   - Interactive Swagger API docs: `http://localhost:8000/docs`

---

### Frontend Setup (React + Vite + TypeScript + Tailwind)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Install packages:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   - Application will open at: `http://localhost:5173`

---

### Running with Docker Compose

To start the full stack (FastAPI Backend + React Frontend + MongoDB):
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root status, version, and disclaimer |
| `GET` | `/api/v1/health` | Health check & database connection status |
| `GET` | `/api/v1/algorithm-info` | Metadata on all scoring modes, DVs & thresholds |
| `POST` | `/api/v1/analyze` | Food nutrient analysis & score calculation |
| `GET` | `/api/v1/analysis-history` | Recent analysis history (if MongoDB enabled) |

---

## 🔬 Algorithm Conflicts & Documented Limitations

1. **16-Nutrient vs 39-Nutrient Model Conflict**:
   - In the initial exploratory research on the 1,014 Anuvaad INDB recipes, scoring all 39 nutrients increased the positive ceiling to 165 points. Because unfortified single home dishes do not contain 25% of the daily allowance for every trace mineral and vitamin simultaneously, the 39-nutrient model compressed scores downward (mean score 34.5, ~60% in Grade E).
   - **Resolution**: The **16-Nutrient ICMR model** (5 negative + 11 positive) is the primary, balanced standard. The application explicitly provides a mode toggle (`algorithm_mode`) so users and researchers can switch models transparently without silent conflation.
2. **Missing Trans Fats and Added vs Free Sugars in Databank**:
   - The source databank only provides total `freesugar_g` and lacks separated trans-fat or B12 values. The algorithm penalizes free sugars under standard step bands and flags missing trace fields.
3. **Adult Reference Baseline**:
   - ICMR-NIN 2020 provides separate allowances for men, women, pregnancy, lactation, and elderly. This system standardizes on the **adult moderate-work reference standard** (65kg man / 55kg woman).

---

## ⚠️ Disclaimer
This application is an educational, research, and profiling prototype based on algorithm research for Indian recipes. **It does not provide medical diagnosis, clinical treatment, or personalized medical advice.** Always consult a certified dietitian or physician for individual medical needs.

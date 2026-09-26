import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { FoodDetailsForm } from './components/FoodDetailsForm';
import { NutrientInputForm } from './components/NutrientInputForm';
import { ActionButtons } from './components/ActionButtons';
import { MobileActionBar } from './components/MobileActionBar';
import { ResultCard } from './components/ResultCard';
import { ScoreBreakdown } from './components/ScoreBreakdown';
import { NutrientAnalysis } from './components/NutrientAnalysis';
import { Visualizations } from './components/Visualizations';
import { Recommendations } from './components/Recommendations';
import { Disclaimer } from './components/Disclaimer';
import { AlgorithmInfoModal } from './components/AlgorithmInfoModal';
import { FoodFormData, FoodAnalysisResponse, AlgorithmMode } from './types/nutrition';
import { SAMPLE_RECIPES } from './services/sampleData';
import { analyzeFood } from './services/api';
import { ArrowDown, AlertCircle, Sparkles, Table, Check } from 'lucide-react';

const INITIAL_FORM_DATA: FoodFormData = {
  food_name: '',
  food_category: '',
  serving_size: 100,
  serving_unit: 'g',
  recipe_description: '',
  algorithm_mode: 'personalised_pndpq',
  demographic_profile: 'adult_male',
  complementary_protein_source: 'cereal_pulse',
  auto_estimate_eaas: true,
  
  // Negative
  energy_kcal: '',
  free_sugars: '',
  added_sugars: '',
  saturated_fat: '',
  trans_fat: '',
  total_fat: '',
  sodium: '',
  cholesterol: '',
  
  // Macros
  protein: '',
  fibre: '',
  total_carbs: '',
  complex_carbs: '',
  
  // Fats
  mufa: '',
  pufa: '',
  omega3: '',

  // Essential Amino Acids
  leucine: '',
  lysine: '',
  threonine: '',
  histidine: '',
  methionine_cysteine: '',
  tryptophan: '',
  valine: '',
  isoleucine: '',
  phenylalanine_tyrosine: '',
  
  // Core Micros
  iron: '',
  calcium: '',
  vitamin_a: '',
  vitamin_c: '',
  vitamin_d: '',
  potassium: '',
  
  // Extended
  zinc: '',
  magnesium: '',
  phosphorus: '',
  copper: '',
  manganese: '',
  selenium: '',
  chromium: '',
  molybdenum: '',
  vitamin_e: '',
  vitamin_k: '',
  thiamin_b1: '',
  riboflavin_b2: '',
  niacin_b3: '',
  pantothenic_acid_b5: '',
  vitamin_b6: '',
  biotin_b7: '',
  folate_b9: '',
  vitamin_b12: '',
  carotenoids: '',
  fruit_veg_legume_pct: '',
};

export const App: React.FC = () => {
  const [formData, setFormData] = useState<FoodFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FoodAnalysisResponse | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Field change handler
  const handleFieldChange = (field: keyof FoodFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Change algorithm mode
  const handleSelectMode = (mode: AlgorithmMode) => {
    handleFieldChange('algorithm_mode', mode);
  };

  // Load sample recipe
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_RECIPES.find((s) => s.id === sampleId);
    if (!sample) return;

    setFormData((prev) => ({
      ...prev,
      ...sample.data,
      food_name: sample.name,
      food_category: sample.category,
      recipe_description: sample.description,
    }));
    setErrors({});
    setApiError(null);
  };

  // Reset form
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setApiError(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.food_name.trim()) {
      newErrors.food_name = 'Please enter a food or recipe name.';
    }

    if (!formData.serving_size || Number(formData.serving_size) <= 0) {
      newErrors.serving_size = 'Serving portion must be greater than zero.';
    }

    const numericalKeys: (keyof FoodFormData)[] = [
      'energy_kcal', 'free_sugars', 'saturated_fat', 'sodium', 'cholesterol',
      'protein', 'fibre', 'total_carbs', 'complex_carbs', 'mufa', 'pufa',
      'iron', 'calcium', 'vitamin_a', 'vitamin_c', 'vitamin_d', 'potassium',
    ];

    for (const key of numericalKeys) {
      const val = formData[key];
      if (val !== '' && Number(val) < 0) {
        newErrors[key] = 'Nutrient cannot be negative.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Main calculation action
  const handleCalculate = async () => {
    setApiError(null);

    if (!validateForm()) {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await analyzeFood(formData);
      setResult(response);

      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setApiError(err.message || 'Failed to calculate nutrient score. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24 md:pb-12">
      {/* Header */}
      <Header
        onReset={handleReset}
        onOpenInfo={() => setIsInfoModalOpen(true)}
        hasResult={result !== null}
      />

      {/* Hero / Introduction */}
      <section className="bg-gradient-to-b from-emerald-50/70 via-slate-50/50 to-slate-50 border-b border-slate-200/60 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>ICMR-NIN 2024 RDA & IFCT 2017 Profiling Standard</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight sm:leading-tight">
            Indian Recipe Nutritional Profiling Engine
          </h2>

          <p className="mt-2.5 text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Enter recipe nutrients to calculate a two-step Health Score (0–100) and 5-color Nutri-Score grade (A to E) benchmarked against ICMR-NIN 2024 RDA & Dietary Guidelines.
          </p>

          {/* Quick preset chips - mobile horizontally scrollable */}
          <div className="mt-5 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-2">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 hidden sm:inline">
              Try Preset:
            </span>
            {[
              { id: 'moong-dal', label: 'Moong Dal Tadka' },
              { id: 'veg-khichdi', label: 'Vegetable Khichdi' },
              { id: 'palak-paneer', label: 'Palak Paneer' },
              { id: 'aloo-paratha', label: 'Aloo Paratha' },
              { id: 'gulab-jamun', label: 'Gulab Jamun' },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadSample(preset.id)}
                className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/90 shadow-2xs active:scale-95 transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Action anchors */}
          <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <span>Start Recipe Input</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsInfoModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs active:scale-95 transition-all"
            >
              <Table className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Threshold Tables</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Alert Banner */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">Calculation Error</h4>
              <p className="text-xs text-rose-700 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div ref={formSectionRef} className="space-y-2">
          {/* Step 0: Algorithm Selector */}
          <AlgorithmSelector
            selectedMode={formData.algorithm_mode}
            onSelectMode={handleSelectMode}
            selectedDemographic={formData.demographic_profile}
            onSelectDemographic={(demo) => handleFieldChange('demographic_profile', demo)}
          />

          {/* Step 1: Food Details */}
          <FoodDetailsForm
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />

          {/* Step 2: Nutrient Input Form */}
          <NutrientInputForm
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
            onOpenTables={() => setIsInfoModalOpen(true)}
          />

          {/* Desktop Action Buttons */}
          <ActionButtons
            onCalculate={handleCalculate}
            onReset={handleReset}
            onLoadSample={handleLoadSample}
            isLoading={isLoading}
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* RESULT SECTION (ON THE SAME PAGE)                             */}
        {/* ------------------------------------------------------------- */}
        <div ref={resultSectionRef} className="mt-12 pt-8 border-t border-slate-200">
          {result ? (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              <ResultCard result={result} />
              <ScoreBreakdown result={result} />
              <NutrientAnalysis result={result} />
              <Visualizations result={result} />
              <Recommendations result={result} />
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-dashed border-slate-200 text-slate-400 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Calculation Performed Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                Enter your recipe nutrient values above or pick a sample preset, then tap <strong>Calculate Result</strong> to see the Health Score, Grade, and breakdown right here.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <Disclaimer />
      </main>

      {/* Floating Bottom Action Bar for Mobile */}
      <MobileActionBar
        onCalculate={handleCalculate}
        onReset={handleReset}
        isLoading={isLoading}
        result={result}
      />

      {/* Algorithm Info Modal */}
      <AlgorithmInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
};

export default App;

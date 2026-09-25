import React, { useState } from 'react';
import {
  AlertTriangle,
  Heart,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { FoodFormData, AlgorithmMode } from '../types/nutrition';

interface NutrientInputFormProps {
  formData: FoodFormData;
  onChange: (field: keyof FoodFormData, value: any) => void;
  errors: Record<string, string>;
}

export const NutrientInputForm: React.FC<NutrientInputFormProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const [showExtended, setShowExtended] = useState<boolean>(formData.algorithm_mode === 'full_39_nutrient');

  // Auto-calculated complex carbs display helper
  const totalCarbs = typeof formData.total_carbs === 'number' ? formData.total_carbs : 0;
  const freeSugars = typeof formData.free_sugars === 'number' ? formData.free_sugars : 0;
  const fibre = typeof formData.fibre === 'number' ? formData.fibre : 0;
  const derivedComplex = Math.max(0, Math.round((totalCarbs - freeSugars - fibre) * 10) / 10);

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. NEGATIVE NUTRIENTS SECTION (0 - 10 points penalty each) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-rose-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-rose-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Negative Nutrients to Limit</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  0 to 10 pts penalty each
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Components associated with non-communicable diseases. Higher amounts increase penalty score.
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-400">Values per serving</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Energy */}
          <div>
            <label htmlFor="energy_kcal" className="block text-xs font-semibold text-slate-700 mb-1">
              Energy Density <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="energy_kcal"
                type="number"
                min="0"
                step="any"
                value={formData.energy_kcal}
                onChange={(e) => onChange('energy_kcal', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.energy_kcal ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:border-rose-500 focus:ring-rose-100'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">kcal</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Target: ≤ 80 kcal</p>
          </div>

          {/* Free Sugars */}
          <div>
            <label htmlFor="free_sugars" className="block text-xs font-semibold text-slate-700 mb-1">
              Free Sugars <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="free_sugars"
                type="number"
                min="0"
                step="any"
                value={formData.free_sugars}
                onChange={(e) => onChange('free_sugars', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.free_sugars ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:border-rose-500 focus:ring-rose-100'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Target: ≤ 4.5 g</p>
          </div>

          {/* Saturated Fat */}
          <div>
            <label htmlFor="saturated_fat" className="block text-xs font-semibold text-slate-700 mb-1">
              Saturated Fat <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="saturated_fat"
                type="number"
                min="0"
                step="any"
                value={formData.saturated_fat}
                onChange={(e) => onChange('saturated_fat', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.saturated_fat ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:border-rose-500 focus:ring-rose-100'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Target: ≤ 1.0 g</p>
          </div>

          {/* Sodium */}
          <div>
            <label htmlFor="sodium" className="block text-xs font-semibold text-slate-700 mb-1">
              Sodium <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="sodium"
                type="number"
                min="0"
                step="any"
                value={formData.sodium}
                onChange={(e) => onChange('sodium', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.sodium ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:border-rose-500 focus:ring-rose-100'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Target: ≤ 90 mg</p>
          </div>

          {/* Cholesterol */}
          <div>
            <label htmlFor="cholesterol" className="block text-xs font-semibold text-slate-700 mb-1">
              Cholesterol <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="cholesterol"
                type="number"
                min="0"
                step="any"
                value={formData.cholesterol}
                onChange={(e) => onChange('cholesterol', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.cholesterol ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:border-rose-500 focus:ring-rose-100'
                }`}
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Target: ≤ 10 mg</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. POSITIVE MACRONUTRIENTS & HEALTHY FATS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-emerald-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Protective Macronutrients & Lipids</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Rewarding Points
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Protein, dietary fibre, sustained carbohydrates, and heart-healthy unsaturated fatty acids.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Protein */}
          <div>
            <label htmlFor="protein" className="block text-xs font-semibold text-slate-700 mb-1">
              Protein <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="protein"
                type="number"
                min="0"
                step="any"
                value={formData.protein}
                onChange={(e) => onChange('protein', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: &gt; 16.0g</p>
          </div>

          {/* Fibre */}
          <div>
            <label htmlFor="fibre" className="block text-xs font-semibold text-slate-700 mb-1">
              Dietary Fibre <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="fibre"
                type="number"
                min="0"
                step="any"
                value={formData.fibre}
                onChange={(e) => onChange('fibre', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: &gt; 9.4g</p>
          </div>

          {/* Total Carbs (Helper) */}
          <div>
            <label htmlFor="total_carbs" className="block text-xs font-semibold text-slate-700 mb-1">
              Total Carbohydrates
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="total_carbs"
                type="number"
                min="0"
                step="any"
                value={formData.total_carbs}
                onChange={(e) => onChange('total_carbs', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Used for auto-deriving</p>
          </div>

          {/* Complex Carbs */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="complex_carbs" className="block text-xs font-semibold text-slate-700">
                Complex Carbs
              </label>
              {formData.complex_carbs === '' && totalCarbs > 0 && (
                <span className="text-[10px] text-emerald-600 font-medium">auto: {derivedComplex}g</span>
              )}
            </div>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="complex_carbs"
                type="number"
                min="0"
                step="any"
                value={formData.complex_carbs !== '' ? formData.complex_carbs : (totalCarbs > 0 ? derivedComplex : '')}
                onChange={(e) => onChange('complex_carbs', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: &gt; 50g</p>
          </div>

          {/* MUFA */}
          <div>
            <label htmlFor="mufa" className="block text-xs font-semibold text-slate-700 mb-1">
              MUFA (Monounsaturated)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="mufa"
                type="number"
                min="0"
                step="any"
                value={formData.mufa}
                onChange={(e) => onChange('mufa', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 10g</p>
          </div>

          {/* PUFA */}
          <div>
            <label htmlFor="pufa" className="block text-xs font-semibold text-slate-700 mb-1">
              PUFA (Polyunsaturated)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="pufa"
                type="number"
                min="0"
                step="any"
                value={formData.pufa}
                onChange={(e) => onChange('pufa', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 5g</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CORE MICRONUTRIENTS (ICMR-NIN 2020 RDA CALIBRATED) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-teal-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-teal-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Essential Micronutrients</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  ICMR-NIN 2020 RDA Denominators
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Graded into 0 to 5 points based on % Daily Value contribution (&gt;25% yields maximum 5 points).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Iron */}
          <div>
            <label htmlFor="iron" className="block text-xs font-semibold text-slate-700 mb-1">
              Iron (RDA 19 mg)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="iron"
                type="number"
                min="0"
                step="any"
                value={formData.iron}
                onChange={(e) => onChange('iron', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 4.75 mg</p>
          </div>

          {/* Calcium */}
          <div>
            <label htmlFor="calcium" className="block text-xs font-semibold text-slate-700 mb-1">
              Calcium (RDA 1000 mg)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="calcium"
                type="number"
                min="0"
                step="any"
                value={formData.calcium}
                onChange={(e) => onChange('calcium', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 250 mg</p>
          </div>

          {/* Vitamin A */}
          <div>
            <label htmlFor="vitamin_a" className="block text-xs font-semibold text-slate-700 mb-1">
              Vitamin A (RDA 1000 mcg)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="vitamin_a"
                type="number"
                min="0"
                step="any"
                value={formData.vitamin_a}
                onChange={(e) => onChange('vitamin_a', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mcg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 250 mcg</p>
          </div>

          {/* Vitamin C */}
          <div>
            <label htmlFor="vitamin_c" className="block text-xs font-semibold text-slate-700 mb-1">
              Vitamin C (RDA 80 mg)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="vitamin_c"
                type="number"
                min="0"
                step="any"
                value={formData.vitamin_c}
                onChange={(e) => onChange('vitamin_c', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 20 mg</p>
          </div>

          {/* Vitamin D */}
          <div>
            <label htmlFor="vitamin_d" className="block text-xs font-semibold text-slate-700 mb-1">
              Vitamin D (RDA 20 mcg)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="vitamin_d"
                type="number"
                min="0"
                step="any"
                value={formData.vitamin_d}
                onChange={(e) => onChange('vitamin_d', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mcg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 5 mcg</p>
          </div>

          {/* Potassium */}
          <div>
            <label htmlFor="potassium" className="block text-xs font-semibold text-slate-700 mb-1">
              Potassium (RDA 3500 mg)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="potassium"
                type="number"
                min="0"
                step="any"
                value={formData.potassium}
                onChange={(e) => onChange('potassium', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Max pts: ≥ 875 mg</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. OFFICIAL NUTRI-SCORE SPECIFIC FIELD (If Official Mode) */}
      {/* ------------------------------------------------------------- */}
      {formData.algorithm_mode === 'official_nutri_score' && (
        <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              European FSA-NPS Fruits, Vegetables, Legumes & Nuts Proportion
            </h3>
          </div>
          <div className="max-w-xs">
            <label htmlFor="fruit_veg_legume_pct" className="block text-xs font-semibold text-slate-700 mb-1">
              Fruit / Veg / Legume / Nut % (0 - 100)
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                id="fruit_veg_legume_pct"
                type="number"
                min="0"
                max="100"
                step="any"
                value={formData.fruit_veg_legume_pct}
                onChange={(e) => onChange('fruit_veg_legume_pct', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
              <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 pointer-events-none">%</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              In FSA rules: &gt;40% awards 1 pt, &gt;60% awards 2 pts, &gt;80% awards 5 pts.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. EXTENDED 39-NUTRIENT ACCORDION */}
      {/* ------------------------------------------------------------- */}
      <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowExtended(!showExtended)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-800">
              Extended Indian Databank (INDB) Micronutrients & Vitamins
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              18 additional trace fields
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <span>{showExtended ? 'Collapse fields' : 'Expand fields'}</span>
            {showExtended ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showExtended && (
          <div className="p-6 border-t border-slate-100 space-y-6">
            <p className="text-xs text-slate-500">
              These fields are included in the Extended 39-Nutrient Model from the Anuvaad Indian Nutrient Databank. You can enter them if lab testing values are available.
            </p>

            {/* Trace Minerals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Trace Minerals</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'zinc', label: 'Zinc (mg)', unit: 'mg' },
                  { key: 'magnesium', label: 'Magnesium (mg)', unit: 'mg' },
                  { key: 'phosphorus', label: 'Phosphorus (mg)', unit: 'mg' },
                  { key: 'copper', label: 'Copper (mg)', unit: 'mg' },
                  { key: 'manganese', label: 'Manganese (mg)', unit: 'mg' },
                  { key: 'selenium', label: 'Selenium (mcg)', unit: 'mcg' },
                  { key: 'chromium', label: 'Chromium (mcg)', unit: 'mcg' },
                  { key: 'molybdenum', label: 'Molybdenum (mcg)', unit: 'mcg' },
                ].map((item) => (
                  <div key={item.key}>
                    <label htmlFor={item.key} className="block text-[11px] font-semibold text-slate-600 mb-1 truncate">
                      {item.label}
                    </label>
                    <div className="relative">
                      <input
                        id={item.key}
                        type="number"
                        min="0"
                        step="any"
                        value={(formData as any)[item.key]}
                        onChange={(e) => onChange(item.key as any, e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500"
                      />
                      <span className="absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional B-Vitamins and Phytonutrients */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">B-Complex, Lipophilic Vitamins & Carotenoids</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: 'thiamin_b1', label: 'Thiamin B1 (mg)', unit: 'mg' },
                  { key: 'riboflavin_b2', label: 'Riboflavin B2 (mg)', unit: 'mg' },
                  { key: 'niacin_b3', label: 'Niacin B3 (mg)', unit: 'mg' },
                  { key: 'pantothenic_acid_b5', label: 'Pantothenic B5 (mg)', unit: 'mg' },
                  { key: 'vitamin_b6', label: 'Vitamin B6 (mg)', unit: 'mg' },
                  { key: 'biotin_b7', label: 'Biotin B7 (mcg)', unit: 'mcg' },
                  { key: 'folate_b9', label: 'Folate B9 (mcg)', unit: 'mcg' },
                  { key: 'vitamin_b12', label: 'Vitamin B12 (mcg)', unit: 'mcg' },
                  { key: 'vitamin_e', label: 'Vitamin E (mg)', unit: 'mg' },
                  { key: 'vitamin_k', label: 'Vitamin K (mcg)', unit: 'mcg' },
                  { key: 'carotenoids', label: 'Carotenoids (mcg)', unit: 'mcg' },
                ].map((item) => (
                  <div key={item.key}>
                    <label htmlFor={item.key} className="block text-[11px] font-semibold text-slate-600 mb-1 truncate">
                      {item.label}
                    </label>
                    <div className="relative">
                      <input
                        id={item.key}
                        type="number"
                        min="0"
                        step="any"
                        value={(formData as any)[item.key]}
                        onChange={(e) => onChange(item.key as any, e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500"
                      />
                      <span className="absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

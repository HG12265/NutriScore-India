import React, { useState } from 'react';
import {
  AlertTriangle,
  Heart,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Dna,
} from 'lucide-react';
import { FoodFormData } from '../types/nutrition';

interface NutrientInputFormProps {
  formData: FoodFormData;
  onChange: (field: keyof FoodFormData, value: any) => void;
  errors: Record<string, string>;
  onOpenTables?: () => void;
}

export const NutrientInputForm: React.FC<NutrientInputFormProps> = ({
  formData,
  onChange,
  errors,
  onOpenTables,
}) => {
  const [showExtended, setShowExtended] = useState<boolean>(formData.algorithm_mode === 'full_39_nutrient');

  // Auto-calculated complex carbs display helper
  const totalCarbs = typeof formData.total_carbs === 'number' ? formData.total_carbs : 0;
  const freeSugars = typeof formData.free_sugars === 'number' ? formData.free_sugars : 0;
  const fibre = typeof formData.fibre === 'number' ? formData.fibre : 0;
  const derivedComplex = Math.max(0, Math.round((totalCarbs - freeSugars - fibre) * 10) / 10);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. NEGATIVE NUTRIENTS SECTION (0 - 10 points penalty each)    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-rose-500 to-rose-600" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-rose-100 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">Negative Nutrients to Limit</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 whitespace-nowrap shrink-0">
                  0 – 10 pts penalty each
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calories, sugars, saturated fats, sodium, and cholesterol. Higher intake yields penalties.
              </p>
            </div>
          </div>
          {onOpenTables && (
            <button
              type="button"
              onClick={onOpenTables}
              className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 self-start sm:self-auto bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
            >
              <Info className="w-3 h-3" />
              <span>View 0–10 Cutoffs</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Energy */}
          <div className="col-span-1">
            <label htmlFor="energy_kcal" className="block text-xs font-bold text-slate-700 mb-1">
              Energy Density <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
              <input
                id="energy_kcal"
                type="number"
                min="0"
                step="any"
                value={formData.energy_kcal}
                onChange={(e) => onChange('energy_kcal', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-12 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">kcal</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Optimal: ≤ 80 kcal</p>
          </div>

          {/* Free Sugars */}
          <div className="col-span-1">
            <label htmlFor="free_sugars" className="block text-xs font-bold text-slate-700 mb-1">
              Free Sugars <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
              <input
                id="free_sugars"
                type="number"
                min="0"
                step="any"
                value={formData.free_sugars}
                onChange={(e) => onChange('free_sugars', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Optimal: ≤ 4.5 g</p>
          </div>

          {/* Saturated Fat */}
          <div className="col-span-1">
            <label htmlFor="saturated_fat" className="block text-xs font-bold text-slate-700 mb-1">
              Saturated Fat <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
              <input
                id="saturated_fat"
                type="number"
                min="0"
                step="any"
                value={formData.saturated_fat}
                onChange={(e) => onChange('saturated_fat', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Optimal: ≤ 1.0 g</p>
          </div>

          {/* Sodium */}
          <div className="col-span-1">
            <label htmlFor="sodium" className="block text-xs font-bold text-slate-700 mb-1">
              Sodium (Salt) <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
              <input
                id="sodium"
                type="number"
                min="0"
                step="any"
                value={formData.sodium}
                onChange={(e) => onChange('sodium', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-10 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Optimal: ≤ 90 mg</p>
          </div>

          {/* Cholesterol */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="cholesterol" className="block text-xs font-bold text-slate-700 mb-1">
              Cholesterol <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
              <input
                id="cholesterol"
                type="number"
                min="0"
                step="any"
                value={formData.cholesterol}
                onChange={(e) => onChange('cholesterol', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-10 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Optimal: ≤ 10 mg</p>
          </div>

          {/* Conditional Personalised PPQND Negative Factors */}
          {formData.algorithm_mode === 'personalised_pndpq' && (
            <>
              {/* Added Sugars */}
              <div className="col-span-1">
                <label htmlFor="added_sugars" className="block text-xs font-bold text-slate-700 mb-1">
                  Added Sugars
                </label>
                <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
                  <input
                    id="added_sugars"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.added_sugars ?? ''}
                    onChange={(e) => onChange('added_sugars', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-medium">WHO Limit: 25g/day</p>
              </div>

              {/* Trans Fat */}
              <div className="col-span-1">
                <label htmlFor="trans_fat" className="block text-xs font-bold text-slate-700 mb-1">
                  Trans Fat
                </label>
                <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
                  <input
                    id="trans_fat"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.trans_fat ?? ''}
                    onChange={(e) => onChange('trans_fat', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-medium">Safe target: 0g</p>
              </div>

              {/* Total Fat */}
              <div className="col-span-1">
                <label htmlFor="total_fat" className="block text-xs font-bold text-slate-700 mb-1">
                  Total Fat
                </label>
                <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15 transition-all overflow-hidden bg-white">
                  <input
                    id="total_fat"
                    type="number"
                    min="0"
                    step="any"
                    value={formData.total_fat ?? ''}
                    onChange={(e) => onChange('total_fat', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 font-medium">Limit: 30g/day</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. POSITIVE MACRONUTRIENTS & HEALTHY FATS                     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-emerald-100 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">Protective Macronutrients & Lipids</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                  Rewarding Points
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Protein, fibre, slow-digesting carbohydrates, and unsaturated fatty acids (MUFA & PUFA).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Protein */}
          <div className="col-span-1">
            <label htmlFor="protein" className="block text-xs font-bold text-slate-700 mb-1">
              Protein <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15 transition-all overflow-hidden bg-white">
              <input
                id="protein"
                type="number"
                min="0"
                step="any"
                value={formData.protein}
                onChange={(e) => onChange('protein', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max pts: &gt; 16.0g</p>
          </div>

          {/* Fibre */}
          <div className="col-span-1">
            <label htmlFor="fibre" className="block text-xs font-bold text-slate-700 mb-1">
              Dietary Fibre <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15 transition-all overflow-hidden bg-white">
              <input
                id="fibre"
                type="number"
                min="0"
                step="any"
                value={formData.fibre}
                onChange={(e) => onChange('fibre', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max pts: &gt; 9.4g</p>
          </div>

          {/* Total Carbs */}
          <div className="col-span-1">
            <label htmlFor="total_carbs" className="block text-xs font-bold text-slate-700 mb-1">
              Total Carbs
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15 transition-all overflow-hidden bg-white">
              <input
                id="total_carbs"
                type="number"
                min="0"
                step="any"
                value={formData.total_carbs}
                onChange={(e) => onChange('total_carbs', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Auto-derives complex</p>
          </div>

          {/* Complex Carbs */}
          <div className="col-span-1">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="complex_carbs" className="block text-xs font-bold text-slate-700">
                Complex Carbs
              </label>
              {formData.complex_carbs === '' && totalCarbs > 0 && (
                <span className="text-[10px] text-emerald-600 font-bold">={derivedComplex}g</span>
              )}
            </div>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15 transition-all overflow-hidden bg-white">
              <input
                id="complex_carbs"
                type="number"
                min="0"
                step="any"
                value={formData.complex_carbs !== '' ? formData.complex_carbs : (totalCarbs > 0 ? derivedComplex : '')}
                onChange={(e) => onChange('complex_carbs', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max pts: &gt; 50g</p>
          </div>

          {/* MUFA */}
          <div className="col-span-1">
            <label htmlFor="mufa" className="block text-xs font-bold text-slate-700 mb-1">
              MUFA (Good Fat)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15 transition-all overflow-hidden bg-white">
              <input
                id="mufa"
                type="number"
                min="0"
                step="any"
                value={formData.mufa}
                onChange={(e) => onChange('mufa', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max pts: ≥ 10g</p>
          </div>

          {/* PUFA */}
          <div className="col-span-1">
            <label htmlFor="pufa" className="block text-xs font-bold text-slate-700 mb-1">
              PUFA (Essential)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15 transition-all overflow-hidden bg-white">
              <input
                id="pufa"
                type="number"
                min="0"
                step="any"
                value={formData.pufa}
                onChange={(e) => onChange('pufa', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max pts: ≥ 5g</p>
          </div>

          {/* Omega-3 Fatty Acids */}
          <div className="col-span-1">
            <label htmlFor="omega3" className="block text-xs font-bold text-slate-700 mb-1">
              Omega-3 (ALA/EPA)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15 transition-all overflow-hidden bg-white">
              <input
                id="omega3"
                type="number"
                min="0"
                step="any"
                value={formData.omega3 ?? ''}
                onChange={(e) => onChange('omega3', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">g</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Target: ≥ 1.0g</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2.5 PROTEIN QUALITY & 9 ESSENTIAL AMINO ACIDS (PPQND)        */}
      {/* ------------------------------------------------------------- */}
      {formData.algorithm_mode === 'personalised_pndpq' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-300 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-600 via-teal-500 to-emerald-700" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-emerald-100 gap-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                <Dna className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">Protein Quality & Amino Acid Matrix</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                    40% Score Weight
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluates the 9 Essential Amino Acids, DIAAS synergy, and Indian complementary protein combinations.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Complementarity Selector */}
            <div>
              <label htmlFor="complementary_protein_source" className="block text-xs font-bold text-slate-700 mb-1">
                Complementary Protein Matrix <span className="text-emerald-600">*</span>
              </label>
              <select
                id="complementary_protein_source"
                value={formData.complementary_protein_source || 'cereal_pulse'}
                onChange={(e) => onChange('complementary_protein_source', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-emerald-50/40 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="cereal_pulse">Cereal + Pulse (Rice + Dal, Roti + Chana) [Synergy: 8/10]</option>
                <option value="cereal_dairy">Cereal + Dairy (Dalia + Milk, Kheer) [Synergy: 8/10]</option>
                <option value="pulse_dairy">Pulse + Dairy (Palak Paneer, Dal + Curd) [Synergy: 9/10]</option>
                <option value="soy_cereal">Soybean + Cereal (Soya Pulao, Tofu Fried Rice) [Synergy: 9/10]</option>
                <option value="egg_pulse">Egg + Plant Protein (Egg Curry with Dal) [Synergy: 10/10]</option>
                <option value="animal_source">Complete Animal / Fish Protein [Synergy: 9/10]</option>
                <option value="single_cereal">Single Cereal Grain alone (Lysine limited) [Synergy: 2/10]</option>
                <option value="single_pulse">Single Pulse alone (Methionine limited) [Synergy: 4/10]</option>
                <option value="mixed_legumes">Mixed Legumes & Seeds [Synergy: 5/10]</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                Balances amino acid kinetics (e.g. Lysine in pulses offsets Lysine deficiency in cereals).
              </p>
            </div>

            {/* Smart Auto-Estimation Toggle */}
            <div className="flex flex-col justify-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.auto_estimate_eaas !== false}
                  onChange={(e) => onChange('auto_estimate_eaas', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800">
                  Auto-estimate 9 Essential Amino Acids from recipe protein
                </span>
              </label>
              <p className="text-[11px] text-slate-500 mt-1 pl-6">
                Recommended: Derives Leucine, Lysine, etc. based on {formData.protein || 0}g crude protein and food source. Uncheck to enter laboratory mg values directly.
              </p>
            </div>
          </div>

          {/* Optional Manual 9 EAAs Fields */}
          {formData.auto_estimate_eaas === false && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Laboratory Essential Amino Acids (mg per serving)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { id: 'leucine', label: 'Leucine', opt: 'MPS driver' },
                  { id: 'lysine', label: 'Lysine', opt: 'Cereal limiting' },
                  { id: 'threonine', label: 'Threonine', opt: 'Gut integrity' },
                  { id: 'histidine', label: 'Histidine', opt: 'Tissue repair' },
                  { id: 'methionine_cysteine', label: 'Met + Cys', opt: 'Pulse limiting' },
                  { id: 'tryptophan', label: 'Tryptophan', opt: 'Neurotransmitter' },
                  { id: 'valine', label: 'Valine', opt: 'BCAA muscle' },
                  { id: 'isoleucine', label: 'Isoleucine', opt: 'BCAA energy' },
                  { id: 'phenylalanine_tyrosine', label: 'Phe + Tyr', opt: 'Aromatic' },
                ].map((aa) => (
                  <div key={aa.id} className="col-span-1">
                    <label htmlFor={aa.id} className="block text-[11px] font-bold text-slate-700 mb-1">
                      {aa.label}
                    </label>
                    <div className="relative rounded-xl border border-slate-300 focus-within:border-emerald-500 bg-white">
                      <input
                        id={aa.id}
                        type="number"
                        min="0"
                        step="any"
                        value={(formData as any)[aa.id] ?? ''}
                        onChange={(e) => onChange(aa.id as any, e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-2.5 py-2 text-xs bg-white focus:outline-none pr-8 font-medium"
                      />
                      <span className="absolute right-2 top-2 text-[10px] font-bold text-slate-400">mg</span>
                    </div>
                    <p className="mt-0.5 text-[9px] text-slate-400">{aa.opt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CORE MICRONUTRIENTS (ICMR-NIN 2020 RDA CALIBRATED)         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-teal-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-500 to-teal-700" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-teal-100 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">Essential Micronutrients</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 whitespace-nowrap shrink-0">
                  ICMR-NIN 2020 RDA Denominators
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scored 0 to 5 points based on % Daily Value (&ge; 25% of adult RDA awards maximum 5 points).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Iron */}
          <div className="col-span-1">
            <label htmlFor="iron" className="block text-xs font-bold text-slate-700 mb-1">
              Iron (RDA 19 mg)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 transition-all overflow-hidden bg-white">
              <input
                id="iron"
                type="number"
                min="0"
                step="any"
                value={formData.iron}
                onChange={(e) => onChange('iron', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-10 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max: ≥ 4.75 mg</p>
          </div>

          {/* Calcium */}
          <div className="col-span-1">
            <label htmlFor="calcium" className="block text-xs font-bold text-slate-700 mb-1">
              Calcium (1000 mg)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 transition-all overflow-hidden bg-white">
              <input
                id="calcium"
                type="number"
                min="0"
                step="any"
                value={formData.calcium}
                onChange={(e) => onChange('calcium', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-10 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max: ≥ 250 mg</p>
          </div>

          {/* Vitamin A */}
          <div className="col-span-1">
            <label htmlFor="vitamin_a" className="block text-xs font-bold text-slate-700 mb-1">
              Vit A (1000 mcg)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 transition-all overflow-hidden bg-white">
              <input
                id="vitamin_a"
                type="number"
                min="0"
                step="any"
                value={formData.vitamin_a}
                onChange={(e) => onChange('vitamin_a', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-12 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mcg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max: ≥ 250 mcg</p>
          </div>

          {/* Vitamin C */}
          <div className="col-span-1">
            <label htmlFor="vitamin_c" className="block text-xs font-bold text-slate-700 mb-1">
              Vit C (RDA 80 mg)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 transition-all overflow-hidden bg-white">
              <input
                id="vitamin_c"
                type="number"
                min="0"
                step="any"
                value={formData.vitamin_c}
                onChange={(e) => onChange('vitamin_c', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-10 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max: ≥ 20 mg</p>
          </div>

          {/* Vitamin D */}
          <div className="col-span-1">
            <label htmlFor="vitamin_d" className="block text-xs font-bold text-slate-700 mb-1">
              Vit D (20 mcg)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 transition-all overflow-hidden bg-white">
              <input
                id="vitamin_d"
                type="number"
                min="0"
                step="any"
                value={formData.vitamin_d}
                onChange={(e) => onChange('vitamin_d', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-12 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mcg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max: ≥ 5 mcg</p>
          </div>

          {/* Potassium */}
          <div className="col-span-1">
            <label htmlFor="potassium" className="block text-xs font-bold text-slate-700 mb-1">
              Potassium (3500 mg)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-slate-300 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 transition-all overflow-hidden bg-white">
              <input
                id="potassium"
                type="number"
                min="0"
                step="any"
                value={formData.potassium}
                onChange={(e) => onChange('potassium', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-10 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">mg</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 font-medium">Max: ≥ 875 mg</p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. OFFICIAL NUTRI-SCORE SPECIFIC FIELD (If Official Mode)     */}
      {/* ------------------------------------------------------------- */}
      {formData.algorithm_mode === 'official_nutri_score' && (
        <div className="bg-amber-50/70 rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              European FSA-NPS Fruits, Vegetables, Legumes & Nuts Proportion
            </h3>
          </div>
          <div className="max-w-xs mt-3">
            <label htmlFor="fruit_veg_legume_pct" className="block text-xs font-bold text-slate-700 mb-1">
              Fruit / Veg / Legume / Nut % (0 - 100)
            </label>
            <div className="relative rounded-2xl shadow-2xs border border-amber-300 bg-white focus-within:border-amber-500 focus-within:ring-3 focus-within:ring-amber-500/15 transition-all overflow-hidden">
              <input
                id="fruit_veg_legume_pct"
                type="number"
                min="0"
                max="100"
                step="any"
                value={formData.fruit_veg_legume_pct}
                onChange={(e) => onChange('fruit_veg_legume_pct', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-3 text-sm bg-white focus:outline-none pr-8 font-medium"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">%</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              In FSA rules: &gt;40% awards 1 pt, &gt;60% awards 2 pts, &gt;80% awards 5 pts.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. EXTENDED 39-NUTRIENT ACCORDION                            */}
      {/* ------------------------------------------------------------- */}
      <div className="border border-slate-200/90 rounded-3xl bg-white overflow-hidden shadow-xs transition-all hover:border-slate-300">
        <button
          type="button"
          onClick={() => setShowExtended(!showExtended)}
          className="w-full px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between bg-gradient-to-r from-slate-50/90 via-slate-50/50 to-white hover:bg-slate-100/80 active:scale-[0.99] transition-all text-left gap-3"
          aria-expanded={showExtended}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Extended Indian Databank (INDB)
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 whitespace-nowrap shrink-0 shadow-2xs">
                  +18 Optional Fields
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 hidden xs:block truncate">
                Trace minerals, B-complex vitamins & lab components
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs shrink-0 transition-all">
            <span className="hidden sm:inline">{showExtended ? 'Collapse fields' : 'Expand fields'}</span>
            <span className="sm:hidden">{showExtended ? 'Collapse' : 'Expand'}</span>
            {showExtended ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            )}
          </div>
        </button>

        {showExtended && (
          <div className="p-5 sm:p-7 border-t border-slate-100 space-y-6">
            <p className="text-xs text-slate-500 leading-relaxed">
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
                    <div className="relative rounded-xl border border-slate-200 bg-white overflow-hidden">
                      <input
                        id={item.key}
                        type="number"
                        min="0"
                        step="any"
                        value={(formData as any)[item.key]}
                        onChange={(e) => onChange(item.key as any, e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2 text-xs focus:outline-none font-medium pr-8"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400 pointer-events-none">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional B-Vitamins and Phytonutrients */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">B-Complex, Lipophilic Vitamins & Carotenoids</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                    <div className="relative rounded-xl border border-slate-200 bg-white overflow-hidden">
                      <input
                        id={item.key}
                        type="number"
                        min="0"
                        step="any"
                        value={(formData as any)[item.key]}
                        onChange={(e) => onChange(item.key as any, e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2 text-xs focus:outline-none font-medium pr-8"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400 pointer-events-none">{item.unit}</span>
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

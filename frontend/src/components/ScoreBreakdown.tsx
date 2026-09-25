import React from 'react';
import { FoodAnalysisResponse } from '../types/nutrition';
import { Calculator, ArrowRight } from 'lucide-react';

interface ScoreBreakdownProps {
  result: FoodAnalysisResponse;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ result }) => {
  const { score, nutrient_analysis } = result;

  const negativeNutrients = nutrient_analysis.all_nutrients.filter((n) => n.category === 'negative');
  const positiveNutrients = nutrient_analysis.all_nutrients.filter((n) => n.category !== 'negative');

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Two-Step Score Calculation & Normalization</h3>
          <p className="text-xs text-slate-500">
            Mathematical derivation of negative penalties, positive nutrient awards, and final 0–100 normalization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Negative Scoring Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-2xs" />
              Step 1: Negative Penalties (N)
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 whitespace-nowrap shrink-0">
              Total N: {score.negative_penalty} / {score.negative_max}
            </span>
          </div>

          <div className="space-y-2">
            {negativeNutrients.map((item) => (
              <div
                key={item.nutrient_key}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">{item.label}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({item.value} {item.unit})</span>
                  </div>
                  {item.threshold_explanation && (
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">{item.threshold_explanation}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-14 sm:w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.points_awarded / item.max_possible_points) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-rose-600 w-8 text-right font-mono">
                    +{item.points_awarded}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 & 3: Positive Scoring & Formula */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-2xs" />
                Step 2: Positive Rewards (P)
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap shrink-0">
                Total P: {score.positive_score} / {score.positive_max}
              </span>
            </div>

            {/* Quick summary of positive categories */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800/80 block uppercase tracking-wider">Macronutrients & Fats</span>
                <span className="text-base font-black text-slate-800 mt-1 block">
                  {positiveNutrients
                    .filter((n) => n.category === 'positive_macro' || n.category === 'positive_fatty_acid')
                    .reduce((acc, curr) => acc + curr.points_awarded, 0)}{' '}
                  <span className="text-xs font-normal text-slate-500">pts</span>
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-teal-50/40 border border-teal-100">
                <span className="text-[10px] font-bold text-teal-800/80 block uppercase tracking-wider">Vitamins & Minerals (%DV)</span>
                <span className="text-base font-black text-slate-800 mt-1 block">
                  {positiveNutrients
                    .filter((n) => n.category === 'positive_mineral' || n.category === 'positive_vitamin' || n.category === 'positive_phytonutrient')
                    .reduce((acc, curr) => acc + curr.points_awarded, 0)}{' '}
                  <span className="text-xs font-normal text-slate-500">pts</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical Normalization Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50 border border-indigo-100 space-y-3">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              Step 3: Normalization Equation
            </span>

            <div className="bg-white p-3.5 rounded-xl border border-indigo-200/70 font-mono text-xs text-slate-800 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-slate-500">Raw Score (N - P):</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {score.negative_penalty} - {score.positive_score} = {score.raw_score}
                </span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-1 border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Normalized Health Score:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  100 × ({score.negative_max} - ({score.raw_score})) / {score.negative_max + score.positive_max} = {score.health_score}/100
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Lower Raw Score indicates superior nutritional density. The final Health Score scales from 0 (poorest) to 100 (highest), assigning Grade <strong>{score.grade}</strong> ({score.grade_label}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

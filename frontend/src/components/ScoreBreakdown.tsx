import React from 'react';
import { FoodAnalysisResponse } from '../types/nutrition';
import { HelpCircle, Calculator, CheckCircle2, XCircle } from 'lucide-react';

interface ScoreBreakdownProps {
  result: FoodAnalysisResponse;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ result }) => {
  const { score, nutrient_analysis, algorithm_info } = result;

  const negativeNutrients = nutrient_analysis.all_nutrients.filter((n) => n.category === 'negative');
  const positiveNutrients = nutrient_analysis.all_nutrients.filter((n) => n.category !== 'negative');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-2.5 pb-4 mb-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Two-Step Score Calculation & Normalization</h3>
          <p className="text-xs text-slate-500">
            Step-by-step derivation of negative penalty points, positive points, and final normalized health score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Negative Scoring Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Step 1: Negative Nutrient Penalties (N)
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
              Total N: {score.negative_penalty} / {score.negative_max}
            </span>
          </div>

          <div className="space-y-2.5">
            {negativeNutrients.map((item) => (
              <div
                key={item.nutrient_key}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                    <span className="text-[11px] text-slate-400">({item.value} {item.unit})</span>
                  </div>
                  {item.threshold_explanation && (
                    <span className="text-[10px] text-slate-500 block">{item.threshold_explanation}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${(item.points_awarded / item.max_possible_points) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-rose-600 w-8 text-right">
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Step 2: Positive Nutrient Rewards (P)
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Total P: {score.positive_score} / {score.positive_max}
              </span>
            </div>

            {/* Quick summary of positive categories */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Macronutrients & Fats</span>
                <span className="text-sm font-bold text-slate-800">
                  {positiveNutrients
                    .filter((n) => n.category === 'positive_macro' || n.category === 'positive_fatty_acid')
                    .reduce((acc, curr) => acc + curr.points_awarded, 0)}{' '}
                  pts
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Vitamins & Minerals (%DV)</span>
                <span className="text-sm font-bold text-slate-800">
                  {positiveNutrients
                    .filter((n) => n.category === 'positive_mineral' || n.category === 'positive_vitamin' || n.category === 'positive_phytonutrient')
                    .reduce((acc, curr) => acc + curr.points_awarded, 0)}{' '}
                  pts
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical Normalization Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <span className="text-xs font-bold text-indigo-900 block flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              Step 3: Score Normalization Equation
            </span>

            <div className="bg-white p-3 rounded-xl border border-indigo-200/60 font-mono text-xs text-slate-800 space-y-1">
              <div>
                Raw Score = N_total ({score.negative_penalty}) - P_total ({score.positive_score}) ={' '}
                <strong className="text-indigo-600">{score.raw_score}</strong>
              </div>
              <div>
                Health Score = 100 × ({score.negative_max} - ({score.raw_score})) / {score.negative_max + score.positive_max} ={' '}
                <strong className="text-emerald-600">{score.health_score} / 100</strong>
              </div>
            </div>

            <p className="text-[11px] text-indigo-800/80 leading-relaxed">
              Lower Raw Score signifies superior nutritional quality. The normalized Health Score scales cleanly from 0 (poorest) to 100 (highest), mapping into letter Grade <strong>{score.grade}</strong> ({score.grade_label}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

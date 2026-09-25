import React from 'react';
import { FoodAnalysisResponse } from '../types/nutrition';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface NutrientAnalysisProps {
  result: FoodAnalysisResponse;
}

export const NutrientAnalysis: React.FC<NutrientAnalysisProps> = ({ result }) => {
  const { nutrient_analysis } = result;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Nutritional Contribution Analysis</h3>
          <p className="text-xs text-slate-500">
            Granular inspection of individual nutrients driving positive health credits and negative penalties.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Positive Contributors */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Leading Beneficial Contributors
            </h4>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Rewards
            </span>
          </div>

          {nutrient_analysis.positive_contributors.length > 0 ? (
            <div className="space-y-2.5">
              {nutrient_analysis.positive_contributors.slice(0, 6).map((item) => (
                <div
                  key={item.nutrient_key}
                  className="p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/25 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500">
                      Amount: <strong className="text-slate-700">{item.value} {item.unit}</strong>
                      {item.percentage_of_dv !== undefined && (
                        <span className="ml-1 text-emerald-700 font-semibold">({item.percentage_of_dv}% RDA)</span>
                      )}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                    +{item.points_awarded} pts
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              No significant positive nutrient points recorded for this recipe.
            </div>
          )}
        </div>

        {/* Top Negative Penalties */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Significant Penalty Nutrients
            </h4>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Penalties
            </span>
          </div>

          {nutrient_analysis.negative_contributors.length > 0 ? (
            <div className="space-y-2.5">
              {nutrient_analysis.negative_contributors.map((item) => (
                <div
                  key={item.nutrient_key}
                  className="p-3.5 rounded-2xl border border-rose-100 bg-rose-50/25 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500">
                      Amount: <strong className="text-slate-700">{item.value} {item.unit}</strong>
                    </span>
                    {item.threshold_explanation && (
                      <span className="text-[10px] text-rose-600 block mt-0.5 font-medium">{item.threshold_explanation}</span>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-rose-100 text-rose-800 border border-rose-200 font-mono">
                    +{item.points_awarded} pts
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center text-xs text-emerald-800 font-semibold">
              Zero negative nutrient penalties incurred! Excellent profiling.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

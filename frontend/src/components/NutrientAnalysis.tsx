import React from 'react';
import { FoodAnalysisResponse } from '../types/nutrition';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface NutrientAnalysisProps {
  result: FoodAnalysisResponse;
}

export const NutrientAnalysis: React.FC<NutrientAnalysisProps> = ({ result }) => {
  const { nutrient_analysis } = result;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-2.5 pb-4 mb-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Nutritional Contribution Analysis</h3>
          <p className="text-xs text-slate-500">
            Granular breakdown of nutrients driving positive health credits and negative penalties.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Positive Contributors */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Leading Beneficial Contributors
          </h4>

          {nutrient_analysis.positive_contributors.length > 0 ? (
            <div className="space-y-2">
              {nutrient_analysis.positive_contributors.slice(0, 6).map((item) => (
                <div
                  key={item.nutrient_key}
                  className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500">
                      Amount: {item.value} {item.unit}
                      {item.percentage_of_dv !== undefined && (
                        <span className="ml-1 text-emerald-700 font-medium">({item.percentage_of_dv}% of RDA)</span>
                      )}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    +{item.points_awarded} pts
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              No significant positive nutrient points recorded for this recipe.
            </div>
          )}
        </div>

        {/* Top Negative Penalties */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Significant Penalty Nutrients
          </h4>

          {nutrient_analysis.negative_contributors.length > 0 ? (
            <div className="space-y-2">
              {nutrient_analysis.negative_contributors.map((item) => (
                <div
                  key={item.nutrient_key}
                  className="p-3 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500">
                      Amount: {item.value} {item.unit}
                    </span>
                    {item.threshold_explanation && (
                      <span className="text-[10px] text-rose-600 block mt-0.5">{item.threshold_explanation}</span>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                    +{item.points_awarded} pts penalty
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-center text-xs text-emerald-700 font-medium">
              Zero negative nutrient penalties incurred! Excellent profiling.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

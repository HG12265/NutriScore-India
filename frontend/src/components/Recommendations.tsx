import React from 'react';
import { Lightbulb, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { FoodAnalysisResponse } from '../types/nutrition';

interface RecommendationsProps {
  result: FoodAnalysisResponse;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ result }) => {
  const { recommendations, warnings } = result;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Dietary Optimization & Balance Tips</h3>
          <p className="text-xs text-slate-500">
            Actionable dietary modifications benchmarked against ICMR-NIN 2024 national nutritional guidelines.
          </p>
        </div>
      </div>

      {/* Warnings if any */}
      {warnings && warnings.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Nutrient Proportion Observations</span>
          </div>
          <ul className="list-disc list-inside text-xs text-amber-800/90 space-y-1 font-medium pl-1">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all flex items-start space-x-3"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed pt-0.5">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Lightbulb, ArrowRight, ShieldAlert } from 'lucide-react';
import { FoodAnalysisResponse } from '../types/nutrition';

interface RecommendationsProps {
  result: FoodAnalysisResponse;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ result }) => {
  const { recommendations, warnings } = result;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-2.5 pb-4 mb-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Dietary Balance & Optimization Tips</h3>
          <p className="text-xs text-slate-500">
            Algorithmic insights based on ICMR-NIN 2020 nutritional guidelines for recipe improvement.
          </p>
        </div>
      </div>

      {/* Warnings if any */}
      {warnings && warnings.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Plausibility Observations</span>
          </div>
          <ul className="list-disc list-inside text-xs text-amber-700/90 space-y-1">
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
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start space-x-3"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

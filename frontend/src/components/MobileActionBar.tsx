import React from 'react';
import { Calculator, Loader2, RotateCcw } from 'lucide-react';
import { FoodAnalysisResponse } from '../types/nutrition';

interface MobileActionBarProps {
  onCalculate: () => void;
  onReset: () => void;
  isLoading: boolean;
  result: FoodAnalysisResponse | null;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  onCalculate,
  onReset,
  isLoading,
  result,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 px-4 md:hidden shadow-lg flex items-center justify-between gap-3">
      {result ? (
        <div className="flex items-center space-x-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-xs"
            style={{ backgroundColor: result.score.grade_color }}
          >
            {result.score.grade}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Health Score</span>
            <span className="text-sm font-extrabold text-slate-800">
              {Math.round(result.score.health_score)}<span className="text-xs font-normal text-slate-400">/100</span>
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="p-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all border border-slate-200"
          title="Reset All"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
        </button>
      )}

      <button
        type="button"
        onClick={onCalculate}
        disabled={isLoading}
        className="flex-1 py-3 px-5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calculating...</span>
          </>
        ) : (
          <>
            <Calculator className="w-4 h-4" />
            <span>{result ? 'Recalculate Result' : 'Calculate NutriScore'}</span>
          </>
        )}
      </button>
    </div>
  );
};

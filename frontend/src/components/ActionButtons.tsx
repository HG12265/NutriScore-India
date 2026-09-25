import React from 'react';
import { Calculator, RotateCcw, BookOpen, Loader2 } from 'lucide-react';
import { SAMPLE_RECIPES } from '../services/sampleData';

interface ActionButtonsProps {
  onCalculate: () => void;
  onReset: () => void;
  onLoadSample: (sampleId: string) => void;
  isLoading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCalculate,
  onReset,
  onLoadSample,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Sample Recipe Presets */}
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block sm:inline mr-2">
            Load Indian Preset:
          </span>
          <select
            onChange={(e) => {
              if (e.target.value) onLoadSample(e.target.value);
            }}
            defaultValue=""
            className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50/80 text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 w-full sm:w-64 transition-all"
          >
            <option value="" disabled>
              Select traditional recipe...
            </option>
            {SAMPLE_RECIPES.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name} ({recipe.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all border border-slate-200 flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Form</span>
        </button>

        <button
          type="button"
          onClick={onCalculate}
          disabled={isLoading}
          className="flex-1 sm:flex-none px-7 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating Score...</span>
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              <span>Calculate Result</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

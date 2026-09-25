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
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
      {/* Sample Recipe Presets */}
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="text-xs font-semibold text-slate-700 shrink-0">Sample Indian Recipe:</span>
        <select
          onChange={(e) => {
            if (e.target.value) onLoadSample(e.target.value);
          }}
          defaultValue=""
          className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 w-full md:w-56"
        >
          <option value="" disabled>
            Select a recipe preset...
          </option>
          {SAMPLE_RECIPES.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name} ({recipe.category})
            </option>
          ))}
        </select>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>

        <button
          type="button"
          onClick={onCalculate}
          disabled={isLoading}
          className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

import React from 'react';
import { AlgorithmMode } from '../types/nutrition';
import { Sparkles, Layers, Award } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedMode: AlgorithmMode;
  onSelectMode: (mode: AlgorithmMode) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  const modes: {
    id: AlgorithmMode;
    title: string;
    badge: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'icmr_16_nutrient',
      title: 'ICMR 16-Nutrient Model',
      badge: 'Recommended',
      subtitle: '5 Negative + 11 Positive nutrients with ICMR-NIN 2020 RDA benchmarks.',
      icon: Sparkles,
    },
    {
      id: 'full_39_nutrient',
      title: 'Extended 39-Nutrient Model',
      badge: 'Comprehensive',
      subtitle: 'Evaluates all 39 minerals, vitamins & carotenoids from Indian Databank (INDB).',
      icon: Layers,
    },
    {
      id: 'official_nutri_score',
      title: 'Standard Nutri-Score (FSA)',
      badge: 'EU / France',
      subtitle: 'FSA-NPS general solid foods model with protein cap exception rule.',
      icon: Award,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Profiling Algorithm Standard
          </h2>
          <p className="text-xs text-slate-500">
            Select the profiling model and benchmark reference standards to evaluate your food.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isSelected
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  {mode.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {mode.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

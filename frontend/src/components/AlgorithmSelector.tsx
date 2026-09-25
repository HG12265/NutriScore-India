import React from 'react';
import { AlgorithmMode } from '../types/nutrition';
import { Sparkles, Layers, Award, CheckCircle2 } from 'lucide-react';

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
    details: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'icmr_16_nutrient',
      title: 'ICMR 16-Nutrient Model',
      badge: 'Recommended for India',
      subtitle: '5 Negative + 11 Positive nutrients',
      details: 'Calibrated with ICMR-NIN 2020 RDA benchmarks for traditional Indian cooking.',
      icon: Sparkles,
    },
    {
      id: 'full_39_nutrient',
      title: 'Extended 39-Nutrient Model',
      badge: 'Comprehensive',
      subtitle: 'All 39 INDB components',
      details: 'Evaluates all minerals, vitamins & carotenoids from the national databank.',
      icon: Layers,
    },
    {
      id: 'official_nutri_score',
      title: 'Standard Nutri-Score (FSA)',
      badge: 'EU / France',
      subtitle: 'European Solid Foods Model',
      details: 'Official FSA-NPS algorithm incorporating the 80% fruit/veg protein cap rule.',
      icon: Award,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 inline-block mb-1">
            Profiling Framework
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Select Profiling Algorithm Standard
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          Switch between Indian ICMR RDA standards, full 39-nutrient databank, or the European FSA model.
        </p>
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
              className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/70 to-emerald-50/20 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                      {mode.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-0.5">
                  {mode.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-800/80 mb-1.5">
                  {mode.subtitle}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {mode.details}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

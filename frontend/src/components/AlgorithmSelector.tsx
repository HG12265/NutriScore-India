import React from 'react';
import { AlgorithmMode } from '../types/nutrition';
import { Sparkles, Layers, Award, CheckCircle2, UserCheck, Activity } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedMode: AlgorithmMode;
  onSelectMode: (mode: AlgorithmMode) => void;
  selectedDemographic?: string;
  onSelectDemographic?: (demographicKey: string) => void;
}

export const DEMOGRAPHIC_OPTIONS = [
  { key: 'adult_male', label: 'Adult Male', age: '19–59y (65kg)', protein: '54g', energy: '2110 kcal', desc: 'Reference standard for adult men.' },
  { key: 'adult_female', label: 'Adult Female', age: '19–59y (55kg)', protein: '46g', energy: '1660 kcal', desc: 'Higher iron demand (29mg/day).' },
  { key: 'pregnant_woman', label: 'Pregnant Mother', age: '2nd/3rd Tri', protein: '67g', energy: '2460 kcal', desc: 'High anabolic protein and micronutrient support.' },
  { key: 'lactating_woman', label: 'Lactating Mother', age: '0–6m', protein: '63g', energy: '2600 kcal', desc: 'Elevated calcium, vitamin A & fluid support.' },
  { key: 'adolescent_female', label: 'Adolescent Female', age: '14–18y', protein: '46g', energy: '2060 kcal', desc: 'Pubertal growth spurt & iron conservation.' },
  { key: 'adolescent_male', label: 'Adolescent Male', age: '14–18y', protein: '55g', energy: '2860 kcal', desc: 'Rapid muscle accretion and bone mineralization.' },
  { key: 'older_child', label: 'Older Child', age: '9–13y', protein: '34g', energy: '1950 kcal', desc: 'Cognitive growth and school-age requirements.' },
  { key: 'child', label: 'Young Child', age: '4–8y', protein: '22g', energy: '1350 kcal', desc: 'High amino acid requirements per kg body weight.' },
  { key: 'toddler', label: 'Toddler', age: '1–3y', protein: '12.5g', energy: '1010 kcal', desc: 'High energy-dense and lysine/threonine density.' },
  { key: 'senior_citizen', label: 'Senior Citizen', age: '>60y', protein: '52g', energy: '1700 kcal', desc: 'Sarcopenia prevention; moderate sodium.' },
  { key: 'active_athlete', label: 'Active Athlete', age: 'Athletic', protein: '85g', energy: '2900 kcal', desc: 'Hypertrophy & high glycogen turnover.' },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedMode,
  onSelectMode,
  selectedDemographic = 'adult_male',
  onSelectDemographic,
}) => {
  const modes: {
    id: AlgorithmMode;
    title: string;
    badge: string;
    badgeColor: string;
    subtitle: string;
    details: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'personalised_pndpq',
      title: 'Personalised PPQND (ICMR/FAO)',
      badge: 'New • 7-Tier A+ to F',
      badgeColor: 'bg-emerald-600 text-white',
      subtitle: 'Demographic RDA & Protein Quality',
      details: 'Evaluates against 11 life stages, 9 Essential Amino Acids, DIAAS synergy & 7 chronic risk factors.',
      icon: Activity,
    },
    {
      id: 'icmr_16_nutrient',
      title: 'ICMR 16-Nutrient Model',
      badge: 'National Baseline',
      badgeColor: 'bg-amber-100 text-amber-800',
      subtitle: '5 Negative + 11 Positive nutrients',
      details: 'Calibrated with ICMR-NIN 2020 RDA benchmarks for traditional Indian cooking.',
      icon: Sparkles,
    },
    {
      id: 'full_39_nutrient',
      title: 'Extended 39-Nutrient Model',
      badge: 'Comprehensive',
      badgeColor: 'bg-blue-100 text-blue-800',
      subtitle: 'All 39 INDB components',
      details: 'Evaluates all minerals, vitamins & carotenoids from the national databank.',
      icon: Layers,
    },
    {
      id: 'official_nutri_score',
      title: 'Standard Nutri-Score (FSA)',
      badge: 'EU / France',
      badgeColor: 'bg-purple-100 text-purple-800',
      subtitle: 'European Solid Foods Model',
      details: 'Official FSA-NPS algorithm incorporating the 80% fruit/veg protein cap rule.',
      icon: Award,
    },
  ];

  const currentDemo = DEMOGRAPHIC_OPTIONS.find((d) => d.key === selectedDemographic) || DEMOGRAPHIC_OPTIONS[0];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-8 transition-all">
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
          Switch between Personalised PPQND (Demographic & Amino Acid), ICMR-NIN 2024, or the European FSA model.
        </p>
      </div>

      {/* Grid of 4 Profiling Engines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/80 to-emerald-50/20 shadow-sm ring-2 ring-emerald-500/20'
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${mode.badgeColor}`}>
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

      {/* Demographic Life-Stage Selector (Rendered when Personalised PPQND is active) */}
      {selectedMode === 'personalised_pndpq' && (
        <div className="mt-5 pt-5 border-t border-slate-100 bg-emerald-50/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-b-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Target Demographic Life Stage
                </h4>
                <p className="text-[11px] text-emerald-800/80">
                  Algorithm tailors positive saturation and chronic penalties to this individual's ICMR 2024 / WHO RDA.
                </p>
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div className="flex items-center gap-2 text-xs font-semibold bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-200/80 text-emerald-900 shadow-2xs">
              <span>{currentDemo.label}</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700">RDA: {currentDemo.protein} Prot</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">{currentDemo.energy}</span>
            </div>
          </div>

          {/* Demographic Selection Dropdown & Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {DEMOGRAPHIC_OPTIONS.map((demo) => {
              const isCurrent = demo.key === selectedDemographic;
              return (
                <button
                  key={demo.key}
                  type="button"
                  onClick={() => onSelectDemographic && onSelectDemographic(demo.key)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-600/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className="font-bold truncate">{demo.label}</span>
                  <span className={`text-[10px] ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {demo.age}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

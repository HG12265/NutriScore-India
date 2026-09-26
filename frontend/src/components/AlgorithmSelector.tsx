import React from 'react';
import { AlgorithmMode } from '../types/nutrition';
import { UserCheck, ShieldCheck, BookOpen, Sparkles, Layers } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedMode: AlgorithmMode;
  onSelectMode: (mode: AlgorithmMode) => void;
  selectedDemographic?: string;
  onSelectDemographic?: (demographicKey: string) => void;
}

export const DEMOGRAPHIC_OPTIONS = [
  { key: 'adult_male', label: 'Adult Male', age: '19–59y (65kg)', protein: '54g', energy: '2110 kcal', iron: '19mg', desc: 'ICMR-NIN 2024 Reference Indian Man (65kg standard).' },
  { key: 'adult_female', label: 'Adult Female', age: '19–59y (55kg)', protein: '46g', energy: '1660 kcal', iron: '29mg', desc: 'ICMR-NIN 2024 Reference Indian Woman (elevated 29mg Iron RDA).' },
  { key: 'pregnant_woman', label: 'Pregnant Mother', age: '2nd/3rd Tri', protein: '67g', energy: '2460 kcal', iron: '27mg', desc: 'ICMR-NIN 2024 high anabolic protein, folate & iron requirements.' },
  { key: 'lactating_woman', label: 'Lactating Mother', age: '0–6m', protein: '63g', energy: '2600 kcal', iron: '23mg', desc: 'ICMR-NIN 2024 elevated calcium, vitamin A & fluid support.' },
  { key: 'adolescent_female', label: 'Adolescent Female', age: '14–18y', protein: '46g', energy: '2060 kcal', iron: '32mg', desc: 'ICMR-NIN 2024 pubertal growth spurt & peak iron conservation.' },
  { key: 'adolescent_male', label: 'Adolescent Male', age: '14–18y', protein: '55g', energy: '2860 kcal', iron: '22mg', desc: 'ICMR-NIN 2024 rapid lean muscle accretion & bone mineral density.' },
  { key: 'older_child', label: 'Older Child', age: '9–13y', protein: '34g', energy: '1950 kcal', iron: '16mg', desc: 'ICMR-NIN 2024 school-age cognitive & physical development.' },
  { key: 'child', label: 'Young Child', age: '4–8y', protein: '22g', energy: '1350 kcal', iron: '11mg', desc: 'High amino acid requirements per kg body weight.' },
  { key: 'toddler', label: 'Toddler', age: '1–3y', protein: '12.5g', energy: '1010 kcal', iron: '8mg', desc: 'ICMR-NIN 2024 energy-dense and high lysine/threonine density.' },
  { key: 'senior_citizen', label: 'Senior Citizen', age: '>60y', protein: '52g', energy: '1700 kcal', iron: '19mg', desc: 'ICMR-NIN 2024 sarcopenia prevention & sodium moderation.' },
  { key: 'active_athlete', label: 'Active Athlete / Sports', age: 'High Demand', protein: '85g', energy: '2900 kcal', iron: '25mg', desc: 'Elevated amino acids for muscle protein synthesis & glycogen turnover.' },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedMode,
  onSelectMode,
  selectedDemographic = 'adult_male',
  onSelectDemographic,
}) => {
  const currentDemo = DEMOGRAPHIC_OPTIONS.find((d) => d.key === selectedDemographic) || DEMOGRAPHIC_OPTIONS[0];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-200/90 shadow-sm mb-8 relative overflow-hidden">
      {/* Decorative Indian Tricolor Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600" />

      {/* Header & Framework Citation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              100% Indian Scientific Standard
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70">
              ICMR-NIN 2024 • IFCT 2017
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Indian Recipe NutriScore Profiling System
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
            Exclusively calibrated to the official <strong className="text-slate-800">Dietary Guidelines for Indians (ICMR-NIN 2024)</strong>,{' '}
            <strong className="text-slate-800">Revised 2024 RDAs</strong>, and the{' '}
            <strong className="text-slate-800">Indian Food Composition Tables (IFCT 2017)</strong>. Foreign European FSA models have been completely excluded.
          </p>
        </div>

        {/* Profiling Depth Switcher (100% Indian Models Only) */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => onSelectMode('personalised_pndpq')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedMode === 'personalised_pndpq' || selectedMode === 'icmr_nin_2024'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>PPQND 7-Tier (Recommended)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('full_39_nutrient')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedMode === 'full_39_nutrient'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full IFCT 39-Nutrient</span>
          </button>
        </div>
      </div>

      {/* ICMR-NIN 2024 Demographic Life-Stage Selector */}
      <div className="pt-4 border-t border-slate-100 bg-emerald-50/50 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-5 sm:p-7 rounded-b-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Target ICMR-NIN Demographic Life Stage
              </h4>
              <p className="text-[11px] text-emerald-800">
                Nutrient saturation thresholds, DIAAS amino acid requirements, and upper limits are calibrated to this life stage.
              </p>
            </div>
          </div>

          {/* Life Stage Quick Target Badge */}
          <div className="flex items-center gap-2 text-xs font-bold bg-white px-3.5 py-2 rounded-xl border border-emerald-300 text-emerald-950 shadow-2xs">
            <span>{currentDemo.label}</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700">Protein: {currentDemo.protein}</span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-700">Iron: {currentDemo.iron}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{currentDemo.energy}</span>
          </div>
        </div>

        {/* 11 Demographic Life Stages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {DEMOGRAPHIC_OPTIONS.map((demo) => {
            const isCurrent = demo.key === selectedDemographic;
            return (
              <button
                key={demo.key}
                type="button"
                onClick={() => onSelectDemographic && onSelectDemographic(demo.key)}
                className={`text-left p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/70'
                }`}
              >
                <div>
                  <span className="font-black truncate block">{demo.label}</span>
                  <span className={`text-[10px] block mt-0.5 ${isCurrent ? 'text-emerald-100 font-medium' : 'text-slate-500'}`}>
                    {demo.age}
                  </span>
                </div>
                <div className={`mt-2 pt-1 border-t text-[10px] flex items-center justify-between ${isCurrent ? 'border-emerald-500/80 text-emerald-100' : 'border-slate-100 text-slate-400'}`}>
                  <span>Prot: {demo.protein}</span>
                  <span>Fe: {demo.iron}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

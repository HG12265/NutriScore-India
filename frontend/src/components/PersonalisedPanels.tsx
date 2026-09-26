import React, { useState } from 'react';
import { PersonalisedNutriScoreResult } from '../types/nutrition';
import { 
  Dna, 
  ShieldAlert, 
  Sparkles, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';

interface PersonalisedPanelsProps {
  result: PersonalisedNutriScoreResult;
}

export const PersonalisedPanels: React.FC<PersonalisedPanelsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'protein' | 'density' | 'risk'>('all');
  const [showAllNutrients, setShowAllNutrients] = useState(false);

  // EAA display labels
  const eaaLabels: Record<string, string> = {
    leucine: 'Leucine (MPS Trigger)',
    lysine: 'Lysine (Cereal Limiting)',
    valine: 'Valine (BCAA)',
    isoleucine: 'Isoleucine (BCAA)',
    threonine: 'Threonine',
    methionine_cysteine: 'Methionine + Cysteine (Sulfur AA)',
    tryptophan: 'Tryptophan (Serotonin Precursor)',
    histidine: 'Histidine',
    phenylalanine_tyrosine: 'Phenylalanine + Tyrosine',
  };

  const getGradeStyle = (grade: string) => {
    switch (grade) {
      case 'A+':
        return {
          bg: 'bg-emerald-600',
          gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
          border: 'border-emerald-300',
          badgeText: 'Exceptional Density & Protein Quality',
        };
      case 'A':
        return {
          bg: 'bg-emerald-500',
          gradient: 'from-emerald-400 to-teal-600',
          border: 'border-emerald-200',
          badgeText: 'High Nutritional Quality',
        };
      case 'B':
        return {
          bg: 'bg-teal-500',
          gradient: 'from-teal-400 to-emerald-600',
          border: 'border-teal-200',
          badgeText: 'Good Nutritional Value',
        };
      case 'C':
        return {
          bg: 'bg-amber-500',
          gradient: 'from-amber-400 to-amber-600',
          border: 'border-amber-200',
          badgeText: 'Balanced / Moderate Quality',
        };
      case 'D':
        return {
          bg: 'bg-orange-500',
          gradient: 'from-orange-400 to-orange-600',
          border: 'border-orange-200',
          badgeText: 'Moderately Unfavorable',
        };
      case 'E':
        return {
          bg: 'bg-rose-500',
          gradient: 'from-rose-500 to-rose-600',
          border: 'border-rose-200',
          badgeText: 'Low Nutritional Density',
        };
      default: // F
        return {
          bg: 'bg-red-700',
          gradient: 'from-red-600 to-rose-800',
          border: 'border-red-300',
          badgeText: 'High Chronic Health Risk',
        };
    }
  };

  const gradeStyle = getGradeStyle(result.grade);

  return (
    <div className="space-y-6 mt-8">
      {/* 1. HERO 7-TIER GRADE BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            {/* Glowing 7-Tier Grade Letter Badge */}
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${gradeStyle.gradient} flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-900/10 border-4 border-white shrink-0`}>
              <span className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
                {result.grade}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                Grade
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                  PPQND-100 Standard
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Target: {result.demographic_label}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Serving: {result.serving_size_g}g
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {result.food_name}
              </h2>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {result.grade_label} • <span className="font-normal text-slate-600">{result.grade_description}</span>
              </p>
            </div>
          </div>

          {/* Metric Trio Pill */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                NutriScore
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {result.nutriscore}
              </span>
              <span className="text-[10px] text-slate-400 block">/ 100</span>
            </div>

            <div className="text-center px-2 border-x border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Benefit (PNS)
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600">
                {result.positive_nutrient_score}
              </span>
              <span className="text-[10px] text-emerald-600/80 block">Density</span>
            </div>

            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Risk (NRS)
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-600">
                {result.negative_risk_score}
              </span>
              <span className="text-[10px] text-rose-600/80 block">Penalties</span>
            </div>
          </div>
        </div>

        {/* Benefit-Risk Synthesis Formula Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Benefit-Risk Balance:</span>
            <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700">
              50 + (0.75 × {result.positive_nutrient_score}) - (0.25 × {result.negative_risk_score}) = {result.nutriscore}
            </code>
          </div>
          <div className="text-[11px] text-slate-500">
            Calculated against ICMR-NIN 2024 & FAO/WHO Daily Allowances
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All 4 Diagnostic Panels
        </button>
        <button
          onClick={() => setActiveTab('protein')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'protein'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          Protein Quality & DIAAS
        </button>
        <button
          onClick={() => setActiveTab('density')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'density'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-teal-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Nutrient Density (PNS)
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'risk'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-rose-50 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Chronic Risk Load (NRS)
        </button>
      </div>

      {/* 2. PANEL: PROTEIN QUALITY & AMINO ACID ADEQUACY */}
      {(activeTab === 'all' || activeTab === 'protein') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                <Dna className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-block mb-0.5">
                  40% Total Algorithm Weight
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Protein Quality, DIAAS & Amino Acid Profile
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 text-emerald-900 font-bold px-3 py-1.5 rounded-xl border border-emerald-200/80 text-xs">
                EAA Quality: {result.weighted_amino_acid_score} / 10
              </div>
              <div className="bg-teal-50 text-teal-900 font-bold px-3 py-1.5 rounded-xl border border-teal-200/80 text-xs">
                Synergy: {result.complementary_protein_score} / 10
              </div>
            </div>
          </div>

          {/* Synergy Card & Limiting AA Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-4 rounded-2xl border border-emerald-200/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Complementary Pairing
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  {result.complementary_protein_score} / 10 Pts
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">
                {result.complementary_protein_label}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.protein_quality_panel.complementary_description}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/40 p-4 rounded-2xl border border-amber-200/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Limiting Amino Acid
                </span>
                <span className="text-xs font-extrabold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                  DIAAS Bottleneck
                </span>
              </div>
              {result.limiting_amino_acid ? (
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1 capitalize">
                    {result.limiting_amino_acid.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This essential amino acid shows the lowest relative RDA fulfillment in this recipe. Pairing with complementary protein foods resolves this limiting factor.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold py-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  All 9 Essential Amino Acids are comprehensively represented.
                </div>
              )}
            </div>
          </div>

          {/* 9 Essential Amino Acids Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              9 Essential Amino Acids (FAO/WHO Individual Daily Fulfillment)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(result.protein_quality_panel.amino_acid_coverages || {}).map(([key, data]) => {
                const label = eaaLabels[key] || key;
                const isLimiting = result.limiting_amino_acid === key;
                const pct = data.coverage_pct;
                const barWidth = Math.min(100, pct);

                return (
                  <div
                    key={key}
                    className={`p-3 rounded-xl border transition-all ${
                      isLimiting
                        ? 'border-amber-300 bg-amber-50/50 shadow-2xs'
                        : 'border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800 truncate" title={label}>
                        {label}
                      </span>
                      <span className={`text-[11px] font-extrabold ${isLimiting ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {pct}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLimiting ? 'bg-amber-500' : pct >= 50 ? 'bg-emerald-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Serving: {data.mg_in_serving}mg</span>
                      <span>Target: {data.daily_requirement_mg}mg</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. PANEL: NUTRIENT DENSITY & 19 POSITIVE FACTORS (PNS) */}
      {(activeTab === 'all' || activeTab === 'density') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 inline-block mb-0.5">
                  19 Essential Nutrients Saturation Scale
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Nutrient Density Panel (PNS: {result.positive_nutrient_score} / 100)
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAllNutrients(!showAllNutrients)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto"
            >
              {showAllNutrients ? 'Show Top Nutrients' : 'View All 19 Positive Factors'}
              {showAllNutrients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.nutrient_density_panel
              .slice(0, showAllNutrients ? result.nutrient_density_panel.length : 6)
              .map((item) => {
                const pct = item.requirement_fulfilled_pct;
                const barWidth = Math.min(100, pct);
                return (
                  <div key={item.nutrient_key} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <span className="text-xs font-extrabold text-teal-700">
                        {item.score_points} / 10 Pts
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        {item.amount_per_serving} {item.unit} ({pct}% RDA)
                      </span>
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 text-[10px]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 4. PANEL: CHRONIC DISEASE RISK LOAD (NRS) */}
      {(activeTab === 'all' || activeTab === 'risk') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold shadow-xs">
              <ShieldAlert className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 inline-block mb-0.5">
                7 Non-Communicable Disease Risk Factors
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Chronic Risk Penalty Load (NRS: {result.negative_risk_score} / 100)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.chronic_risk_panel.map((item) => {
              const pct = item.requirement_fulfilled_pct;
              const isExcessive = pct > 50.0 || (item.nutrient_key === 'trans_fat' && item.amount_per_serving > 0);
              const barWidth = Math.min(100, pct);

              return (
                <div
                  key={item.nutrient_key}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isExcessive
                      ? 'border-rose-300 bg-rose-50/60 shadow-2xs'
                      : 'border-slate-100 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    <span className={`text-xs font-extrabold ${isExcessive ? 'text-rose-700' : 'text-slate-700'}`}>
                      {item.score_points} / 10 Pts
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExcessive ? 'bg-rose-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      {item.amount_per_serving} {item.unit} ({pct}% Limit)
                    </span>
                    <span
                      className={`font-semibold px-1.5 py-0.2 rounded border text-[10px] ${
                        isExcessive
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. PANEL: TAILORED DEMOGRAPHIC GUIDANCE & SYNERGY */}
      {result.demographic_insights && result.demographic_insights.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Life-Stage Nutrition Guidance ({result.demographic_label})
              </h3>
              <p className="text-xs text-slate-600">
                Actionable culinary adjustments derived from ICMR-NIN 2024 recommendations.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {result.demographic_insights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-800 bg-white/90 p-3 rounded-xl border border-emerald-200/60"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed font-medium">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

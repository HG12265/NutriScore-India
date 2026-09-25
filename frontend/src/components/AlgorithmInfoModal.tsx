import React, { useState } from 'react';
import { X, BookOpen, Table, FileText, Sparkles, AlertCircle } from 'lucide-react';

interface AlgorithmInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmInfoModal: React.FC<AlgorithmInfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'official_fsa' | 'icmr_indian' | 'overview'>('official_fsa');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Nutritional Thresholds & Reference Tables</h2>
              <p className="text-xs text-slate-500">Official point-by-point scoring tables and cutoff benchmarks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 sticky top-[81px] z-10">
          <button
            onClick={() => setActiveTab('official_fsa')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
              activeTab === 'official_fsa'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            Standard Nutri-Score (Official France / FSA)
          </button>
          <button
            onClick={() => setActiveTab('icmr_indian')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
              activeTab === 'icmr_indian'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            ICMR 16-Nutrient Model (Indian RDA)
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x ${
              activeTab === 'overview'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            Research Background & Methodology
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          {/* ============================================================== */}
          {/* TAB 1: OFFICIAL NUTRI-SCORE (FSA) TABLE (MATCHES SCREENSHOT)   */}
          {/* ============================================================== */}
          {activeTab === 'official_fsa' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Official European Nutri-Score (FSA-NPS) Threshold Table
                  </h3>
                  <p className="text-xs text-slate-500">
                    Standard fixed threshold bands applied to solid foods per 100g.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  EU / France Solid Foods Model
                </span>
              </div>

              {/* 1. Negative points table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
                  Negative points (0–10 each):
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5 text-center w-16">Points</th>
                        <th className="p-2.5">Energy (kJ)</th>
                        <th className="p-2.5">Sat. Fat (g)</th>
                        <th className="p-2.5">Sugars (g)</th>
                        <th className="p-2.5">Sodium (mg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      {[
                        { pts: '0', kj: '≤335', sat: '≤1', sug: '≤4.5', na: '≤90' },
                        { pts: '1', kj: '≤670', sat: '≤2', sug: '≤9', na: '≤180' },
                        { pts: '2', kj: '≤1005', sat: '≤3', sug: '≤13.5', na: '≤270' },
                        { pts: '3', kj: '≤1340', sat: '≤4', sug: '≤18', na: '≤360' },
                        { pts: '4', kj: '≤1675', sat: '≤5', sug: '≤22.5', na: '≤450' },
                        { pts: '5', kj: '≤2010', sat: '≤6', sug: '≤27', na: '≤540' },
                        { pts: '6', kj: '≤2345', sat: '≤7', sug: '≤31', na: '≤630' },
                        { pts: '7', kj: '≤2680', sat: '≤8', sug: '≤36', na: '≤720' },
                        { pts: '8', kj: '≤3015', sat: '≤9', sug: '≤40', na: '≤810' },
                        { pts: '9', kj: '≤3350', sat: '≤10', sug: '≤45', na: '≤900' },
                        { pts: '10', kj: '>3350', sat: '>10', sug: '>45', na: '>900' },
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="p-2.5 text-center font-bold text-rose-600 bg-rose-50/40">{row.pts}</td>
                          <td className="p-2.5">{row.kj}</td>
                          <td className="p-2.5">{row.sat}</td>
                          <td className="p-2.5">{row.sug}</td>
                          <td className="p-2.5">{row.na}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Positive points table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                  Positive points (0–5 each):
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5 text-center w-16">Points</th>
                        <th className="p-2.5">Fibre (g, AOAC)</th>
                        <th className="p-2.5">Protein (g)</th>
                        <th className="p-2.5">Fruit/Veg/Legume (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      {[
                        { pts: '0', fib: '≤0.9', pro: '≤1.6', fvl: '≤40' },
                        { pts: '1', fib: '≤1.9', pro: '≤3.2', fvl: '≤60' },
                        { pts: '2', fib: '≤2.8', pro: '≤4.8', fvl: '≤80' },
                        { pts: '3', fib: '≤3.7', pro: '≤6.4', fvl: '—' },
                        { pts: '4', fib: '≤4.7', pro: '≤8.0', fvl: '—' },
                        { pts: '5', fib: '>4.7', pro: '>8.0', fvl: '>80' },
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/40">{row.pts}</td>
                          <td className="p-2.5">{row.fib}</td>
                          <td className="p-2.5">{row.pro}</td>
                          <td className="p-2.5">{row.fvl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Final Cutoffs */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Final grade cutoffs (Score = N − P):
                </span>
                <p className="font-mono text-xs sm:text-sm text-emerald-400">
                  A ≤ −1 &nbsp;·&nbsp; B 0–2 &nbsp;·&nbsp; C 3–10 &nbsp;·&nbsp; D 11–18 &nbsp;·&nbsp; E ≥ 19
                </p>
                <p className="text-[11px] text-slate-400">
                  <strong>Protein Rule:</strong> If total negative points N ≥ 11, protein points are excluded from P unless Fruit/Veg/Legume % is greater than 80%.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ICMR 16-NUTRIENT INDIAN MODEL TABLES                    */}
          {/* ============================================================== */}
          {activeTab === 'icmr_indian' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    ICMR-NIN 2020 Calibrated Indian Profiling Thresholds
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customized for Indian recipes using ICMR adult moderate-work RDA denominators.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Recommended Primary Model
                </span>
              </div>

              {/* Negative points table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
                  5 Negative Nutrients (0–10 points each, Max 50):
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2 text-center w-12">Pts</th>
                        <th className="p-2">Energy (kcal)</th>
                        <th className="p-2">Free Sugars (g)</th>
                        <th className="p-2">Sat. Fat (g)</th>
                        <th className="p-2">Sodium (mg)</th>
                        <th className="p-2">Cholesterol (mg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      {[
                        { pts: '0', kcal: '≤80', sug: '≤4.5', sat: '≤1.0', na: '≤90', cho: '≤10' },
                        { pts: '1', kcal: '≤160', sug: '≤9.0', sat: '≤2.0', na: '≤180', cho: '≤25' },
                        { pts: '2', kcal: '≤240', sug: '≤13.5', sat: '≤3.0', na: '≤270', cho: '≤50' },
                        { pts: '3', kcal: '≤320', sug: '≤18.0', sat: '≤4.0', na: '≤360', cho: '≤75' },
                        { pts: '4', kcal: '≤400', sug: '≤22.5', sat: '≤5.0', na: '≤450', cho: '≤100' },
                        { pts: '5', kcal: '≤480', sug: '≤27.0', sat: '≤6.0', na: '≤540', cho: '≤130' },
                        { pts: '6', kcal: '≤560', sug: '≤31.0', sat: '≤7.0', na: '≤630', cho: '≤165' },
                        { pts: '7', kcal: '≤640', sug: '≤36.0', sat: '≤8.0', na: '≤720', cho: '≤200' },
                        { pts: '8', kcal: '≤720', sug: '≤40.0', sat: '≤9.0', na: '≤810', cho: '≤240' },
                        { pts: '9', kcal: '≤800', sug: '≤45.0', sat: '≤10.0', na: '≤900', cho: '≤300' },
                        { pts: '10', kcal: '>800', sug: '>45.0', sat: '>10.0', na: '>900', cho: '>300' },
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="p-2 text-center font-bold text-rose-600 bg-rose-50/40">{row.pts}</td>
                          <td className="p-2">{row.kcal}</td>
                          <td className="p-2">{row.sug}</td>
                          <td className="p-2">{row.sat}</td>
                          <td className="p-2">{row.na}</td>
                          <td className="p-2">{row.cho}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Positive Macronutrients & Fatty Acids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    Macronutrients (0–10 pts each):
                  </h4>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5 font-mono">
                    <div><strong>Protein:</strong> 1.6g steps to 16.0g (&gt;16g = 10 pts)</div>
                    <div><strong>Dietary Fibre:</strong> 0.9g steps to 9.4g (&gt;9.4g = 10 pts)</div>
                    <div><strong>Complex Carbs:</strong> 5.0g steps to 50.0g (&gt;50g = 10 pts)</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    Healthy Fats (0–5 pts each):
                  </h4>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5 font-mono">
                    <div><strong>MUFA:</strong> &lt;2g: 0, 2-4g: 1, 4-6g: 2, 6-8g: 3, 8-10g: 4, ≥10g: 5</div>
                    <div><strong>PUFA:</strong> &lt;1g: 0, 1-2g: 1, 2-3g: 2, 3-4g: 3, 4-5g: 4, ≥5g: 5</div>
                  </div>
                </div>
              </div>

              {/* Micronutrients %DV Reference Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
                  Micronutrients (0–5 pts based on % ICMR RDA):
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2">Nutrient</th>
                        <th className="p-2">ICMR RDA Baseline</th>
                        <th className="p-2">5% (1 pt)</th>
                        <th className="p-2">15% (3 pts)</th>
                        <th className="p-2">≥25% (Max 5 pts)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      <tr><td className="p-2 font-bold">Iron</td><td className="p-2">19 mg</td><td className="p-2">0.95 mg</td><td className="p-2">2.85 mg</td><td className="p-2 font-bold text-emerald-600">≥4.75 mg</td></tr>
                      <tr><td className="p-2 font-bold">Calcium</td><td className="p-2">1000 mg</td><td className="p-2">50 mg</td><td className="p-2">150 mg</td><td className="p-2 font-bold text-emerald-600">≥250 mg</td></tr>
                      <tr><td className="p-2 font-bold">Vitamin A</td><td className="p-2">1000 mcg RAE</td><td className="p-2">50 mcg</td><td className="p-2">150 mcg</td><td className="p-2 font-bold text-emerald-600">≥250 mcg</td></tr>
                      <tr><td className="p-2 font-bold">Vitamin C</td><td className="p-2">80 mg</td><td className="p-2">4 mg</td><td className="p-2">12 mg</td><td className="p-2 font-bold text-emerald-600">≥20 mg</td></tr>
                      <tr><td className="p-2 font-bold">Vitamin D</td><td className="p-2">20 mcg</td><td className="p-2">1 mcg</td><td className="p-2">3 mcg</td><td className="p-2 font-bold text-emerald-600">≥5 mcg</td></tr>
                      <tr><td className="p-2 font-bold">Potassium</td><td className="p-2">3500 mg</td><td className="p-2">175 mg</td><td className="p-2">525 mg</td><td className="p-2 font-bold text-emerald-600">≥875 mg</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formula */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 font-mono text-xs text-indigo-900">
                Raw Score = N_total (0–50) − P_total (0–70) &nbsp;[Range: −70 to +50]<br />
                Health Score = 100 × (50 − Raw_Score) / 120 &nbsp;[Range: 0 to 100]<br />
                Grades: A ≥ 80 &nbsp;·&nbsp; B 65–79 &nbsp;·&nbsp; C 50–64 &nbsp;·&nbsp; D 35–49 &nbsp;·&nbsp; E &lt; 35
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: OVERVIEW & RESEARCH METHODOLOGY                         */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-5 text-xs text-slate-600 leading-relaxed">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Development and Validation of the Two-Step Profiling Algorithm
                </h3>
                <p className="mb-2">
                  This algorithm was developed and validated on <strong>1,014 unique recipes</strong> from the <strong>Anuvaad Indian Nutrient Databank (INDB 2024.11)</strong>.
                </p>
                <p>
                  While Europe's Nutri-Score uses a small set of nutrients, traditional Indian recipes feature high spice, pulse, and cereal diversity without industrial fortification. Calibrating with ICMR-NIN 2020 RDA benchmarks ensures a fair, culturally appropriate nutritional assessment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Key Findings from the 1,014 Indian Databank Recipes:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Mean Health Score:</strong> 45.1 / 100</li>
                  <li><strong>Grade A (0%):</strong> No home-cooked single recipe reached Grade A without synthetic fortification.</li>
                  <li><strong>Grade B (1.3%):</strong> Pulse-rich, sprouted, and vegetable-dense preparations (e.g. Moong Dal).</li>
                  <li><strong>Grade C (22.4%):</strong> Everyday balanced cereal-legume mixed meals (e.g. Khichdi, Sambar-rice).</li>
                  <li><strong>Grade D (72.2%):</strong> Majority of preparations due to tempering oil, salt, and refined grains.</li>
                  <li><strong>Grade E (4.1%):</strong> Deep-fried snacks (pakodas, samosas) and syrup-soaked sweets (jalebi).</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Source: FSA-NPS Nutrient Profiling & ICMR-NIN 2020 RDA
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors"
          >
            Close Tables
          </button>
        </div>
      </div>
    </div>
  );
};

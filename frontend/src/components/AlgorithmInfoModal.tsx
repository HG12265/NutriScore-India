import React, { useState } from 'react';
import { X, BookOpen, Table, ShieldCheck, Dna, HeartPulse, CheckCircle2 } from 'lucide-react';

interface AlgorithmInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmInfoModal: React.FC<AlgorithmInfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guidelines_2024' | 'rda_table' | 'ifct_protein'>('guidelines_2024');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  100% Indian Scientific Standard
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  ICMR - National Institute of Nutrition
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900">ICMR-NIN 2024 & IFCT 2017 Guidelines</h2>
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 sticky top-[81px] z-10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('guidelines_2024')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'guidelines_2024'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Dietary Guidelines for Indians (ICMR-NIN 2024)
          </button>
          <button
            onClick={() => setActiveTab('rda_table')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'rda_table'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Revised RDAs & Upper Limits (RDA 2024)
          </button>
          <button
            onClick={() => setActiveTab('ifct_protein')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ifct_protein'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            IFCT 2017 & Protein Complementarity
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB 1: ICMR-NIN 2024 DIETARY GUIDELINES */}
          {activeTab === 'guidelines_2024' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent p-5 rounded-2xl border border-emerald-200">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  17 Dietary Guidelines for Indians (ICMR-NIN 2024 Release)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Published by the National Institute of Nutrition (ICMR-NIN), Hyderabad. This framework directly sets the thresholds for NutriScore India calculations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">7</span>
                    <h4 className="text-sm font-bold text-rose-950">Limit Salt & Sodium (Guideline 7)</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Total salt intake must not exceed <strong className="text-rose-900">5g/day</strong> (less than <strong>2000 mg Sodium</strong>). Penalties escalate progressively for recipes exceeding 30% of this upper limit per portion.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">8</span>
                    <h4 className="text-sm font-bold text-rose-950">Consume Sugar Sparingly (Guideline 8)</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Added sugars must contribute <strong className="text-rose-900">less than 5%</strong> of daily energy intake (strictly capped at <strong>20–25g/day</strong>). Zero points are penalized for naturally occurring intrinsic fruit sugars.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black">9</span>
                    <h4 className="text-sm font-bold text-amber-950">Fats & Fatty Acid Balance (Guideline 9)</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Limit total visible fat to 20–30g/day. Keep saturated fats <strong className="text-amber-900">&lt; 8–10% of total calories</strong> and trans fats strictly <strong>zero (&lt; 1%)</strong>. Favor cold-pressed MUFA/PUFA oils (mustard, sesame, groundnut).
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">2</span>
                    <h4 className="text-sm font-bold text-emerald-950">Diet Diversity & Pulse Ratio (Guideline 2)</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Consume at least 400g of vegetables and whole pulses daily. To achieve complete amino acid synergy in cereal-dominant diets, ICMR mandates a <strong className="text-emerald-900">cereal-to-pulse ratio of 3:1 to 4:1</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">3</span>
                    <h4 className="text-sm font-bold text-emerald-950">Dietary Fibre & Satiety (Guideline 3)</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Ensure <strong className="text-emerald-900">30–40g of dietary fibre daily</strong> from whole grains, millets, legumes, and green vegetables for optimal metabolic health and insulin sensitivity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">10</span>
                    <h4 className="text-sm font-bold text-purple-950">Avoid Ultra-Processed Foods (Guideline 10)</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Heavily processed foods loaded with refined maida, high fructose syrup, artificial flavor enhancers, and sodium receive severe penalty weighting in the algorithm.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVISED RDA 2024 BENCHMARKS */}
          {activeTab === 'rda_table' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                <strong className="font-bold">ICMR-NIN 2024 Recommended Dietary Allowances (RDA) Table:</strong> The algorithm dynamically scales its 10-point saturation scores against the selected demographic group below:
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-3">Demographic Life Stage</th>
                      <th className="px-3 py-3">Ref Wt (kg)</th>
                      <th className="px-3 py-3">Energy (kcal)</th>
                      <th className="px-3 py-3">Protein (g)</th>
                      <th className="px-3 py-3">Fibre (g)</th>
                      <th className="px-3 py-3">Calcium (mg)</th>
                      <th className="px-3 py-3">Iron (mg)</th>
                      <th className="px-3 py-3">Zinc (mg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    <tr className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold">Adult Male (Moderate)</td>
                      <td className="px-3 py-2.5">65.0</td>
                      <td className="px-3 py-2.5">2110</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">54.0</td>
                      <td className="px-3 py-2.5">40.0</td>
                      <td className="px-3 py-2.5">1000</td>
                      <td className="px-3 py-2.5">19.0</td>
                      <td className="px-3 py-2.5">17.0</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-bold">Adult Female (Moderate)</td>
                      <td className="px-3 py-2.5">55.0</td>
                      <td className="px-3 py-2.5">1660</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">46.0</td>
                      <td className="px-3 py-2.5">30.0</td>
                      <td className="px-3 py-2.5">1000</td>
                      <td className="px-3 py-2.5 text-rose-700 font-bold">29.0</td>
                      <td className="px-3 py-2.5">13.2</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold">Pregnant Mother</td>
                      <td className="px-3 py-2.5">65.0</td>
                      <td className="px-3 py-2.5">2460</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">67.0</td>
                      <td className="px-3 py-2.5">35.0</td>
                      <td className="px-3 py-2.5">1000</td>
                      <td className="px-3 py-2.5 text-rose-700 font-bold">27.0</td>
                      <td className="px-3 py-2.5">14.5</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-bold">Lactating Mother</td>
                      <td className="px-3 py-2.5">60.0</td>
                      <td className="px-3 py-2.5">2600</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">63.0</td>
                      <td className="px-3 py-2.5">35.0</td>
                      <td className="px-3 py-2.5">1200</td>
                      <td className="px-3 py-2.5">23.0</td>
                      <td className="px-3 py-2.5">14.0</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold">Adolescent Female (14–18)</td>
                      <td className="px-3 py-2.5">52.0</td>
                      <td className="px-3 py-2.5">2060</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">46.0</td>
                      <td className="px-3 py-2.5">30.0</td>
                      <td className="px-3 py-2.5">1050</td>
                      <td className="px-3 py-2.5 text-rose-700 font-bold">32.0</td>
                      <td className="px-3 py-2.5">14.2</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-bold">Adolescent Male (14–18)</td>
                      <td className="px-3 py-2.5">60.0</td>
                      <td className="px-3 py-2.5">2860</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">55.0</td>
                      <td className="px-3 py-2.5">35.0</td>
                      <td className="px-3 py-2.5">1050</td>
                      <td className="px-3 py-2.5">22.0</td>
                      <td className="px-3 py-2.5">17.6</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold">Older Child (9–13y)</td>
                      <td className="px-3 py-2.5">36.0</td>
                      <td className="px-3 py-2.5">1950</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">34.0</td>
                      <td className="px-3 py-2.5">26.0</td>
                      <td className="px-3 py-2.5">850</td>
                      <td className="px-3 py-2.5">16.0</td>
                      <td className="px-3 py-2.5">11.0</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-bold">Toddler (1–3y)</td>
                      <td className="px-3 py-2.5">12.9</td>
                      <td className="px-3 py-2.5">1010</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">12.5</td>
                      <td className="px-3 py-2.5">15.0</td>
                      <td className="px-3 py-2.5">500</td>
                      <td className="px-3 py-2.5">8.0</td>
                      <td className="px-3 py-2.5">4.0</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-3.5 py-2.5 font-bold">Senior Citizen (&gt;60y)</td>
                      <td className="px-3 py-2.5">60.0</td>
                      <td className="px-3 py-2.5">1700</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">52.0</td>
                      <td className="px-3 py-2.5">30.0</td>
                      <td className="px-3 py-2.5">1000</td>
                      <td className="px-3 py-2.5">19.0</td>
                      <td className="px-3 py-2.5">14.0</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-bold">Active Athlete</td>
                      <td className="px-3 py-2.5">70.0</td>
                      <td className="px-3 py-2.5">2900</td>
                      <td className="px-3 py-2.5 text-emerald-700 font-bold">85.0</td>
                      <td className="px-3 py-2.5">35.0</td>
                      <td className="px-3 py-2.5">1300</td>
                      <td className="px-3 py-2.5">25.0</td>
                      <td className="px-3 py-2.5">20.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: IFCT 2017 & PROTEIN QUALITY */}
          {activeTab === 'ifct_protein' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  IFCT 2017 & Indian Protein Complementarity Synergy
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Indian Food Composition Tables (IFCT 2017) demonstrate that individual cereal grains (rice, wheat) are limited in Lysine, while pulses (chana, moong, toor) are limited in sulfur amino acids (Methionine). When paired, their net Biological Value and DIAAS score increase dramatically.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Cereal + Pulse (e.g. Khichdi, Idli Sambar, Dal Chawal)</h5>
                    <p className="text-[11px] text-slate-500">Pulse supplies abundant Lysine; cereal supplies Methionine.</p>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Synergy: 8 / 10 Pts
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Pulse + Dairy (e.g. Palak Paneer with Dal, Curd with Lentils)</h5>
                    <p className="text-[11px] text-slate-500">High biological value casein + whey elevates total branched-chain amino acids.</p>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Synergy: 9 / 10 Pts
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Soybean + Cereal (e.g. Soya Chunk Pulao, Tofu with Millets)</h5>
                    <p className="text-[11px] text-slate-500">High PDCAAS/DIAAS plant isolate approaching complete biological value.</p>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Synergy: 9 / 10 Pts
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Single Unbalanced Grain alone (e.g. Plain White Rice, Maida)</h5>
                    <p className="text-[11px] text-slate-500">Incomplete protein severely compromised by extreme Lysine deficit.</p>
                  </div>
                  <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                    Synergy: 2 / 10 Pts
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 px-6 flex items-center justify-between rounded-b-3xl">
          <span className="text-[11px] text-slate-500">
            Source: ICMR-NIN Dietary Guidelines 2024, IFCT 2017 & Revised RDA 2024
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FoodAnalysisResponse } from '../types/nutrition';
import { BarChart3 } from 'lucide-react';

interface VisualizationsProps {
  result: FoodAnalysisResponse;
}

export const Visualizations: React.FC<VisualizationsProps> = ({ result }) => {
  const { nutrient_analysis } = result;

  // Prepare Negative chart data
  const negData = nutrient_analysis.negative_contributors.map((n) => ({
    name: n.label.replace(' Density', '').replace('Free ', ''),
    points: n.points_awarded,
    max: n.max_possible_points,
  }));

  // Prepare Positive chart data
  const posData = nutrient_analysis.positive_contributors.slice(0, 6).map((n) => ({
    name: n.label.replace('Dietary ', '').replace('Complex ', ''),
    points: n.points_awarded,
    max: n.max_possible_points,
  }));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Nutritional Visual Profile</h3>
          <p className="text-xs text-slate-500">
            Graphical inspection of penalty concentrations versus beneficial nutrient contributions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Negative Chart */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/70">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Penalties Incurred (0–10 Scale)
            </h4>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Lower is healthier
            </span>
          </div>

          <div className="h-60 sm:h-64 w-full">
            {negData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={negData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(val: any) => [`${val} pts penalty`, 'Penalty Points']}
                  />
                  <Bar dataKey="points" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Zero negative penalties recorded.
              </div>
            )}
          </div>
        </div>

        {/* Positive Chart */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/70">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Beneficial Nutrients Awarded
            </h4>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Higher is healthier
            </span>
          </div>

          <div className="h-60 sm:h-64 w-full">
            {posData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={posData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(val: any) => [`${val} pts awarded`, 'Reward Points']}
                  />
                  <Bar dataKey="points" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No positive nutrients awarded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

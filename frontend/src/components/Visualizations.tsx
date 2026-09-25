import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
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
    name: n.label,
    points: n.points_awarded,
    max: n.max_possible_points,
  }));

  // Prepare Positive chart data
  const posData = nutrient_analysis.positive_contributors.slice(0, 8).map((n) => ({
    name: n.label,
    points: n.points_awarded,
    max: n.max_possible_points,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-2.5 pb-4 mb-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Nutritional Visual Profile</h3>
          <p className="text-xs text-slate-500">
            Graphical inspection of penalty concentrations versus beneficial nutrient awards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Negative Chart */}
        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-4">
            Penalties Incurred (Points: 0 to 10)
          </h4>
          <div className="h-64 w-full">
            {negData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={negData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} pts penalty`, 'Points']}
                  />
                  <Bar dataKey="points" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No negative penalties recorded.
              </div>
            )}
          </div>
        </div>

        {/* Positive Chart */}
        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-4">
            Beneficial Nutrients Awarded (Points)
          </h4>
          <div className="h-64 w-full">
            {posData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={posData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} pts awarded`, 'Points']}
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

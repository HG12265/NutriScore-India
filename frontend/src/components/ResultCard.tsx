import React from 'react';
import { Award, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import { FoodAnalysisResponse } from '../types/nutrition';

interface ResultCardProps {
  result: FoodAnalysisResponse;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { score, food_name, food_category, serving_size, serving_unit, algorithm_info, timestamp } = result;

  const grades: Array<{ key: 'A' | 'B' | 'C' | 'D' | 'E'; label: string; color: string }> = [
    { key: 'A', label: 'A', color: '#1b8a43' },
    { key: 'B', label: 'B', color: '#85bb2f' },
    { key: 'C', label: 'C', color: '#fecb02' },
    { key: 'D', label: 'D', color: '#ee8100' },
    { key: 'E', label: 'E', color: '#e63e11' },
  ];

  const formattedDate = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md mb-8 overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {algorithm_info.title}
            </span>
            {food_category && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {food_category}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{food_name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyzed for <span className="font-semibold text-slate-700">{serving_size} {serving_unit}</span> reference portion
          </p>
        </div>

        {formattedDate && (
          <div className="flex items-center text-xs text-slate-400 gap-1.5 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Calculated at {formattedDate}</span>
          </div>
        )}
      </div>

      {/* Main Score & Grade Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Numeric Health Score (0 - 100) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Nutritional Health Score
          </span>
          <div className="relative flex items-center justify-center my-2">
            <div
              className="text-6xl sm:text-7xl font-black tracking-tight"
              style={{ color: score.grade_color }}
            >
              {Math.round(score.health_score)}
            </div>
            <span className="text-xl font-bold text-slate-400 self-end mb-2 ml-1">/ 100</span>
          </div>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-2 shadow-2xs"
            style={{
              backgroundColor: `${score.grade_color}18`,
              color: score.grade_color,
              border: `1px solid ${score.grade_color}40`,
            }}
          >
            {score.grade_label}
          </span>
          <p className="text-xs text-slate-500 mt-3 max-w-xs leading-relaxed">
            {score.grade_description}
          </p>
        </div>

        {/* 5-Level Nutri-Score Grade Badges (A - E) */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Nutri-Score Rating Scale
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Grade: <strong className="text-slate-900 font-bold">{score.grade}</strong>
              </span>
            </div>

            {/* Official 5-Color Grade Bar */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5">
              {grades.map((g) => {
                const isActive = g.key === score.grade;
                return (
                  <div
                    key={g.key}
                    className={`flex-1 flex flex-col items-center justify-center py-3.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'scale-105 shadow-md ring-3 ring-offset-2 ring-slate-800'
                        : 'opacity-40 hover:opacity-75'
                    }`}
                    style={{ backgroundColor: g.color }}
                  >
                    <span
                      className={`font-black text-xl sm:text-2xl ${
                        g.key === 'C' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {g.label}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-0.5">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Negative Penalty</span>
                <span className="text-sm font-bold text-slate-800">
                  {score.negative_penalty} <span className="text-xs font-normal text-slate-500">/ {score.negative_max}</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ArrowUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Positive Reward</span>
                <span className="text-sm font-bold text-slate-800">
                  {score.positive_score} <span className="text-xs font-normal text-slate-500">/ {score.positive_max}</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Raw Score (N - P)</span>
                <span className="text-sm font-bold text-slate-800">{score.raw_score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

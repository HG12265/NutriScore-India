import React from 'react';
import { Award, Clock, ArrowDown, ArrowUp, Sparkles, CheckCircle2 } from 'lucide-react';
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

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  // Circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const healthScore = Math.max(0, Math.min(100, Math.round(score.health_score)));
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-md mb-8 overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {algorithm_info.title}
            </span>
            {food_category && (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {food_category}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{food_name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated per <strong className="text-slate-800">{serving_size} {serving_unit}</strong> serving portion
          </p>
        </div>

        {formattedDate && (
          <div className="flex items-center text-[11px] text-slate-500 gap-1.5 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Calculated at {formattedDate}</span>
          </div>
        )}
      </div>

      {/* Main Score & Grade Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Circular Health Score Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100/60 border border-slate-200 text-center relative">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">
            Nutritional Health Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              {/* Background Ring */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-slate-200/80 stroke-current"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={score.grade_color}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Score Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {healthScore}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 -mt-1">
                out of 100
              </span>
            </div>
          </div>

          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mt-4 shadow-2xs"
            style={{
              backgroundColor: `${score.grade_color}18`,
              color: score.grade_color,
              border: `1.5px solid ${score.grade_color}50`,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{score.grade_label}</span>
          </span>

          <p className="text-xs text-slate-500 mt-2.5 max-w-xs leading-relaxed font-medium">
            {score.grade_description}
          </p>
        </div>

        {/* Right: Official Nutri-Score Grade Display */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Official Nutri-Score Rating
              </span>
              <span className="text-xs font-bold text-slate-700">
                Assigned Grade: <strong className="text-slate-900 text-sm font-black">{score.grade}</strong>
              </span>
            </div>

            {/* Official 5-Color Grade Bar */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 p-2 bg-slate-100/70 rounded-2xl border border-slate-200/80">
              {grades.map((g) => {
                const isActive = g.key === score.grade;
                return (
                  <div
                    key={g.key}
                    className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-300 relative ${
                      isActive
                        ? 'scale-105 shadow-md ring-3 ring-slate-900 ring-offset-2 z-10'
                        : 'opacity-40 hover:opacity-75'
                    }`}
                    style={{ backgroundColor: g.color }}
                  >
                    <span
                      className={`font-black text-2xl sm:text-3xl leading-none ${
                        g.key === 'C' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {g.label}
                    </span>
                    {isActive && (
                      <span className="text-[9px] font-black text-white uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded bg-black/25">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Breakdown Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Penalties</span>
                <span className="text-sm font-black text-slate-800">
                  {score.negative_penalty} <span className="text-[11px] font-normal text-slate-400">/ {score.negative_max}</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ArrowUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Rewards</span>
                <span className="text-sm font-black text-slate-800">
                  {score.positive_score} <span className="text-[11px] font-normal text-slate-400">/ {score.positive_max}</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Raw Score</span>
                <span className="text-sm font-black text-slate-800">{score.raw_score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

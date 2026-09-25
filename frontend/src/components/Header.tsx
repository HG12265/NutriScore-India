import React from 'react';
import { Apple, Table, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenInfo: () => void;
  hasResult?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenInfo, hasResult }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/25 text-white shrink-0">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                NutriScore<span className="text-emerald-600 font-black">AI</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ICMR 2020
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Indian Recipe Nutritional Profiling Engine
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={onOpenInfo}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200/90 active:scale-95 transition-all border border-slate-200"
            title="Algorithm and Threshold Documentation"
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Reference Tables</span>
            <span className="sm:hidden">Tables</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200"
            title="Reset All Inputs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};

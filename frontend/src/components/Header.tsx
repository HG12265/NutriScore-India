import React from 'react';
import { BookOpen, RotateCcw, Github, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenInfo: () => void;
  hasResult?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenInfo, hasResult }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      {/* Sleek top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 min-w-0">
          {/* Logo Mark */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-sm shadow-emerald-600/25 ring-1 ring-white/30 text-white shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>

          {/* Brand Titles */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="text-[15px] sm:text-lg font-black tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                Nutri<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Score</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300/50 leading-none shrink-0">
                AI
              </span>
              
              {/* ICMR RDA Badge */}
              <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>ICMR 2020</span>
              </span>
            </div>

            <p className="text-[10px] text-slate-500 hidden md:block font-medium tracking-normal leading-none mt-0.5 truncate">
              Indian Food Nutrient Profiling Engine • INDB & ICMR-NIN RDA
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Standards & Reference Tables Button */}
          <button
            type="button"
            onClick={onOpenInfo}
            className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 shadow-2xs active:scale-95 transition-all whitespace-nowrap"
            title="Algorithm Thresholds and Reference Tables"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Standards & RDA</span>
            <span className="sm:hidden text-[11px]">Standards</span>
          </button>

          {/* GitHub Source Link (visible on tablet/desktop) */}
          <a
            href="https://github.com/HG12265/NutriScore-India"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs active:scale-95 transition-all shrink-0"
            title="View Open Source Repository on GitHub"
          >
            <Github className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="hidden md:inline">GitHub</span>
          </a>

          {/* Reset Action */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 shadow-2xs active:scale-95 transition-all shrink-0"
            title="Reset Form Inputs"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};


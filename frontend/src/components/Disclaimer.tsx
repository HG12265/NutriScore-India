import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-4 py-2 rounded-full mb-3">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Scientific Profiling Prototype & Educational Tool</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>Disclaimer:</strong> This tool provides an algorithmic nutritional estimate based on entered values and ICMR-NIN 2024 dietary reference guidelines. It is designed for recipe evaluation and nutrient profiling research, not for clinical medical diagnosis or personalized healthcare advice.
        </p>
        <p className="text-[11px] text-slate-400 mt-2">
          NutriScore AI &bull; Based on research with the Indian Food Composition Tables (IFCT 2017) & ICMR-NIN 2024 RDA.
        </p>
      </div>
    </footer>
  );
};

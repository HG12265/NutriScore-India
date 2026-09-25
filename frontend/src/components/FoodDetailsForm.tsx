import React from 'react';
import { Utensils, Scale, Tag, FileText } from 'lucide-react';
import { FoodFormData } from '../types/nutrition';

interface FoodDetailsFormProps {
  formData: FoodFormData;
  onChange: (field: keyof FoodFormData, value: any) => void;
  errors: Record<string, string>;
}

export const FoodDetailsForm: React.FC<FoodDetailsFormProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const categories = [
    'Pulses & Legumes',
    'Cereals & Millets',
    'Vegetables & Leafy Greens',
    'Dairy & Cottage Cheese',
    'Traditional Snacks & Savouries',
    'Traditional Sweets & Desserts',
    'Meat, Poultry & Fish',
    'Mixed Indian Dishes',
    'Beverages & Soups',
    'Condiments & Chutneys',
    'Other Prepared Dishes',
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs mb-8">
      <div className="flex items-center space-x-2 pb-4 mb-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
          <Utensils className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Food & Recipe Identification</h2>
          <p className="text-xs text-slate-500">Provide basic recipe identification and reference serving quantity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Food Name */}
        <div className="lg:col-span-2">
          <label htmlFor="food_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Food / Recipe Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="food_name"
              type="text"
              required
              value={formData.food_name}
              onChange={(e) => onChange('food_name', e.target.value)}
              placeholder="e.g. Moong Dal Tadka, Palak Paneer, Upma"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.food_name
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
            />
          </div>
          {errors.food_name && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.food_name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="food_category" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Category</span>
          </label>
          <select
            id="food_category"
            value={formData.food_category}
            onChange={(e) => onChange('food_category', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800"
          >
            <option value="">Select Category (Optional)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Serving Size & Unit */}
        <div>
          <label htmlFor="serving_size" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>Serving Portion <span className="text-rose-500">*</span></span>
          </label>
          <div className="flex rounded-xl shadow-2xs">
            <input
              id="serving_size"
              type="number"
              min="0.1"
              step="any"
              required
              value={formData.serving_size}
              onChange={(e) => onChange('serving_size', e.target.value === '' ? '' : Number(e.target.value))}
              className={`w-2/3 px-3 py-2.5 rounded-l-xl text-sm border bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.serving_size
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
            />
            <select
              aria-label="Serving Unit"
              value={formData.serving_unit}
              onChange={(e) => onChange('serving_unit', e.target.value)}
              className="w-1/3 px-2 py-2.5 rounded-r-xl text-xs font-medium border-y border-r border-slate-300 bg-slate-50 text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="g">grams (g)</option>
              <option value="ml">ml</option>
              <option value="katori">katori</option>
              <option value="bowl">bowl</option>
              <option value="piece">piece</option>
            </select>
          </div>
          {errors.serving_size && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.serving_size}</p>
          )}
        </div>
      </div>

      {/* Optional Recipe Notes */}
      <div className="mt-4">
        <label htmlFor="recipe_description" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Recipe Notes or Primary Ingredients (Optional)</span>
        </label>
        <input
          id="recipe_description"
          type="text"
          value={formData.recipe_description}
          onChange={(e) => onChange('recipe_description', e.target.value)}
          placeholder="e.g. Split yellow mung dal, tomatoes, cumin, turmeric, minimal ghee tempering"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-700"
        />
      </div>
    </div>
  );
};

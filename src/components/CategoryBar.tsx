import React from 'react';
import { Hammer, Wheat, Shirt, Coffee, Zap, Home, LayoutGrid } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface CategoryBarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  currentLang: Language;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  currentLang,
}) => {
  const t = getTranslation(currentLang);

  const categories = [
    {
      id: null,
      name: t.allCategories,
      icon: LayoutGrid,
      color: 'from-neutral-700 to-neutral-900',
    },
    {
      id: 'artisanat',
      name: t.categoriesList.artisanat,
      icon: Hammer,
      color: 'from-amber-600 to-amber-800',
    },
    {
      id: 'agriculture',
      name: t.categoriesList.agriculture,
      icon: Wheat,
      color: 'from-emerald-600 to-emerald-800',
    },
    {
      id: 'alimentation',
      name: t.categoriesList.alimentation,
      icon: Coffee,
      color: 'from-orange-600 to-orange-800',
    },
    {
      id: 'mode',
      name: t.categoriesList.mode,
      icon: Shirt,
      color: 'from-purple-600 to-purple-800',
    },
    {
      id: 'electronique',
      name: t.categoriesList.electronique,
      icon: Zap,
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'maison',
      name: t.categoriesList.maison,
      icon: Home,
      color: 'from-teal-600 to-teal-800',
    },
  ];

  return (
    <div className="w-full bg-white border-b border-neutral-200 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id || 'all'}
                id={`cat-${cat.id || 'all'}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-orange-500 text-white' : 'bg-white text-neutral-800 shadow-2xs border border-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

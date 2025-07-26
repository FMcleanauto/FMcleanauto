import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showClear?: boolean;
  onClear?: () => void;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  showFilters?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher par référence, désignation...",
  showClear = true,
  onClear,
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  showFilters = false
}: SearchBarProps) {
  return (
    <div className="sticky top-12 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 p-3 sm:p-4 safe-area-top">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-sm sm:text-base touch-manipulation"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {showClear && value && (
            <button
              onClick={onClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation p-1"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {showFilters && categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-xs sm:text-sm touch-manipulation"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
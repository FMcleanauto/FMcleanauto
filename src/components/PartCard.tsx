import React, { useState } from 'react';
import { Copy, Check, Eye, Tag, Euro } from 'lucide-react';
import { Part } from '../types/Part';

interface PartCardProps {
  part: Part;
  selected: boolean;
  onToggleSelect: (ref: string) => void;
  onImageClick: (imageUrl: string) => void;
  searchTerm?: string;
}

export default function PartCard({ 
  part, 
  selected, 
  onToggleSelect, 
  onImageClick,
  searchTerm = '' 
}: PartCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const highlightText = (text: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 overflow-hidden border-2 ${
      selected ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:border-gray-200'
    } touch-manipulation`}>
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(part.ref)}
          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer touch-manipulation"
        />
      </div>

      {/* Card Content */}
      <div className="p-3 pt-10 sm:p-4 sm:pt-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-tight">
              {highlightText(part.ref)}
            </h3>
            
            {/* Meta Information */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              {part.category && (
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {part.category}
                </span>
              )}
              {part.price && (
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  <Euro className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {part.price}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => handleCopy(part.ref)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
            title="Copier la référence"
          >
            {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copié!' : 'Copier'}</span>
          </button>
        </div>

        {/* Image */}
        {part.image && (
          <div className="relative mb-3 sm:mb-4 group">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden touch-manipulation">
              <img
                src={part.image}
                alt={`Pièce ${part.ref}`}
                className="w-full h-full object-contain group-hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer"
                onClick={() => onImageClick(part.image!)}
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
            <button
              onClick={() => onImageClick(part.image!)}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
              title="Voir l'image"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
            </button>
          </div>
        )}

        {/* Descriptions */}
        <div className="space-y-2 sm:space-y-3">
          <div>
            <span className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">FR:</span>
            <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
              {part.fr ? highlightText(part.fr) : 'N/A'}
            </p>
          </div>
          <div>
            <span className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">EN:</span>
            <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
              {part.en ? highlightText(part.en) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
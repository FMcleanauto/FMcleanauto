import React from 'react';
import { Download, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  selectedCount: number;
  totalCount: number;
  onExport: () => void;
  onToggleFilters: () => void;
  isExporting: boolean;
}

export default function Header({ 
  selectedCount, 
  totalCount, 
  onExport, 
  onToggleFilters,
  isExporting 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 safe-area-top">
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">FM</span>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-gray-900 leading-tight">Catalogue FM AUTO</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {totalCount} pièces • {selectedCount} sélectionnées
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFilters}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              title="Filtres"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {selectedCount > 0 && (
              <button
                onClick={onExport}
                disabled={isExporting}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation text-sm sm:text-base"
                title={`Exporter ${selectedCount} pièce(s)`}
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{isExporting ? 'Export...' : 'Exporter'}</span>
                <span className="sm:hidden">{selectedCount}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
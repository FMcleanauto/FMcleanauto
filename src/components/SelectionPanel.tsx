import React from 'react';
import { CheckSquare, Square, Download, X, Trash2 } from 'lucide-react';

interface SelectionPanelProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onExport: () => void;
  onClearSelection: () => void;
  isExporting: boolean;
}

export default function SelectionPanel({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onExport,
  onClearSelection,
  isExporting
}: SelectionPanelProps) {
  if (selectedCount === 0) return null;

  const allSelected = selectedCount === totalCount;

  return (
    <div className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-3 sm:p-4 z-40 safe-area-bottom">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
            >
              {allSelected ? <Square className="w-3 h-3 sm:w-4 sm:h-4" /> : <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="hidden sm:inline">{allSelected ? 'Désélectionner tout' : 'Tout sélectionner'}</span>
              <span className="sm:hidden">{allSelected ? 'Tout' : 'Sél.'}</span>
            </button>
          </div>
          
          <div className="text-xs sm:text-sm text-gray-600 font-medium truncate">
            {selectedCount} / {totalCount} pièces sélectionnées
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            title="Vider la sélection"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Vider</span>
          </button>

          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm touch-manipulation"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isExporting ? 'Export...' : `Exporter (${selectedCount})`}</span>
            <span className="sm:hidden">{isExporting ? '...' : selectedCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
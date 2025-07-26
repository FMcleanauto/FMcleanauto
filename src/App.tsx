import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PartCard from './components/PartCard';
import ImageModal from './components/ImageModal';
import StatusMessage from './components/StatusMessage';
import SelectionPanel from './components/SelectionPanel';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import { Part, PartWithSelection } from './types/Part';
import { useLocalStorage } from './hooks/useLocalStorage';
import { readExcelFile, exportToExcel, loadExcelFromUrl } from './utils/excelUtils';
import { searchParts, getCategories } from './utils/searchUtils';

export default function App() {
  // States
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedParts, setSelectedParts] = useLocalStorage<string[]>('selectedParts', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: '', partRef: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as const });
  const [statusMessage, setStatusMessage] = useState({ type: 'info' as const, message: 'Chargez un fichier Excel pour commencer', count: 0 });

  // Computed values
  const categories = useMemo(() => getCategories(parts), [parts]);
  const filteredParts = useMemo(() => searchParts(parts, searchTerm, selectedCategory), [parts, searchTerm, selectedCategory]);
  const partsWithSelection: PartWithSelection[] = useMemo(() => 
    filteredParts.map(part => ({
      ...part,
      selected: selectedParts.includes(part.ref)
    })), [filteredParts, selectedParts]
  );

  // Effects
  useEffect(() => {
    // Try to load default Excel file on startup
    loadDefaultData();
  }, []);

  useEffect(() => {
    if (parts.length > 0) {
      if (filteredParts.length === 0 && (searchTerm || selectedCategory)) {
        setStatusMessage({
          type: 'error',
          message: 'Aucun résultat trouvé pour votre recherche',
          count: 0
        });
      } else if (searchTerm || selectedCategory) {
        setStatusMessage({
          type: 'success',
          message: `Résultats de recherche`,
          count: filteredParts.length
        });
      } else {
        setStatusMessage({
          type: 'info',
          message: 'Catalogue chargé avec succès',
          count: parts.length
        });
      }
    }
  }, [parts.length, filteredParts.length, searchTerm, selectedCategory]);

  // Handlers
  const loadDefaultData = async () => {
    setLoading(true);
    try {
      const data = await loadExcelFromUrl('/A1.xlsx');
      setParts(data);
      showToast('Catalogue chargé avec succès!', 'success');
    } catch (error) {
      console.error('Error loading default data:', error);
      setStatusMessage({
        type: 'error',
        message: 'Impossible de charger le fichier par défaut. Veuillez charger un fichier Excel.',
        count: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await readExcelFile(file);
      setParts(data);
      setSelectedParts([]);
      showToast(`${data.length} pièces chargées avec succès!`, 'success');
    } catch (error) {
      console.error('Error loading file:', error);
      showToast('Erreur lors du chargement du fichier', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = useCallback((ref: string) => {
    setSelectedParts(prev => 
      prev.includes(ref) 
        ? prev.filter(r => r !== ref)
        : [...prev, ref]
    );
  }, [setSelectedParts]);

  const handleSelectAll = () => {
    setSelectedParts(filteredParts.map(part => part.ref));
    showToast(`${filteredParts.length} pièces sélectionnées`, 'success');
  };

  const handleDeselectAll = () => {
    setSelectedParts([]);
    showToast('Sélection effacée', 'info');
  };

  const handleExport = async () => {
    if (selectedParts.length === 0) return;

    setIsExporting(true);
    try {
      const selectedPartsData = parts.filter(part => selectedParts.includes(part.ref));
      exportToExcel(selectedPartsData, 'pieces_selectionnees_fm_auto');
      showToast(`${selectedParts.length} pièces exportées avec succès!`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Erreur lors de l\'export', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImageClick = (imageUrl: string, partRef?: string) => {
    setImageModal({ isOpen: true, imageUrl, partRef: partRef || '' });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50 touch-manipulation">
      {/* Background Logo */}
      <div 
        className="fixed inset-0 opacity-3 sm:opacity-5 bg-no-repeat bg-center pointer-events-none"
        style={{
          backgroundImage: 'url("/LOGO FM CLEAN AUTO.png")',
          backgroundSize: '50% sm:30%'
        }}
      />

      <Header
        selectedCount={selectedParts.length}
        totalCount={parts.length}
        onExport={handleExport}
        onToggleFilters={() => setShowFilters(!showFilters)}
        isExporting={isExporting}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={handleClearSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showFilters={showFilters}
      />

      <main className="pb-20 sm:pb-24">
        {/* File Upload */}
        {parts.length === 0 && !loading && (
          <div className="p-3 sm:p-4">
            <div className="bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 p-6 sm:p-8 text-center hover:border-blue-500 transition-colors touch-manipulation">
              <FileSpreadsheet className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Chargez votre catalogue Excel
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Sélectionnez un fichier .xlsx contenant vos pièces automobiles
              </p>
              <label className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors touch-manipulation text-sm sm:text-base">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                Choisir un fichier
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="p-6 sm:p-8">
            <LoadingSpinner size="lg" message="Chargement du catalogue..." />
          </div>
        )}

        {/* Status Message */}
        {!loading && parts.length > 0 && (
          <div className="p-3 sm:p-4">
            <StatusMessage
              type={statusMessage.type}
              message={statusMessage.message}
              count={statusMessage.count}
            />
          </div>
        )}

        {/* Parts Grid */}
        {!loading && filteredParts.length > 0 && (
          <div className="px-3 sm:px-4">
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partsWithSelection.map((part) => (
                <PartCard
                  key={part.ref}
                  part={part}
                  selected={part.selected}
                  onToggleSelect={handleToggleSelect}
                  onImageClick={(imageUrl) => handleImageClick(imageUrl, part.ref)}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && parts.length > 0 && filteredParts.length === 0 && (searchTerm || selectedCategory) && (
          <div className="p-6 sm:p-8 text-center">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Essayez avec d'autres termes de recherche
            </p>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation text-sm sm:text-base"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </main>

      {/* Selection Panel */}
      <SelectionPanel
        selectedCount={selectedParts.length}
        totalCount={filteredParts.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onExport={handleExport}
        onClearSelection={handleDeselectAll}
        isExporting={isExporting}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        imageUrl={imageModal.imageUrl}
        partRef={imageModal.partRef}
        onClose={() => setImageModal({ isOpen: false, imageUrl: '', partRef: '' })}
      />

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2 text-center text-xs sm:text-sm text-gray-600 safe-area-bottom">
        FM AUTO © {new Date().getFullYear()} - Tous droits réservés
      </footer>
    </div>
  );
}
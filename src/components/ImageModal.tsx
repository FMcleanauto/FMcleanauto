import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  partRef?: string;
}

export default function ImageModal({ isOpen, imageUrl, onClose, partRef }: ImageModalProps) {
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScale(1);
      setRotation(0);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${partRef || 'image'}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center safe-area-inset">
      {/* Controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 z-10">
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1.5 sm:p-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-white text-xs sm:text-sm px-1 sm:px-2 min-w-8 sm:min-w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <button
          onClick={handleRotate}
          className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
          title="Rotation"
        >
          <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <button
          onClick={handleDownload}
          className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
          title="Télécharger"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <button
          onClick={onClose}
          className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
          title="Fermer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Image */}
      <div 
        className="relative max-w-[95vw] max-h-[90vh] sm:max-h-[95vh] cursor-move touch-manipulation"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={partRef ? `Pièce ${partRef}` : 'Image'}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-200 touch-manipulation"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
          draggable={false}
        />
      </div>

      {/* Backdrop */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />

      {/* Part Reference */}
      {partRef && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/10 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
            Pièce: {partRef}
          </div>
        </div>
      )}
    </div>
  );
}
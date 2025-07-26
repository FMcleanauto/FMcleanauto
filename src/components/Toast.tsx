import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Toast({ 
  message, 
  type, 
  show, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <X className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg ${getColorClasses()}`}>
        {getIcon()}
        <span className="font-medium text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
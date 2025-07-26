import React from 'react';
import { CheckCircle, AlertCircle, Info, Loader } from 'lucide-react';

interface StatusMessageProps {
  type: 'loading' | 'success' | 'error' | 'info';
  message: string;
  count?: number;
  className?: string;
}

export default function StatusMessage({ type, message, count, className = '' }: StatusMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getColorClasses()} ${className}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {count !== undefined && (
            <p className="text-sm mt-1 opacity-80">
              {count} élément{count !== 1 ? 's' : ''} trouvé{count !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
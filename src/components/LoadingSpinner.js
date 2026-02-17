import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <RefreshCw 
        size={size === 'small' ? 16 : size === 'medium' ? 32 : size === 'large' ? 48 : 64}
        className={`${sizeClasses[size]} text-blue-600 animate-spin mb-2`}
      />
      {showText && (
        <span className={`${textSizes[size]} text-gray-600`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;

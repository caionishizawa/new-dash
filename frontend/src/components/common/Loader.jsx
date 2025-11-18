import React from 'react';
import { LABELS } from '../../utils/constants';

const Loader = ({ message = LABELS.loading, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`loading-spinner ${sizeClasses[size]}`} />
      {message && (
        <p className="text-text-secondary text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default Loader;

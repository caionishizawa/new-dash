import React from 'react';
import { CRYPTO_COLORS } from '../../utils/constants';

const CryptoIcon = ({ asset, size = 'md', showLabel = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  const color = CRYPTO_COLORS[asset] || '#6B7280';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-sm`}
        style={{ backgroundColor: color }}
      >
        {asset.substring(0, 3)}
      </div>
      {showLabel && (
        <span className="font-semibold text-text-primary">{asset}</span>
      )}
    </div>
  );
};

export default CryptoIcon;

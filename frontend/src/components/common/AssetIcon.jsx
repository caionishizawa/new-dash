import React from 'react';
import { Bitcoin, Coins, DollarSign } from 'lucide-react';
import { CRYPTO_COLORS } from '../../utils/constants';

const AssetIcon = ({ asset, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const bgColor = CRYPTO_COLORS[asset] || '#6B7280';

  // Ícones específicos para alguns ativos
  const getIcon = () => {
    switch (asset) {
      case 'BTC':
        return <Bitcoin className={iconSize[size]} strokeWidth={2.5} />;
      case 'USD':
      case 'USDT':
      case 'USDC':
      case 'DAI':
        return <DollarSign className={iconSize[size]} strokeWidth={2.5} />;
      default:
        return <Coins className={iconSize[size]} strokeWidth={2.5} />;
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-sm`}
      style={{ backgroundColor: bgColor }}
    >
      {getIcon()}
    </div>
  );
};

export default AssetIcon;

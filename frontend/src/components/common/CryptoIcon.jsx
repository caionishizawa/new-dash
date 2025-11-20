import React from 'react';

// URLs dos logos das criptomoedas (usando CoinGecko CDN)
const CRYPTO_LOGOS = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  DAI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
  ENA: 'https://assets.coingecko.com/coins/images/36530/small/ethena.png',
  PENDLE: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png',
};

const CryptoIcon = ({ asset, size = 'md', showLabel = false, className = '' }) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const logoUrl = CRYPTO_LOGOS[asset];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeMap[size]} rounded-full overflow-hidden bg-bg-tertiary flex items-center justify-center relative group`}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={asset}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
            onError={(e) => {
              // Fallback para círculo colorido com iniciais
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center font-bold text-white text-xs"
          style={{ display: logoUrl ? 'none' : 'flex' }}
        >
          {asset?.substring(0, 2)}
        </div>
      </div>
      {showLabel && (
        <span className="font-semibold text-text-primary">{asset}</span>
      )}
    </div>
  );
};

export default CryptoIcon;

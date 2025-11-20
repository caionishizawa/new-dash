import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { LABELS } from '../../utils/constants';
import CryptoIcon from '../common/CryptoIcon';

const PortfolioTable = ({ portfolio }) => {
  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold text-gradient mb-6">
          {LABELS.portfolio}
        </h3>
        <p className="text-text-muted text-center py-12">{LABELS.noData}</p>
      </div>
    );
  }

  return (
    <div className="card glow-card">
      <h3 className="text-xl font-bold text-gradient mb-6">
        {LABELS.portfolio}
      </h3>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-xs uppercase tracking-wider">
                {LABELS.asset}
              </th>
              <th className="text-right py-4 px-4 text-text-secondary font-semibold text-xs uppercase tracking-wider">
                {LABELS.quantity}
              </th>
              <th className="text-right py-4 px-4 text-text-secondary font-semibold text-xs uppercase tracking-wider">
                {LABELS.avgPrice}
              </th>
              <th className="text-right py-4 px-4 text-text-secondary font-semibold text-xs uppercase tracking-wider">
                {LABELS.currentPrice}
              </th>
              <th className="text-right py-4 px-4 text-text-secondary font-semibold text-xs uppercase tracking-wider">
                {LABELS.value}
              </th>
              <th className="text-right py-4 px-4 text-text-secondary font-semibold text-xs uppercase tracking-wider">
                {LABELS.gainPercent}
              </th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item, index) => {
              const isPositive = item.gainPercent > 0;
              const Icon = isPositive ? TrendingUp : TrendingDown;
              const colorClass = isPositive ? 'text-success glow-success' : item.gainPercent < 0 ? 'text-danger glow-danger' : 'text-text-secondary';

              return (
                <tr key={index} className="table-row group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <CryptoIcon asset={item.asset} size="lg" />
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary text-base group-hover:text-accent transition-colors">
                          {item.asset}
                        </span>
                        {item.protocol && (
                          <span className="badge badge-info text-xs mt-1">
                            {item.protocol}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-text-primary font-medium">
                    {formatNumber(item.quantity, 8)}
                  </td>
                  <td className="py-4 px-4 text-right text-text-secondary font-medium">
                    {formatCurrency(item.avgBuyPrice)}
                  </td>
                  <td className="py-4 px-4 text-right text-text-primary font-semibold">
                    {formatCurrency(item.currentPrice)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-text-primary font-bold text-lg">
                      {formatCurrency(item.value)}
                    </span>
                  </td>
                  <td className={`py-4 px-4 text-right font-bold ${colorClass}`}>
                    <div className="flex items-center justify-end gap-2">
                      <Icon className="w-5 h-5" />
                      <span className="text-base">{formatPercentage(Math.abs(item.gainPercent), 2, false)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;

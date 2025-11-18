import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { LABELS } from '../../utils/constants';

const PortfolioTable = ({ portfolio }) => {
  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {LABELS.portfolio}
        </h3>
        <p className="text-text-muted text-center py-8">{LABELS.noData}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {LABELS.portfolio}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                {LABELS.asset}
              </th>
              <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">
                {LABELS.quantity}
              </th>
              <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">
                {LABELS.avgPrice}
              </th>
              <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">
                {LABELS.currentPrice}
              </th>
              <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">
                {LABELS.value}
              </th>
              <th className="text-right py-3 px-4 text-text-secondary font-medium text-sm">
                {LABELS.gainPercent}
              </th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item, index) => {
              const isPositive = item.gainPercent > 0;
              const Icon = isPositive ? TrendingUp : TrendingDown;
              const colorClass = isPositive ? 'text-success' : item.gainPercent < 0 ? 'text-danger' : 'text-text-secondary';

              return (
                <tr key={index} className="table-row">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary">
                        {item.asset}
                      </span>
                      {item.protocol && (
                        <span className="badge bg-accent/10 text-accent text-xs">
                          {item.protocol}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-text-primary">
                    {formatNumber(item.quantity, 8)}
                  </td>
                  <td className="py-3 px-4 text-right text-text-secondary">
                    {formatCurrency(item.avgBuyPrice)}
                  </td>
                  <td className="py-3 px-4 text-right text-text-primary font-medium">
                    {formatCurrency(item.currentPrice)}
                  </td>
                  <td className="py-3 px-4 text-right text-text-primary font-semibold">
                    {formatCurrency(item.value)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${colorClass}`}>
                    <div className="flex items-center justify-end gap-1">
                      <Icon className="w-4 h-4" />
                      <span>{formatPercentage(Math.abs(item.gainPercent), 2, false)}</span>
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

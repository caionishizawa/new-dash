import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage, getChangeColor } from '../../utils/formatters';

const StatsCard = ({ title, value, change, changeType, icon: Icon, isCurrency = true, isPercentage = false }) => {
  const changeColor = change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-text-secondary';
  const ChangeIcon = change > 0 ? TrendingUp : TrendingDown;

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm font-medium">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-text-muted" />}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold text-text-primary">
          {isCurrency ? formatCurrency(value) : isPercentage ? formatPercentage(value, 2, false) : value}
        </span>

        {change !== undefined && change !== null && (
          <div className={`flex items-center gap-1 ${changeColor} text-sm font-medium`}>
            <ChangeIcon className="w-4 h-4" />
            <span>{formatPercentage(Math.abs(change), 2, false)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;

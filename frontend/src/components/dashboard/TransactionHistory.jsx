import React from 'react';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, DollarSign, Plus, Minus } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { LABELS, TRANSACTION_TYPES } from '../../utils/constants';

const getTransactionIcon = (type) => {
  switch (type) {
    case 'buy':
      return ArrowDownLeft;
    case 'sell':
      return ArrowUpRight;
    case 'yield':
      return TrendingUp;
    case 'deposit':
      return Plus;
    case 'withdrawal':
      return Minus;
    case 'fee':
      return DollarSign;
    default:
      return DollarSign;
  }
};

const getTransactionColor = (type) => {
  const txType = TRANSACTION_TYPES.find(t => t.value === type);
  return txType?.color || 'text-text-secondary';
};

const TransactionHistory = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {LABELS.recentTransactions}
        </h3>
        <p className="text-text-muted text-center py-8">{LABELS.noData}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {LABELS.recentTransactions}
      </h3>

      <div className="space-y-2">
        {transactions.map((tx) => {
          const Icon = getTransactionIcon(tx.type);
          const colorClass = getTransactionColor(tx.type);
          const typeLabel = TRANSACTION_TYPES.find(t => t.value === tx.type)?.label || tx.type;

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg hover:bg-border transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-bg-secondary ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary">
                      {formatNumber(tx.quantity, 8)} {tx.asset}
                    </span>
                    <span className="badge bg-border text-text-secondary">
                      {typeLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                    <span>{formatDate(tx.date)}</span>
                    {tx.notes && (
                      <>
                        <span>•</span>
                        <span>{tx.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-text-primary">
                  {formatCurrency(tx.totalUsd)}
                </div>
                <div className="text-sm text-text-muted">
                  @ {formatCurrency(tx.priceUsd)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistory;

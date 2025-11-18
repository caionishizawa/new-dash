import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { CRYPTO_COLORS } from '../../utils/constants';
import AssetIcon from '../common/AssetIcon';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-secondary border border-border rounded-lg p-3 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <AssetIcon asset={data.asset} size="sm" />
          <p className="text-text-primary font-semibold">{data.asset}</p>
        </div>
        <p className="text-text-secondary text-sm">
          {formatCurrency(data.value)}
        </p>
        <p className="text-accent text-sm font-medium">
          {formatPercentage(data.percentage, 2, false)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <AssetIcon asset={entry.value} size="sm" />
          <span className="text-text-secondary text-sm font-medium">
            {entry.value}: {formatPercentage(entry.payload.percentage, 1, false)}
          </span>
        </div>
      ))}
    </div>
  );
};

const AllocationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card flex items-center justify-center h-80">
        <p className="text-text-muted">Sem dados de alocação disponíveis</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    fill: CRYPTO_COLORS[item.asset] || '#6B7280',
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Alocação de Ativos
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="asset"
            label={({ asset, percentage }) =>
              `${asset} ${formatPercentage(percentage, 1, false)}`
            }
            labelLine={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllocationChart;

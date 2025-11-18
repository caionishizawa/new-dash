import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { LABELS, TRANSACTION_TYPES } from '../../utils/constants';

const TransactionForm = ({ clients, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'buy',
    asset: 'BTC',
    quantity: '',
    priceUsd: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminAPI.addTransaction(formData);

      // Reset form
      setFormData({
        ...formData,
        quantity: '',
        priceUsd: '',
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }

      alert('Transação adicionada com sucesso!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao adicionar transação');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        {LABELS.addTransaction}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Cliente
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="input-field w-full"
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {LABELS.date}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {LABELS.type}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="input-field w-full"
            >
              {TRANSACTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {LABELS.asset}
            </label>
            <input
              type="text"
              name="asset"
              value={formData.asset}
              onChange={handleChange}
              placeholder="BTC, ETH, SOL..."
              required
              className="input-field w-full uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {LABELS.quantity}
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              step="any"
              min="0"
              placeholder="0.00"
              required
              className="input-field w-full font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Preço (USD)
            </label>
            <input
              type="number"
              name="priceUsd"
              value={formData.priceUsd}
              onChange={handleChange}
              step="any"
              min="0"
              placeholder="0.00"
              required
              className="input-field w-full font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {LABELS.notes}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Observações opcionais..."
            className="input-field w-full resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-text-muted">
            Total: ${formData.quantity && formData.priceUsd
              ? (parseFloat(formData.quantity) * parseFloat(formData.priceUsd)).toFixed(2)
              : '0.00'}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? LABELS.loading : LABELS.add}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

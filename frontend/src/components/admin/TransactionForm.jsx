import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { LABELS, TRANSACTION_TYPES, ASSETS } from '../../utils/constants';

const TransactionForm = ({ clients, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [customAsset, setCustomAsset] = useState('');
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'buy',
    asset: 'BTC',
    quantity: '',
    priceUsd: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'buy',
      asset: 'BTC',
      quantity: '',
      priceUsd: '',
      notes: '',
    });
    setCustomAsset('');
  };

  const handleAddToList = (e) => {
    e.preventDefault();

    if (!formData.clientId || !formData.quantity || !formData.priceUsd) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    // Se selecionou "other", usar o customAsset
    const finalAsset = formData.asset === 'other' ? customAsset.toUpperCase() : formData.asset;

    if (formData.asset === 'other' && !customAsset.trim()) {
      setError('Digite o nome do ativo');
      return;
    }

    const newTransaction = {
      ...formData,
      asset: finalAsset,
      quantity: parseFloat(formData.quantity),
      priceUsd: parseFloat(formData.priceUsd),
      totalUsd: parseFloat(formData.quantity) * parseFloat(formData.priceUsd),
      clientName: clients.find(c => c.id === formData.clientId)?.name || 'Cliente',
    };

    if (editingIndex !== null) {
      // Editando transação existente
      const updated = [...transactions];
      updated[editingIndex] = newTransaction;
      setTransactions(updated);
      setEditingIndex(null);
    } else {
      // Adicionando nova transação
      setTransactions([...transactions, newTransaction]);
    }

    resetForm();
    setError(null);
  };

  const handleEdit = (index) => {
    const transaction = transactions[index];

    // Verificar se o ativo está na lista de ativos predefinidos
    const isCustomAsset = !ASSETS.some(a => a.value === transaction.asset);

    setFormData({
      clientId: transaction.clientId,
      date: transaction.date,
      type: transaction.type,
      asset: isCustomAsset ? 'other' : transaction.asset,
      quantity: transaction.quantity.toString(),
      priceUsd: transaction.priceUsd.toString(),
      notes: transaction.notes || '',
    });

    if (isCustomAsset) {
      setCustomAsset(transaction.asset);
    } else {
      setCustomAsset('');
    }

    setEditingIndex(index);
  };

  const handleRemove = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      resetForm();
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    resetForm();
  };

  const handleSubmitAll = async () => {
    if (transactions.length === 0) {
      setError('Adicione pelo menos uma transação à lista');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar dados para envio
      const transactionsData = transactions.map(t => ({
        clientId: t.clientId,
        date: t.date,
        type: t.type,
        asset: t.asset,
        quantity: t.quantity,
        priceUsd: t.priceUsd,
        notes: t.notes,
      }));

      await adminAPI.addBulkTransactions(transactionsData);

      // Limpar lista e formulário
      setTransactions([]);
      resetForm();
      setEditingIndex(null);

      if (onSuccess) {
        onSuccess();
      }

      alert(`${transactions.length} transações adicionadas com sucesso!`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao adicionar transações');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const currentTotal = formData.quantity && formData.priceUsd
    ? (parseFloat(formData.quantity) * parseFloat(formData.priceUsd)).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      {/* Formulário de Entrada */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingIndex !== null ? 'Editar Transação' : LABELS.addTransaction}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleAddToList} className="space-y-4">
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
              <select
                name="asset"
                value={formData.asset}
                onChange={handleChange}
                required
                className="input-field w-full"
              >
                {ASSETS.map((asset) => (
                  <option key={asset.value} value={asset.value}>
                    {asset.label}
                  </option>
                ))}
              </select>
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

          {formData.asset === 'other' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nome do Ativo
              </label>
              <input
                type="text"
                value={customAsset}
                onChange={(e) => setCustomAsset(e.target.value)}
                placeholder="Digite o símbolo do ativo (ex: PENDLE, ENA, etc.)"
                required
                className="input-field w-full uppercase"
              />
            </div>
          )}

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
              Total: ${currentTotal}
            </div>
            <div className="flex gap-2">
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                {editingIndex !== null ? (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Edição
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Adicionar à Lista
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista de Transações */}
      {transactions.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Transações a Adicionar ({transactions.length})
            </h3>
            <button
              onClick={handleSubmitAll}
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? LABELS.loading : `Enviar Todas (${transactions.length})`}
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-colors ${
                  editingIndex === index
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-bg-secondary hover:border-border-hover'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-text-muted">Cliente:</span>
                      <p className="text-text-primary font-medium">{transaction.clientName}</p>
                    </div>
                    <div>
                      <span className="text-text-muted">Data:</span>
                      <p className="text-text-primary">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-text-muted">Tipo:</span>
                      <p className="text-text-primary capitalize">
                        {TRANSACTION_TYPES.find(t => t.value === transaction.type)?.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-text-muted">Ativo:</span>
                      <p className="text-text-primary font-medium">{transaction.asset}</p>
                    </div>
                    <div>
                      <span className="text-text-muted">Quantidade:</span>
                      <p className="text-text-primary font-mono">{transaction.quantity}</p>
                    </div>
                    <div>
                      <span className="text-text-muted">Preço:</span>
                      <p className="text-text-primary font-mono">${transaction.priceUsd.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-text-muted">Total:</span>
                      <p className="text-text-primary font-mono font-semibold">
                        ${transaction.totalUsd.toFixed(2)}
                      </p>
                    </div>
                    {transaction.notes && (
                      <div className="md:col-span-1">
                        <span className="text-text-muted">Notas:</span>
                        <p className="text-text-primary text-xs">{transaction.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-text-muted">
              Total Geral: ${transactions.reduce((sum, t) => sum + t.totalUsd, 0).toFixed(2)}
            </div>
            <button
              onClick={() => setTransactions([])}
              className="text-sm text-danger hover:underline"
            >
              Limpar Lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;

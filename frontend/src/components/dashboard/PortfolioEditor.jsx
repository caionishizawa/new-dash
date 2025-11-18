import React, { useState } from 'react';
import { Edit3, Plus, Trash2, Save, X } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { LABELS } from '../../utils/constants';
import CryptoIcon from '../common/CryptoIcon';

const PortfolioEditor = ({ clientId, portfolio, onUpdate }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    asset: '',
    quantity: '',
    avgBuyPrice: '',
  });
  const [loading, setLoading] = useState(false);

  const assets = [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'SOL', label: 'Solana (SOL)' },
    { value: 'USDT', label: 'Tether (USDT)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
    { value: 'DAI', label: 'DAI' },
    { value: 'ENA', label: 'Ethena (ENA)' },
    { value: 'PENDLE', label: 'Pendle (PENDLE)' },
  ];

  const handleEdit = (position) => {
    setEditingIndex(position.asset);
    setFormData({
      asset: position.asset,
      quantity: position.quantity.toString(),
      avgBuyPrice: position.avgBuyPrice.toString(),
    });
  };

  const handleSave = async () => {
    if (!formData.asset || !formData.quantity || !formData.avgBuyPrice) {
      alert('Preencha todos os campos!');
      return;
    }

    if (parseFloat(formData.quantity) <= 0) {
      alert('Quantidade deve ser maior que zero!');
      return;
    }

    if (parseFloat(formData.avgBuyPrice) <= 0) {
      alert('Preço médio deve ser maior que zero!');
      return;
    }

    try {
      setLoading(true);

      await adminAPI.updatePortfolio(
        clientId,
        formData.asset,
        {
          quantity: parseFloat(formData.quantity),
          avgBuyPrice: parseFloat(formData.avgBuyPrice),
        }
      );

      alert('Portfólio atualizado com sucesso!');

      // Reset form
      setFormData({ asset: '', quantity: '', avgBuyPrice: '' });
      setEditingIndex(null);

      // Reload data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      alert('Erro ao atualizar portfólio: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ asset: '', quantity: '', avgBuyPrice: '' });
    setEditingIndex(null);
  };

  if (!showEditor) {
    return (
      <button
        onClick={() => setShowEditor(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg shadow-glow hover:bg-accent-hover transition-all duration-200 z-50"
      >
        <Edit3 className="w-5 h-5" />
        <span className="font-medium">Editar Portfólio</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-bg-secondary rounded-lg border border-border shadow-card w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-bg-secondary border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-accent" />
            Editar Portfólio
          </h2>
          <button
            onClick={() => setShowEditor(false)}
            className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Lista de Ativos Atuais */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Ativos Atuais
            </h3>
            <div className="space-y-2">
              {portfolio && portfolio.length > 0 ? (
                portfolio.map((position, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg hover:bg-border transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <CryptoIcon asset={position.asset} size="lg" />
                      <div className="flex-1">
                        <div className="font-semibold text-text-primary text-lg">
                          {position.asset}
                        </div>
                        <div className="text-sm text-text-muted mt-1">
                          Qtd: {formatNumber(position.quantity, 8)} |
                          Preço Médio: {formatCurrency(position.avgBuyPrice)} |
                          Valor: {formatCurrency(position.value)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(position)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      {LABELS.edit}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-text-muted text-center py-4">
                  Nenhum ativo no portfólio
                </p>
              )}
            </div>
          </div>

          {/* Formulário de Edição */}
          <div className="bg-bg-tertiary rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {editingIndex ? `Editando ${editingIndex}` : 'Adicionar Novo Ativo'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {LABELS.asset}
                </label>
                <select
                  value={formData.asset}
                  onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                  disabled={!!editingIndex}
                  className="input-field w-full"
                >
                  <option value="">Selecione o Ativo</option>
                  {assets.map((asset) => (
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
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0.00000000"
                  step="0.00000001"
                  className="input-field w-full font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {LABELS.avgPrice} (USD)
                </label>
                <input
                  type="number"
                  value={formData.avgBuyPrice}
                  onChange={(e) => setFormData({ ...formData, avgBuyPrice: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  className="input-field w-full font-mono"
                />
              </div>
            </div>

            {/* Cálculo de Valor Total */}
            {formData.quantity && formData.avgBuyPrice && (
              <div className="mt-4 p-3 bg-bg-secondary rounded-lg border border-border">
                <div className="text-sm text-text-secondary">Valor Total Investido:</div>
                <div className="text-xl font-bold text-text-primary">
                  {formatCurrency(parseFloat(formData.quantity) * parseFloat(formData.avgBuyPrice))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? LABELS.loading : LABELS.save}
              </button>

              {editingIndex && (
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  {LABELS.cancel}
                </button>
              )}
            </div>
          </div>

          {/* Informações */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-accent mb-2">
              ℹ️ Informações Importantes
            </h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• As alterações serão salvas imediatamente no banco de dados</li>
              <li>• O preço médio deve refletir o custo médio de aquisição do ativo</li>
              <li>• Os cálculos de ganho/perda serão atualizados automaticamente</li>
              <li>• Para adicionar um novo ativo, selecione-o e preencha os campos</li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-bg-secondary border-t border-border p-6">
          <button
            onClick={() => setShowEditor(false)}
            className="btn-secondary w-full"
          >
            Fechar Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;

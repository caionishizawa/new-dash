import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Plus, RefreshCw } from 'lucide-react';
import { adminAPI, pricesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import ClientList from '../components/admin/ClientList';
import TransactionForm from '../components/admin/TransactionForm';
import { LABELS } from '../utils/constants';

const AdminPanel = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [updatingPrices, setUpdatingPrices] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getClients();
      setClients(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleUpdatePrices = async () => {
    try {
      setUpdatingPrices(true);
      await pricesAPI.updatePrices();
      alert('Preços atualizados com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar preços: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingPrices(false);
    }
  };

  const tabs = [
    { id: 'overview', label: LABELS.overview, icon: LayoutDashboard },
    { id: 'clients', label: LABELS.clients, icon: Users },
    { id: 'transaction', label: LABELS.addTransaction, icon: Plus },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-bg-primary">
          <Loader />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-bg-primary">
          <ErrorMessage message={error} onRetry={fetchClients} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Painel Administrativo
              </h1>
              <p className="text-text-secondary">
                Gerencie clientes, transações e configurações
              </p>
            </div>

            <button
              onClick={handleUpdatePrices}
              disabled={updatingPrices}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${updatingPrices ? 'animate-spin' : ''}`} />
              <span>{LABELS.updatePrices}</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="animate-fade-in">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="stat-card">
                  <div className="text-text-secondary text-sm font-medium mb-2">
                    Total de Clientes
                  </div>
                  <div className="text-3xl font-bold text-text-primary">
                    {clients.length}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="text-text-secondary text-sm font-medium mb-2">
                    Clientes Ativos
                  </div>
                  <div className="text-3xl font-bold text-success">
                    {clients.filter(c => c.isActive).length}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="text-text-secondary text-sm font-medium mb-2">
                    Administradores
                  </div>
                  <div className="text-3xl font-bold text-accent">
                    {clients.filter(c => c.role === 'admin').length}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'clients' && <ClientList clients={clients} />}

            {activeTab === 'transaction' && (
              <TransactionForm
                clients={clients.filter(c => c.role !== 'admin')}
                onSuccess={fetchClients}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminPanel;

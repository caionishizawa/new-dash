import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wallet, DollarSign, TrendingUp, Target, Percent } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import StatsCard from '../components/dashboard/StatsCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import AllocationChart from '../components/dashboard/AllocationChart';
import PortfolioTable from '../components/dashboard/PortfolioTable';
import TransactionHistory from '../components/dashboard/TransactionHistory';

const ClientDashboard = () => {
  const { clientId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = clientId || user.id;
      const response = await dashboardAPI.getDashboard(id);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [clientId, user]);

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
          <ErrorMessage message={error} onRetry={fetchDashboard} />
        </div>
      </>
    );
  }

  if (!data) {
    return null;
  }

  const { stats, portfolio, allocation, history, transactions } = data;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCard
              title="Investido"
              value={stats.invested}
              icon={DollarSign}
            />
            <StatsCard
              title="Valor Total"
              value={stats.actualValue}
              change={stats.gain.percent}
              icon={Wallet}
            />
            <StatsCard
              title="Ganho/Perda"
              value={stats.gain.absolute}
              change={stats.gain.percent}
              icon={TrendingUp}
            />
            <StatsCard
              title="Vantagem vs HODL"
              value={stats.advantage.absolute}
              change={stats.advantage.percent}
              icon={Target}
            />
            <StatsCard
              title="APY Anual"
              value={stats.apy}
              icon={Percent}
              isCurrency={false}
              isPercentage={true}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PerformanceChart data={history} />
            <AllocationChart data={allocation} />
          </div>

          {/* Portfolio Table */}
          <div className="mb-8">
            <PortfolioTable portfolio={portfolio} />
          </div>

          {/* Transaction History */}
          <TransactionHistory transactions={transactions} />
        </div>
      </main>
    </>
  );
};

export default ClientDashboard;

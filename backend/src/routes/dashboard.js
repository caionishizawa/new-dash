import express from 'express';
import authenticateToken from '../middleware/auth.js';
import { checkClientAccess } from '../middleware/roleCheck.js';
import CalculationService from '../services/calculationService.js';
import PriceService from '../services/priceService.js';
import Transaction from '../models/Transaction.js';
import PortfolioPosition from '../models/PortfolioPosition.js';
import Snapshot from '../models/Snapshot.js';

const router = express.Router();

// GET /api/dashboard/:clientId
router.get('/:clientId', authenticateToken, checkClientAccess, async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    const period = req.query.period || '90'; // Dias

    // Estatísticas principais
    const stats = await CalculationService.getDashboardStats(clientId);

    // Preços atuais
    const prices = await PriceService.getCurrentPrices();

    // Portfolio
    const portfolio = PortfolioPosition.findByClient(clientId);

    const portfolioWithValues = portfolio.map(pos => {
      const currentPrice = prices[pos.asset] || pos.current_price;
      const value = pos.quantity * currentPrice;
      const gain = value - (pos.quantity * pos.avg_buy_price);
      const gainPercent = pos.avg_buy_price > 0
        ? ((currentPrice - pos.avg_buy_price) / pos.avg_buy_price) * 100
        : 0;

      return {
        asset: pos.asset,
        quantity: pos.quantity,
        avgBuyPrice: pos.avg_buy_price,
        currentPrice,
        value,
        gain,
        gainPercent,
        protocol: pos.protocol,
        chain: pos.chain
      };
    });

    // Alocação
    const allocation = CalculationService.calculateAllocation(clientId, prices);

    // Histórico de performance (snapshots)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const history = Snapshot.findByClientAndDateRange(clientId, startDate, endDate);

    const historyData = history.map(snap => ({
      date: snap.date,
      totalValue: snap.total_value_usd,
      hodlValue: snap.hodl_value_usd,
      gainPercent: snap.gain_percent,
      apy: snap.apy
    }));

    // Transações recentes
    const recentTransactions = Transaction.findByClient(clientId, 10);

    const transactionsData = recentTransactions.map(tx => ({
      id: tx.id,
      date: tx.date,
      type: tx.type,
      asset: tx.asset,
      quantity: tx.quantity,
      priceUsd: tx.price_usd,
      totalUsd: tx.total_usd,
      notes: tx.notes
    }));

    res.json({
      stats: {
        invested: stats.invested,
        actualValue: stats.actualValue,
        hodlValue: stats.hodlValue,
        gain: stats.gain,
        advantage: stats.advantage,
        apy: stats.apy,
        daysSinceEntry: stats.daysSinceEntry
      },
      portfolio: portfolioWithValues,
      allocation,
      history: historyData,
      transactions: transactionsData,
      prices
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

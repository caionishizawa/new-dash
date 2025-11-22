import Transaction from '../models/Transaction.js';
import PortfolioPosition from '../models/PortfolioPosition.js';
import Client from '../models/Client.js';
import PriceService from './priceService.js';

export class CalculationService {
  /**
   * Calcula o valor HODL (se não tivesse feito nada)
   */
  static async calculateHODL(clientId, currentPrices) {
    const initialTransactions = await Transaction.getInitialTransactions(clientId);
    const initialQuantities = {};

    initialTransactions.forEach(tx => {
      if (!initialQuantities[tx.asset]) {
        initialQuantities[tx.asset] = 0;
      }
      initialQuantities[tx.asset] += tx.quantity;
    });

    let hodlValue = 0;
    for (const [asset, quantity] of Object.entries(initialQuantities)) {
      const currentPrice = currentPrices[asset] || 0;
      hodlValue += quantity * currentPrice;
    }

    return hodlValue;
  }

  /**
   * Calcula o valor atual do portfólio (com rendimentos)
   */
  static async calculateActualValue(clientId, currentPrices) {
    const positions = await PortfolioPosition.findByClient(clientId);

    let actualValue = 0;
    positions.forEach(pos => {
      const currentPrice = currentPrices[pos.asset] || pos.current_price || 0;
      actualValue += pos.quantity * currentPrice;
    });

    return actualValue;
  }

  /**
   * Calcula a vantagem sobre HODL
   */
  static calculateAdvantage(actualValue, hodlValue) {
    if (hodlValue === 0) {
      return {
        absolute: 0,
        percent: 0
      };
    }

    return {
      absolute: actualValue - hodlValue,
      percent: ((actualValue - hodlValue) / hodlValue) * 100
    };
  }

  /**
   * Calcula o APY anualizado
   */
  static calculateAPY(invested, current, daysSinceEntry) {
    if (invested === 0 || daysSinceEntry === 0) {
      return 0;
    }

    const profit = current - invested;
    return (profit / invested) * (365 / daysSinceEntry) * 100;
  }

  /**
   * Recalcula as posições do portfólio baseado nas transações
   */
  static async recalculatePortfolio(clientId) {
    const transactions = await Transaction.findByClient(clientId);
    const prices = await PriceService.getCurrentPrices();
    const positions = {};

    // Processar transações em ordem cronológica
    transactions.reverse().forEach(tx => {
      if (!positions[tx.asset]) {
        positions[tx.asset] = {
          quantity: 0,
          totalCost: 0,
          avgBuyPrice: 0
        };
      }

      const pos = positions[tx.asset];

      switch (tx.type) {
        case 'buy':
        case 'deposit':
          pos.totalCost += tx.total_usd;
          pos.quantity += tx.quantity;
          break;

        case 'sell':
        case 'withdrawal':
          pos.quantity -= tx.quantity;
          pos.totalCost -= tx.total_usd;
          break;

        case 'yield':
          pos.quantity += tx.quantity;
          break;

        case 'fee':
          pos.quantity -= tx.quantity;
          break;
      }

      if (pos.quantity > 0) {
        pos.avgBuyPrice = pos.totalCost / pos.quantity;
      }
    });

    // Limpar posições antigas
    await PortfolioPosition.deleteByClient(clientId);

    // Criar novas posições
    for (const [asset, pos] of Object.entries(positions)) {
      if (pos.quantity > 0.00000001) {
        await PortfolioPosition.create({
          clientId,
          asset,
          quantity: pos.quantity,
          avgBuyPrice: pos.avgBuyPrice || 0,
          currentPrice: prices[asset] || 0,
          protocol: null,
          chain: null
        });
      }
    }

    return await PortfolioPosition.findByClient(clientId);
  }

  /**
   * Calcula a alocação por ativo
   */
  static async calculateAllocation(clientId, currentPrices) {
    const positions = await PortfolioPosition.findByClient(clientId);
    const totalValue = await this.calculateActualValue(clientId, currentPrices);

    const allocation = positions.map(pos => {
      const currentPrice = currentPrices[pos.asset] || pos.current_price || 0;
      const value = pos.quantity * currentPrice;
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        asset: pos.asset,
        value,
        percentage,
        quantity: pos.quantity
      };
    });

    return allocation.sort((a, b) => b.value - a.value);
  }

  /**
   * Gera estatísticas completas do dashboard
   */
  static async getDashboardStats(clientId) {
    const client = await Client.findById(clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    const prices = await PriceService.getCurrentPrices();
    const invested = await Transaction.getTotalInvested(clientId);
    const actualValue = await this.calculateActualValue(clientId, prices);
    const hodlValue = await this.calculateHODL(clientId, prices);
    const advantage = this.calculateAdvantage(actualValue, hodlValue);
    const daysSinceEntry = Client.getDaysSinceEntry(client.entry_date);
    const apy = this.calculateAPY(invested, actualValue, daysSinceEntry);

    const gain = {
      absolute: actualValue - invested,
      percent: invested > 0 ? ((actualValue - invested) / invested) * 100 : 0
    };

    return {
      invested,
      actualValue,
      hodlValue,
      gain,
      advantage,
      apy,
      daysSinceEntry
    };
  }
}

export default CalculationService;

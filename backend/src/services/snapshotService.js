import Client from '../models/Client.js';
import Snapshot from '../models/Snapshot.js';
import PriceService from './priceService.js';
import CalculationService from './calculationService.js';

export class SnapshotService {
  /**
   * Cria snapshot para um cliente específico
   */
  static async createSnapshot(clientId, date = null) {
    const snapshotDate = date || new Date().toISOString().split('T')[0];

    const prices = await PriceService.getCurrentPrices();
    const stats = await CalculationService.getDashboardStats(clientId);

    const snapshot = await Snapshot.create({
      clientId,
      date: snapshotDate,
      totalValueUsd: stats.actualValue,
      hodlValueUsd: stats.hodlValue,
      gainPercent: stats.gain.percent,
      apy: stats.apy,
      btcPrice: prices.BTC || null,
      ethPrice: prices.ETH || null,
      solPrice: prices.SOL || null
    });

    return snapshot;
  }

  /**
   * Cria snapshots para todos os clientes ativos
   */
  static async createDailySnapshots() {
    const clients = await Client.findAll();
    const results = [];

    for (const client of clients) {
      try {
        const snapshot = await this.createSnapshot(client.id);
        results.push({
          clientId: client.id,
          success: true,
          snapshot
        });
        console.log(`Snapshot criado para cliente ${client.name}`);
      } catch (error) {
        results.push({
          clientId: client.id,
          success: false,
          error: error.message
        });
        console.error(`Erro ao criar snapshot para cliente ${client.name}:`, error.message);
      }
    }

    return results;
  }
}

export default SnapshotService;

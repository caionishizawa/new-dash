import axios from 'axios';
import getDatabase from '../config/database.js';
import { config } from '../config/environment.js';

const COINGECKO_MAP = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'ENA': 'ethena',
  'PENDLE': 'pendle',
  'USDT': null,
  'USDC': null,
  'DAI': null,
  'USD': null
};

export class PriceService {
  static async fetchPrices() {
    try {
      const ids = Object.values(COINGECKO_MAP)
        .filter(id => id !== null)
        .join(',');

      const response = await axios.get(
        `${config.coingeckoApiUrl}/simple/price?ids=${ids}&vs_currencies=usd`,
        { timeout: 10000 }
      );

      const prices = {};

      for (const [asset, coinId] of Object.entries(COINGECKO_MAP)) {
        if (coinId === null) {
          prices[asset] = 1.0;
        } else {
          prices[asset] = response.data[coinId]?.usd || 0;
        }
      }

      this.updatePriceCache(prices);
      return prices;
    } catch (error) {
      console.error('Erro ao buscar preços do CoinGecko:', error.message);
      return this.getPricesFromCache();
    }
  }

  static updatePriceCache(prices) {
    const db = getDatabase();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO price_cache (asset, price_usd, last_updated, source)
      VALUES (?, ?, ?, 'coingecko')
      ON CONFLICT(asset) DO UPDATE SET
        price_usd = excluded.price_usd,
        last_updated = excluded.last_updated
    `);

    for (const [asset, price] of Object.entries(prices)) {
      stmt.run(asset, price, now);
    }
  }

  static getPricesFromCache() {
    const db = getDatabase();
    const rows = db.prepare('SELECT asset, price_usd FROM price_cache').all();

    const prices = {};
    rows.forEach(row => {
      prices[row.asset] = row.price_usd;
    });

    // Adicionar preços padrão para stablecoins se não estiverem no cache
    if (!prices.USDT) prices.USDT = 1.0;
    if (!prices.USDC) prices.USDC = 1.0;
    if (!prices.DAI) prices.DAI = 1.0;
    if (!prices.USD) prices.USD = 1.0;

    return prices;
  }

  static async getCurrentPrices() {
    const db = getDatabase();
    const cached = db.prepare('SELECT last_updated FROM price_cache LIMIT 1').get();

    if (cached) {
      const lastUpdate = new Date(cached.last_updated);
      const now = new Date();
      const diffMinutes = (now - lastUpdate) / (1000 * 60);

      // Se o cache tem menos de 5 minutos, usar cache
      if (diffMinutes < 5) {
        return this.getPricesFromCache();
      }
    }

    // Caso contrário, buscar novos preços
    return await this.fetchPrices();
  }

  static getPrice(asset) {
    const db = getDatabase();
    const row = db.prepare('SELECT price_usd FROM price_cache WHERE asset = ?').get(asset);

    if (row) {
      return row.price_usd;
    }

    // Retornar 1.0 para stablecoins por padrão
    if (['USDT', 'USDC', 'DAI', 'USD'].includes(asset)) {
      return 1.0;
    }

    return 0;
  }
}

export default PriceService;

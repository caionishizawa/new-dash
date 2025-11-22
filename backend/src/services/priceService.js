import axios from 'axios';
import supabase from '../config/supabase.js';
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

      await this.updatePriceCache(prices);
      return prices;
    } catch (error) {
      console.error('Erro ao buscar preços do CoinGecko:', error.message);
      return await this.getPricesFromCache();
    }
  }

  static async updatePriceCache(prices) {
    const now = new Date().toISOString();

    for (const [asset, price] of Object.entries(prices)) {
      const { error } = await supabase
        .from('price_cache')
        .upsert({
          asset,
          price_usd: price,
          last_updated: now,
          source: 'coingecko'
        }, {
          onConflict: 'asset'
        });

      if (error) {
        console.error(`Erro ao atualizar cache de preço para ${asset}:`, error.message);
      }
    }
  }

  static async getPricesFromCache() {
    const { data, error } = await supabase
      .from('price_cache')
      .select('asset, price_usd');

    if (error) {
      console.error('Erro ao buscar preços do cache:', error.message);
      return this.getDefaultPrices();
    }

    const prices = {};
    data.forEach(row => {
      prices[row.asset] = row.price_usd;
    });

    // Adicionar preços padrão para stablecoins se não estiverem no cache
    if (!prices.USDT) prices.USDT = 1.0;
    if (!prices.USDC) prices.USDC = 1.0;
    if (!prices.DAI) prices.DAI = 1.0;
    if (!prices.USD) prices.USD = 1.0;

    return prices;
  }

  static getDefaultPrices() {
    return {
      BTC: 100000,
      ETH: 3500,
      SOL: 150,
      ENA: 1.2,
      PENDLE: 5.5,
      USDT: 1.0,
      USDC: 1.0,
      DAI: 1.0,
      USD: 1.0
    };
  }

  static async getCurrentPrices() {
    const { data: cached, error } = await supabase
      .from('price_cache')
      .select('last_updated')
      .limit(1)
      .single();

    if (!error && cached) {
      const lastUpdate = new Date(cached.last_updated);
      const now = new Date();
      const diffMinutes = (now - lastUpdate) / (1000 * 60);

      // Se o cache tem menos de 5 minutos, usar cache
      if (diffMinutes < 5) {
        return await this.getPricesFromCache();
      }
    }

    // Caso contrário, buscar novos preços
    return await this.fetchPrices();
  }

  static async getPrice(asset) {
    const { data, error } = await supabase
      .from('price_cache')
      .select('price_usd')
      .eq('asset', asset)
      .single();

    if (!error && data) {
      return data.price_usd;
    }

    // Retornar 1.0 para stablecoins por padrão
    if (['USDT', 'USDC', 'DAI', 'USD'].includes(asset)) {
      return 1.0;
    }

    return 0;
  }
}

export default PriceService;

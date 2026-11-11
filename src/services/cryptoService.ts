import axios from 'axios';
import { CryptoCurrency, GlobalMarketData, SearchCoin } from '@/types';

const COINGECKO_API = '/api/crypto';

export const cryptoService = {
  // Get list of cryptocurrencies with market data
  async getCryptoList(limit: number = 50): Promise<CryptoCurrency[]> {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get historical price data for a cryptocurrency
  async getCryptoHistory(
    id: string,
    days: number = 30
  ): Promise<Array<[number, number]>> {
    try {
      const response = await axios.get(
        `${COINGECKO_API}/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: days,
          },
        }
      );
      return response.data.prices;
    } catch (error) {
      throw error;
    }
  },

  // Get detailed information about a specific cryptocurrency
  async getCryptoDetails(id: string): Promise<CryptoCurrency> {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/${id}`, {
        params: {
          localization: false,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get trending cryptocurrencies
  async getTrendingCrypto(): Promise<CryptoCurrency[]> {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'gecko_desc',
          per_page: 10,
          sparkline: false,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search for a cryptocurrency
  async searchCrypto(query: string): Promise<SearchCoin[]> {
    try {
      const response = await axios.get(`${COINGECKO_API}/search`, {
        params: {
          query: query,
        },
      });
      return response.data.coins || [];
    } catch (error) {
      throw error;
    }
  },

  // Get global cryptocurrency data
  async getGlobalData(): Promise<GlobalMarketData> {
    try {
      const response = await axios.get(`${COINGECKO_API}/global`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import axios from 'axios';
import { CryptoCurrency, DashboardFilters, GlobalMarketData } from '@/types';
import { cryptoService } from '@/services/cryptoService';

const getRequestError = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    return 'Market data is temporarily rate-limited. Please try again shortly.';
  }
  return error instanceof Error ? error.message : fallback;
};

interface DashboardContextType {
  cryptos: CryptoCurrency[];
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  filteredCryptos: CryptoCurrency[];
  globalData: GlobalMarketData | null;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  fetchCryptos: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [filters, setFiltersState] = useState<DashboardFilters>({
    search: '',
    sortBy: 'market_cap',
    sortOrder: 'desc',
    limit: 100,
  });

  const setFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const fetchCryptos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cryptoService.getCryptoList(filters.limit);
      setCryptos(data);
    } catch (err) {
      const errorMessage = getRequestError(
        err,
        'Failed to fetch cryptocurrencies'
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters.limit]);

  const fetchGlobalData = useCallback(async () => {
    try {
      const data = await cryptoService.getGlobalData();
      setGlobalData(data);
    } catch (err) {
      setError(getRequestError(err, 'Market summary is temporarily unavailable.'));
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchCryptos(), fetchGlobalData()]);
  }, [fetchCryptos, fetchGlobalData]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [refreshData]);

  // Filter and sort cryptocurrencies
  const filteredCryptos = cryptos
    .filter((crypto) => {
      const searchLower = filters.search.toLowerCase();
      return (
        crypto.name.toLowerCase().includes(searchLower) ||
        crypto.symbol.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;

      switch (filters.sortBy) {
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'market_cap':
          aValue = a.market_cap || 0;
          bValue = b.market_cap || 0;
          break;
        case 'change_24h':
          aValue = a.price_change_percentage_24h || 0;
          bValue = b.price_change_percentage_24h || 0;
          break;
        case 'volume':
          aValue = a.total_volume || 0;
          bValue = b.total_volume || 0;
          break;
        default:
          return 0;
      }

      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  return (
    <DashboardContext.Provider
      value={{
        cryptos,
        loading,
        error,
        filters,
        filteredCryptos,
        globalData,
        setFilters,
        fetchCryptos,
        refreshData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

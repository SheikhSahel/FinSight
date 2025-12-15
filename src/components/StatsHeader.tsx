'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';

export const StatsHeader: React.FC = () => {
  const { globalData, refreshData, loading } = useDashboard();

  const formatBigNumber = (num: number | undefined): string => {
    if (!num) return '$0';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(0)}`;
  };

  const btcDominance =
    globalData?.btc_market_cap_percentage?.btc?.toFixed(2) || '0';
  const ethDominance =
    globalData?.btc_market_cap_percentage?.eth?.toFixed(2) || '0';
  const marketCap = globalData?.total_market_cap?.usd;
  const volume24h = globalData?.total_volume?.usd;

  return (
    <div className="space-y-6 mb-8">
      {/* Header Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            FinSight Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time cryptocurrency market data and analytics
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Market Cap */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-medium opacity-90 mb-2">
              Total Market Cap
            </p>
            <p className="text-2xl font-bold">{formatBigNumber(marketCap)}</p>
            <p className="text-xs opacity-75 mt-2">All Cryptocurrencies</p>
          </div>

          {/* 24h Volume */}
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-medium opacity-90 mb-2">24h Volume</p>
            <p className="text-2xl font-bold">{formatBigNumber(volume24h)}</p>
            <p className="text-xs opacity-75 mt-2">Last 24 Hours</p>
          </div>

          {/* BTC Dominance */}
          <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-medium opacity-90 mb-2">
              BTC Dominance
            </p>
            <p className="text-2xl font-bold">{btcDominance}%</p>
            <p className="text-xs opacity-75 mt-2">Market Share</p>
          </div>

          {/* ETH Dominance */}
          <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-medium opacity-90 mb-2">
              ETH Dominance
            </p>
            <p className="text-2xl font-bold">{ethDominance}%</p>
            <p className="text-xs opacity-75 mt-2">Market Share</p>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useDashboard } from '@/context/DashboardContext';

const formatBigNumber = (num: number | undefined): string => {
  if (!num) return '$0';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(0)}`;
};

const statCards = [
  { key: 'marketCap', label: 'Total market cap', caption: 'All cryptocurrencies', color: 'from-blue-600 to-cyan-500' },
  { key: 'volume', label: '24h volume', caption: 'Last 24 hours', color: 'from-violet-600 to-fuchsia-500' },
  { key: 'btc', label: 'BTC dominance', caption: 'Market share', color: 'from-orange-500 to-amber-400' },
  { key: 'eth', label: 'ETH dominance', caption: 'Market share', color: 'from-indigo-600 to-blue-500' },
] as const;

export const StatsHeader: React.FC = () => {
  const { globalData, refreshData, loading, error } = useDashboard();
  const marketChange = globalData?.market_cap_change_percentage_24h_usd;
  const values = {
    marketCap: formatBigNumber(globalData?.total_market_cap?.usd),
    volume: formatBigNumber(globalData?.total_volume?.usd),
    btc: `${globalData?.btc_market_cap_percentage?.btc?.toFixed(2) || '0'}%`,
    eth: `${globalData?.btc_market_cap_percentage?.eth?.toFixed(2) || '0'}%`,
  };

  return (
    <header className="mb-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live market intelligence
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            See the market clearly.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Track prices, momentum, and market share in one focused workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => void refreshData()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <span className={loading ? 'animate-spin' : ''} aria-hidden="true">↻</span>
            {loading ? 'Updating' : 'Refresh data'}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-5 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 sm:flex-row sm:items-center sm:justify-between">
          <span>Market data is temporarily unavailable. Try refreshing in a moment.</span>
          <button type="button" onClick={() => void refreshData()} className="font-semibold underline underline-offset-2">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${card.color} p-5 text-white shadow-xl shadow-slate-900/10`}>
            <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <p className="relative text-xs font-semibold uppercase tracking-wider text-white/75">{card.label}</p>
            <p className="relative mt-3 text-2xl font-bold tracking-tight">{values[card.key]}</p>
            <div className="relative mt-3 flex items-center justify-between text-xs text-white/70">
              <span>{card.caption}</span>
              {card.key === 'marketCap' && marketChange !== undefined && (
                <span className={marketChange >= 0 ? 'text-emerald-100' : 'text-rose-100'}>
                  {marketChange >= 0 ? '+' : ''}{marketChange.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

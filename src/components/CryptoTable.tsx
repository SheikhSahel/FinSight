'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CryptoCurrency } from '@/types';
import { CryptoCharts } from '@/components/CryptoCharts';

interface CryptoTableProps {
  cryptos: CryptoCurrency[];
  loading: boolean;
}

const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

const formatPrice = (price: number): string => price < 0.01 ? `$${price.toFixed(8)}` : `$${price.toFixed(2)}`;
const changeLabel = (change: number | null | undefined): string => change === null || change === undefined ? 'N/A' : `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;

export const CryptoTable: React.FC<CryptoTableProps> = ({ cryptos, loading }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem('finsight-watchlist');
    if (saved) queueMicrotask(() => setWatchlist(JSON.parse(saved) as string[]));
  }, []);

  const toggleWatchlist = (id: string) => {
    const next = watchlist.includes(id) ? watchlist.filter((item) => item !== id) : [...watchlist, id];
    setWatchlist(next);
    window.localStorage.setItem('finsight-watchlist', JSON.stringify(next));
  };

  if (loading) {
    return (
      <div className="space-y-3" aria-label="Loading market data">
        {[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />)}
      </div>
    );
  }

  if (cryptos.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"><p className="font-semibold text-slate-900 dark:text-white">No assets match your search</p><p className="mt-1 text-sm text-slate-500">Try a different name or symbol.</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div><h2 className="font-semibold text-slate-900 dark:text-white">Market overview</h2><p className="mt-1 text-xs text-slate-500">Live prices in USD · Click chart to explore history</p></div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 sm:inline-flex">● Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
              <tr><th className="px-5 py-3 font-semibold">Asset</th><th className="px-5 py-3 text-right font-semibold">Price</th><th className="px-5 py-3 text-right font-semibold">24h change</th><th className="px-5 py-3 text-right font-semibold">Market cap</th><th className="px-5 py-3 text-right font-semibold">Volume</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cryptos.map((crypto) => {
                const change = crypto.price_change_percentage_24h;
                const positive = (change ?? 0) >= 0;
                return (
                  <tr key={crypto.id} className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><button type="button" onClick={() => toggleWatchlist(crypto.id)} aria-label={`${watchlist.includes(crypto.id) ? 'Remove' : 'Add'} ${crypto.name} ${watchlist.includes(crypto.id) ? 'from' : 'to'} watchlist`} className={`text-lg ${watchlist.includes(crypto.id) ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}>★</button><Image src={crypto.image} alt="" width={36} height={36} className="h-9 w-9 rounded-full" /><div><p className="font-semibold text-slate-900 dark:text-white">{crypto.name}</p><p className="text-xs font-medium uppercase text-slate-400">{crypto.symbol}</p></div></div></td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900 dark:text-white">{formatPrice(crypto.current_price)}</td>
                    <td className="px-5 py-4 text-right"><span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${positive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'}`}>{changeLabel(change)}</span></td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600 dark:text-slate-300">{formatNumber(crypto.market_cap)}</td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600 dark:text-slate-300">{formatNumber(crypto.total_volume)}</td>
                    <td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelectedCrypto(selectedCrypto === crypto.id ? null : crypto.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400">{selectedCrypto === crypto.id ? 'Hide chart' : 'View chart'}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCrypto && <CryptoCharts cryptoId={selectedCrypto} cryptoName={cryptos.find((crypto) => crypto.id === selectedCrypto)?.name || 'Cryptocurrency'} onClose={() => setSelectedCrypto(null)} />}
    </div>
  );
};

'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { DashboardFilters } from '@/types';

const sortOptions: Array<{ value: DashboardFilters['sortBy']; label: string }> = [
  { value: 'market_cap', label: 'Market cap' },
  { value: 'price', label: 'Price' },
  { value: 'change_24h', label: '24h change' },
  { value: 'volume', label: 'Volume' },
];

export const FilterBar: React.FC = () => {
  const { filters, setFilters, filteredCryptos } = useDashboard();

  const clearFilters = () => setFilters({ search: '', sortBy: 'market_cap', sortOrder: 'desc' });

  return (
    <section aria-label="Market filters" className="mb-6 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="crypto-search" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Find an asset
          </label>
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 text-slate-400">⌕</span>
            <input
              id="crypto-search"
              type="search"
              placeholder="Search by name or symbol..."
              value={filters.search}
              onChange={(event) => setFilters({ search: event.target.value })}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {filters.search && (
              <button type="button" onClick={() => setFilters({ search: '' })} aria-label="Clear search" className="absolute right-3 top-2 text-slate-400 hover:text-slate-700 dark:hover:text-white">×</button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div>
            <label htmlFor="sort-by" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort by</label>
            <select id="sort-by" value={filters.sortBy} onChange={(event) => setFilters({ sortBy: event.target.value as DashboardFilters['sortBy'] })} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort-order" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Order</label>
            <select id="sort-order" value={filters.sortOrder} onChange={(event) => setFilters({ sortOrder: event.target.value as DashboardFilters['sortOrder'] })} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <option value="desc">Highest first</option>
              <option value="asc">Lowest first</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:pb-0.5">
          <span className="text-sm text-slate-500 dark:text-slate-400"><strong className="text-slate-900 dark:text-white">{filteredCryptos.length}</strong> assets</span>
          {(filters.search || filters.sortBy !== 'market_cap' || filters.sortOrder !== 'desc') && (
            <button type="button" onClick={clearFilters} className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Reset</button>
          )}
        </div>
      </div>
    </section>
  );
};

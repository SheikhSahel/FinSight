'use client';

import { StatsHeader, FilterBar, CryptoTable } from '@/components';
import { useDashboard } from '@/context/DashboardContext';

export default function Home() {
  const { filteredCryptos, loading } = useDashboard();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsHeader />
        <FilterBar />
        <CryptoTable cryptos={filteredCryptos} loading={loading} />
      </div>
    </main>
  );
}

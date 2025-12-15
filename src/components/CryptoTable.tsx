'use client';

import React, { useState } from 'react';
import { CryptoCurrency } from '@/types';
import { CryptoCharts } from '@/components/CryptoCharts';

interface CryptoTableProps {
  cryptos: CryptoCurrency[];
  loading: boolean;
}

export const CryptoTable: React.FC<CryptoTableProps> = ({ cryptos, loading }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cryptocurrencies...</p>
        </div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">No cryptocurrencies found</p>
      </div>
    );
  }

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number): string => {
    if (price < 0.01) return `$${price.toFixed(8)}`;
    return `$${price.toFixed(2)}`;
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBgColor = (change: number): string => {
    return change >= 0
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Coin
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  24h Change
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Market Cap
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Volume 24h
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {cryptos.map((crypto, index) => (
                <tr
                  key={crypto.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {crypto.market_cap_rank}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {crypto.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {crypto.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                    {formatPrice(crypto.current_price)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${getChangeColor(
                      crypto.price_change_percentage_24h || 0
                    )}`}
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getChangeBgColor(
                        crypto.price_change_percentage_24h || 0
                      )}`}
                    >
                      {crypto.price_change_percentage_24h
                        ? `${crypto.price_change_percentage_24h > 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`
                        : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                    {formatNumber(crypto.market_cap)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
                    {formatNumber(crypto.total_volume)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        setSelectedCrypto(
                          selectedCrypto === crypto.id ? null : crypto.id
                        )
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                    >
                      {selectedCrypto === crypto.id ? 'Hide' : 'Chart'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      {selectedCrypto && (
        <CryptoCharts
          cryptoId={selectedCrypto}
          cryptoName={
            cryptos.find((c) => c.id === selectedCrypto)?.name || 'Cryptocurrency'
          }
          onClose={() => setSelectedCrypto(null)}
        />
      )}
    </div>
  );
};

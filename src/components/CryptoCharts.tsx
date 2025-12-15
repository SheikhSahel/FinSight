'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cryptoService } from '@/services/cryptoService';

interface CryptoChartsProps {
  cryptoId: string;
  cryptoName: string;
  onClose: () => void;
}

export const CryptoCharts: React.FC<CryptoChartsProps> = ({
  cryptoId,
  cryptoName,
  onClose,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90 | 365>(30);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        const data = await cryptoService.getCryptoHistory(
          cryptoId,
          selectedPeriod
        );

        const formattedData = data.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          price: parseFloat(price.toFixed(2)),
          timestamp,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [cryptoId, selectedPeriod]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600 dark:text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));
  const avgPrice =
    chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length;
  const priceChange =
    chartData[chartData.length - 1].price - chartData[0].price;
  const priceChangePercent = ((priceChange / chartData[0].price) * 100).toFixed(
    2
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {cryptoName} Price Chart
        </h2>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[7, 30, 90, 365].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {period === 7 ? '7D' : period === 30 ? '1M' : period === 90 ? '3M' : '1Y'}
          </button>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Min Price</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${minPrice.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Max Price</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${maxPrice.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Price</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${avgPrice.toFixed(2)}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${
            priceChange >= 0 ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-30' : 'bg-red-50 dark:bg-red-900 dark:bg-opacity-30'
          }`}
        >
          <p
            className={`text-sm ${
              priceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            Change
          </p>
          <p
            className={`text-xl font-bold ${
              priceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {priceChange >= 0 ? '+' : ''}
            {priceChangePercent}%
          </p>
        </div>
      </div>

      {/* Area Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Price Trend (Area)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={Math.floor(chartData.length / 10)}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number | undefined) =>
                value !== undefined ? `$${value.toFixed(2)}` : 'N/A'
              }
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Price Movement (Line)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={Math.floor(chartData.length / 10)}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number | undefined) =>
                value !== undefined ? `$${value.toFixed(2)}` : 'N/A'
              }
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

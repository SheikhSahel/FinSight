export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  atl: number;
  last_updated: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface DashboardFilters {
  search: string;
  sortBy: 'price' | 'market_cap' | 'change_24h' | 'volume';
  sortOrder: 'asc' | 'desc';
  limit: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

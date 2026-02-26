export type MarketOverviewChartPoint = {
  time: string;
  price: number;
  timestamp?: number;
};

export type MarketChartRange = "1h" | "1d" | "7d" | "1m" | "3m";

export type CoinGeckoMarket = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: {
    price: number[];
  };
  last_updated?: string;
};

export type CoinGeckoGlobal = {
  data?: {
    market_cap_percentage?: {
      btc?: number;
    };
  };
};

export type MarketOverviewPayload = {
  markets: CoinGeckoMarket[];
  global: CoinGeckoGlobal | null;
};

export type CoinGeckoMarketChart = {
  prices: [number, number][];
};

export type MarketRow = {
  symbol: string;
  price: string;
  change: string;
};

export type MarketOverviewViewModel = {
  tickerItems: MarketRow[];
  topGainers: MarketRow[];
  topLosers: MarketRow[];
  chartData: MarketOverviewChartPoint[];
  btcPriceLabel: string;
  btcChangeLabel: string;
  btcChangePositive: boolean;
  btcMarketCapLabel: string;
  btcVolumeLabel: string;
  btcDominanceLabel: string;
  greedLabel: string;
  tooltipTimeLabel: string;
  tooltipPriceLabel: string;
  isUsingFallbackData: boolean;
};

export type DefiLlamaProtocol = {
  name: string;
  tvl?: number;
  chains?: string[];
};

export type TrendingProtocolItem = {
  rank: string;
  name: string;
  chain: string;
  tvl: string;
};

export type GasNetworkKey = "ethereum" | "bnb" | "polygon";

export type GasRpcSnapshot = {
  network: GasNetworkKey;
  avgGwei: number;
};

export type GasRowItem = {
  name: string;
  dot: string;
  value: string;
  low: string;
  avg: string;
  fast: string;
};

export type FearGreedApiResponse = {
  data?: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
  }>;
};

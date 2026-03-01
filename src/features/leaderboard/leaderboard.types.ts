export type LeaderboardChain = "all" | "ethereum" | "arbitrum" | "base" | "solana";

export type LeaderboardTimeframe = "all" | "30d" | "7d" | "24h";

export type CoinGeckoMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  price_change_percentage_30d_in_currency: number | null;
  market_cap_change_24h: number | null;
  sparkline_in_7d?: { price: number[] };
};

export type LeaderboardGlobalData = {
  active_cryptocurrencies?: number;
};

export type LeaderboardGlobalResponse = {
  data?: LeaderboardGlobalData;
};

export type LeaderboardPayload = {
  markets: CoinGeckoMarket[];
  global: LeaderboardGlobalResponse | null;
};

export type LeaderboardRow = {
  rank: number;
  wallet: string;
  tier?: string;
  avatar: string;
  symbol: string;
  name: string;
  currentPrice: number;
  winRate: number;
  totalPnl: string;
  totalPnlValue: number;
  pnl30d: string;
  pnl30dValue: number;
  pnl30dPositive: boolean;
  volume: string;
  volumeValue: number;
  trades: string;
};

export type LeaderboardStats = {
  totalVolumeTraded: string;
  totalTraders: string;
  totalPnlGenerated: string;
  totalPnlPositive: boolean;
};

export type LeaderboardViewModel = {
  rows: LeaderboardRow[];
  stats: LeaderboardStats;
};

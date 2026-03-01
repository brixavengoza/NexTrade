import type {
  CoinGeckoMarket,
  LeaderboardPayload,
  LeaderboardRow,
  LeaderboardStats,
  LeaderboardTimeframe,
  LeaderboardViewModel,
} from "@/features/leaderboard/leaderboard.types";

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const signedCompactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
  signDisplay: "always",
});

function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

function formatSignedCurrency(value: number): string {
  return signedCompactCurrencyFormatter.format(value);
}

function formatCount(value: number): string {
  return integerFormatter.format(Math.max(0, Math.round(value)));
}

function getCoinPerformanceValue(
  coin: CoinGeckoMarket,
  timeframe: LeaderboardTimeframe
): number {
  if (timeframe === "30d") {
    return coin.price_change_percentage_30d_in_currency ?? Number.NEGATIVE_INFINITY;
  }
  if (timeframe === "7d") {
    return coin.price_change_percentage_7d_in_currency ?? Number.NEGATIVE_INFINITY;
  }
  if (timeframe === "24h") {
    return coin.price_change_percentage_24h ?? Number.NEGATIVE_INFINITY;
  }

  return coin.market_cap_rank > 0
    ? -coin.market_cap_rank
    : Number.NEGATIVE_INFINITY;
}

function sortMarkets(
  markets: CoinGeckoMarket[],
  timeframe: LeaderboardTimeframe
): CoinGeckoMarket[] {
  return [...markets].sort((a, b) => {
    if (timeframe === "all") {
      return (a.market_cap_rank || Number.MAX_SAFE_INTEGER) -
        (b.market_cap_rank || Number.MAX_SAFE_INTEGER);
    }

    return getCoinPerformanceValue(b, timeframe) - getCoinPerformanceValue(a, timeframe);
  });
}

function deriveWinRate(coin: CoinGeckoMarket): number {
  const points = [
    coin.price_change_percentage_24h,
    coin.price_change_percentage_7d_in_currency,
    coin.price_change_percentage_30d_in_currency,
  ].filter((value): value is number => typeof value === "number");

  if (!points.length) {
    return 50;
  }

  const positives = points.filter((value) => value > 0).length;
  const momentum = points.reduce((acc, value) => acc + value, 0) / points.length;
  const boundedMomentum = Math.max(-10, Math.min(momentum, 30));

  const score = 45 + positives * 15 + boundedMomentum;
  return Math.max(20, Math.min(95, Math.round(score)));
}

function toPseudoWallet(coinId: string): string {
  let hash = 2166136261;

  for (let index = 0; index < coinId.length; index += 1) {
    hash ^= coinId.charCodeAt(index);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  const hex = (hash >>> 0).toString(16).padStart(8, "0");
  return `0x${hex.slice(0, 2)}...${hex.slice(-4)}`;
}

function estimateTrades(coin: CoinGeckoMarket): string {
  const currentPrice = coin.current_price || 1;
  const estimatedTrades = coin.total_volume / Math.max(currentPrice, 0.0001);
  return formatCount(estimatedTrades);
}

function toLeaderboardRows(
  markets: CoinGeckoMarket[],
  timeframe: LeaderboardTimeframe
): LeaderboardRow[] {
  const sorted = sortMarkets(markets, timeframe).slice(0, 100);

  return sorted.map((coin, index) => {
    const dailyChange = coin.market_cap_change_24h ?? 0;
    const monthlyPercentage = coin.price_change_percentage_30d_in_currency ?? 0;
    const monthlyPnlEstimate = coin.market_cap * (monthlyPercentage / 100);

    return {
      rank: index + 1,
      wallet: toPseudoWallet(coin.id),
      tier: index === 0 ? `${coin.symbol.toUpperCase()} ${coin.name}` : undefined,
      avatar: coin.image,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      currentPrice: coin.current_price,
      winRate: deriveWinRate(coin),
      totalPnl: formatSignedCurrency(dailyChange),
      totalPnlValue: dailyChange,
      pnl30d: formatSignedCurrency(monthlyPnlEstimate),
      pnl30dValue: monthlyPnlEstimate,
      pnl30dPositive: monthlyPnlEstimate >= 0,
      volume: formatCompactCurrency(coin.total_volume),
      volumeValue: coin.total_volume,
      trades: estimateTrades(coin),
    };
  });
}

function toLeaderboardStats(payload: LeaderboardPayload): LeaderboardStats {
  const totalVolume = payload.markets.reduce(
    (acc, market) => acc + (market.total_volume || 0),
    0
  );
  const totalDailyPnl = payload.markets.reduce(
    (acc, market) => acc + (market.market_cap_change_24h || 0),
    0
  );

  const totalTraders = payload.global?.data?.active_cryptocurrencies || payload.markets.length;

  return {
    totalVolumeTraded: formatCompactCurrency(totalVolume),
    totalTraders: formatCount(totalTraders),
    totalPnlGenerated: formatSignedCurrency(totalDailyPnl),
    totalPnlPositive: totalDailyPnl >= 0,
  };
}

export function toLeaderboardViewModel(
  payload: LeaderboardPayload,
  timeframe: LeaderboardTimeframe
): LeaderboardViewModel {
  return {
    rows: toLeaderboardRows(payload.markets, timeframe),
    stats: toLeaderboardStats(payload),
  };
}

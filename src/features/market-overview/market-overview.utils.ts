import type {
  CoinGeckoMarketChart,
  CoinGeckoMarket,
  DefiLlamaProtocol,
  GasRowItem,
  GasRpcSnapshot,
  MarketChartRange,
  MarketOverviewChartPoint,
  MarketOverviewPayload,
  MarketOverviewViewModel,
  MarketRow,
  TrendingProtocolItem,
} from "@/features/market-overview/market-overview.types";

const FALLBACK_TICKER: MarketRow[] = [
  { symbol: "BTC", price: "$64,230.50", change: "+2.4%" },
  { symbol: "ETH", price: "$3,450.12", change: "-0.8%" },
  { symbol: "SOL", price: "$145.80", change: "+5.2%" },
  { symbol: "BNB", price: "$590.20", change: "+1.1%" },
  { symbol: "ADA", price: "$0.45", change: "-1.5%" },
  { symbol: "XRP", price: "$0.62", change: "+0.5%" },
  { symbol: "DOGE", price: "$0.16", change: "+8.4%" },
  { symbol: "DOT", price: "$7.20", change: "-2.1%" },
];

const FALLBACK_GAINERS: MarketRow[] = [
  { symbol: "PEPE", price: "$0.000008", change: "+18.4%" },
  { symbol: "RNDR", price: "$10.24", change: "+12.1%" },
  { symbol: "NEAR", price: "$7.85", change: "+9.5%" },
  { symbol: "FET", price: "$2.40", change: "+8.2%" },
  { symbol: "AGIX", price: "$0.98", change: "+7.9%" },
];

const FALLBACK_LOSERS: MarketRow[] = [
  { symbol: "WIF", price: "$3.10", change: "-8.4%" },
  { symbol: "OP", price: "$2.34", change: "-5.1%" },
  { symbol: "ARB", price: "$1.12", change: "-4.5%" },
  { symbol: "LDO", price: "$2.05", change: "-3.8%" },
  { symbol: "TIA", price: "$10.45", change: "-3.2%" },
];

export function formatCurrency(value: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    ...opts,
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(value: number) {
  if (value >= 1000) return formatCurrency(value, { maximumFractionDigits: 2 });
  if (value >= 1) return formatCurrency(value, { maximumFractionDigits: 2 });
  if (value >= 0.01) return formatCurrency(value, { maximumFractionDigits: 4 });
  return formatCurrency(value, { maximumFractionDigits: 8 });
}

export function formatPct(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "0.0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function changeTone(change: string) {
  return change.startsWith("-")
    ? "text-danger bg-danger/10"
    : "text-success bg-success/10";
}

function mapRow(coin: CoinGeckoMarket): MarketRow {
  return {
    symbol: coin.symbol.toUpperCase(),
    price: formatPrice(coin.current_price),
    change: formatPct(coin.price_change_percentage_24h),
  };
}

function buildChartData(coin?: CoinGeckoMarket): MarketOverviewChartPoint[] {
  const prices = coin?.sparkline_in_7d?.price ?? [];
  if (!prices.length) return [];

  const last24 = prices.slice(-24);
  const endTime = coin?.last_updated
    ? new Date(coin.last_updated).getTime()
    : Date.now();
  const startTime = endTime - (last24.length - 1) * 60 * 60 * 1000;

  return last24.map((price, index) => {
    const date = new Date(startTime + index * 60 * 60 * 1000);
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      price,
      timestamp: date.getTime(),
    };
  });
}

export function formatChartHoverTime(timestamp?: number) {
  if (!timestamp) return "Live";

  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${isToday ? "Today" : date.toLocaleDateString("en-US")}, ${time}`;
}

export function formatCompactHoverPrice(value?: number) {
  if (value == null || Number.isNaN(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function buildBitcoinChartPoints(
  data: CoinGeckoMarketChart | undefined,
  range: MarketChartRange
): MarketOverviewChartPoint[] {
  const points = data?.prices ?? [];
  if (!points.length) return [];

  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  const filtered =
    range === "1h" ? points.filter(([ts]) => ts >= oneHourAgo) : points;

  const samplingLimitMap: Record<MarketChartRange, number> = {
    "1h": 12,
    "1d": 24,
    "7d": 42,
    "1m": 60,
    "3m": 72,
  };

  const limit = samplingLimitMap[range];
  const source =
    filtered.length > limit
      ? filtered.filter(
          (_, index) => index % Math.ceil(filtered.length / limit) === 0
        )
      : filtered;

  return source.map(([timestamp, price]) => {
    const date = new Date(timestamp);
    const time =
      range === "1h" || range === "1d"
        ? date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

    return { time, price, timestamp };
  });
}

export function buildTrendingProtocolsView(
  protocols: DefiLlamaProtocol[] | undefined
): TrendingProtocolItem[] {
  const sorted =
    protocols
      ?.filter((item) => typeof item.tvl === "number" && item.tvl > 0)
      .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
      .slice(0, 4) ?? [];

  return sorted.map((protocol, index) => ({
    rank: `${index + 1}`.padStart(2, "0"),
    name: protocol.name,
    chain: protocol.chains?.[0] ?? "Multi-chain",
    tvl: formatCompactCurrency(protocol.tvl ?? 0),
  }));
}

function formatGasNumber(value: number) {
  if (!Number.isFinite(value)) return "--";
  const rounded =
    value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded}`;
}

export function buildGasRowsView(
  snapshots: GasRpcSnapshot[] | undefined
): GasRowItem[] {
  const meta = {
    ethereum: { name: "Ethereum", dot: "bg-blue-500" },
    bnb: { name: "BNB Chain", dot: "bg-yellow-500" },
    polygon: { name: "Polygon", dot: "bg-purple-500" },
  } as const;

  return (snapshots ?? []).map((snapshot) => {
    const avg = Math.max(snapshot.avgGwei, 0);
    const low = Math.max(avg * 0.9, avg - 1);
    const fast = avg < 10 ? avg * 1.1 : avg * 1.15;

    return {
      name: meta[snapshot.network].name,
      dot: meta[snapshot.network].dot,
      value: `${formatGasNumber(avg)} Gwei`,
      low: formatGasNumber(low),
      avg: formatGasNumber(avg),
      fast: formatGasNumber(fast),
    };
  });
}

export function buildMarketOverviewView(
  payload?: MarketOverviewPayload
): MarketOverviewViewModel {
  const rankedMarkets =
    payload?.markets?.filter((coin) => Number.isFinite(coin.current_price)) ??
    [];

  const tickerItems = rankedMarkets.length
    ? rankedMarkets.slice(0, 8).map(mapRow)
    : FALLBACK_TICKER;

  const moversSource = rankedMarkets
    .filter((coin) => coin.price_change_percentage_24h != null)
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h ?? 0) -
        (a.price_change_percentage_24h ?? 0)
    );

  const topGainers = moversSource.length
    ? moversSource.slice(0, 5).map(mapRow)
    : FALLBACK_GAINERS;

  const topLosers = moversSource.length
    ? [...moversSource].slice(-5).reverse().map(mapRow)
    : FALLBACK_LOSERS;

  const btc =
    rankedMarkets.find((coin) => coin.id === "bitcoin") ??
    rankedMarkets.find((coin) => coin.symbol.toLowerCase() === "btc");

  const chartData = buildChartData(btc);
  const btcPrice = btc?.current_price ?? 64230.5;
  const btcChange = btc?.price_change_percentage_24h ?? 2.4;
  const btcMarketCap = btc?.market_cap ?? 1.24e12;
  const btcVolume = btc?.total_volume ?? 45.2e9;
  const btcDominance =
    payload?.global?.data?.market_cap_percentage?.btc ?? 52.4;
  const greedLabel =
    btcChange > 3 ? "76 (Greed)" : btcChange > 0 ? "72 (Greed)" : "43 (Fear)";
  const lastChartPoint = chartData[chartData.length - 1];

  return {
    tickerItems,
    topGainers,
    topLosers,
    chartData,
    btcPriceLabel: formatCurrency(btcPrice),
    btcChangeLabel: formatPct(btcChange),
    btcChangePositive: btcChange >= 0,
    btcMarketCapLabel: formatCompactCurrency(btcMarketCap),
    btcVolumeLabel: formatCompactCurrency(btcVolume),
    btcDominanceLabel: `${btcDominance.toFixed(1)}%`,
    greedLabel,
    tooltipTimeLabel: lastChartPoint?.time
      ? `Today, ${lastChartPoint.time}`
      : "Live",
    tooltipPriceLabel: lastChartPoint
      ? formatCurrency(lastChartPoint.price)
      : formatCurrency(btcPrice),
    isUsingFallbackData: rankedMarkets.length === 0,
  };
}

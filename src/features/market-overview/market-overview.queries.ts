import { queryOptions } from "@tanstack/react-query";

import { blockchain } from "@/features/market-overview/market-overview.api";
import type { MarketChartRange } from "@/features/market-overview/market-overview.types";

export const marketOverviewQueryKey = ["market-overview", "coingecko"] as const;

export function marketOverviewQueryOptions({
  revalidateSeconds = 60,
}: {
  revalidateSeconds?: number;
} = {}) {
  return queryOptions({
    queryKey: marketOverviewQueryKey,
    queryFn: () =>
      blockchain.getMarketOverview({ revalidate: revalidateSeconds }),
    staleTime: revalidateSeconds * 1000,
    refetchInterval: revalidateSeconds * 1000,
    refetchOnWindowFocus: false,
  });
}

export function bitcoinChartQueryOptions(
  range: MarketChartRange,
  { revalidateSeconds = 60 }: { revalidateSeconds?: number } = {}
) {
  return queryOptions({
    queryKey: ["market-overview", "btc-chart", range] as const,
    queryFn: () =>
      blockchain.getBitcoinChart(range, { revalidate: revalidateSeconds }),
    staleTime: revalidateSeconds * 1000,
    refetchInterval: revalidateSeconds * 1000,
    refetchOnWindowFocus: false,
  });
}

export function trendingProtocolsQueryOptions({
  revalidateSeconds = 300,
}: {
  revalidateSeconds?: number;
} = {}) {
  return queryOptions({
    queryKey: ["market-overview", "trending-protocols"] as const,
    queryFn: () => blockchain.getTrendingProtocols(),
    staleTime: revalidateSeconds * 1000,
    refetchInterval: revalidateSeconds * 1000,
    refetchOnWindowFocus: false,
  });
}

export function gasOverviewQueryOptions({
  revalidateSeconds = 60,
}: {
  revalidateSeconds?: number;
} = {}) {
  return queryOptions({
    queryKey: ["market-overview", "gas-overview"] as const,
    queryFn: () => blockchain.getGasOverview({ revalidate: revalidateSeconds }),
    staleTime: revalidateSeconds * 1000,
    refetchInterval: revalidateSeconds * 1000,
    refetchOnWindowFocus: false,
  });
}

export function fearGreedQueryOptions({
  revalidateSeconds = 300,
}: {
  revalidateSeconds?: number;
} = {}) {
  return queryOptions({
    queryKey: ["market-overview", "fear-greed"] as const,
    queryFn: () => blockchain.getFearGreedIndex({ revalidate: revalidateSeconds }),
    staleTime: revalidateSeconds * 1000,
    refetchInterval: revalidateSeconds * 1000,
    refetchOnWindowFocus: false,
  });
}

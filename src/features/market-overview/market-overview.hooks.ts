"use client";

import { useQuery } from "@tanstack/react-query";

import {
  bitcoinChartQueryOptions,
  fearGreedQueryOptions,
  gasOverviewQueryOptions,
  marketOverviewQueryOptions,
  trendingProtocolsQueryOptions,
} from "@/features/market-overview/market-overview.queries";
import type { MarketChartRange } from "@/features/market-overview/market-overview.types";

export function useGetMarketOverview() {
  return useQuery(marketOverviewQueryOptions());
}

export function useGetBitcoinChart(range: MarketChartRange) {
  return useQuery(bitcoinChartQueryOptions(range));
}

export function useGetTrendingProtocols() {
  return useQuery(trendingProtocolsQueryOptions());
}

export function useGetGasOverview() {
  return useQuery(gasOverviewQueryOptions());
}

export function useGetFearGreedIndex() {
  return useQuery(fearGreedQueryOptions());
}

"use client";

import { BtcChartPanel } from "@/components/features/market-overview/btc-chart-panel";
import { GasTrackerPanel } from "@/components/features/market-overview/gas-tracker-panel";
import { MarketMoversPanel } from "@/components/features/market-overview/movers-panel";
import { MarketTickerTape } from "@/components/features/market-overview/ticker-tape";
import { TrendingDefiPanel } from "@/components/features/market-overview/trending-defi-panel";

export function MarketOverviewPageClient() {
  return (
    <div className="space-y-6">
      <MarketTickerTape />

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 lg:grid-cols-12">
        <MarketMoversPanel />
        <BtcChartPanel />
        <div className="flex flex-col gap-6 lg:col-span-3">
          <TrendingDefiPanel />
          <GasTrackerPanel />
        </div>
      </div>
    </div>
  );
}

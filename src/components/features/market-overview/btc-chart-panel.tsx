"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { MarketOverviewChart } from "@/components/features/market-overview-chart";
import {
  useGetBitcoinChart,
  useGetFearGreedIndex,
  useGetMarketOverview,
} from "@/features/market-overview/market-overview.hooks";
import type { MarketChartRange } from "@/features/market-overview/market-overview.types";
import {
  buildBitcoinChartPoints,
  buildMarketOverviewView,
} from "@/features/market-overview/market-overview.utils";

export function BtcChartPanel() {
  const [selectedRange, setSelectedRange] = useState<MarketChartRange>("1d");
  const { data } = useGetMarketOverview();
  const { data: chartResponse } = useGetBitcoinChart(selectedRange);
  const { data: fearGreedResponse } = useGetFearGreedIndex();

  const view = buildMarketOverviewView(data);
  const chartData = buildBitcoinChartPoints(chartResponse, selectedRange);
  const fearGreed = fearGreedResponse?.data?.[0];
  const fearGreedLabel =
    fearGreed?.value && fearGreed?.value_classification
      ? `${fearGreed.value} (${fearGreed.value_classification})`
      : view.greedLabel;

  const stats = [
    { label: "Market Cap", value: view.btcMarketCapLabel },
    { label: "24h Vol", value: view.btcVolumeLabel },
    { label: "Dominance", value: view.btcDominanceLabel },
    {
      label: "Greed Index",
      value: fearGreedLabel,
      tone: "success" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 lg:col-span-6">
      <section className="surface-card surface-card-hover flex min-h-[500px] flex-col p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7931A] text-white">
              <span className="font-mono text-sm font-bold">₿</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-tight text-white">
                BTC/USDT
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg text-primary">
                  {view.btcPriceLabel}
                </span>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    view.btcChangePositive ? "text-success" : "text-danger"
                  }`}
                >
                  {view.btcChangePositive ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  {view.btcChangeLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center rounded-lg border border-border bg-background p-1">
            {(["1h", "1d", "7d", "1m", "3m"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={
                  range === selectedRange
                    ? "rounded bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-[0_0_14px_rgba(0,229,255,0.2)]"
                    : "rounded px-3 py-1 text-xs font-bold text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                }
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-6 h-[320px] w-full overflow-hidden rounded-lg border border-border/40 bg-[#080B11]/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.01)]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <MarketOverviewChart
            data={chartData.length ? chartData : view.chartData}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative cursor-default overflow-hidden rounded-lg border border-border bg-background p-3 text-center transition-colors hover:border-primary/50"
            >
              {stat.label === "Greed Index" ? (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-success/10 to-transparent duration-1000 group-hover:translate-x-full" />
              ) : null}
              <p className="relative mb-1 text-xs uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p
                className={`relative font-mono text-sm font-medium ${
                  stat.tone === "success" ? "text-success" : "text-white"
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { useGetMarketOverview } from "@/features/market-overview/market-overview.hooks";
import type { MarketRow } from "@/features/market-overview/market-overview.types";
import {
  buildMarketOverviewView,
  changeTone,
} from "@/features/market-overview/market-overview.utils";

function MoversCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "up" | "down";
  items: MarketRow[];
}) {
  return (
    <div className="surface-card surface-card-hover flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 text-white">
          {tone === "up" ? (
            <TrendingUp className="size-4 text-success" />
          ) : (
            <TrendingDown className="size-4 text-danger" />
          )}
          <h3 className="text-sm font-semibold uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <button className="text-xs text-primary hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                {item.symbol.slice(0, 4)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.symbol}</p>
                <p className="font-mono text-xs text-slate-400">{item.price}</p>
              </div>
            </div>
            <span
              className={`rounded px-2 py-1 font-mono text-sm ${changeTone(item.change)}`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketMoversPanel() {
  const { data } = useGetMarketOverview();
  const view = buildMarketOverviewView(data);

  return (
    <div className="flex flex-col gap-6 lg:col-span-3">
      <MoversCard title="Top Gainers" tone="up" items={view.topGainers} />
      <MoversCard title="Top Losers" tone="down" items={view.topLosers} />
    </div>
  );
}

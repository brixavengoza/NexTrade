"use client";

import { useGetMarketOverview } from "@/features/market-overview/market-overview.hooks";
import { buildMarketOverviewView } from "@/features/market-overview/market-overview.utils";

export function MarketTickerTape() {
  const { data } = useGetMarketOverview();
  const { tickerItems } = buildMarketOverviewView(data);
  const tickerLoop = [...tickerItems, ...tickerItems.slice(0, 4)];

  return (
    <div className="-mx-4 border-y border-border bg-card/50 sm:-mx-6">
      <div className="flex h-12 items-center overflow-hidden">
        <div className="flex w-max animate-ticker items-center gap-8 whitespace-nowrap px-4">
          {tickerLoop.map((item, index) => (
            <div
              key={`${item.symbol}-${index}`}
              className="flex items-center gap-8"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">{item.symbol}</span>
                <span className="font-mono text-sm text-white">
                  {item.price}
                </span>
                <span
                  className={`font-mono text-xs ${
                    item.change.startsWith("-") ? "text-danger" : "text-success"
                  }`}
                >
                  {item.change}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

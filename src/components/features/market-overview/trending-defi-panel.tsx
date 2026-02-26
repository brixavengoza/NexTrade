"use client";

import { Flame } from "lucide-react";

import { useGetTrendingProtocols } from "@/features/market-overview/market-overview.hooks";
import { buildTrendingProtocolsView } from "@/features/market-overview/market-overview.utils";

export function TrendingDefiPanel() {
  const { data } = useGetTrendingProtocols();
  const trendProtocols = buildTrendingProtocolsView(data);

  return (
    <section className="surface-card surface-card-hover p-5">
      <div className="mb-5 flex items-center gap-2 text-white">
        <Flame className="size-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Trending DeFi
        </h3>
      </div>
      <div className="space-y-4">
        {trendProtocols.map((protocol, index) => (
          <div key={protocol.rank}>
            <div className="group flex cursor-pointer items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-500">
                  {protocol.rank}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white transition-colors group-hover:text-primary">
                    {protocol.name}
                  </span>
                  <span className="mt-0.5 w-fit rounded bg-border px-1.5 text-[10px] text-slate-400">
                    {protocol.chain}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-slate-500">TVL</p>
                <p className="font-mono text-sm font-medium text-white">
                  {protocol.tvl}
                </p>
              </div>
            </div>
            {index < trendProtocols.length - 1 ? (
              <div className="mt-4 h-px w-full bg-border" />
            ) : null}
          </div>
        ))}
        {trendProtocols.length === 0 ? (
          <div className="rounded border border-border bg-background/60 px-3 py-4 text-sm text-slate-500">
            DeFiLlama data unavailable.
          </div>
        ) : null}
      </div>
    </section>
  );
}

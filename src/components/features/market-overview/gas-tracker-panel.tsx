"use client";

import { Fuel } from "lucide-react";

import { useGetGasOverview } from "@/features/market-overview/market-overview.hooks";
import { buildGasRowsView } from "@/features/market-overview/market-overview.utils";

export function GasTrackerPanel() {
  const { data } = useGetGasOverview();
  const gasRows = buildGasRowsView(data);

  return (
    <section className="surface-card surface-card-hover flex-1 p-5">
      <div className="mb-5 flex items-center gap-2 text-white">
        <Fuel className="size-4 text-slate-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Gas Tracker
        </h3>
      </div>
      <div className="space-y-4">
        {gasRows.map((row) => (
          <div
            key={row.name}
            className="rounded border border-border bg-background p-3 transition-colors hover:border-primary/30"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${row.dot}`} />
                <span className="text-sm font-bold text-white">{row.name}</span>
              </div>
              <span className="font-mono text-sm text-primary">
                {row.value}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="rounded bg-card/50 py-1">
                <span className="block text-[10px] text-slate-500">Low</span>
                <span className="block font-mono text-xs text-white">
                  {row.low}
                </span>
              </div>
              <div className="rounded border border-success/30 bg-card/50 py-1">
                <span className="block text-[10px] text-success">Avg</span>
                <span className="block font-mono text-xs text-white">
                  {row.avg}
                </span>
              </div>
              <div className="rounded bg-card/50 py-1">
                <span className="block text-[10px] text-slate-500">Fast</span>
                <span className="block font-mono text-xs text-white">
                  {row.fast}
                </span>
              </div>
            </div>
          </div>
        ))}
        {gasRows.length === 0 ? (
          <div className="rounded border border-border bg-background/60 px-3 py-4 text-sm text-slate-500">
            Gas RPC endpoints unavailable.
          </div>
        ) : null}
      </div>
    </section>
  );
}

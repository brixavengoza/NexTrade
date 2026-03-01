"use client";

import Image from "next/image";
import { BarChart3, Diamond, Eye, Flame, Layers, Sun, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import Container from "@/components/container";
import { useGetLeaderboard } from "@/features/leaderboard/leaderboard.hooks";
import type {
  LeaderboardChain,
  LeaderboardRow,
  LeaderboardTimeframe,
} from "@/features/leaderboard/leaderboard.types";
import { toLeaderboardViewModel } from "@/features/leaderboard/leaderboard.utils";

type CopyTradeConfig = {
  wallet: string;
  symbol: string;
  chain: LeaderboardChain;
  allocationUsd: number;
  maxPositionSize: number;
  stopLoss: number;
  copiedAt: string;
};

const COPY_TRADING_STORAGE_KEY = "nextrade:copy-trading";
const COPY_TRADING_CHANGE_EVENT = "nextrade-copy-trading-change";
const EMPTY_COPY_TRADES: CopyTradeConfig[] = [];
let copyTradingRawCache: string | null = null;
let copyTradingParsedCache: CopyTradeConfig[] = EMPTY_COPY_TRADES;

const timeframeTabs: { label: string; value: LeaderboardTimeframe }[] = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "30d" },
  { label: "This Week", value: "7d" },
  { label: "24H", value: "24h" },
];

const chainTabs: {
  label: string;
  value: LeaderboardChain;
  icon: ReactNode;
}[] = [
  { label: "Ethereum", value: "ethereum", icon: <Diamond className="size-3.5" /> },
  { label: "Arbitrum", value: "arbitrum", icon: <Layers className="size-3.5" /> },
  {
    label: "Base",
    value: "base",
    icon: <span className="size-3 rounded-full bg-slate-500" />,
  },
  { label: "Solana", value: "solana", icon: <Sun className="size-3.5" /> },
];

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US");

function formatUsd(value: number) {
  return usdFormatter.format(value);
}

function readCopyTradingStorage(): CopyTradeConfig[] {
  if (typeof window === "undefined") {
    return EMPTY_COPY_TRADES;
  }

  try {
    const raw = window.localStorage.getItem(COPY_TRADING_STORAGE_KEY);
    if (raw === copyTradingRawCache) {
      return copyTradingParsedCache;
    }

    copyTradingRawCache = raw;
    if (!raw) {
      copyTradingParsedCache = EMPTY_COPY_TRADES;
      return copyTradingParsedCache;
    }

    const parsed = JSON.parse(raw) as CopyTradeConfig[];
    if (!Array.isArray(parsed)) {
      copyTradingParsedCache = EMPTY_COPY_TRADES;
      return copyTradingParsedCache;
    }

    copyTradingParsedCache = parsed;
    return copyTradingParsedCache;
  } catch {
    copyTradingRawCache = null;
    copyTradingParsedCache = EMPTY_COPY_TRADES;
    return copyTradingParsedCache;
  }
}

function writeCopyTradingStorage(configs: CopyTradeConfig[]) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(configs);
  window.localStorage.setItem(COPY_TRADING_STORAGE_KEY, serialized);
  copyTradingRawCache = serialized;
  copyTradingParsedCache = configs;
}

function notifyCopyTradingStorageChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(COPY_TRADING_CHANGE_EVENT));
}

function subscribeCopyTradingStore(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorageEvent = () => callback();
  window.addEventListener("storage", handleStorageEvent);
  window.addEventListener(COPY_TRADING_CHANGE_EVENT, handleStorageEvent);

  return () => {
    window.removeEventListener("storage", handleStorageEvent);
    window.removeEventListener(COPY_TRADING_CHANGE_EVENT, handleStorageEvent);
  };
}

function getCopyTradingClientSnapshot() {
  return readCopyTradingStorage();
}

function getCopyTradingServerSnapshot() {
  return EMPTY_COPY_TRADES;
}

function rankStyles(rank: number) {
  if (rank === 1) {
    return {
      row: "bg-yellow-500/5 hover:bg-yellow-500/10",
      marker: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
      badge: "bg-yellow-500/20 text-yellow-500",
    };
  }
  if (rank === 2) {
    return {
      row: "hover:bg-slate-800/50",
      marker: "bg-slate-400/60 shadow-[0_0_10px_rgba(148,163,184,0.5)]",
      badge: "bg-slate-400/20 text-slate-300",
    };
  }
  if (rank === 3) {
    return {
      row: "hover:bg-orange-900/10",
      marker: "bg-orange-700/60 shadow-[0_0_10px_rgba(194,65,12,0.5)]",
      badge: "bg-orange-700/20 text-orange-400",
    };
  }
  return {
    row: "hover:bg-slate-800/30",
    marker: "bg-transparent",
    badge: "text-slate-400",
  };
}

function getSuggestedAllocation(row: LeaderboardRow) {
  return Math.max(100, Math.min(25000, Math.round(row.volumeValue * 0.00001)));
}

function getSuggestedStopLoss(row: LeaderboardRow) {
  return Math.max(3, Math.min(30, Math.round(30 - row.winRate / 2)));
}

type CopyPanelProps = {
  row: LeaderboardRow | undefined;
  allocationUsd: number;
  maxPositionSize: number;
  stopLoss: number;
  copiedTrades: CopyTradeConfig[];
  onAllocationChange: (value: number) => void;
  onMaxPositionSizeChange: (value: number) => void;
  onStopLossChange: (value: number) => void;
  onCopy: () => void;
};

function CopyPanel({
  row,
  allocationUsd,
  maxPositionSize,
  stopLoss,
  copiedTrades,
  onAllocationChange,
  onMaxPositionSizeChange,
  onStopLossChange,
  onCopy,
}: CopyPanelProps) {
  const activeConfig = copiedTrades.find((trade) => trade.wallet === row?.wallet);

  return (
    <aside className="h-fit w-full shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-2xl xl:w-[360px]">
      <div className="flex items-center justify-between border-b border-border bg-[#1C2333]/50 p-5">
        <h3 className="text-lg font-bold text-white">Copy Trading</h3>
      </div>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4 border-b border-dashed border-border pb-4">
          {row?.avatar ? (
            <Image
              src={row.avatar}
              alt="Selected trader avatar"
              width={56}
              height={56}
              className="size-14 rounded-full border-2 border-primary object-cover shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            />
          ) : (
            <div className="size-14 rounded-full border-2 border-primary bg-primary/20" />
          )}
          <div className="flex flex-col">
            <span className="mb-0.5 text-xs font-bold uppercase tracking-wider text-primary">
              Selected Trader
            </span>
            <span className="font-mono text-lg font-bold text-white">
              {row?.wallet ?? "No trader selected"}
            </span>
            {row ? (
              <div className="mt-1 flex flex-wrap gap-3 text-xs">
                <span className="font-medium text-green-400">Win: {row.winRate}%</span>
                <span className="text-slate-400">
                  {row.symbol} {formatUsd(row.currentPrice)}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {row ? (
          <>
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-background/60 p-3 text-xs">
              <div className="space-y-1">
                <p className="text-slate-400">30D PnL</p>
                <p className={row.pnl30dPositive ? "text-green-400" : "text-red-400"}>
                  {row.pnl30d}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-slate-400">24H PnL</p>
                <p className={row.totalPnlValue >= 0 ? "text-green-400" : "text-red-400"}>
                  {row.totalPnl}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Allocation (USDT)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={allocationUsd}
                    min={1}
                    onChange={(event) => onAllocationChange(Number(event.target.value) || 0)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-white transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-2.5 text-sm font-bold text-slate-500">
                    USDT
                  </span>
                </div>
                <div className="flex justify-between px-1 text-xs text-slate-500">
                  <span>Suggested: {formatUsd(getSuggestedAllocation(row))}</span>
                  <button
                    className="text-primary hover:underline"
                    onClick={() => onAllocationChange(getSuggestedAllocation(row))}
                  >
                    Use
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Max Position Size</label>
                  <span className="font-mono text-sm font-bold text-primary">
                    {maxPositionSize}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={maxPositionSize}
                  onChange={(event) =>
                    onMaxPositionSizeChange(Number(event.target.value) || maxPositionSize)
                  }
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-primary"
                />
                <div className="flex justify-between px-1 font-mono text-xs text-slate-500">
                  <span>1%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Stop Loss %</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={stopLoss}
                    onChange={(event) => onStopLossChange(Number(event.target.value) || 0)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-white transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-2.5 text-sm font-bold text-slate-500">
                    %
                  </span>
                </div>
                <div className="flex justify-between px-1 text-xs text-slate-500">
                  <span>Suggested: {getSuggestedStopLoss(row)}%</span>
                  <button
                    className="text-primary hover:underline"
                    onClick={() => onStopLossChange(getSuggestedStopLoss(row))}
                  >
                    Use
                  </button>
                </div>
              </div>
            </div>

            <button
              className="mt-2 w-full rounded-lg bg-primary py-3 text-base font-bold text-background shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]"
              onClick={onCopy}
            >
              {activeConfig ? "Update Copy Trading" : "Start Copy Trading"}
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-400">
            Select a trader from the table to configure copy trading.
          </p>
        )}

        <div className="space-y-2 border-t border-border pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Active Copied Traders
          </h4>
          {copiedTrades.length === 0 ? (
            <p className="text-xs text-slate-500">No active copy strategies yet.</p>
          ) : (
            copiedTrades.slice(0, 5).map((trade) => (
              <div
                key={trade.wallet}
                className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2 text-xs"
              >
                <div className="space-y-1">
                  <p className="font-mono text-slate-200">{trade.wallet}</p>
                  <p className="text-slate-500">
                    {trade.symbol} | {trade.chain.toUpperCase()}
                  </p>
                </div>
                <p className="font-mono text-primary">{formatUsd(trade.allocationUsd)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

export function LeaderboardPageClient() {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>("all");
  const [chain, setChain] = useState<LeaderboardChain>("ethereum");
  const [page, setPage] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [allocationUsd, setAllocationUsd] = useState<number | null>(null);
  const [maxPositionSize, setMaxPositionSize] = useState<number | null>(null);
  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const copyPanelRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 20;
  const copiedTrades = useSyncExternalStore(
    subscribeCopyTradingStore,
    getCopyTradingClientSnapshot,
    getCopyTradingServerSnapshot
  );

  const { data, isLoading, isError } = useGetLeaderboard(chain);
  const viewModel = data ? toLeaderboardViewModel(data, timeframe) : null;
  const totalRows = viewModel?.rows.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const allRows = viewModel?.rows ?? [];
  const visibleRows = viewModel?.rows.slice(startIndex, endIndex) ?? [];
  const selectedRow = selectedWallet
    ? allRows.find((row) => row.wallet === selectedWallet) ?? null
    : null;
  const activeRow = selectedRow ?? (!selectedWallet ? visibleRows[0] : undefined);
  const derivedAllocationUsd = activeRow ? getSuggestedAllocation(activeRow) : 0;
  const derivedMaxPositionSize = activeRow
    ? Math.max(1, Math.min(100, Math.round(activeRow.winRate / 2)))
    : 25;
  const derivedStopLoss = activeRow ? getSuggestedStopLoss(activeRow) : 10;
  const allocationValue = allocationUsd ?? derivedAllocationUsd;
  const maxPositionValue = maxPositionSize ?? derivedMaxPositionSize;
  const stopLossValue = stopLoss ?? derivedStopLoss;

  const handleFocusTrader = (row: LeaderboardRow) => {
    setSelectedWallet(row.wallet);
    setAllocationUsd(getSuggestedAllocation(row));
    setMaxPositionSize(Math.max(1, Math.min(100, Math.round(row.winRate / 2))));
    setStopLoss(getSuggestedStopLoss(row));
    copyPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCopy = () => {
    if (!activeRow) {
      toast.error("Select a trader before starting copy trading.");
      return;
    }

    if (allocationValue <= 0 || maxPositionValue <= 0 || stopLossValue <= 0) {
      toast.error("Allocation, position size, and stop loss must be greater than zero.");
      return;
    }

    const payload: CopyTradeConfig = {
      wallet: activeRow.wallet,
      symbol: activeRow.symbol,
      chain,
      allocationUsd: allocationValue,
      maxPositionSize: maxPositionValue,
      stopLoss: stopLossValue,
      copiedAt: new Date().toISOString(),
    };

    const existingIndex = copiedTrades.findIndex((item) => item.wallet === payload.wallet);
    const next =
      existingIndex >= 0
        ? copiedTrades.map((item, index) => (index === existingIndex ? payload : item))
        : [payload, ...copiedTrades];

    writeCopyTradingStorage(next);
    notifyCopyTradingStorageChange();

    toast.success(`Copy trading ${activeRow.wallet} is now active.`);
  };

  return (
    <Container className="py-6 md:py-10">
      <main className="flex flex-1 flex-col gap-6 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-2">
              <h1 className="relative w-fit font-display text-4xl font-black tracking-tight text-white md:text-5xl">
                Leaderboard
                <span className="absolute -bottom-2 left-0 h-1 w-1/2 rounded-full bg-gradient-to-r from-primary to-transparent shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
              </h1>
              <p className="mt-2 text-base text-slate-400">Top traders by PnL this epoch</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                  Total Volume Traded
                </p>
                <BarChart3 className="size-5 text-primary/60" />
              </div>
              <p className="font-mono text-3xl font-bold tracking-tight text-white">
                {viewModel?.stats.totalVolumeTraded ?? "—"}
              </p>
            </div>
            <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                  Total Traders
                </p>
                <Users className="size-5 text-primary/60" />
              </div>
              <p className="font-mono text-3xl font-bold tracking-tight text-white">
                {viewModel?.stats.totalTraders ?? "—"}
              </p>
            </div>
            <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                  Total PnL Generated
                </p>
                <Flame className="size-5 text-green-400/60" />
              </div>
              <p
                className={`font-mono text-3xl font-bold tracking-tight ${
                  viewModel?.stats.totalPnlPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {viewModel?.stats.totalPnlGenerated ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
            <div className="flex items-center gap-6 text-sm font-bold">
              {timeframeTabs.map((tab) => (
                <button
                  key={tab.value}
                  className={
                    tab.value === timeframe
                      ? "border-b-2 border-primary pb-2 text-primary"
                      : "pb-2 text-slate-400 transition-colors hover:text-white"
                  }
                  onClick={() => {
                    setTimeframe(tab.value);
                    setPage(1);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {chainTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setChain(tab.value);
                    setPage(1);
                  }}
                  className={
                    tab.value === chain
                      ? "flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
                      : "flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-slate-500 hover:text-white"
                  }
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 border-b border-border bg-card text-xs font-semibold uppercase text-slate-400">
                  <tr>
                    <th className="w-16 px-6 py-4 text-center">Rank</th>
                    <th className="px-6 py-4">Trader</th>
                    <th className="px-6 py-4">Win Rate</th>
                    <th className="px-6 py-4 text-right">Total PnL</th>
                    <th className="px-6 py-4 text-right">30D PnL</th>
                    <th className="px-6 py-4 text-right">Volume</th>
                    <th className="px-6 py-4 text-right">Trades</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                        Loading leaderboard...
                      </td>
                    </tr>
                  ) : null}
                  {isError ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-red-400">
                        Failed to load leaderboard data.
                      </td>
                    </tr>
                  ) : null}
                  {!isLoading && !isError && visibleRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                        No data available for this filter.
                      </td>
                    </tr>
                  ) : null}

                  {visibleRows.map((row) => {
                    const styles = rankStyles(row.rank);
                    const isSelected = activeRow?.wallet === row.wallet;
                    return (
                      <tr
                        key={row.wallet}
                        className={`group relative transition-colors ${styles.row} ${
                          isSelected ? "border-l-2 border-l-primary" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-center">
                          {row.rank <= 3 ? (
                            <>
                              <div className={`absolute bottom-0 left-0 top-0 w-1 ${styles.marker}`} />
                              <div
                                className={`mx-auto flex size-8 items-center justify-center rounded-full font-bold ${styles.badge}`}
                              >
                                {row.rank}
                              </div>
                            </>
                          ) : (
                            <span className="font-mono text-slate-400">{row.rank}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={row.avatar}
                              alt={`${row.wallet} avatar`}
                              width={40}
                              height={40}
                              className="size-10 rounded-full border border-slate-500 object-cover"
                            />
                            <div>
                              <div className="font-mono font-bold text-white">{row.wallet}</div>
                              <div className="text-xs text-slate-400">
                                {row.symbol} • {row.name}
                              </div>
                              {row.tier ? <div className="text-xs text-yellow-500">{row.tier}</div> : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex w-24 flex-col gap-1">
                            <div className="text-xs text-slate-300">{row.winRate}%</div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                              <div
                                className="h-full rounded-full bg-green-400"
                                style={{ width: `${row.winRate}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-mono font-bold ${
                            row.totalPnlValue < 0 ? "text-red-400" : "text-green-400"
                          }`}
                        >
                          {row.totalPnl}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`font-mono ${row.pnl30dPositive ? "text-green-400" : "text-red-400"}`}
                          >
                            {row.pnl30d}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-300">
                          {row.volume}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-300">
                          {row.trades}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="rounded p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                              onClick={() => handleFocusTrader(row)}
                              aria-label={`View ${row.wallet}`}
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              className={`rounded px-3 py-1 text-xs font-bold transition-colors ${
                                row.rank === 1
                                  ? "bg-primary text-background hover:bg-cyan-300"
                                  : "border border-primary text-primary hover:bg-primary/10"
                              }`}
                              onClick={() => {
                                handleFocusTrader(row);
                                toast.info(`Configured ${row.wallet} for copy trading.`);
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4">
              <span className="text-sm text-slate-400">
                Showing {totalRows === 0 ? 0 : startIndex + 1}-{endIndex} of{" "}
                {numberFormatter.format(totalRows)} traders
              </span>
              <div className="flex gap-2">
                <button
                  className="rounded border border-border px-3 py-1 text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                >
                  Previous
                </button>
                <button
                  className="rounded border border-border px-3 py-1 text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div ref={copyPanelRef} className="xl:sticky xl:top-24 xl:self-start">
          <CopyPanel
            row={activeRow}
            allocationUsd={allocationValue}
            maxPositionSize={maxPositionValue}
            stopLoss={stopLossValue}
            copiedTrades={copiedTrades}
            onAllocationChange={setAllocationUsd}
            onMaxPositionSizeChange={setMaxPositionSize}
            onStopLossChange={setStopLoss}
            onCopy={handleCopy}
          />
        </div>
      </main>
    </Container>
  );
}

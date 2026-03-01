"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CirclePile } from "lucide-react";
import Link from "next/link";
import { useAccount, useChainId } from "wagmi";
import { arbitrum, base, bsc, mainnet, polygon } from "wagmi/chains";

const navItems = [
  { href: "/", label: "Markets" },
  { href: "/trade", label: "Trade" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/portfolio", label: "Portfolio" },
];

const chainLabels: Record<number, string> = {
  [mainnet.id]: "Ethereum",
  [arbitrum.id]: "Arbitrum",
  [base.id]: "Base",
  [polygon.id]: "Polygon",
  [bsc.id]: "BNB Chain",
};

export function SiteHeader() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const networkLabel = chainLabels[chainId] ?? "No Network";
  const networkDotClass = isConnected ? "bg-green-400" : "bg-slate-500";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex size-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <CirclePile className="size-4" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            NexTrade
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-border bg-card/70 px-2.5 py-1.5 text-xs text-slate-300 sm:flex">
            <span className={`mr-2 size-2 rounded-full ${networkDotClass}`} />
            {networkLabel}
          </div>
          <ConnectButton
            accountStatus={{ smallScreen: "avatar", largeScreen: "address" }}
            chainStatus={{ smallScreen: "icon", largeScreen: "name" }}
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
}

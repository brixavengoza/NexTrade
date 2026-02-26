import Link from "next/link";
import { CirclePile, Trophy, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Markets" },
  { href: "/trade", label: "Trade" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/portfolio", label: "Portfolio" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6">
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
          <Button variant="neon" size="sm" className="hidden sm:inline-flex">
            <Wallet className="size-4" />
            Connect Wallet
          </Button>
          <Button variant="ghostNeon" size="icon" className="sm:hidden">
            <Trophy className="size-4" />
            <span className="sr-only">Leaderboard</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

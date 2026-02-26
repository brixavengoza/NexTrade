import Link from "next/link";

const footerLinks = ["Docs", "API", "Security", "Status"];

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-12 border-t border-border bg-background/80">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-base font-semibold text-white">
            NexTrade
          </span>
          <span className="text-slate-500">Realtime crypto market UI</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {footerLinks.map((label) => (
            <Link
              key={label}
              href="/"
              className="transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

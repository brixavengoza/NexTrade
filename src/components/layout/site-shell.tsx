import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="app-grid-bg pointer-events-none absolute inset-0 z-0 opacity-20" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}

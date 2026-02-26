# NextTrade

Realtime crypto market UI built with Next.js, Tailwind, shadcn/ui, and TanStack Query.

## What it has

- Market overview dashboard UI
- Live market data (CoinGecko)
- Live DeFi protocols list (DeFiLlama)
- Live gas tracker (public RPC endpoints)
- Fear & Greed index widget
- SSR prefetch + React Query hydration

## Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Recharts (via shadcn chart wrapper)

## Run locally

1. Install deps

```bash
npm install
```

2. Create env file

Copy `template.env` to `.env.local` and fill values.

3. Start dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```

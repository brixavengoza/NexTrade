import type {
  CoinGeckoMarket,
  LeaderboardChain,
  LeaderboardGlobalResponse,
  LeaderboardPayload,
} from "@/features/leaderboard/leaderboard.types";
import { config } from "@/lib/config";

type RequestOptions = {
  revalidate?: number;
};

const chainCategoryMap: Record<Exclude<LeaderboardChain, "all">, string> = {
  ethereum: "ethereum-ecosystem",
  arbitrum: "arbitrum-ecosystem",
  base: "base-ecosystem",
  solana: "solana-ecosystem",
};

function buildRequestInit({ revalidate }: RequestOptions = {}): RequestInit & {
  next?: { revalidate: number };
} {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: { accept: "application/json" },
  };

  if (typeof window === "undefined" && revalidate) {
    init.next = { revalidate };
  }

  return init;
}

export const leaderboardApi = {
  apiUrl: config.external.coingeckoBaseUrl,

  async getMarkets(
    chain: LeaderboardChain,
    options: RequestOptions = {}
  ): Promise<CoinGeckoMarket[]> {
    const url = new URL(`${this.apiUrl}/coins/markets`);
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", "1");
    url.searchParams.set("sparkline", "true");
    url.searchParams.set("price_change_percentage", "24h,7d,30d");

    if (chain !== "all") {
      url.searchParams.set("category", chainCategoryMap[chain]);
    }

    const response = await fetch(url, buildRequestInit(options));
    if (!response.ok) {
      throw new Error(
        `CoinGecko leaderboard markets request failed: ${response.status}`
      );
    }

    return response.json();
  },

  async getGlobal(
    options: RequestOptions = {}
  ): Promise<LeaderboardGlobalResponse> {
    const response = await fetch(
      `${this.apiUrl}/global`,
      buildRequestInit(options)
    );

    if (!response.ok) {
      throw new Error(`CoinGecko global request failed: ${response.status}`);
    }

    return response.json();
  },

  async getLeaderboardPayload(
    chain: LeaderboardChain,
    options: RequestOptions = {}
  ): Promise<LeaderboardPayload> {
    const [marketsResult, globalResult] = await Promise.allSettled([
      this.getMarkets(chain, options),
      this.getGlobal(options),
    ]);

    if (marketsResult.status === "rejected") {
      throw marketsResult.reason;
    }

    const global =
      globalResult.status === "fulfilled" ? globalResult.value : null;

    return { markets: marketsResult.value, global };
  },
};

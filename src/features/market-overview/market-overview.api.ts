import type {
  CoinGeckoMarketChart,
  DefiLlamaProtocol,
  FearGreedApiResponse,
  GasNetworkKey,
  GasRpcSnapshot,
  MarketChartRange,
  MarketOverviewPayload,
} from "@/features/market-overview/market-overview.types";
import { config } from "@/lib/config";

type RequestOptions = {
  revalidate?: number;
};

function buildRequestInit({ revalidate }: RequestOptions = {}): RequestInit & {
  next?: { revalidate: number };
} {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: { accept: "application/json" },
  };

  // `next.revalidate` only applies on the server. Keep client fetches standards-safe.
  if (typeof window === "undefined" && revalidate) {
    init.next = { revalidate };
  }

  return init;
}

export const blockchain = {
  apiUrl: config.external.coingeckoBaseUrl,

  async getMarkets(options: RequestOptions = {}) {
    const url = new URL(`${this.apiUrl}/coins/markets`);
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", "1");
    url.searchParams.set("sparkline", "true");
    url.searchParams.set("price_change_percentage", "24h");

    const response = await fetch(url, buildRequestInit(options));
    if (!response.ok) {
      throw new Error(`CoinGecko markets request failed: ${response.status}`);
    }

    return response.json();
  },

  async getGlobal(options: RequestOptions = {}) {
    const response = await fetch(
      `${this.apiUrl}/global`,
      buildRequestInit(options)
    );

    if (!response.ok) {
      throw new Error(`CoinGecko global request failed: ${response.status}`);
    }

    return response.json();
  },

  async getMarketOverview(
    options: RequestOptions = {}
  ): Promise<MarketOverviewPayload> {
    try {
      const [markets, global] = await Promise.all([
        this.getMarkets(options),
        this.getGlobal(options).catch(() => null),
      ]);

      return { markets, global };
    } catch {
      return { markets: [], global: null };
    }
  },

  async getBitcoinChart(
    range: MarketChartRange,
    options: RequestOptions = {}
  ): Promise<CoinGeckoMarketChart> {
    const rangeToDays: Record<MarketChartRange, string> = {
      "1h": "1",
      "1d": "1",
      "7d": "7",
      "1m": "30",
      "3m": "90",
    };

    const url = new URL(`${this.apiUrl}/coins/bitcoin/market_chart`);
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("days", rangeToDays[range]);

    const response = await fetch(url, buildRequestInit(options));
    if (!response.ok) {
      throw new Error(
        `CoinGecko market_chart request failed: ${response.status}`
      );
    }

    return response.json();
  },

  async getTrendingProtocols(): Promise<DefiLlamaProtocol[]> {
    const response = await fetch(config.external.defillamaProtocolsUrl, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`DeFiLlama protocols request failed: ${response.status}`);
    }

    return response.json();
  },

  async getGasPriceForNetwork(
    network: GasNetworkKey,
    options: RequestOptions = {}
  ): Promise<GasRpcSnapshot> {
    const rpcByNetwork: Record<GasNetworkKey, string> = {
      ethereum: config.external.rpc.ethereum,
      bnb: config.external.rpc.bnb,
      polygon: config.external.rpc.polygon,
    };

    const response = await fetch(rpcByNetwork[network], {
      ...buildRequestInit(options),
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_gasPrice",
        params: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`${network} gas RPC request failed: ${response.status}`);
    }

    const json = (await response.json()) as { result?: string };
    const hex = json.result;
    if (!hex) {
      throw new Error(`${network} gas RPC missing result`);
    }

    const wei = Number.parseInt(hex, 16);
    const avgGwei = wei / 1e9;

    return { network, avgGwei };
  },

  async getGasOverview(
    options: RequestOptions = {}
  ): Promise<GasRpcSnapshot[]> {
    const networks: GasNetworkKey[] = ["ethereum", "bnb", "polygon"];
    const results = await Promise.allSettled(
      networks.map((network) => this.getGasPriceForNetwork(network, options))
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<GasRpcSnapshot> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);
  },

  async getFearGreedIndex(
    options: RequestOptions = {}
  ): Promise<FearGreedApiResponse | null> {
    try {
      const response = await fetch(
        config.external.fearGreedUrl,
        buildRequestInit(options)
      );
      if (!response.ok) {
        throw new Error(`Fear & Greed request failed: ${response.status}`);
      }
      return response.json();
    } catch {
      return null;
    }
  },
};

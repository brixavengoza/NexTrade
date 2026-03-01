export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "NexTrade",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
  },
  web3: {
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
      "c9f7689f0f7fcf217b53a3068f1819e1",
  },
  external: {
    coingeckoBaseUrl: process.env.NEXT_PUBLIC_COINGECKO_BASE_URL || "",
    defillamaProtocolsUrl:
      process.env.NEXT_PUBLIC_DEFILLAMA_PROTOCOLS_URL || "",
    fearGreedUrl: process.env.NEXT_PUBLIC_FEAR_GREED_URL || "",
    rpc: {
      ethereum: process.env.NEXT_PUBLIC_RPC_ETHEREUM || "",
      bnb: process.env.NEXT_PUBLIC_RPC_BNB || "",
      polygon: process.env.NEXT_PUBLIC_RPC_POLYGON || "",
    },
  },
} as const;

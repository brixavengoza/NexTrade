import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, bsc, mainnet, polygon } from "wagmi/chains";

import { config } from "@/lib/config";

export const walletConfig = getDefaultConfig({
  appName: config.app.name,
  projectId: config.web3.walletConnectProjectId,
  chains: [mainnet, arbitrum, base, polygon, bsc],
  ssr: true,
});

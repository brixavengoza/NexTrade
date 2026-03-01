"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

import { walletConfig } from "@/features/wallet/wallet.config";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={walletConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#00e5ff",
          accentColorForeground: "#051018",
          borderRadius: "medium",
          overlayBlur: "small",
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

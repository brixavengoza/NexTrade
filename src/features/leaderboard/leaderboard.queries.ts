import { queryOptions } from "@tanstack/react-query";

import { leaderboardApi } from "@/features/leaderboard/leaderboard.api";
import type { LeaderboardChain } from "@/features/leaderboard/leaderboard.types";

export function leaderboardQueryOptions(
  chain: LeaderboardChain,
  { revalidateSeconds = 60 }: { revalidateSeconds?: number } = {}
) {
  return queryOptions({
    queryKey: ["leaderboard", "coingecko", chain] as const,
    queryFn: () =>
      leaderboardApi.getLeaderboardPayload(chain, {
        revalidate: revalidateSeconds,
      }),
    staleTime: revalidateSeconds * 1000,
    refetchInterval: revalidateSeconds * 1000,
    refetchOnWindowFocus: false,
  });
}

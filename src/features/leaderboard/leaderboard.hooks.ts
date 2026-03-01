"use client";

import { useQuery } from "@tanstack/react-query";

import { leaderboardQueryOptions } from "@/features/leaderboard/leaderboard.queries";
import type { LeaderboardChain } from "@/features/leaderboard/leaderboard.types";

export function useGetLeaderboard(chain: LeaderboardChain) {
  return useQuery(leaderboardQueryOptions(chain));
}

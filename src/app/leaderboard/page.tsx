import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { LeaderboardPageClient } from "@/components/features/leaderboard/leaderboard-page-client";
import { leaderboardQueryOptions } from "@/features/leaderboard/leaderboard.queries";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    leaderboardQueryOptions("ethereum", { revalidateSeconds: revalidate })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LeaderboardPageClient />
    </HydrationBoundary>
  );
}

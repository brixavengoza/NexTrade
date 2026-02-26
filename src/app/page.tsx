import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { MarketOverviewPageClient } from "@/components/features/market-overview-page";
import {
  bitcoinChartQueryOptions,
  fearGreedQueryOptions,
  gasOverviewQueryOptions,
  marketOverviewQueryOptions,
  trendingProtocolsQueryOptions,
} from "@/features/market-overview/market-overview.queries";

export const revalidate = 60;

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    marketOverviewQueryOptions({ revalidateSeconds: revalidate })
  );
  await queryClient.prefetchQuery(
    bitcoinChartQueryOptions("1d", { revalidateSeconds: revalidate })
  );
  await queryClient.prefetchQuery(
    trendingProtocolsQueryOptions({ revalidateSeconds: 300 })
  );
  await queryClient.prefetchQuery(
    gasOverviewQueryOptions({ revalidateSeconds: revalidate })
  );
  await queryClient.prefetchQuery(
    fearGreedQueryOptions({ revalidateSeconds: 300 })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MarketOverviewPageClient />
    </HydrationBoundary>
  );
}

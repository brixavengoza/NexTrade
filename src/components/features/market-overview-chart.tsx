"use client";

import type { TooltipProps } from "recharts";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MarketOverviewChartPoint } from "@/features/market-overview/market-overview.types";
import {
  formatChartHoverTime,
  formatCompactHoverPrice,
} from "@/features/market-overview/market-overview.utils";

const chartConfig = {
  price: {
    label: "BTC Price",
    color: "#00E5FF",
  },
} satisfies ChartConfig;

function MarketChartTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload as MarketOverviewChartPoint | undefined;
  const price = Number(payload[0]?.value);

  return (
    <div className="rounded border border-primary/30 bg-card/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <p className="mb-1 text-xs text-slate-400">
        {formatChartHoverTime(point?.timestamp)}
      </p>
      <p className="font-mono text-sm font-bold text-white">
        {formatCompactHoverPrice(price)}
      </p>
    </div>
  );
}

export function MarketOverviewChart({
  data,
}: {
  data: MarketOverviewChartPoint[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="[&_.recharts-cartesian-grid_horizontal_line]:stroke-dasharray-[4_4] !aspect-auto h-full w-full p-0 [&_.recharts-cartesian-grid_horizontal_line]:stroke-border/70 [&_.recharts-layer.recharts-line-dots]:hidden"
    >
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <filter id="btcLineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0.898
                      0 0 0 0 1
                      0 0 0 0.75 0"
            />
          </filter>
          <linearGradient id="btcArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.07} />
            <stop offset="35%" stopColor="#082A36" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#030B14" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 4" />
        <XAxis
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          dataKey="time"
          minTickGap={24}
          padding={{ left: 0, right: 0 }}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={6}
          orientation="right"
          mirror
          width={44}
          dx={-4}
          tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          domain={["dataMin - 300", "dataMax + 300"]}
        />
        <ChartTooltip
          cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 4" }}
          content={<MarketChartTooltip />}
        />
        <Area
          type="monotone"
          dataKey="price"
          fill="url(#btcArea)"
          stroke="#00E5FF"
          strokeWidth={4.2}
          strokeLinecap="round"
          filter="url(#btcLineGlow)"
          activeDot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#00E5FF"
          strokeWidth={2.2}
          strokeLinecap="round"
          dot={false}
          activeDot={{
            r: 5,
            fill: "#00E5FF",
            stroke: "rgba(0,229,255,0.2)",
            strokeWidth: 14,
          }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

import Container from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rows = [
  { name: "AlphaWhale", pnl: "+24.2%" },
  { name: "DeltaSigma", pnl: "+18.7%" },
  { name: "NeonTape", pnl: "+14.9%" },
];

export default function LeaderboardPage() {
  return (
    <Container>
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-md border border-border bg-card/60 px-4 py-3 text-sm"
            >
              <span className="text-slate-300">
                #{index + 1} {row.name}
              </span>
              <span className="font-mono text-success">{row.pnl}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}

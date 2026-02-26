import Container from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortfolioPage() {
  return (
    <Container>
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-400">
            <p>
              Total Balance:{" "}
              <span className="font-mono text-white">$128,402.20</span>
            </p>
            <p>
              24h Change: <span className="font-mono text-success">+3.14%</span>
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Allocations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-400">
            <p>BTC 42%</p>
            <p>ETH 28%</p>
            <p>SOL 16%</p>
            <p>Cash 14%</p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

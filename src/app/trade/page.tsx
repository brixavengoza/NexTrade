import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TradePage() {
  return (
    <Container>
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Trade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-400">
          <p>
            This route now inherits the shared NexTrade header/footer shell from
            `src/app/layout.tsx`.
          </p>
          <div className="flex gap-3">
            <Button variant="neon">Buy</Button>
            <Button variant="outline">Sell</Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitcher } from "@/components/features/ThemeSwitcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        {/* Header with theme switcher */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Next.js Boilerplate</h1>
          <ThemeSwitcher />
        </div>

        {/* Alert Section */}
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Welcome!</AlertTitle>
          <AlertDescription>
            This is a modern Next.js boilerplate with TypeScript, Tailwind CSS,
            and shadcn/ui components.
          </AlertDescription>
        </Alert>

        {/* Components Showcase */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Buttons */}
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-2xl font-semibold">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          {/* Form Elements */}
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-2xl font-semibold">Form Elements</h2>
            <Input placeholder="Enter your email" type="email" />
            <Textarea placeholder="Type your message here..." rows={4} />
          </div>

          {/* Skeleton Loaders */}
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-2xl font-semibold">Skeleton Loaders</h2>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-2xl font-semibold">Features</h2>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Next.js 16 with App Router</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui Components</li>
              <li>Light & Dark Mode</li>
              <li>Poppins Font</li>
              <li>Docker Ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

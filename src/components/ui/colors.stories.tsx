import type { Meta, StoryObj } from "@storybook/react";

const ColorShowcase = () => {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h1 className="mb-4 text-4xl font-bold">Color Palette</h1>
        <p className="text-muted-foreground">
          Theme colors using CSS variables with hsl values.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Base Colors</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="h-24 rounded-lg border bg-background"></div>
            <p className="text-sm font-medium">Background</p>
            <code className="text-xs text-muted-foreground">bg-background</code>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-foreground"></div>
            <p className="text-sm font-medium">Foreground</p>
            <code className="text-xs text-muted-foreground">bg-foreground</code>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-primary"></div>
            <p className="text-sm font-medium">Primary</p>
            <code className="text-xs text-muted-foreground">bg-primary</code>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-secondary"></div>
            <p className="text-sm font-medium">Secondary</p>
            <code className="text-xs text-muted-foreground">bg-secondary</code>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-muted"></div>
            <p className="text-sm font-medium">Muted</p>
            <code className="text-xs text-muted-foreground">bg-muted</code>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-accent"></div>
            <p className="text-sm font-medium">Accent</p>
            <code className="text-xs text-muted-foreground">bg-accent</code>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-destructive"></div>
            <p className="text-sm font-medium">Destructive</p>
            <code className="text-xs text-muted-foreground">
              bg-destructive
            </code>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg border bg-card"></div>
            <p className="text-sm font-medium">Card</p>
            <code className="text-xs text-muted-foreground">bg-card</code>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Text Colors</h2>
        <div className="space-y-2">
          <p className="text-foreground">Foreground text</p>
          <p className="text-primary">Primary text</p>
          <p className="text-secondary-foreground">Secondary text</p>
          <p className="text-muted-foreground">Muted text</p>
          <p className="text-destructive">Destructive text</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Border Colors</h2>
        <div className="space-y-2">
          <div className="rounded-lg border p-4">
            <p>Default border</p>
          </div>
          <div className="rounded-lg border-2 border-primary p-4">
            <p>Primary border</p>
          </div>
          <div className="rounded-lg border-2 border-destructive p-4">
            <p>Destructive border</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof ColorShowcase> = {
  title: "Foundation/Colors",
  component: ColorShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ColorShowcase>;

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
    theme: "dark",
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

import type { Meta, StoryObj } from "@storybook/react";

const TypographyShowcase = () => {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h1 className="mb-4 text-4xl font-bold">Typography - Poppins Font</h1>
        <p className="text-muted-foreground">
          This boilerplate uses Poppins as the default font family.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Font Weights</h2>
        <div className="space-y-2">
          <p className="font-light">
            Light (300) - The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-normal">
            Regular (400) - The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-medium">
            Medium (500) - The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-semibold">
            Semibold (600) - The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-bold">
            Bold (700) - The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Heading Sizes</h2>
        <h1 className="text-4xl font-bold">Heading 1</h1>
        <h2 className="text-3xl font-semibold">Heading 2</h2>
        <h3 className="text-2xl font-semibold">Heading 3</h3>
        <h4 className="text-xl font-semibold">Heading 4</h4>
        <h5 className="text-lg font-medium">Heading 5</h5>
        <h6 className="text-base font-medium">Heading 6</h6>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Body Text</h2>
        <p className="text-lg">
          Large text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p className="text-base">
          Regular text - Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
        <p className="text-sm">
          Small text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <p className="text-xs">
          Extra small text - Lorem ipsum dolor sit amet.
        </p>
      </section>
    </div>
  );
};

const meta: Meta<typeof TypographyShowcase> = {
  title: "Foundation/Typography",
  component: TypographyShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TypographyShowcase>;

export const Default: Story = {};

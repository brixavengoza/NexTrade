import type { Preview } from "@storybook/nextjs";
import React from "react";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "../src/components/providers/ThemeProvider";
import "../src/app/globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className={`${poppins.variable} font-sans antialiased`}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;

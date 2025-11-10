"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary">
        <span className="sr-only">Toggle theme</span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative inline-flex h-6 w-11 items-center rounded-full bg-secondary shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary/80 focus:outline-none"
      aria-label="Toggle theme"
    >
      <span
        className={`${
          isDark ? "translate-x-6" : "translate-x-1"
        } absolute flex h-4 w-4 items-center justify-center rounded-full bg-background shadow-md transition-transform duration-300 ease-in-out`}
      >
        <Sun
          className={`${
            isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
          } absolute h-3 w-3 text-yellow-500 transition-all duration-300 ease-in-out`}
        />

        <Moon
          className={`${
            isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } absolute h-3 w-3 text-blue-400 transition-all duration-300 ease-in-out`}
        />
      </span>
    </button>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-[var(--content-max-width)] px-4 py-10 sm:px-6",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

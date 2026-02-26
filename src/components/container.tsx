import React from "react";

export default function Container({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10" {...props}>
      {children}
    </section>
  );
}

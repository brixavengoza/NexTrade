import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-primary/30 bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,229,255,0.1)] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,229,255,0.35)]",
        neon: "border border-primary/30 bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,229,255,0.1)] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,229,255,0.35)]",
        neonSolid:
          "border border-primary/40 bg-primary text-primary-foreground shadow-[0_0_18px_rgba(0,229,255,0.25)] hover:shadow-[0_0_28px_rgba(0,229,255,0.35)] hover:brightness-105",
        destructive:
          "border border-danger/30 bg-danger/10 text-danger hover:bg-danger hover:text-white",
        outline:
          "border border-border bg-card/70 text-slate-200 hover:border-primary/30 hover:bg-primary/5 hover:text-white",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-slate-300 hover:bg-white/5 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
        ghostNeon:
          "text-primary hover:bg-primary/10 hover:text-primary hover:shadow-[inset_0_0_0_1px_rgba(0,229,255,0.2)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-sm",
        icon: "h-9 w-9",
        pill: "h-10 rounded-full px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

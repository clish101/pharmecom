import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success/10 text-success",
        warning: "border-transparent bg-warning/10 text-warning",
        info: "border-transparent bg-info/10 text-info",
        "cold-chain": "border-transparent bg-cold-chain text-cold-chain-foreground",
        accent: "border-transparent bg-accent/10 text-accent",
        poultry: "border-transparent bg-amber-100 text-amber-800",
        swine: "border-transparent bg-pink-100 text-pink-800",
        live: "border-transparent bg-emerald-100 text-emerald-800",
        killed: "border-transparent bg-slate-100 text-slate-800",
        attenuated: "border-transparent bg-violet-100 text-violet-800",
        // Order status badges
        requested: "border-transparent bg-info/10 text-info",
        confirmed: "border-transparent bg-primary/10 text-primary",
        prepared: "border-transparent bg-warning/10 text-warning",
        dispatched: "border-transparent bg-accent/10 text-accent",
        delivered: "border-transparent bg-success/10 text-success",
        cancelled: "border-transparent bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

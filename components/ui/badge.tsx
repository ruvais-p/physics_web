import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-oxford text-white hover:bg-oxford/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-heritage-red text-white hover:bg-heritage-red/80",
        outline: "text-foreground",
        success:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        inactive:
          "bg-slate-100 text-slate-600 border-slate-200",
        amber:
          "bg-amber-50 text-amber-700 border-amber-200",
        sky:
          "bg-sky-50 text-sky-750 border-sky-200",
        indigo:
          "bg-indigo-50 text-indigo-750 border-indigo-200",
        oxford:
          "bg-oxford/10 text-oxford border-oxford/20",
        cyan:
          "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

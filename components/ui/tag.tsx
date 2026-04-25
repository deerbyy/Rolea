import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagProps = {
  children: ReactNode;
  variant?: "default" | "accent" | "ember" | "outline";
  className?: string;
};

const variants: Record<NonNullable<TagProps["variant"]>, string> = {
  default: "border-line/15 bg-surface-2/60 text-muted",
  accent: "border-accent/30 bg-accent/12 text-accent-ring",
  ember: "border-ember/40 bg-ember/12 text-ember",
  outline: "border-line/20 bg-transparent text-muted"
};

export function Tag({ children, variant = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

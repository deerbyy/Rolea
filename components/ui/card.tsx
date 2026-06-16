import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "article" | "section" | "div" | "aside";
  reveal?: boolean;
  delay?: 0 | 1 | 2 | 3;
};

const delayClasses: Record<NonNullable<CardProps["delay"]>, string> = {
  0: "",
  1: "reveal-delay-1",
  2: "reveal-delay-2",
  3: "reveal-delay-3"
};

export function Card({
  children,
  className,
  hover = false,
  as: Tag = "article",
  reveal = false,
  delay = 0
}: CardProps) {
  return (
    <Tag
      className={cn(
        "glass rounded-3xl p-6",
        hover && "hover-lift",
        reveal && "reveal-up",
        delayClasses[delay],
        className
      )}
    >
      {children}
    </Tag>
  );
}

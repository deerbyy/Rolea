import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
};

const sizes: Record<NonNullable<PageContainerProps["size"]>, string> = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  wide: "max-w-[88rem]"
};

export function PageContainer({ children, className, size = "default" }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 py-8 md:px-8", sizes[size], className)}>{children}</div>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, actions, className }: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "reveal-up mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">{eyebrow}</p>
        )}
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

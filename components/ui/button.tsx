import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "danger";
type Size = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg shadow-glow hover:-translate-y-0.5 hover:bg-accent-hover interactive-glow",
  secondary:
    "border border-line/15 bg-surface-2/60 text-fg hover:-translate-y-0.5 hover:bg-surface-3/60",
  ghost: "text-muted hover:bg-surface-2/60 hover:text-fg",
  soft:
    "border border-accent/30 bg-accent/12 text-accent-ring hover:bg-accent/20 hover:text-fg",
  danger:
    "border border-danger/30 bg-danger/15 text-danger hover:bg-danger/25"
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base"
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    ...rest
  } = props as ButtonAsButton;
  void _variant;
  void _size;
  void _className;
  void _children;

  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}

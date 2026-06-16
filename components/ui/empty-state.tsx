import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("glass rounded-3xl p-10 text-center", className)}>
      {Icon && (
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent-ring">
          <Icon size={22} />
        </div>
      )}
      <p className="font-serif text-3xl font-semibold">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>}
      {action && <div className="mt-6 inline-flex">{action}</div>}
    </div>
  );
}

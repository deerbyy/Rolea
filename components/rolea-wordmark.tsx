import { cn } from "@/lib/cn";

export function RoleaWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-serif text-3xl font-semibold tracking-tight leading-none text-fg",
        className,
      )}
      aria-label="Rolea"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.svg"
        alt=""
        aria-hidden="true"
        className="h-[1.2em] w-[1.2em] shrink-0 rounded-[0.32em]"
      />
      <span>Rolea</span>
    </span>
  );
}

import { cn } from "@/lib/cn";

export function RoleaWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-serif text-3xl font-semibold tracking-tight leading-none text-fg",
        className,
      )}
      aria-label="Rolea"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.svg"
        alt=""
        aria-hidden="true"
        className="mr-[0.06em] h-[1em] w-[1em] shrink-0 rounded-[0.22em] -translate-y-[0.04em]"
      />
      <span>olea</span>
    </span>
  );
}

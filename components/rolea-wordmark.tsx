import { cn } from "@/lib/cn";

export function RoleaWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center font-serif text-3xl font-semibold tracking-tight leading-none text-fg",
        className,
      )}
      aria-label="Rolea"
    >
      <span className="relative">
        Rolea
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute -right-2 -top-1 h-[0.42em] w-[0.42em]"
        >
          <defs>
            <linearGradient id="rw-spark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fef3c7" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#rw-spark)"
            d="M12 0C13.6 7 17 10.4 24 12C17 13.6 13.6 17 12 24C10.4 17 7 13.6 0 12C7 10.4 10.4 7 12 0Z"
          />
        </svg>
      </span>
    </span>
  );
}

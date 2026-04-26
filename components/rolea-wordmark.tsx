import { cn } from "@/lib/cn";

export function RoleaWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-baseline font-serif text-3xl font-semibold tracking-tight leading-none",
        className,
      )}
      aria-label="Rolea"
    >
      <span
        className="bg-gradient-to-br from-white via-amber-100 to-amber-500 bg-clip-text text-transparent"
        style={{ WebkitTextFillColor: "transparent" }}
      >
        Rolea
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute -top-[0.08em] left-[0.55em] h-[0.4em] w-[0.4em]"
      >
        <defs>
          <linearGradient id="rw-spark-violet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ede9fe" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path
          fill="url(#rw-spark-violet)"
          d="M12 0C13.6 7 17 10.4 24 12C17 13.6 13.6 17 12 24C10.4 17 7 13.6 0 12C7 10.4 10.4 7 12 0Z"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute -bottom-[0.04em] right-[-0.18em] h-[0.3em] w-[0.3em]"
      >
        <defs>
          <linearGradient id="rw-spark-ember" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff7ed" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path
          fill="url(#rw-spark-ember)"
          d="M12 0C13.6 7 17 10.4 24 12C17 13.6 13.6 17 12 24C10.4 17 7 13.6 0 12C7 10.4 10.4 7 12 0Z"
        />
      </svg>
    </span>
  );
}

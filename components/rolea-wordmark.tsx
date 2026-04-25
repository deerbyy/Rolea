import { cn } from "@/lib/cn";

const R_GLYPH =
  "M50 0V66Q73 67 88.5 72.0Q104 77 112.5 95.0Q121 113 121 153V536Q121 563 122.5 588.0Q124 613 125 626Q109 625 85.0 624.5Q61 624 50 623V700Q121 701 192.0 701.0Q263 701 334 702Q422 703 487.0 682.0Q552 661 587.0 614.0Q622 567 620 487Q619 445 599.5 407.0Q580 369 541.5 340.0Q503 311 444 294Q463 286 481.5 268.0Q500 250 513 230L560 160Q582 126 599.0 106.0Q616 86 633.0 76.5Q650 67 672 66V0H507Q489 13 471.5 37.5Q454 62 434 94L360 214Q347 234 337.5 248.0Q328 262 318 272Q302 272 291.0 272.0Q280 272 266 272V165Q266 137 265.0 112.0Q264 87 262 74Q273 75 290.0 75.5Q307 76 323.5 76.5Q340 77 347 77V0ZM314 344Q370 344 404.0 360.5Q438 377 453.5 410.5Q469 444 469 495Q469 543 454.0 570.5Q439 598 416.5 611.5Q394 625 371.0 628.5Q348 632 333 632Q312 632 297.0 627.0Q282 622 274.0 605.0Q266 588 266 553V348Q277 347 289.0 345.5Q301 344 314 344Z";

export function RoleaWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-serif text-3xl font-semibold tracking-tight leading-none text-fg",
        className,
      )}
      aria-label="Rolea"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 420 420"
        className="h-[1.25em] w-auto"
        style={{ marginBottom: "-0.18em", marginRight: "-0.04em" }}
      >
        <defs>
          <linearGradient id="rw-mark" x1="60" y1="20" x2="380" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.4" stopColor="#fef3c7" />
            <stop offset="0.8" stopColor="#fcd9a5" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="rw-spark-violet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ede9fe" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="rw-spark-ember" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff7ed" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient
            id="rw-aura"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(190 220) scale(190)"
          >
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.42" />
            <stop offset="0.7" stopColor="#a78bfa" stopOpacity="0.06" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="rw-spark-halo"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(0 0) scale(60)"
          >
            <stop offset="0" stopColor="#ede9fe" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ede9fe" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id="rw-spark-halo-ember"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(0 0) scale(50)"
          >
            <stop offset="0" stopColor="#fcd9a5" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fcd9a5" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="190" cy="220" r="180" fill="url(#rw-aura)" />

        <g transform="translate(20 392) scale(0.52 -0.52)">
          <path fill="url(#rw-mark)" d={R_GLYPH} />
        </g>

        <g transform="translate(360 70)">
          <circle cx="0" cy="0" r="48" fill="url(#rw-spark-halo)" />
          <path
            fill="url(#rw-spark-violet)"
            d="M0 -34C6 -15 15 -6 34 0C15 6 6 15 0 34C-6 15 -15 6 -34 0C-15 -6 -6 -15 0 -34Z"
          />
          <path
            fill="#ffffff"
            opacity="0.95"
            d="M0 -16C3 -7 7 -3 16 0C7 3 3 7 0 16C-3 7 -7 3 -16 0C-7 -3 -3 -7 0 -16Z"
          />
        </g>

        <g transform="translate(70 360)">
          <circle cx="0" cy="0" r="34" fill="url(#rw-spark-halo-ember)" />
          <path
            fill="url(#rw-spark-ember)"
            d="M0 -22C4 -10 10 -4 22 0C10 4 4 10 0 22C-4 10 -10 4 -22 0C-10 -4 -4 -10 0 -22Z"
          />
        </g>
      </svg>
      <span>olea</span>
    </span>
  );
}

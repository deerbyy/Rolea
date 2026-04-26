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
        viewBox="0 0 720 760"
        className="h-[1em] w-auto"
        style={{ verticalAlign: "baseline", marginRight: "0.04em" }}
      >
        <defs>
          <linearGradient id="rwm-r" x1="60" y1="40" x2="640" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.4" stopColor="#fef3c7" />
            <stop offset="0.8" stopColor="#fcd9a5" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="rwm-spark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ede9fe" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <g transform="translate(0 700) scale(1 -1)">
          <path fill="url(#rwm-r)" d={R_GLYPH} />
        </g>
        <g transform="translate(640 90)">
          <path
            fill="url(#rwm-spark)"
            d="M0 -55C7 -22 22 -7 55 0C22 7 7 22 0 55C-7 22 -22 7 -55 0C-22 -7 -7 -22 0 -55Z"
          />
          <path
            fill="#ffffff"
            opacity="0.95"
            d="M0 -22C3 -9 9 -3 22 0C9 3 3 9 0 22C-3 9 -9 3 -22 0C-9 -3 -3 -9 0 -22Z"
          />
        </g>
      </svg>
      <span>olea</span>
    </span>
  );
}

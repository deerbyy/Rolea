"use client";

import type { Highlighted } from "@/lib/search";

/**
 * Render highlighted text. Matches are wrapped in a span with the accent
 * gradient so search results visually echo the brand palette.
 */
export function Highlight({ parts, fallback }: { parts?: Highlighted; fallback: string }) {
  if (!parts || parts.length === 0) {
    return <>{fallback}</>;
  }

  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={index}
            className="rounded bg-gradient-to-r from-accent/35 via-fuchsia-400/30 to-ember/30 px-0.5 text-fg"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}

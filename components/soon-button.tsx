"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

type SoonButtonProps = {
  children: React.ReactNode;
  className?: string;
  message?: string;
};

export function SoonButton({
  children,
  className = "",
  message = "Soon: функция появится позже"
}: SoonButtonProps) {
  const [shown, setShown] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => {
          setShown(true);
          window.setTimeout(() => setShown(false), 2200);
        }}
        className={cn(
          "interactive-glow inline-flex items-center justify-center gap-2 rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-3 text-sm font-semibold text-muted transition active:scale-[0.97] hover:-translate-y-0.5 hover:border-accent/40 hover:text-fg",
          className
        )}
      >
        <Sparkles size={16} />
        {children}
        <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-accent-ring">
          Soon
        </span>
      </button>
      {shown && (
        <span className="message-enter absolute left-0 top-[calc(100%+8px)] z-30 min-w-56 rounded-2xl border border-accent/25 bg-surface p-3 text-xs leading-5 text-muted shadow-2xl">
          {message}
        </span>
      )}
    </span>
  );
}

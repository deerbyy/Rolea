"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

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
        className={`interactive-glow inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/74 transition active:scale-[0.97] hover:-translate-y-0.5 hover:border-violet-300/40 hover:text-white ${className}`}
      >
        <Sparkles size={16} />
        {children}
        <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-violet-100">
          Soon
        </span>
      </button>
      {shown && (
        <span className="message-enter absolute left-0 top-[calc(100%+8px)] z-30 min-w-56 rounded-2xl border border-violet-300/20 bg-[#0a1020] p-3 text-xs leading-5 text-white/72 shadow-2xl">
          {message}
        </span>
      )}
    </span>
  );
}

"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { Story } from "@/lib/types";

type StoryCardProps = {
  story: Story;
  offset?: number;
};

export function StoryCard({ story, offset = 0 }: StoryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  function showSoon(action: string) {
    setMessage(`${action}: Soon`);
    window.setTimeout(() => setMessage(""), 2000);
  }

  return (
    <article className="hover-lift reveal-up group relative min-h-[250px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
      <div
        className="story-card-bg absolute inset-0 scale-105 transition duration-700 group-hover:scale-110"
        style={{ backgroundPosition: `${48 + offset * 11}% center` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex h-full min-h-[250px] flex-col justify-between p-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`Меню истории ${story.title}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/80 backdrop-blur transition hover:rotate-90 hover:bg-violet-500/50"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="message-enter absolute right-5 top-16 z-20 w-48 rounded-2xl border border-white/10 bg-[#080d1c]/95 p-2 text-sm shadow-2xl backdrop-blur">
              <Link
                href={`/app/story/${story.id}`}
                className="block rounded-xl px-3 py-2 text-white/76 transition hover:bg-white/[0.06] hover:text-white"
              >
                Открыть чат
              </Link>
              <button
                type="button"
                onClick={() => showSoon("Редактирование")}
                className="w-full rounded-xl px-3 py-2 text-left text-white/76 transition hover:bg-white/[0.06] hover:text-white"
              >
                Редактировать <span className="text-violet-200">Soon</span>
              </button>
              <button
                type="button"
                onClick={() => showSoon("Дублирование")}
                className="w-full rounded-xl px-3 py-2 text-left text-white/76 transition hover:bg-white/[0.06] hover:text-white"
              >
                Дублировать <span className="text-violet-200">Soon</span>
              </button>
            </div>
          )}
          {message && (
            <div className="message-enter absolute right-5 top-16 z-30 rounded-2xl border border-violet-300/20 bg-[#080d1c] px-3 py-2 text-xs text-white/70 shadow-2xl">
              {message}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Link href={`/app/story/${story.id}`} className="font-serif text-2xl font-semibold">
              {story.title}
            </Link>
            <p className="mt-1 text-sm text-white/72">{story.genre}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>Глава {story.chapter}</span>
              <span>{story.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="progress-shine h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-amber-300"
                style={{ width: `${story.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

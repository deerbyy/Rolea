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
    <article className="hover-lift reveal-up group relative min-h-[250px] overflow-hidden rounded-2xl border border-line/15 bg-surface shadow-2xl">
      <div
        className="story-card-bg absolute inset-0 scale-105 transition duration-700 group-hover:scale-110"
        style={{ backgroundPosition: `${48 + offset * 11}% center` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-ring/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex h-full min-h-[250px] flex-col justify-between p-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`Меню истории ${story.title}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line/15 bg-black/40 text-white/85 backdrop-blur transition hover:rotate-90 hover:bg-accent/55"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="message-enter absolute right-5 top-16 z-20 w-48 rounded-2xl border border-line/15 bg-surface p-2 text-sm shadow-2xl backdrop-blur">
              <Link
                href={`/app/story/${story.id}`}
                className="block rounded-xl px-3 py-2 text-muted transition hover:bg-surface-2/60 hover:text-fg"
              >
                Открыть чат
              </Link>
              <button
                type="button"
                onClick={() => showSoon("Редактирование")}
                className="w-full rounded-xl px-3 py-2 text-left text-muted transition hover:bg-surface-2/60 hover:text-fg"
              >
                Редактировать <span className="text-accent-ring">Soon</span>
              </button>
              <button
                type="button"
                onClick={() => showSoon("Дублирование")}
                className="w-full rounded-xl px-3 py-2 text-left text-muted transition hover:bg-surface-2/60 hover:text-fg"
              >
                Дублировать <span className="text-accent-ring">Soon</span>
              </button>
            </div>
          )}
          {message && (
            <div className="message-enter absolute right-5 top-16 z-30 rounded-2xl border border-accent/30 bg-surface px-3 py-2 text-xs text-muted shadow-2xl">
              {message}
            </div>
          )}
        </div>

        <div className="space-y-4 text-white">
          <div>
            <Link href={`/app/story/${story.id}`} className="font-serif text-2xl font-semibold">
              {story.title}
            </Link>
            <p className="mt-1 text-sm text-white/80">{story.genre}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-white/65">
              <span>Глава {story.chapter}</span>
              <span>{story.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="progress-shine h-full rounded-full bg-gradient-to-r from-accent via-fuchsia-400 to-ember"
                style={{ width: `${story.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

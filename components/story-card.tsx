"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  MoreHorizontal,
  Play,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import type { Story, StoryStatus } from "@/lib/types";
import { useStories } from "@/lib/stories-store";
import { Highlight } from "@/components/highlight";
import type { Highlighted } from "@/lib/search";

type StoryCardProps = {
  story: Story;
  offset?: number;
  highlights?: Record<string, Highlighted>;
  variant?: "library" | "compact";
};

const statusBadge: Record<StoryStatus, { label: string; className: string }> = {
  active: {
    label: "Активная",
    className:
      "border-accent/35 bg-gradient-to-r from-accent/25 via-fuchsia-500/20 to-ember/15 text-accent-ring"
  },
  draft: {
    label: "Черновик",
    className: "border-line/15 bg-surface-2/55 text-muted"
  },
  published: {
    label: "Опубликована",
    className:
      "border-ember/40 bg-gradient-to-r from-ember/25 via-amber-400/15 to-accent/15 text-ember-soft"
  }
};

export function StoryCard({ story, offset = 0, highlights, variant = "library" }: StoryCardProps) {
  const { updateStory, removeStory, duplicateStory } = useStories();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(story.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  }

  function commitTitle() {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== story.title) {
      updateStory(story.id, { title: trimmed });
      flash("Название обновлено");
    } else {
      setDraftTitle(story.title);
    }
    setEditing(false);
  }

  function togglePublish() {
    const next = story.status === "published" ? "active" : "published";
    updateStory(story.id, { status: next });
    flash(next === "published" ? "История опубликована" : "Сделана непубличной");
    setMenuOpen(false);
  }

  function handleDuplicate() {
    duplicateStory(story.id);
    flash("Дубликат создан");
    setMenuOpen(false);
  }

  function handleDelete() {
    removeStory(story.id);
  }

  const badge = statusBadge[story.status];

  return (
    <article className="hover-lift reveal-up group relative overflow-hidden rounded-3xl border border-line/15 bg-surface shadow-2xl">
      <div
        className="story-card-bg absolute inset-0 scale-105 transition duration-700 group-hover:scale-110"
        style={{ backgroundPosition: `${48 + offset * 11}% center` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/15" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-ring/70 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember/45 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex min-h-[280px] flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${badge.className}`}
          >
            <Sparkles size={10} />
            {badge.label}
          </span>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={`Меню истории ${story.title}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/85 backdrop-blur transition hover:bg-accent/55"
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="message-enter absolute right-0 top-12 z-30 w-56 rounded-2xl border border-line/15 bg-surface p-2 text-sm text-fg shadow-2xl backdrop-blur"
              >
                <Link
                  href={`/app/story/${story.id}`}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-surface-2/60"
                >
                  <Play size={14} className="text-accent-ring" /> Открыть чат
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-surface-2/60"
                >
                  <Edit3 size={14} className="text-accent-ring" /> Переименовать
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleDuplicate}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-surface-2/60"
                >
                  <Copy size={14} className="text-accent-ring" /> Дублировать
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={togglePublish}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-surface-2/60"
                >
                  {story.status === "published" ? (
                    <>
                      <EyeOff size={14} className="text-ember" /> Сделать непубличной
                    </>
                  ) : (
                    <>
                      <Eye size={14} className="text-ember" /> Опубликовать
                    </>
                  )}
                </button>
                <div className="my-1 h-px bg-line/15" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setConfirmDelete(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-danger transition hover:bg-danger/12"
                >
                  <Trash2 size={14} /> Удалить
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4 text-white">
          <div>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") commitTitle();
                    if (event.key === "Escape") {
                      setDraftTitle(story.title);
                      setEditing(false);
                    }
                  }}
                  onBlur={commitTitle}
                  className="w-full rounded-xl border border-accent/40 bg-black/55 px-3 py-2 font-serif text-2xl font-semibold text-white outline-none focus:border-accent focus:shadow-glow"
                />
                <button
                  type="button"
                  onClick={commitTitle}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-fg"
                  aria-label="Сохранить"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <Link
                href={`/app/story/${story.id}`}
                className="line-clamp-2 block min-h-[3.75rem] font-serif text-2xl font-semibold leading-tight transition hover:text-accent-ring"
              >
                <Highlight parts={highlights?.title} fallback={story.title} />
              </Link>
            )}
            <p className="mt-1 line-clamp-1 text-sm text-white/80">
              <Highlight parts={highlights?.genre} fallback={story.genre} />
              {" · "}
              <span className="text-white/60">
                <Highlight parts={highlights?.format} fallback={story.format} />
              </span>
            </p>
            {variant === "library" && (
              <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-white/70">
                <Highlight parts={highlights?.summary} fallback={story.summary} />
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-white/65">
              <span>Глава {story.chapter}</span>
              <span className="tabular-nums">{story.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="progress-shine h-full rounded-full bg-gradient-to-r from-accent via-fuchsia-400 to-ember"
                style={{ width: `${story.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/app/story/${story.id}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent via-fuchsia-500 to-ember px-3 py-2 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              <Play size={14} /> Продолжить
            </Link>
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Переименовать"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/40 text-white/80 transition hover:border-accent/50 hover:text-white"
            >
              <Edit3 size={14} />
            </button>
            <button
              type="button"
              onClick={handleDuplicate}
              aria-label="Дублировать"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/40 text-white/80 transition hover:border-accent/50 hover:text-white"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/75 p-5 backdrop-blur-sm">
          <div className="message-enter w-full max-w-xs rounded-2xl border border-danger/30 bg-surface p-5 text-center shadow-2xl">
            <p className="font-serif text-xl text-fg">Удалить историю?</p>
            <p className="mt-2 text-sm text-muted">«{story.title}» исчезнет из библиотеки.</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-line/15 bg-surface-2/40 px-3 py-2 text-sm text-muted transition hover:text-fg"
              >
                <X size={14} className="-mt-0.5 mr-1 inline" /> Отмена
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-danger px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Trash2 size={14} className="-mt-0.5 mr-1 inline" /> Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="message-enter absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full border border-accent/40 bg-bg/85 px-3 py-1 text-xs text-fg shadow-glow backdrop-blur">
          {toast}
        </div>
      )}
    </article>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Filter as FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import { useStories } from "@/lib/stories-store";
import { fuzzySearch, type ScoredItem } from "@/lib/search";
import type { Story, StoryStatus } from "@/lib/types";

const filters: Array<{ label: string; value: "all" | StoryStatus }> = [
  { label: "Все", value: "all" },
  { label: "Активные", value: "active" },
  { label: "Черновики", value: "draft" },
  { label: "Опубликованные", value: "published" }
];

const statusLabel: Record<StoryStatus, string> = {
  active: "активные",
  draft: "черновики",
  published: "опубликованные"
};

export function StoriesLibrary() {
  const { stories } = useStories();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | StoryStatus>("all");
  const [activeGenres, setActiveGenres] = useState<string[]>([]);

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((story) => {
      story.genre.split(/[,/]/).forEach((token) => {
        const trimmed = token.trim();
        if (trimmed) set.add(trimmed);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [stories]);

  const counts = useMemo(() => {
    return {
      all: stories.length,
      active: stories.filter((s) => s.status === "active").length,
      draft: stories.filter((s) => s.status === "draft").length,
      published: stories.filter((s) => s.status === "published").length
    };
  }, [stories]);

  const visible: ScoredItem<Story>[] = useMemo(() => {
    const byStatus = stories.filter((story) => filter === "all" || story.status === filter);

    const byGenre =
      activeGenres.length === 0
        ? byStatus
        : byStatus.filter((story) =>
            activeGenres.every((genre) => story.genre.toLowerCase().includes(genre.toLowerCase()))
          );

    if (!query.trim()) {
      return byGenre.map((story) => ({ item: story, score: 0, highlights: {} }));
    }

    return fuzzySearch(
      byGenre,
      query,
      (story) => ({
        title: story.title,
        genre: story.genre,
        format: story.format,
        summary: story.summary,
        mood: story.mood,
        status: statusLabel[story.status]
      }),
      {
        weights: { title: 4, genre: 2, mood: 1.5, format: 1.5, summary: 1, status: 0.5 },
        limit: 60
      }
    );
  }, [stories, filter, activeGenres, query]);

  const hasFilters = filter !== "all" || activeGenres.length > 0 || query.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="glass reveal-up rounded-3xl p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-line/15 bg-surface-2/40 px-4 text-sm text-muted transition focus-within:border-accent focus-within:shadow-glow">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-fg outline-none"
              placeholder="Найти по названию, жанру, настроению или сюжету…"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Очистить поиск"
                className="rounded-full p-1 text-subtle transition hover:text-fg"
              >
                <X size={14} />
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const count = counts[item.value === "all" ? "all" : item.value];
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
                    filter === item.value
                      ? "border-accent/50 bg-gradient-to-r from-accent/30 via-fuchsia-500/22 to-ember/22 text-fg shadow-glow"
                      : "border-line/15 bg-surface-2/40 text-muted hover:text-fg"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="rounded-full bg-bg/40 px-2 py-0.5 text-[11px] tabular-nums text-subtle">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <Button href="/app/onboarding" size="md">
            <Plus size={18} /> Создать историю
          </Button>
        </div>

        {allGenres.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/10 pt-4">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-subtle">
              <FilterIcon size={12} /> Жанры
            </span>
            {allGenres.map((genre) => {
              const active = activeGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() =>
                    setActiveGenres((current) =>
                      active ? current.filter((g) => g !== genre) : [...current, genre]
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-xs transition active:scale-[0.97] ${
                    active
                      ? "border-ember/50 bg-ember/15 text-ember-soft"
                      : "border-line/15 bg-surface-2/40 text-muted hover:border-accent/35 hover:text-fg"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  setActiveGenres([]);
                }}
                className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-subtle transition hover:text-fg"
              >
                <X size={12} /> Сбросить
              </button>
            )}
          </div>
        )}
      </div>

      {query && (
        <p className="text-sm text-muted">
          {visible.length === 0
            ? "Ничего не нашлось"
            : `Найдено: ${visible.length} ${visible.length === 1 ? "история" : visible.length < 5 ? "истории" : "историй"}`}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visible.map(({ item, highlights }, index) => (
          <StoryCard
            key={item.id}
            story={item}
            offset={index}
            highlights={highlights}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="font-serif text-3xl">
            <span className="bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-transparent">
              Ничего не найдено
            </span>
          </p>
          <p className="mt-3 text-sm text-muted">
            Попробуй другой запрос, сбрось фильтры или начни новую историю.
          </p>
          <div className="mt-6 inline-flex gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  setActiveGenres([]);
                }}
                className="rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-2 text-sm text-muted transition hover:text-fg"
              >
                Сбросить фильтры
              </button>
            )}
            <Button href="/app/onboarding" size="md">
              <Plus size={16} /> Создать историю
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

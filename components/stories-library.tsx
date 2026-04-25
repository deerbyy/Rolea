"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import { demoStories } from "@/lib/demo-data";
import type { StoryStatus } from "@/lib/types";

const filters: Array<{ label: string; value: "all" | StoryStatus }> = [
  { label: "Все", value: "all" },
  { label: "Активные", value: "active" },
  { label: "Черновики", value: "draft" },
  { label: "Опубликованные", value: "published" }
];

export function StoriesLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | StoryStatus>("all");

  const stories = useMemo(() => {
    return demoStories.filter((story) => {
      const matchesFilter = filter === "all" || story.status === filter;
      const haystack = `${story.title} ${story.genre} ${story.summary} ${story.mood}`.toLowerCase();
      return matchesFilter && haystack.includes(query.toLowerCase());
    });
  }, [filter, query]);

  return (
    <div className="space-y-6">
      <div className="glass reveal-up rounded-3xl p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-line/15 bg-surface-2/40 px-4 text-sm text-muted transition focus-within:border-accent">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-fg outline-none"
              placeholder="Найти историю по названию, жанру или настроению…"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
                  filter === item.value
                    ? "border-accent/50 bg-accent/24 text-fg"
                    : "border-line/15 bg-surface-2/40 text-muted hover:text-fg"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button href="/app/onboarding" size="md">
            <Plus size={18} /> Создать историю
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stories.map((story, index) => (
          <StoryCard key={story.id} story={story} offset={index} />
        ))}
      </div>

      {stories.length === 0 && (
        <div className="glass rounded-3xl p-8 text-center">
          <p className="font-serif text-3xl">Ничего не найдено</p>
          <p className="mt-2 text-sm text-muted">Попробуй другой запрос или сбрось фильтр.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SoonButton } from "@/components/soon-button";
import { communityStories } from "@/lib/demo-data";

const tags = ["Все", "Фэнтези", "Мистика", "Романтика", "Сай-фай", "Новые"];

export default function CommunityPage() {
  const [active, setActive] = useState("Все");

  const visibleStories = useMemo(() => {
    if (active === "Все" || active === "Новые") {
      return communityStories;
    }
    return communityStories.filter((story) =>
      `${story.title} ${story.summary}`.toLowerCase().includes(active.toLowerCase())
    );
  }, [active]);

  return (
    <PageContainer>
      <header className="reveal-up mb-8">
        <p className="inline-block bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-sm font-semibold uppercase tracking-[0.18em] text-transparent">Сообщество</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Галерея историй</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Публичные истории и шаблоны от авторов Rolea. Пока это demo-галерея с локальными действиями.
        </p>
      </header>

      <section className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            className={`rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
              active === tag
                ? "border-accent/50 bg-accent/24 text-fg"
                : "border-line/15 bg-surface-2/40 text-muted hover:text-fg"
            }`}
          >
            {tag}
          </button>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleStories.map((story, index) => (
          <article
            key={story.id}
            className={`hover-lift reveal-up relative min-h-[320px] overflow-hidden rounded-3xl border border-line/15 bg-surface reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <div
              className="story-card-bg absolute inset-0 scale-105"
              style={{ backgroundPosition: `${40 + index * 13}% center` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="relative flex min-h-[320px] flex-col justify-end p-5 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-accent-ring">
                Автор: {story.author}
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">{story.title}</h2>
              <p className="mt-2 text-sm text-white/80">{story.summary}</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-white/75">
                <span className="inline-flex items-center gap-1">
                  <Heart size={15} /> {story.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bookmark size={15} /> {story.saves}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/app/story/vesperia"
                  className="interactive-glow rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-fg transition active:scale-[0.97] hover:bg-accent-hover"
                >
                  Открыть
                </Link>
                <SoonButton className="px-3 py-3">
                  <Bookmark size={15} /> Сохранить
                </SoonButton>
              </div>
            </div>
          </article>
        ))}
      </section>

      {visibleStories.length === 0 && (
        <div className="glass mt-6 rounded-3xl p-8 text-center">
          <p className="font-serif text-3xl">В этой подборке пока пусто</p>
          <p className="mt-2 text-sm text-muted">
            Попробуй другой тег или вернись позже — каждый день появляются новые истории.
          </p>
        </div>
      )}

      <section className="glass reveal-up mt-8 rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl">Публикация в галерею</h2>
            <p className="mt-2 text-sm text-muted">
              После подключения аккаунтов здесь появятся реальные лайки, сохранения и модерация.
            </p>
          </div>
          <Button variant="secondary" size="md" href="/app/onboarding">
            <Sparkles size={16} /> Создать свою историю
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}

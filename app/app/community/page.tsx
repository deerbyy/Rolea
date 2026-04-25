import Link from "next/link";
import { Bookmark, Heart, Sparkles } from "lucide-react";
import { SoonButton } from "@/components/soon-button";
import { communityStories } from "@/lib/demo-data";

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="reveal-up mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Сообщество</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">Галерея историй</h1>
        <p className="mt-4 max-w-2xl text-white/62">
          Публичные истории и шаблоны от авторов Rolea. Пока это demo-галерея с локальными действиями.
        </p>
      </header>

      <section className="mb-6 flex flex-wrap gap-2">
        {["Все", "Фэнтези", "Мистика", "Романтика", "Сай-фай", "Новые"].map((tag, index) => (
          <button
            key={tag}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm transition active:scale-[0.97] ${
              index === 0
                ? "border-violet-300/50 bg-violet-500/22 text-white"
                : "border-white/10 bg-white/[0.04] text-white/62 hover:text-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {communityStories.map((story, index) => (
          <article
            key={story.id}
            className={`hover-lift reveal-up relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <div className="story-card-bg absolute inset-0 scale-105" style={{ backgroundPosition: `${40 + index * 13}% center` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="relative flex min-h-[320px] flex-col justify-end p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-violet-200">Автор: {story.author}</p>
              <h2 className="mt-2 font-serif text-3xl">{story.title}</h2>
              <p className="mt-2 text-sm text-white/64">{story.summary}</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-white/58">
                <span className="inline-flex items-center gap-1"><Heart size={15} /> {story.likes}</span>
                <span className="inline-flex items-center gap-1"><Bookmark size={15} /> {story.saves}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/app/story/vesperia"
                  className="interactive-glow rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold transition active:scale-[0.97] hover:bg-violet-500"
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

      <section className="glass reveal-up mt-8 rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-3xl">Публикация в галерею</h2>
            <p className="mt-2 text-sm text-white/58">После подключения аккаунтов здесь появятся реальные лайки, сохранения и модерация.</p>
          </div>
          <SoonButton>
            <Sparkles size={16} /> Предложить подборку
          </SoonButton>
        </div>
      </section>
    </div>
  );
}

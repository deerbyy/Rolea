"use client";

import Link from "next/link";
import { ArrowRight, Bot, BookOpen, Feather, MessageCircle, MoreHorizontal, Plus, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { StoryCard } from "@/components/story-card";
import { useStories } from "@/lib/stories-store";
import type { Story } from "@/lib/types";

const heroFeatures = [
  { icon: BookOpen, title: "Создавай миры", subtitle: "и персонажей" },
  { icon: MessageCircle, title: "Играй в своей", subtitle: "истории через чат" },
  { icon: Sparkles, title: "Нейросеть ведёт", subtitle: "сюжет и мир" }
];

const chatPreview = [
  {
    kind: "narration" as const,
    time: "19:21",
    text: "Ночь опускается на город. Фонари бросают дрожащий свет на мокрую брусчатку. Вдалеке слышен колокольный звон. Ты стоишь перед дверью старой библиотеки."
  },
  {
    kind: "character" as const,
    author: "Лира",
    initials: "Л",
    time: "19:21",
    text: "Ты пришёл. Я знала, что ты не оставишь меня одну."
  },
  {
    kind: "character" as const,
    author: "Кайр",
    initials: "К",
    time: "19:22",
    text: "Время уходит, и тени становятся ближе. Что будем делать?"
  },
  {
    kind: "user" as const,
    time: "19:22",
    text: "Я осматриваюсь и ищу другой вход."
  }
];

export default function AppHomePage() {
  const { stories } = useStories();
  const continueStories = stories.slice(0, 4);

  return (
    <PageContainer size="wide" className="pb-12">
      <section className="relative overflow-hidden rounded-[28px] border border-line/15 shadow-soft">
        <div className="hero-image animated-hero absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/55 to-bg/15" aria-hidden />
        <div className="ambient-grid" aria-hidden />
        <div className="mist-layer" aria-hidden />

        <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-12 lg:p-14">
          <div className="reveal-up flex flex-col justify-center">
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
              <span className="block">Создавай.</span>
              <span className="block">Проживай.</span>
              <span className="block bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-transparent">
                Пиши свою историю.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted md:text-lg">
              Погрузись в мир, который ты создал.
              <br className="hidden sm:inline" />
              Ты — не просто читатель, ты — герой.
            </p>

            <div className="mt-8">
              <Button href="/app/onboarding" size="lg">
                <Plus size={18} /> Создать историю
              </Button>
            </div>

            <ul className="mt-10 grid grid-cols-3 gap-4 max-w-lg sm:gap-6">
              {heroFeatures.map(({ icon: Icon, title, subtitle }) => (
                <li key={title} className="reveal-up reveal-delay-1 flex flex-col items-start gap-2">
                  <span className="icon-breathe inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/25 via-fuchsia-500/15 to-ember/15 text-accent-ring shadow-glow">
                    <Icon size={18} />
                  </span>
                  <p className="text-xs leading-5 text-muted sm:text-sm">
                    <span className="block text-fg">{title}</span>
                    {subtitle}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <ChatPreviewCard story={stories[0]} />
        </div>
      </section>

      <section className="mt-10 md:mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold md:text-3xl">
            Продолжить{" "}
            <span className="bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-transparent">
              игру
            </span>
          </h2>
          <Link
            href="/app/stories"
            className="inline-flex items-center gap-2 text-sm text-accent-ring transition hover:text-fg"
          >
            Все истории <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {continueStories.map((story, index) => (
            <StoryCard key={story.id} story={story} offset={index} variant="compact" />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

function ChatPreviewCard({ story }: { story: Story | undefined }) {
  if (!story) return null;

  return (
    <aside className="reveal-up reveal-delay-1 glass relative flex flex-col rounded-3xl border border-line/15 p-5 shadow-2xl">
      <header className="flex items-start justify-between gap-3 border-b border-line/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/25 via-fuchsia-500/15 to-ember/15 text-accent-ring shadow-glow">
            <Feather size={18} />
          </span>
          <div>
            <p className="font-serif text-base font-semibold text-fg">{story.title}</p>
            <p className="text-xs text-muted">Глава {story.chapter}. Пробуждение</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <button
            type="button"
            aria-label="Память сцены"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line/15 transition hover:text-fg"
          >
            <Bot size={14} />
          </button>
          <button
            type="button"
            aria-label="Меню"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line/15 transition hover:text-fg"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </header>

      <div className="mt-4 flex flex-col gap-4">
        {chatPreview.map((message, index) => {
          if (message.kind === "narration") {
            return (
              <div key={index} className="flex gap-3">
                <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-line/15 bg-surface-2/60 text-accent-ring">
                  <Feather size={12} />
                </span>
                <div className="flex-1 text-sm leading-6 text-muted">
                  <p className="italic">{message.text}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">{message.time}</p>
                </div>
              </div>
            );
          }
          if (message.kind === "character") {
            const palette =
              message.author === "Лира"
                ? "from-accent via-fuchsia-500 to-pink-400"
                : "from-ember via-amber-400 to-yellow-300";
            return (
              <div key={index} className="flex gap-3">
                <span
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${palette} text-xs font-semibold text-white shadow-glow`}
                >
                  {message.initials}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-accent-ring">{message.author}</p>
                  <p className="mt-1 text-sm leading-6 text-fg">{message.text}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">{message.time}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={index} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-br from-accent via-fuchsia-500 to-ember/85 px-4 py-2 text-sm text-white shadow-glow">
                <p>{message.text}</p>
                <p className="mt-1 text-right text-[11px] uppercase tracking-[0.18em] text-white/70">{message.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form
        action={`/app/story/${story.id}`}
        className="mt-5 flex items-center gap-2 rounded-2xl border border-line/15 bg-surface-2/60 px-4 py-2 transition focus-within:border-accent focus-within:shadow-glow"
      >
        <input
          type="text"
          placeholder="Ваше действие или реплика..."
          className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
          aria-label="Действие или реплика"
          readOnly
        />
        <span className="text-accent-ring">
          <Sparkles size={16} />
        </span>
        <Link
          href={`/app/story/${story.id}`}
          aria-label="Открыть историю"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-fuchsia-500 to-ember text-white shadow-glow transition hover:opacity-95"
        >
          <Send size={14} />
        </Link>
      </form>
    </aside>
  );
}

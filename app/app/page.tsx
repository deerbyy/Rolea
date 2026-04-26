"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { StoryCard } from "@/components/story-card";
import { ChatPreviewDemo } from "@/components/chat-preview-demo";
import { useStories } from "@/lib/stories-store";

const heroFeatures = [
  { icon: BookOpen, title: "Создавай миры", subtitle: "и персонажей" },
  { icon: MessageCircle, title: "Играй в своей", subtitle: "истории через чат" },
  { icon: Sparkles, title: "Нейросеть ведёт", subtitle: "сюжет и мир" }
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

          <ChatPreviewDemo story={stories[0]} />
        </div>
      </section>

      <section className="mt-10 md:mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold md:text-3xl">Продолжить игру</h2>
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



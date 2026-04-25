import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { StoryCard } from "@/components/story-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { demoStories } from "@/lib/demo-data";

const features = [
  {
    icon: BookOpen,
    title: "Создай свою книгу",
    text: "Жанр, мир, герои, роль пользователя и первая сцена собираются в одном понятном мастере."
  },
  {
    icon: MessageCircle,
    title: "Играй через чат",
    text: "В одной ленте живут реплики персонажей, повествование, твои действия и подсказки сюжета."
  },
  {
    icon: Sparkles,
    title: "AI ведет сцену",
    text: "Gemini работает как режиссер истории: удерживает тон, мир, NPC и развитие конфликта."
  },
  {
    icon: ShieldCheck,
    title: "16+ с фильтрами",
    text: "Истории могут быть мрачными и эмоциональными, но продукт закладывает правила и жалобы."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050915] text-white">
      <section className="relative min-h-[92vh] px-4 py-6 md:px-8">
        <div className="animated-hero absolute inset-0 hero-image opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050915]/15 to-[#050915]" />
        <div className="ambient-grid" />
        <div className="mist-layer" />

        <div className="reveal-up relative mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="font-serif text-5xl font-semibold text-violet-300">
            Rolea
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a href="#why" className="hover:text-white">
              Возможности
            </a>
            <a href="#stories" className="hover:text-white">
              Истории
            </a>
            <a href="#pricing" className="hover:text-white">
              Подписка
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth"
                className="interactive-glow hidden rounded-full border border-white/12 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10 md:inline-flex"
            >
              Войти
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-20 grid max-w-7xl gap-10 lg:grid-cols-[1fr_560px] lg:items-center">
          <div className="reveal-up reveal-delay-1 max-w-3xl">
            <p className="pulse-ring mb-5 inline-flex rounded-full border border-violet-300/20 bg-violet-500/12 px-4 py-2 text-sm text-violet-100">
              AI-ролевые истории, где ты не зритель, а участник
            </p>
            <h1 className="text-balance font-serif text-6xl font-semibold leading-[0.95] md:text-8xl">
              Создай историю. Войди в роль. Играй через чат.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
              Rolea превращает фантазию в живой мир: ты задаешь жанр, персонажей и правила,
              а AI ведет повествование, сцены и диалоги вокруг твоих решений.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app/onboarding"
                className="interactive-glow inline-flex items-center justify-center gap-3 rounded-2xl bg-violet-600 px-6 py-4 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-violet-500"
              >
                Создать историю <ArrowRight size={19} />
              </Link>
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/7 px-6 py-4 font-semibold text-white/86 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                Посмотреть приложение
              </Link>
            </div>
          </div>

          <div className="glass floating-panel reveal-up reveal-delay-2 rounded-3xl p-4">
            <div className="rounded-2xl border border-white/10 bg-[#070d1b]/90 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl">Тени Весперии</h2>
                  <p className="text-sm text-white/55">Глава 2. Пробуждение</p>
                </div>
                <span className="pulse-ring rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-100">
                  live scene
                </span>
              </div>
              <div className="space-y-4 py-5 text-sm leading-6">
                <p className="message-enter rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white/72">
                  Ночь опускается на город. Фонари бросают дрожащий свет на мокрую брусчатку.
                </p>
                <p className="message-enter reveal-delay-1">
                  <span className="font-semibold text-violet-300">Лира:</span> Ты пришел. Я знала,
                  что ты не оставишь меня одну.
                </p>
                <p className="message-enter reveal-delay-2 ml-auto max-w-[82%] rounded-2xl bg-violet-600 p-4 text-white">
                  Я осматриваюсь и ищу другой вход.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/45">
                Ваше действие или реплика...
                <Sparkles className="icon-breathe ml-auto text-violet-300" size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-serif text-4xl font-semibold md:text-5xl">Первая ценность за минуты</h2>
            <p className="mt-4 text-white/62">
              Онбординг ведет автора от идеи до первой сцены, не бросая его в пустой интерфейс.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="glass hover-lift reveal-up rounded-2xl p-5">
                  <Icon className="icon-breathe text-violet-300" size={26} />
                  <h3 className="mt-5 font-serif text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="stories" className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-4xl font-semibold">Истории, которые хочется продолжить</h2>
              <p className="mt-3 text-white/62">Приватно по умолчанию, с публикацией в галерею по выбору автора.</p>
            </div>
            <Link href="/app" className="hidden text-violet-300 hover:text-violet-200 md:inline-flex">
              Открыть галерею
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {demoStories.map((story, index) => (
              <StoryCard key={story.id} story={story} offset={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

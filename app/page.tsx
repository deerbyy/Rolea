import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HelpCircle,
  MessageCircle,
  PenTool,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { demoStories } from "@/lib/demo-data";

const features = [
  {
    icon: BookOpen,
    title: "Создай свою книгу",
    text:
      "Жанр, мир, герои, роль пользователя и первая сцена собираются в одном понятном мастере."
  },
  {
    icon: MessageCircle,
    title: "Играй через чат",
    text:
      "В одной ленте живут реплики персонажей, повествование, твои действия и подсказки сюжета."
  },
  {
    icon: Sparkles,
    title: "AI ведёт сцену",
    text:
      "Gemini работает как режиссёр истории: удерживает тон, мир, NPC и развитие конфликта."
  },
  {
    icon: ShieldCheck,
    title: "16+ с фильтрами",
    text:
      "Истории могут быть мрачными и эмоциональными, но продукт закладывает правила и жалобы."
  }
];

const howItWorks = [
  {
    icon: PenTool,
    title: "Идея",
    text:
      "Опиши жанр, формат и главного героя. Если идея сырая — AI поможет дописать мир, персонажей и роль."
  },
  {
    icon: Wand2,
    title: "Онбординг",
    text:
      "Пять понятных шагов превращают набросок в готовую сцену с правилами мира и характеристиками."
  },
  {
    icon: Play,
    title: "Игра",
    text:
      "Открывается чат-сцена. Ты пишешь действия, AI ведёт повествование и реплики персонажей."
  }
];

const plans = [
  {
    name: "Free",
    price: "0 ₽",
    perks: ["20 AI-сцен в месяц", "3 активные истории", "Базовая память сцены"],
    highlight: false
  },
  {
    name: "Creator",
    price: "399 ₽",
    perks: ["300 AI-сцен", "Безлимит черновиков", "Расширенная память"],
    highlight: true
  },
  {
    name: "Pro",
    price: "799 ₽",
    perks: ["1000 AI-сцен", "Приоритет генераций", "Публичные шаблоны"],
    highlight: false
  }
];

const faqs = [
  {
    q: "Что такое Rolea?",
    a: "Это сервис, где ты сам автор и одновременно главный герой. Создаёшь мир, персонажей и сценарий, а AI ведёт ролевую сцену в чате."
  },
  {
    q: "Нужно ли уметь писать, чтобы пользоваться?",
    a: "Нет. Можно вписать пару слов или даже оставить пустым — AI сам предложит мир, персонажей и первую сцену. Дальше всё дописываешь, как в чате с друзьями."
  },
  {
    q: "Кому принадлежат истории?",
    a: "Все истории по умолчанию приватны. Ты сам решаешь, публиковать ли в галерею. Удалить можно в любой момент."
  },
  {
    q: "Это бесплатно?",
    a: "Да, базового тарифа хватает, чтобы попробовать всё ключевое. Платная подписка нужна, если хочешь больше AI-сцен и расширенную память персонажей."
  },
  {
    q: "Подходит ли подросткам?",
    a: "Rolea — продукт 16+. Есть базовые правила контента и инструменты жалоб; запрещены небезопасные темы."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-bg text-fg">
      {/* HERO */}
      <section className="relative min-h-[92vh] px-4 py-6 md:px-8">
        <div className="animated-hero absolute inset-0 hero-image opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/15 to-bg" />
        <div className="ambient-grid" />
        <div className="mist-layer" />

        <div className="reveal-up relative mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="font-serif text-4xl font-semibold text-accent-ring md:text-5xl">
            Rolea
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#features" className="hover:text-fg">Возможности</a>
            <a href="#how" className="hover:text-fg">Как это работает</a>
            <a href="#stories" className="hover:text-fg">Истории</a>
            <a href="#pricing" className="hover:text-fg">Подписка</a>
            <a href="#faq" className="hover:text-fg">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button href="/auth" variant="secondary" size="sm" className="hidden md:inline-flex">
              Войти
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-7xl gap-10 lg:mt-20 lg:grid-cols-[1fr_540px] lg:items-center">
          <div className="reveal-up reveal-delay-1 max-w-3xl">
            <p className="pulse-ring mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/12 px-4 py-2 text-sm text-accent-ring">
              <Sparkles size={14} /> AI-ролевые истории, где ты не зритель, а участник
            </p>
            <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] md:text-7xl">
              Создай историю. Войди в роль. Играй через&nbsp;чат.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
              Rolea превращает фантазию в живой мир: ты задаёшь жанр, персонажей и правила,
              а AI ведёт повествование, сцены и диалоги вокруг твоих решений.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/app/onboarding" size="lg">
                Создать историю <ArrowRight size={18} />
              </Button>
              <Button href="/app" variant="secondary" size="lg">
                Посмотреть приложение
              </Button>
            </div>
            <p className="mt-5 text-xs text-subtle">
              Регистрация занимает минуту. До покупки тарифа — 20 бесплатных AI-сцен.
            </p>
          </div>

          <div className="glass floating-panel reveal-up reveal-delay-2 rounded-3xl p-4">
            <div className="rounded-2xl border border-line/10 bg-surface/90 p-5">
              <div className="flex items-center justify-between border-b border-line/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl">Тени Весперии</h2>
                  <p className="text-sm text-subtle">Глава 2. Пробуждение</p>
                </div>
                <span className="pulse-ring rounded-full bg-accent/20 px-3 py-1 text-xs text-accent-ring">
                  live scene
                </span>
              </div>
              <div className="space-y-4 py-5 text-sm leading-6">
                <p className="message-enter rounded-2xl border border-line/10 bg-surface-2/40 p-4 text-muted">
                  Ночь опускается на город. Фонари бросают дрожащий свет на мокрую брусчатку.
                </p>
                <p className="message-enter reveal-delay-1">
                  <span className="font-semibold text-accent-ring">Лира:</span> Ты пришёл. Я знала,
                  что ты не оставишь меня одну.
                </p>
                <p className="message-enter reveal-delay-2 ml-auto max-w-[82%] rounded-2xl bg-accent p-4 text-accent-fg">
                  Я осматриваюсь и ищу другой вход.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-line/10 bg-surface-2/30 p-3 text-sm text-subtle">
                Ваше действие или реплика…
                <Sparkles className="icon-breathe ml-auto text-accent-ring" size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">Возможности</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">
              Первая ценность за минуты
            </h2>
            <p className="mt-4 text-muted">
              Онбординг ведёт автора от идеи до первой сцены, не бросая его в пустой интерфейс.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="glass hover-lift reveal-up rounded-2xl p-5"
                >
                  <Icon className="icon-breathe text-accent-ring" size={26} />
                  <h3 className="mt-5 font-serif text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-4 pb-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">Как это работает</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">
              Три шага от идеи до сцены
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="glass hover-lift reveal-up rounded-3xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent-ring">
                      {index + 1}
                    </span>
                    <Icon className="text-accent-ring" size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* STORIES */}
      <section id="stories" className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">Истории</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">
                Истории, которые хочется продолжить
              </h2>
              <p className="mt-3 text-muted">
                Приватно по умолчанию, с публикацией в галерею по выбору автора.
              </p>
            </div>
            <Link href="/app" className="hidden text-accent-ring hover:text-fg md:inline-flex">
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

      {/* PRICING */}
      <section id="pricing" className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">Подписка</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">Старт бесплатный</h2>
            <p className="mt-4 text-muted">
              Платный тариф — для тех, кто играет много и хочет приоритетные генерации и расширенную память.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan, index) => (
              <article
                key={plan.name}
                className={`glass hover-lift reveal-up reveal-delay-${
                  Math.min(index + 1, 3) as 1 | 2 | 3
                } rounded-3xl p-6 ${plan.highlight ? "ring-1 ring-accent/40" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent-ring">
                      Лучший старт
                    </span>
                  )}
                </div>
                <p className="mt-5 font-serif text-4xl">{plan.price}</p>
                <p className="mt-1 text-sm text-subtle">в месяц</p>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/20 text-accent-ring">
                        ✓
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  href="/app/billing"
                  variant={plan.highlight ? "primary" : "secondary"}
                  size="md"
                  className="mt-6 w-full"
                >
                  Подробнее
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">FAQ</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">Короткие ответы</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="glass hover-lift group rounded-2xl p-5 transition open:bg-surface-2/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="text-accent-ring" size={18} />
                    {item.q}
                  </span>
                  <span className="text-accent-ring transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 md:px-8">
        <div className="glass mx-auto max-w-5xl rounded-3xl p-8 text-center md:p-14">
          <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">Готов начать?</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">
            Первая сцена — за пять шагов
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Заполни идею или дай AI заполнить за тебя. История остаётся твоей и приватной по умолчанию.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/app/onboarding" size="lg">
              Создать историю <ArrowRight size={18} />
            </Button>
            <Button href="/auth" variant="secondary" size="lg">
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line/10 px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="font-serif text-3xl font-semibold text-accent-ring">
              Rolea
            </Link>
            <p className="mt-2 max-w-md text-sm text-muted">
              AI-ролевые истории. Сделано с любовью к фантазии. © {new Date().getFullYear()} Rolea.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm text-muted md:grid-cols-3">
            <div>
              <p className="font-semibold text-fg">Продукт</p>
              <ul className="mt-2 space-y-1">
                <li><a href="#features" className="hover:text-fg">Возможности</a></li>
                <li><a href="#how" className="hover:text-fg">Как это работает</a></li>
                <li><a href="#pricing" className="hover:text-fg">Подписка</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-fg">Сообщество</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/app/community" className="hover:text-fg">Галерея</Link></li>
                <li><Link href="/app/templates" className="hover:text-fg">Шаблоны</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-fg">Помощь</p>
              <ul className="mt-2 space-y-1">
                <li><a href="#faq" className="hover:text-fg">FAQ</a></li>
                <li><Link href="/app/settings" className="hover:text-fg">Настройки</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl items-center gap-3 text-xs text-subtle">
          <Compass size={14} />
          <span>Истории Rolea приватны по умолчанию. 16+. Контентные правила и жалобы доступны в чате.</span>
          <Users size={14} className="ml-auto" />
        </div>
      </footer>
    </main>
  );
}

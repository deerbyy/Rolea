import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Plus, Sparkles, Users } from "lucide-react";
import { StoryCard } from "@/components/story-card";
import { demoCharacters, demoStories, demoWorlds } from "@/lib/demo-data";

const activity = [
  "Лира остановилась перед дверью старой библиотеки.",
  "В мир Весперии добавлено правило: дверь открывается только после выбора роли.",
  "Кайр получил новую черту: скрывает долг перед фонарщиками."
];

export default function AppHomePage() {
  const activeStory = demoStories[0];
  const activeWorld = demoWorlds[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl md:p-10">
        <div className="animated-hero absolute inset-0 hero-image" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050915]/82 via-[#050915]/42 to-transparent" />
        <div className="ambient-grid" />
        <div className="mist-layer" />
        <div className="reveal-up relative max-w-2xl">
          <p className="pulse-ring mb-4 inline-flex rounded-full border border-violet-300/20 bg-violet-500/15 px-4 py-2 text-sm text-violet-100">
            Главная мастерская автора
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Создавай. Проживай. Пиши свою историю.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
            Погрузись в мир, который ты создал. Ты не просто читатель, ты герой,
            соавтор и источник каждого поворота.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app/onboarding"
              className="interactive-glow inline-flex items-center gap-3 rounded-2xl border border-violet-200/70 bg-violet-600 px-6 py-4 font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_0_40px_rgba(139,92,246,0.35)] transition hover:-translate-y-0.5 hover:border-white/80 hover:bg-violet-500"
            >
              <Plus size={20} /> Создать историю
            </Link>
            <Link
              href="/app/story/vesperia"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-6 py-4 font-semibold text-white/86 transition hover:-translate-y-0.5 hover:bg-white/12"
            >
              Продолжить игру <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_380px]">
        <article className="glass reveal-up rounded-3xl p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Текущая история</p>
              <h2 className="mt-3 font-serif text-4xl">{activeStory.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">{activeStory.summary}</p>
            </div>
            <Link
              href={`/app/story/${activeStory.id}`}
              className="interactive-glow inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold transition active:scale-[0.97] hover:bg-violet-500"
            >
              Продолжить <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Users className="text-violet-300" size={18} />
              <p className="mt-3 text-sm text-white/50">Персонажи этой истории</p>
              <p className="mt-1 font-serif text-3xl">{demoCharacters.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <BookOpen className="text-violet-300" size={18} />
              <p className="mt-3 text-sm text-white/50">Глава</p>
              <p className="mt-1 font-serif text-3xl">{activeStory.chapter}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Sparkles className="text-violet-300" size={18} />
              <p className="mt-3 text-sm text-white/50">Мир истории</p>
              <p className="mt-1 font-serif text-3xl">{activeWorld.name}</p>
            </div>
          </div>
        </article>

        <aside className="glass reveal-up reveal-delay-1 rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <Clock className="text-violet-300" size={20} />
            <h2 className="font-serif text-3xl">Последние события</h2>
          </div>
          <div className="space-y-3">
            {activity.map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/62">
                {item}
              </p>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold">Продолжить игру</h2>
            <p className="mt-2 text-sm text-white/55">Только истории пользователя. Персонажи и миры живут внутри конкретной истории.</p>
          </div>
          <Link href="/app/stories" className="inline-flex items-center gap-2 text-sm text-violet-300">
            Все истории <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {demoStories.map((story, index) => (
            <StoryCard key={story.id} story={story} offset={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

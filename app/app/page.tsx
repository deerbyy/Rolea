import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Plus, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
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
    <PageContainer>
      <section className="relative overflow-hidden rounded-3xl border border-line/10 p-6 shadow-soft md:p-10">
        <div className="animated-hero absolute inset-0 hero-image" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/45 to-transparent" />
        <div className="ambient-grid" />
        <div className="mist-layer" />
        <div className="reveal-up relative max-w-2xl">
          <p className="pulse-ring mb-4 inline-flex rounded-full border border-accent/30 bg-accent/15 px-4 py-2 text-sm text-accent-ring">
            Главная мастерская автора
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">
            Создавай. Проживай. Пиши свою историю.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted md:text-lg">
            Погрузись в мир, который ты создал. Ты не просто читатель — ты герой,
            соавтор и источник каждого поворота.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/app/onboarding" size="lg">
              <Plus size={18} /> Создать историю
            </Button>
            <Button href={`/app/story/${activeStory.id}`} variant="secondary" size="lg">
              Продолжить игру <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_380px]">
        <article className="glass reveal-up rounded-3xl p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">Текущая история</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">{activeStory.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{activeStory.summary}</p>
            </div>
            <Button href={`/app/story/${activeStory.id}`} size="md" className="shrink-0">
              Продолжить <ArrowRight size={16} />
            </Button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Stat icon={Users} label="Персонажи" value={String(demoCharacters.length)} />
            <Stat icon={BookOpen} label="Глава" value={String(activeStory.chapter)} />
            <Stat icon={Sparkles} label="Мир истории" value={activeWorld.name} />
          </div>
        </article>

        <aside className="glass reveal-up reveal-delay-1 rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <Clock className="text-accent-ring" size={20} />
            <h2 className="font-serif text-2xl md:text-3xl">Последние события</h2>
          </div>
          <div className="space-y-3">
            {activity.map((item) => (
              <p
                key={item}
                className="rounded-2xl border border-line/15 bg-surface-2/40 p-4 text-sm leading-6 text-muted"
              >
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
            <p className="mt-2 text-sm text-muted">
              Только твои истории. Персонажи и миры живут внутри конкретной истории.
            </p>
          </div>
          <Link
            href="/app/stories"
            className="inline-flex items-center gap-2 text-sm text-accent-ring hover:text-fg"
          >
            Все истории <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {demoStories.map((story, index) => (
            <StoryCard key={story.id} story={story} offset={index} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

type StatProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
};

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="rounded-2xl border border-line/15 bg-surface-2/40 p-4">
      <Icon className="text-accent-ring" size={18} />
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-subtle">{label}</p>
      <p className="mt-1 font-serif text-2xl">{value}</p>
    </div>
  );
}

import { BookOpen, Map, Plus, Sparkles } from "lucide-react";
import { SoonButton } from "@/components/soon-button";
import { demoWorlds } from "@/lib/demo-data";

export default function WorldsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="reveal-up mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Миры и локации</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">Лор конкретной истории</h1>
          <p className="mt-4 max-w-2xl text-white/62">
            Мир, правила и локации создаются под отдельную историю. Они не смешиваются с другими сюжетами пользователя.
          </p>
        </div>
        <SoonButton>
          <Plus size={18} /> Сгенерировать локацию
        </SoonButton>
      </header>

      <div className="space-y-6">
        {demoWorlds.map((world) => (
          <article key={world.id} className="glass reveal-up overflow-hidden rounded-3xl">
            <div className="story-card-bg min-h-[220px] p-6 md:p-8">
              <div className="max-w-2xl">
                <p className="text-sm text-violet-200">{world.storyTitle}</p>
                <h2 className="mt-2 font-serif text-5xl font-semibold">{world.name}</h2>
                <p className="mt-4 max-w-xl text-white/72">{world.atmosphere}</p>
              </div>
            </div>
            <div className="grid gap-5 p-6 lg:grid-cols-[1fr_360px]">
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <BookOpen className="icon-breathe text-violet-300" size={20} />
                  <h3 className="font-serif text-3xl">Основной лор</h3>
                </div>
                <p className="text-sm leading-7 text-white/66">{world.description}</p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {world.rules.map((rule) => (
                    <p key={rule} className="hover-lift rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/64">
                      {rule}
                    </p>
                  ))}
                </div>
              </section>
              <aside>
                <div className="mb-4 flex items-center gap-3">
                  <Map className="icon-breathe text-violet-300" size={20} />
                  <h3 className="font-serif text-3xl">Локации</h3>
                </div>
                <div className="space-y-3">
                  {world.locations.map((location) => (
                    <div key={location.name} className="hover-lift rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="font-semibold">{location.name}</p>
                      <p className="mt-1 text-xs text-violet-200">{location.type}</p>
                      <p className="mt-3 text-sm leading-6 text-white/58">{location.description}</p>
                    </div>
                  ))}
                </div>
                <SoonButton className="mt-4 w-full">
                  <Sparkles size={16} /> Дописать лор
                </SoonButton>
              </aside>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

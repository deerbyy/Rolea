import { Edit3, Plus, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { SoonButton } from "@/components/soon-button";
import { demoCharacters } from "@/lib/demo-data";

export default function CharactersPage() {
  return (
    <PageContainer>
      <header className="reveal-up mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-block bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-sm font-semibold uppercase tracking-[0.18em] text-transparent">Персонажи</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Досье героев истории</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Персонажи создаются внутри конкретной истории и не переносятся в другие сюжеты без отдельного выбора автора.
          </p>
        </div>
        <SoonButton>
          <Plus size={18} /> Добавить персонажа
        </SoonButton>
      </header>

      <section className="glass reveal-up mb-5 rounded-3xl p-5">
        <p className="text-sm uppercase tracking-[0.16em] text-subtle">Выбранная история</p>
        <p className="mt-2 font-serif text-2xl">Тени Весперии</p>
        <p className="mt-2 text-sm text-muted">
          Все досье ниже относятся только к этой истории: к её сценам, миру и текущему чату.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {demoCharacters.map((character, index) => (
          <article
            key={character.id}
            className={`glass hover-lift reveal-up rounded-3xl p-5 reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-ember text-xl font-semibold text-accent-fg">
                {character.name.slice(0, 1)}
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent-ring">
                {character.status}
              </span>
            </div>
            <h2 className="font-serif text-2xl">{character.name}</h2>
            <p className="mt-1 text-sm text-accent-ring/90">{character.role}</p>
            <p className="mt-4 text-sm leading-6 text-muted">{character.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {character.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-line/15 bg-surface-2/40 px-3 py-1 text-xs text-muted"
                >
                  {trait}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-line/15 bg-surface-2/40 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-subtle">История</p>
              <p className="mt-1 font-semibold">{character.storyTitle}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <SoonButton className="px-3 py-2">
                <Edit3 size={15} /> Редактировать
              </SoonButton>
              <SoonButton className="px-3 py-2">
                <Sparkles size={15} /> Сгенерировать портрет
              </SoonButton>
            </div>
          </article>
        ))}
      </section>
    </PageContainer>
  );
}

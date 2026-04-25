import { Edit3, Plus, Sparkles } from "lucide-react";
import { SoonButton } from "@/components/soon-button";
import { demoCharacters } from "@/lib/demo-data";

export default function CharactersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="reveal-up mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Персонажи</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">Досье героев истории</h1>
          <p className="mt-4 max-w-2xl text-white/62">
            Персонажи создаются внутри конкретной истории и не переносятся в другие сюжеты без отдельного выбора автора.
          </p>
        </div>
        <SoonButton>
          <Plus size={18} /> Добавить персонажа
        </SoonButton>
      </header>

      <section className="glass reveal-up mb-5 rounded-3xl p-5">
        <p className="text-sm uppercase tracking-[0.16em] text-white/38">Выбранная история</p>
        <p className="mt-2 font-serif text-3xl">Тени Весперии</p>
        <p className="mt-2 text-sm text-white/58">
          Все досье ниже относятся только к этой истории: к ее сценам, миру и текущему чату.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {demoCharacters.map((character, index) => (
          <article
            key={character.id}
            className={`glass hover-lift reveal-up rounded-3xl p-5 reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-300 to-amber-200 text-xl font-semibold text-slate-950">
                {character.name.slice(0, 1)}
              </div>
              <span className="rounded-full bg-violet-500/18 px-3 py-1 text-xs text-violet-100">
                {character.status}
              </span>
            </div>
            <h2 className="font-serif text-3xl">{character.name}</h2>
            <p className="mt-1 text-sm text-violet-200">{character.role}</p>
            <p className="mt-4 text-sm leading-6 text-white/62">{character.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {character.traits.map((trait) => (
                <span key={trait} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/66">
                  {trait}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/38">История</p>
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
    </div>
  );
}

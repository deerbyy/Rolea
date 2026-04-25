import Link from "next/link";
import { ArrowRight, Boxes, Copy, Sparkles } from "lucide-react";
import { SoonButton } from "@/components/soon-button";
import { demoTemplates } from "@/lib/demo-data";

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="reveal-up mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Шаблоны</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">Быстрый старт истории</h1>
        <p className="mt-4 max-w-2xl text-white/62">
          Шаблон задает формат и жанр, а дальше ведет в создание истории с готовой творческой рамкой.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {demoTemplates.map((template, index) => (
          <article
            key={template.id}
            className={`glass hover-lift reveal-up rounded-3xl p-5 reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <Boxes className="icon-breathe text-violet-300" />
            <p className="mt-5 text-sm text-violet-200">{template.format} · {template.genre}</p>
            <h2 className="mt-2 font-serif text-3xl">{template.title}</h2>
            <p className="mt-4 text-sm leading-6 text-white/62">{template.description}</p>
            <div className="mt-5 space-y-2">
              {template.setup.map((item) => (
                <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/64">
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/app/onboarding?template=${template.id}`}
                className="interactive-glow inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold transition active:scale-[0.97] hover:bg-violet-500"
              >
                Использовать <ArrowRight size={16} />
              </Link>
              <SoonButton className="px-3 py-3">
                <Copy size={15} /> Копия
              </SoonButton>
            </div>
          </article>
        ))}
      </section>

      <section className="glass reveal-up mt-8 rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-3xl">Создать свой шаблон</h2>
            <p className="mt-2 text-sm text-white/58">Скоро можно будет сохранять структуру мира, персонажей и правил как личный шаблон.</p>
          </div>
          <SoonButton>
            <Sparkles size={16} /> Новый шаблон
          </SoonButton>
        </div>
      </section>
    </div>
  );
}

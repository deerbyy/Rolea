import { ArrowRight, Boxes, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { SoonButton } from "@/components/soon-button";
import { demoTemplates } from "@/lib/demo-data";

export default function TemplatesPage() {
  return (
    <PageContainer>
      <header className="reveal-up mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-gradient-to-r from-accent/15 via-fuchsia-500/12 to-ember/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fg"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-ember" />Шаблоны</span>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Быстрый старт истории</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Шаблон задаёт формат и жанр, а дальше ведёт в создание истории с готовой творческой рамкой.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {demoTemplates.map((template, index) => (
          <article
            key={template.id}
            className={`glass hover-lift reveal-up rounded-3xl p-5 reveal-delay-${Math.min(index + 1, 3)}`}
          >
            <Boxes className="icon-breathe text-accent-ring" />
            <p className="mt-5 text-sm text-accent-ring/90">
              {template.format} · {template.genre}
            </p>
            <h2 className="mt-2 font-serif text-2xl">{template.title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted">{template.description}</p>
            <div className="mt-5 space-y-2">
              {template.setup.map((item) => (
                <p
                  key={item}
                  className="rounded-2xl border border-line/15 bg-surface-2/40 px-3 py-2 text-sm text-muted"
                >
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button href={`/app/onboarding?template=${template.id}`} size="md">
                Использовать <ArrowRight size={16} />
              </Button>
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
            <h2 className="font-serif text-2xl">Создать свой шаблон</h2>
            <p className="mt-2 text-sm text-muted">
              Скоро можно будет сохранять структуру мира, персонажей и правил как личный шаблон.
            </p>
          </div>
          <SoonButton>
            <Sparkles size={16} /> Новый шаблон
          </SoonButton>
        </div>
      </section>
    </PageContainer>
  );
}

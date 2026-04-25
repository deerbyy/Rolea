import { PageContainer } from "@/components/ui/page-container";
import { StoriesLibrary } from "@/components/stories-library";

export default function StoriesPage() {
  return (
    <PageContainer>
      <header className="reveal-up mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-gradient-to-r from-accent/15 via-fuchsia-500/12 to-ember/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-ember" />
          Мои истории
        </span>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
          Библиотека историй
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Все черновики, активные ролевые сцены и опубликованные истории в одном месте. Поиск
          понимает названия, жанры, настроение и ключевые слова из синопсиса.
        </p>
      </header>
      <StoriesLibrary />
    </PageContainer>
  );
}

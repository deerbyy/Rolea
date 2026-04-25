import { PageContainer } from "@/components/ui/page-container";
import { StoriesLibrary } from "@/components/stories-library";

export default function StoriesPage() {
  return (
    <PageContainer>
      <header className="reveal-up mb-8">
        <p className="inline-block bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-sm font-semibold uppercase tracking-[0.18em] text-transparent">
          Мои истории
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
          Библиотека{" "}
          <span className="bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-transparent">
            историй
          </span>
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

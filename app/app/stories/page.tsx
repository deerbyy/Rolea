import { PageContainer } from "@/components/ui/page-container";
import { StoriesLibrary } from "@/components/stories-library";

export default function StoriesPage() {
  return (
    <PageContainer>
      <header className="reveal-up mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-accent-ring/90">Мои истории</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Библиотека историй</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Все черновики, активные ролевые сцены и опубликованные истории в одном месте.
        </p>
      </header>
      <StoriesLibrary />
    </PageContainer>
  );
}

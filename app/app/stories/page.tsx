import { StoriesLibrary } from "@/components/stories-library";

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="reveal-up mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Мои истории</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">Библиотека историй</h1>
        <p className="mt-4 max-w-2xl text-white/62">
          Все черновики, активные ролевые сцены и опубликованные истории в одном месте.
        </p>
      </header>
      <StoriesLibrary />
    </div>
  );
}

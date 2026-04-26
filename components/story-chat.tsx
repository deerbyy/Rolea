"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Feather,
  Globe2,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCcw,
  Send,
  Sparkles,
  Users
} from "lucide-react";
import { demoCharacters, initialMessages } from "@/lib/demo-data";
import type { ChatMessage } from "@/lib/types";
import { useStories } from "@/lib/stories-store";
import { cn } from "@/lib/cn";

const fallbackSuggestions = [
  "Спросить Лиру о книге",
  "Проверить переулок",
  "Войти первым"
];

const characterPalette: Record<string, string> = {
  Лира: "from-accent via-fuchsia-500 to-pink-400",
  Кайр: "from-ember via-amber-400 to-yellow-300",
  Rolea: "from-accent via-fuchsia-500 to-ember"
};

function nowLabel() {
  return new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function initialOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "·";
  return trimmed[0].toLocaleUpperCase("ru");
}

export function StoryChat({ storyId }: { storyId: string }) {
  const { getStory, stories, updateStory } = useStories();
  const story = useMemo(() => getStory(storyId) ?? stories[0], [getStory, storyId, stories]);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(fallbackSuggestions);
  const [isFull, setIsFull] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const published = story?.status === "published";

  useEffect(() => {
    const node = messagesRef.current;
    if (!node) {
      return;
    }

    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const node = inputRef.current;
    if (!node) {
      return;
    }

    node.style.height = "0px";
    node.style.height = `${Math.min(node.scrollHeight, 200)}px`;
  }, [input]);

  useEffect(() => {
    if (!isFull) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFull]);

  async function send(action: string, replaceLastReply = false) {
    const trimmed = action.trim();
    if (!trimmed || loading) {
      return;
    }

    const timestamp = nowLabel();

    let working: ChatMessage[];

    if (replaceLastReply) {
      working = [...messages];
      while (working.length > 0 && working[working.length - 1].kind !== "user") {
        working.pop();
      }
      setMessages(working);
    } else {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        kind: "user",
        author: "Вы",
        content: trimmed,
        timestamp
      };
      working = [...messages, userMessage];
      setMessages(working);
      setInput("");
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chat/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: trimmed, messages: working })
      });
      const payload = await response.json();

      if (!response.ok) {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            kind: "system",
            author: "Rolea",
            content: payload.error ?? "Сцена остановлена правилами безопасности.",
            timestamp
          }
        ]);
        return;
      }

      const newSuggestions = Array.isArray(payload.suggestions)
        ? payload.suggestions.filter((item: unknown): item is string => typeof item === "string")
        : fallbackSuggestions;

      setSuggestions(newSuggestions.length ? newSuggestions : fallbackSuggestions);

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          kind: "narration",
          author: "Повествование",
          content: payload.narration,
          timestamp
        },
        {
          id: crypto.randomUUID(),
          kind: "character",
          author: "Лира",
          content: payload.character,
          timestamp
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          kind: "system",
          author: "Rolea",
          content:
            error instanceof Error ? error.message : "Соединение прервалось. Попробуй ещё раз.",
          timestamp
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const lastUserAction = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].kind === "user") {
        return messages[index].content;
      }
    }
    return "";
  }, [messages]);

  async function publish() {
    if (!story) return;
    const next = story.status === "published" ? "active" : "published";
    updateStory(story.id, { status: next });
    await fetch("/api/stories/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId: story.id, publish: next === "published" })
    }).catch(() => undefined);
  }

  if (!story) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
        <p className="font-serif text-3xl">История не найдена</p>
        <p className="mt-2 text-sm">Возможно, она была удалена. Открой библиотеку историй.</p>
      </div>
    );
  }

  const easing = "cubic-bezier(0.22, 0.61, 0.36, 1)";

  return (
    <div
      className="mx-auto grid gap-5 px-4 py-8 md:px-8 xl:grid-cols-[minmax(0,1fr)_var(--rolea-aside-w)]"
      style={{
        // CSS variable drives the right column width — animates via grid-template-columns
        ["--rolea-aside-w" as string]: isFull ? "0px" : "340px",
        maxWidth: isFull ? "100%" : "80rem",
        transition: `grid-template-columns 520ms ${easing}, max-width 520ms ${easing}`,
      }}
    >
      <section
        className="glass reveal-up flex flex-col overflow-hidden rounded-3xl"
        style={{
          height: isFull ? "calc(100vh - 96px)" : "calc(100vh - 132px)",
          minHeight: isFull ? "480px" : "620px",
          transition: `height 520ms ${easing}, min-height 520ms ${easing}`,
        }}
      >
        <header className="shrink-0 border-b border-line/15 bg-surface/40 p-5 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/25 via-fuchsia-500/15 to-ember/15 text-accent-ring shadow-glow">
                <Feather size={18} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-ring/85">{story.genre}</p>
                <h1 className="mt-1 font-serif text-2xl font-semibold md:text-3xl">{story.title}</h1>
                <p className="mt-1 text-xs text-muted">
                  Глава {story.chapter} · {story.mood}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFull((value) => !value)}
                aria-pressed={isFull}
                aria-label={isFull ? "Свернуть из полноэкранного режима" : "Развернуть на весь экран"}
                title={isFull ? "Свернуть (Esc)" : "На весь экран"}
                className="interactive-glow grid h-11 w-11 place-items-center rounded-2xl border border-line/15 bg-surface-2/40 text-muted transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-fg"
              >
                {isFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                type="button"
                onClick={publish}
                className={cn(
                  "interactive-glow rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
                  published
                    ? "border border-ember/40 bg-gradient-to-r from-accent/25 via-fuchsia-500/20 to-ember/30 text-ember-soft shadow-glow"
                    : "border border-line/15 bg-surface-2/40 text-muted hover:text-fg"
                )}
              >
                {published ? "Опубликовано" : "Опубликовать"}
              </button>
            </div>
          </div>
        </header>

        <div
          ref={messagesRef}
          className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto p-5"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && (
            <div className="message-enter inline-flex items-center gap-3 rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-3 text-sm text-muted">
              <Loader2 className="animate-spin" size={16} />
              <span>Rolea продолжает сцену</span>
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-accent-ring" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-accent-ring" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-accent-ring" />
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-line/15 bg-surface/85 p-4 backdrop-blur">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                disabled={loading}
                className="hover-lift rounded-full border border-line/15 bg-surface-2/40 px-3 py-2 text-xs text-muted transition hover:border-accent/40 hover:text-fg disabled:opacity-60"
              >
                {suggestion}
              </button>
            ))}
            {lastUserAction && (
              <button
                type="button"
                onClick={() => send(lastUserAction, true)}
                disabled={loading}
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-line/15 bg-surface-2/40 px-3 py-2 text-xs text-muted transition hover:border-accent/40 hover:text-fg disabled:opacity-60"
              >
                <RefreshCcw size={14} /> Перегенерировать
              </button>
            )}
          </div>
          <div className="flex items-end gap-3 rounded-2xl border border-line/15 bg-surface-2/30 p-3 transition focus-within:border-accent focus-within:shadow-glow">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              className="min-h-11 max-h-[200px] flex-1 resize-none bg-transparent text-sm leading-6 text-fg outline-none"
              placeholder="Ваше действие или реплика…"
            />
            <span className="hidden text-accent-ring sm:inline">
              <Sparkles size={16} />
            </span>
            <button
              type="button"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="interactive-glow grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent via-fuchsia-500 to-ember text-accent-fg shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
              aria-label="Отправить действие"
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </section>

      <aside
        aria-hidden={isFull}
        className={cn(
          "reveal-up reveal-delay-1 space-y-4 overflow-hidden",
          isFull && "pointer-events-none"
        )}
        style={{
          opacity: isFull ? 0 : 1,
          transform: isFull ? "translateX(24px) scale(0.96)" : "translateX(0) scale(1)",
          transformOrigin: "top right",
          transition: `opacity 280ms ease, transform 520ms ${easing}`,
        }}
      >
        <div className="story-card-bg floating-panel min-h-[260px] rounded-3xl border border-line/15 p-5">
          <div className="flex h-full min-h-[220px] flex-col justify-end">
            <h2 className="font-serif text-3xl text-white">{story.title}</h2>
            <p className="mt-2 text-sm text-white/80">{story.summary}</p>
          </div>
        </div>

        <Panel icon={Users} title="Участники">
          <div className="space-y-3">
            {demoCharacters.map((character) => (
              <div
                key={character.id}
                className="hover-lift flex items-center gap-3 rounded-2xl border border-line/15 bg-surface-2/40 p-3"
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-glow",
                    characterPalette[character.name] ?? "from-accent via-fuchsia-500 to-ember"
                  )}
                >
                  {initialOf(character.name)}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{character.name}</p>
                  <p className="truncate text-xs text-accent-ring/90">{character.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel icon={Globe2} title="Мир">
          <p className="text-sm leading-6 text-muted">
            Весперия отвечает на решения героя: закрытые двери, чужие письма и тени меняются
            по мере игры.
          </p>
        </Panel>

        <Panel icon={BookOpen} title="Память сцены">
          <p className="text-sm leading-6 text-muted">
            AI учитывает последние сообщения, роль пользователя, активных персонажей и базовые правила 16+.
          </p>
        </Panel>
      </aside>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.kind === "user";
  const isNarration = message.kind === "narration";
  const isSystem = message.kind === "system";

  if (isUser) {
    return (
      <article className="message-enter flex justify-end">
        <div className="relative max-w-[85%] rounded-2xl rounded-tr-md border border-accent/30 bg-accent-hover/95 px-4 py-3 text-sm leading-6 text-white shadow-glow">
          <span className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-ember/60 to-transparent" />
          <p>{message.content}</p>
          <p className="mt-1 text-right text-[11px] uppercase tracking-[0.18em] text-white/75">
            {message.timestamp}
          </p>
        </div>
      </article>
    );
  }

  if (isNarration) {
    return (
      <article className="message-enter flex gap-3">
        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-line/15 bg-surface-2/60 text-accent-ring">
          <Feather size={12} />
        </span>
        <div className="flex-1 text-sm leading-6 text-muted">
          <p className="italic">{message.content}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">
            {message.timestamp}
          </p>
        </div>
      </article>
    );
  }

  if (isSystem) {
    return (
      <article className="message-enter flex">
        <div className="rounded-2xl border border-accent/30 bg-accent/12 px-4 py-3 text-sm text-accent-ring">
          <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
            <Sparkles size={12} />
            <span>{message.author}</span>
            <span>·</span>
            <span>{message.timestamp}</span>
          </div>
          {message.content}
        </div>
      </article>
    );
  }

  // character
  const palette = characterPalette[message.author] ?? "from-accent via-fuchsia-500 to-ember";
  return (
    <article className="message-enter flex gap-3">
      <span
        className={cn(
          "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-white shadow-glow",
          palette
        )}
      >
        {initialOf(message.author)}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-accent-ring">{message.author}</p>
        <p className="mt-1 text-sm leading-6 text-fg">{message.content}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">
          {message.timestamp}
        </p>
      </div>
    </article>
  );
}

function Panel({
  icon: Icon,
  title,
  children
}: {
  icon: typeof Users;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass hover-lift rounded-3xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <Icon className="icon-breathe text-accent-ring" size={20} />
        <h2 className="font-serif text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

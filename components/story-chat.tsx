"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Globe2,
  Loader2,
  RefreshCcw,
  Send,
  Sparkles,
  Users
} from "lucide-react";
import { demoCharacters, demoStories, initialMessages } from "@/lib/demo-data";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/cn";

const fallbackSuggestions = [
  "Спросить Лиру о книге",
  "Проверить переулок",
  "Войти первым"
];

function nowLabel() {
  return new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function StoryChat({ storyId }: { storyId: string }) {
  const story = useMemo(
    () => demoStories.find((item) => item.id === storyId) ?? demoStories[0],
    [storyId]
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(story.status === "published");
  const [suggestions, setSuggestions] = useState<string[]>(fallbackSuggestions);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

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

  async function send(action: string, replaceLastReply = false) {
    const trimmed = action.trim();
    if (!trimmed || loading) {
      return;
    }

    const timestamp = nowLabel();

    let working: ChatMessage[];

    if (replaceLastReply) {
      // remove trailing AI messages back to the most recent user message
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
    setPublished((current) => !current);
    await fetch("/api/stories/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId: story.id, publish: !published })
    });
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:px-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="glass reveal-up flex h-[calc(100vh-132px)] min-h-[620px] flex-col overflow-hidden rounded-3xl">
        <header className="shrink-0 border-b border-line/15 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-accent-ring/90">{story.genre}</p>
              <h1 className="mt-1 font-serif text-3xl font-semibold md:text-4xl">{story.title}</h1>
              <p className="mt-2 text-sm text-muted">
                Глава {story.chapter}. {story.mood}
              </p>
            </div>
            <button
              type="button"
              onClick={publish}
              className={cn(
                "interactive-glow rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
                published
                  ? "border border-accent/30 bg-accent/22 text-accent-ring"
                  : "border border-line/15 bg-surface-2/40 text-muted hover:text-fg"
              )}
            >
              {published ? "Опубликовано" : "Опубликовать"}
            </button>
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
            <button
              type="button"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="interactive-glow grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg transition hover:-translate-y-0.5 hover:bg-accent-hover disabled:opacity-60"
              aria-label="Отправить действие"
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </section>

      <aside className="reveal-up reveal-delay-1 space-y-4">
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
                className="hover-lift rounded-2xl border border-line/15 bg-surface-2/40 p-3"
              >
                <p className="font-semibold">{character.name}</p>
                <p className="text-xs text-accent-ring/90">{character.role}</p>
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

  const wrapperClass = cn(
    "max-w-2xl rounded-2xl p-4 text-sm leading-6",
    isUser
      ? "bg-accent text-accent-fg"
      : isNarration
        ? "border border-line/15 bg-surface-2/40 italic text-muted"
        : isSystem
          ? "border border-accent/30 bg-accent/12 text-accent-ring"
          : "border border-line/15 bg-surface-2/65 text-fg"
  );

  return (
    <article className={cn("message-enter flex", isUser ? "justify-end" : "justify-start")}>
      <div className={wrapperClass}>
        <div className="mb-2 flex items-center gap-2 text-xs opacity-80">
          {isNarration && <Sparkles size={14} />}
          <span>{message.author}</span>
          <span>·</span>
          <span>{message.timestamp}</span>
        </div>
        {message.content}
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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Globe2, Loader2, Send, Sparkles, Users } from "lucide-react";
import { demoCharacters, demoStories, initialMessages } from "@/lib/demo-data";
import type { ChatMessage } from "@/lib/types";

export function StoryChat({ storyId }: { storyId: string }) {
  const story = useMemo(
    () => demoStories.find((item) => item.id === storyId) ?? demoStories[0],
    [storyId]
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(story.status === "published");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = messagesRef.current;
    if (!node) {
      return;
    }

    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(action = input) {
    const trimmed = action.trim();
    if (!trimmed || loading) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      kind: "user",
      author: "Вы",
      content: trimmed,
      timestamp
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: trimmed, messages: nextMessages })
    });
    const payload = await response.json();
    setLoading(false);

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
      },
      {
        id: crypto.randomUUID(),
        kind: "system",
        author: "Rolea",
        content: `Подсказки: ${(payload.suggestions ?? []).join(", ")}`,
        timestamp
      }
    ]);
  }

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
        <header className="shrink-0 border-b border-white/10 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-violet-200">{story.genre}</p>
              <h1 className="mt-1 font-serif text-4xl font-semibold">{story.title}</h1>
              <p className="mt-2 text-sm text-white/55">
                Глава {story.chapter}. {story.mood}
              </p>
            </div>
            <button
              type="button"
              onClick={publish}
              className={`interactive-glow rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                published
                  ? "border border-violet-300/30 bg-violet-500/20 text-violet-100"
                  : "border border-white/10 bg-white/6 text-white/72 hover:text-white"
              }`}
            >
              {published ? "Опубликовано" : "Опубликовать"}
            </button>
          </div>
        </header>

        <div ref={messagesRef} className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && (
            <div className="message-enter inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/58">
              <Loader2 className="animate-spin" size={16} />
              <span>Rolea продолжает сцену</span>
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-300" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-300" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-300" />
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-white/10 bg-[#080d1c]/92 p-4 backdrop-blur">
          <div className="mb-3 flex flex-wrap gap-2">
            {["Спросить Лиру о книге", "Проверить переулок", "Войти первым"].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="hover-lift rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/62 transition hover:border-violet-300/40 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-black/24 p-3 transition focus-within:border-violet-300/50 focus-within:shadow-glow">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-12 flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/35"
              placeholder="Ваше действие или реплика..."
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              className="interactive-glow grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-600 transition hover:-translate-y-0.5 hover:bg-violet-500"
              aria-label="Отправить действие"
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </section>

      <aside className="reveal-up reveal-delay-1 space-y-4">
        <div className="story-card-bg floating-panel min-h-[260px] rounded-3xl border border-white/10 p-5">
          <div className="flex h-full min-h-[220px] flex-col justify-end">
            <h2 className="font-serif text-3xl">{story.title}</h2>
            <p className="mt-2 text-sm text-white/68">{story.summary}</p>
          </div>
        </div>

        <Panel icon={Users} title="Участники">
          <div className="space-y-3">
            {demoCharacters.map((character) => (
              <div key={character.id} className="hover-lift rounded-2xl bg-white/[0.04] p-3">
                <p className="font-semibold">{character.name}</p>
                <p className="text-xs text-violet-200">{character.role}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel icon={Globe2} title="Мир">
          <p className="text-sm leading-6 text-white/62">
            Весперия отвечает на решения героя: закрытые двери, чужие письма и тени меняются по мере игры.
          </p>
        </Panel>

        <Panel icon={BookOpen} title="Память сцены">
          <p className="text-sm leading-6 text-white/62">
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

  return (
    <article className={`message-enter flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-2xl p-4 text-sm leading-6 ${
          isUser
            ? "bg-violet-600 text-white"
            : isNarration
              ? "border border-white/10 bg-white/[0.04] text-white/74"
              : isSystem
                ? "border border-violet-300/20 bg-violet-500/10 text-violet-100"
                : "bg-white/[0.07] text-white/82"
        }`}
      >
        <div className="mb-2 flex items-center gap-2 text-xs opacity-70">
          {isNarration && <Sparkles size={14} />}
          <span>{message.author}</span>
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
        <Icon className="icon-breathe text-violet-300" size={20} />
        <h2 className="font-serif text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

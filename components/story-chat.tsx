"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AtSign,
  BookOpen,
  ChevronRight,
  CloudFog,
  Compass,
  EyeOff,
  Feather,
  Flame,
  Globe2,
  Loader2,
  Map as MapIcon,
  MapPin,
  Maximize2,
  MessageSquare,
  Minimize2,
  Moon,
  Pin,
  Plus,
  RefreshCcw,
  Send,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { demoCharacters, initialMessages } from "@/lib/demo-data";
import type { ChatMessage, Character } from "@/lib/types";
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

type LocationExit = {
  to: string;
  label: string;
  hint: string;
  locked?: boolean;
};

type Location = {
  id: string;
  name: string;
  subtitle: string;
  chips: { icon: typeof Moon; label: string }[];
  exits: LocationExit[];
};

const locations: Record<string, Location> = {
  library: {
    id: "library",
    name: "Старая библиотека Весперии",
    subtitle: "Этаж 1 · Главный зал",
    chips: [
      { icon: Moon, label: "Ночь · 03:14" },
      { icon: CloudFog, label: "Туман" },
      { icon: Flame, label: "Свечи" }
    ],
    exits: [
      { to: "basement", label: "Подвал библиотеки", hint: "Слышны шаги" },
      { to: "upper", label: "Верхний ярус", hint: "Заперто", locked: true },
      { to: "yard", label: "Двор и переулок", hint: "Оттуда пришли" }
    ]
  },
  basement: {
    id: "basement",
    name: "Подвал библиотеки",
    subtitle: "Глубокие архивы",
    chips: [
      { icon: Moon, label: "Глубокая ночь" },
      { icon: CloudFog, label: "Сырость" },
      { icon: Flame, label: "Один факел" }
    ],
    exits: [
      { to: "library", label: "Главный зал", hint: "Откуда пришли" },
      { to: "tunnel", label: "Тайный туннель", hint: "Запах сырости" }
    ]
  },
  upper: {
    id: "upper",
    name: "Верхний ярус",
    subtitle: "Запретные книги",
    chips: [
      { icon: Moon, label: "Лунный свет" },
      { icon: CloudFog, label: "Сквозняк" },
      { icon: Flame, label: "Тишина" }
    ],
    exits: [{ to: "library", label: "Главный зал", hint: "Откуда пришли" }]
  },
  yard: {
    id: "yard",
    name: "Двор и переулок",
    subtitle: "За оградой Весперии",
    chips: [
      { icon: Moon, label: "Ночь" },
      { icon: CloudFog, label: "Дождь" },
      { icon: Flame, label: "Фонари" }
    ],
    exits: [
      { to: "library", label: "Старая библиотека", hint: "Огни внутри" },
      { to: "city", label: "Улицы Весперии", hint: "Тени за углом" }
    ]
  },
  tunnel: {
    id: "tunnel",
    name: "Тайный туннель",
    subtitle: "Под библиотекой",
    chips: [
      { icon: CloudFog, label: "Темнота" },
      { icon: Flame, label: "Эхо" }
    ],
    exits: [{ to: "basement", label: "Подвал", hint: "Назад наверх" }]
  },
  city: {
    id: "city",
    name: "Улицы Весперии",
    subtitle: "Старый квартал",
    chips: [
      { icon: Moon, label: "Ночь" },
      { icon: CloudFog, label: "Дождь" },
      { icon: Flame, label: "Шёпот толпы" }
    ],
    exits: [{ to: "yard", label: "Двор библиотеки", hint: "Назад к огням" }]
  }
};

const initialMemories: MemoryItem[] = [
  { id: "m1", text: "Алиса вошла в старую библиотеку Весперии", pinned: false },
  { id: "m2", text: "Лира узнала героя по голосу", pinned: false },
  { id: "m3", text: "Кайр предупредил о приближении теней", pinned: false },
  { id: "m4", text: "«Хроники Весперии» закрыты на засов", pinned: true }
];

type MemoryItem = {
  id: string;
  text: string;
  pinned: boolean;
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
  const [currentLocId, setCurrentLocId] = useState<string>("library");
  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories);
  const [mapOpen, setMapOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const currentLocation = locations[currentLocId] ?? locations.library;

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

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isFull) {
      document.body.setAttribute("data-chat-full", "1");
      return () => document.body.removeAttribute("data-chat-full");
    }
  }, [isFull]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-chat-locked", "1");
    return () => document.body.removeAttribute("data-chat-locked");
  }, []);

  function mention(name: string) {
    const tag = `@${name} `;
    setInput((current) => (current.startsWith(tag) ? current : `${tag}${current}`));
    requestAnimationFrame(() => {
      const node = inputRef.current;
      if (!node) return;
      node.focus();
      const value = node.value;
      node.setSelectionRange(value.length, value.length);
    });
  }

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => {
      setToast((current) => (current === text ? null : current));
    }, 2600);
  }

  function travelTo(locId: string) {
    const target = locations[locId];
    if (!target) return;
    if (locId === currentLocId) {
      showToast("Вы уже здесь.");
      return;
    }
    setCurrentLocId(locId);
    setMemories((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        text: `Перешли в локацию: ${target.name}`,
        pinned: false
      }
    ]);
    setMapOpen(false);
  }

  function tryExit(exit: LocationExit) {
    if (exit.locked) {
      showToast(`«${exit.label}» — ${exit.hint.toLowerCase()}. Найди ключ или способ открыть.`);
      return;
    }
    travelTo(exit.to);
  }

  function toggleMemoryPin(id: string) {
    setMemories((current) =>
      current.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item))
    );
  }

  function removeMemory(id: string) {
    setMemories((current) => current.filter((item) => item.id !== id));
  }

  function pinMessageAsMemory(message: ChatMessage) {
    const text =
      message.kind === "user"
        ? `Решение героя: ${message.content}`
        : message.kind === "narration"
          ? message.content
          : `${message.author}: ${message.content}`;
    setMemories((current) => [
      ...current,
      { id: crypto.randomUUID(), text, pinned: true }
    ]);
    setPickerOpen(false);
    showToast("Закреплено в памяти сцены.");
  }

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
        ...(isFull
          ? {
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "12px",
              paddingBottom: "12px",
            }
          : {}),
        transition: `grid-template-columns 520ms ${easing}, max-width 520ms ${easing}, padding 520ms ${easing}`,
      }}
    >
      <section
        className="glass reveal-up flex flex-col overflow-hidden rounded-3xl"
        style={{
          height: isFull ? "calc(100dvh - 100px)" : "calc(100dvh - 140px)",
          minHeight: "320px",
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
          "scrollbar-thin reveal-up reveal-delay-1 space-y-4 overflow-y-auto overflow-x-hidden pr-1",
          isFull && "pointer-events-none"
        )}
        style={{
          height: isFull ? "calc(100dvh - 100px)" : "calc(100dvh - 140px)",
          opacity: isFull ? 0 : 1,
          transform: isFull ? "translateX(24px) scale(0.96)" : "translateX(0) scale(1)",
          transformOrigin: "top right",
          transition: `opacity 280ms ease, transform 520ms ${easing}, height 520ms ${easing}`,
        }}
      >
        <Panel icon={Compass} title="Сцена">
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-accent-ring">Глава {story.chapter} · {story.mood}</span>
                <span className="text-subtle">{story.chapter} / 5</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-3/60">
                <div
                  className="progress-shine h-full rounded-full bg-gradient-to-r from-accent to-ember"
                  style={{ width: `${Math.min(100, (story.chapter / 5) * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <SceneChip icon={MapPin} label="Библиотека" />
              <SceneChip icon={Moon} label="Ночь" />
              <SceneChip icon={CloudFog} label={story.mood} />
            </div>
          </div>
        </Panel>

        <Panel icon={Users} title="Участники">
          <div className="space-y-2">
            {demoCharacters.map((character, index) => (
              <CharacterRow
                key={character.id}
                character={character}
                paletteClass={
                  characterPalette[character.name] ?? "from-accent via-fuchsia-500 to-ember"
                }
                presence={
                  index === 0 ? "speaking" : index === 1 ? "present" : "watching"
                }
                onMention={() => mention(character.name)}
              />
            ))}
            <CharacterRow
              character={{
                id: "shade",
                name: "Тени",
                role: "Антагонист",
                traits: [],
                description: "",
                storyTitle: story.title,
                status: "Прячутся"
              }}
              paletteClass="from-slate-500 via-slate-600 to-slate-700"
              presence="away"
              onMention={() => mention("Тени")}
            />
          </div>
        </Panel>

        <Panel icon={Globe2} title="Локация">
          <div className="space-y-4">
            <div className="story-card-bg relative overflow-hidden rounded-2xl border border-line/15">
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
              <div className="relative flex flex-col gap-1 p-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-accent-ring/85">
                  Текущая сцена
                </span>
                <p className="font-serif text-lg leading-tight text-white">
                  {currentLocation.name}
                </p>
                <span className="text-xs text-white/70">{currentLocation.subtitle}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentLocation.chips.map((chip) => (
                <SceneChip key={chip.label} icon={chip.icon} label={chip.label} />
              ))}
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
                Выходы
              </p>
              <div className="space-y-1.5">
                {currentLocation.exits.map((exit) => (
                  <ExitRow
                    key={exit.to}
                    label={exit.label}
                    hint={exit.hint}
                    muted={exit.locked}
                    locked={exit.locked}
                    onClick={() => tryExit(exit)}
                  />
                ))}
              </div>
            </div>

            {toast && (
              <div className="rounded-xl border border-accent/30 bg-accent/12 px-3 py-2 text-xs text-accent-ring">
                {toast}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="hover-lift inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line/15 bg-surface-2/40 px-3 py-2 text-xs text-muted transition hover:border-accent/40 hover:text-fg"
            >
              <MapIcon size={14} /> Открыть карту мира
            </button>
          </div>
        </Panel>

        <Panel icon={BookOpen} title="Память сцены">
          <ul className="space-y-2 text-sm">
            {memories.map((item) => (
              <MemoryRow
                key={item.id}
                text={item.text}
                pinned={item.pinned}
                onTogglePin={() => toggleMemoryPin(item.id)}
                onRemove={() => removeMemory(item.id)}
              />
            ))}
            {memories.length === 0 && (
              <li className="text-xs text-subtle">Пока нет закреплённых фактов сцены.</li>
            )}
          </ul>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="hover-lift mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line/20 bg-surface-2/30 px-3 py-2 text-xs text-muted transition hover:border-accent/40 hover:text-fg"
          >
            <Plus size={14} /> Закрепить из чата
          </button>
        </Panel>
      </aside>

      {mapOpen && (
        <Modal title="Карта мира" onClose={() => setMapOpen(false)}>
          <p className="mb-4 text-sm text-muted">
            Выбери локацию — герой переместится туда, факт появится в памяти сцены.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Object.values(locations).map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => travelTo(loc.id)}
                className={cn(
                  "hover-lift group flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition",
                  loc.id === currentLocId
                    ? "border-accent/60 bg-accent/15"
                    : "border-line/15 bg-surface-2/40 hover:border-accent/40"
                )}
              >
                <span className="flex items-center gap-2 font-serif text-base">
                  <MapPin size={14} className="text-accent-ring" />
                  {loc.name}
                </span>
                <span className="text-xs text-subtle">{loc.subtitle}</span>
                {loc.id === currentLocId && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-accent-ring">
                    Сейчас здесь
                  </span>
                )}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {pickerOpen && (
        <Modal title="Закрепить из чата" onClose={() => setPickerOpen(false)}>
          <p className="mb-4 text-sm text-muted">
            Выбери сообщение из ленты — оно превратится в закреплённый факт памяти сцены.
          </p>
          {messages.length === 0 ? (
            <p className="text-xs text-subtle">В чате пока нет сообщений.</p>
          ) : (
            <div className="space-y-2">
              {[...messages].slice(-8).reverse().map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => pinMessageAsMemory(message)}
                  className="hover-lift block w-full rounded-2xl border border-line/15 bg-surface-2/40 px-3 py-2 text-left text-sm text-fg transition hover:border-accent/40"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
                    {message.author} · {message.timestamp}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm leading-6">{message.content}</p>
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}
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

function SceneChip({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line/15 bg-surface-2/40 px-2.5 py-1 text-xs text-muted">
      <Icon size={12} className="text-accent-ring" />
      {label}
    </span>
  );
}

function ExitRow({
  label,
  hint,
  muted = false,
  locked = false,
  onClick
}: {
  label: string;
  hint?: string;
  muted?: boolean;
  locked?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Выйти: ${label}`}
      className={cn(
        "hover-lift group flex w-full items-center gap-3 rounded-xl border border-line/10 bg-surface-2/30 px-3 py-2 text-left text-sm transition hover:border-accent/40 hover:bg-surface-2/50",
        muted && "opacity-60"
      )}
    >
      <Compass size={14} className="shrink-0 text-accent-ring" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-fg">{label}</p>
        {hint && (
          <p className={cn("truncate text-[11px]", locked ? "text-ember" : "text-subtle")}>
            {hint}
          </p>
        )}
      </div>
      <ChevronRight
        size={14}
        className="shrink-0 text-subtle transition group-hover:translate-x-0.5 group-hover:text-accent-ring"
      />
    </button>
  );
}

function Modal({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
      />
      <div className="glass relative z-10 w-full max-w-lg rounded-3xl border border-line/15 p-6 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid h-9 w-9 place-items-center rounded-xl border border-line/15 bg-surface-2/40 text-muted transition hover:border-accent/40 hover:text-fg"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MemoryRow({
  text,
  pinned = false,
  onTogglePin,
  onRemove
}: {
  text: string;
  pinned?: boolean;
  onTogglePin?: () => void;
  onRemove?: () => void;
}) {
  return (
    <li className="group flex items-start gap-2 text-muted">
      <span
        className={cn(
          "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
          pinned ? "bg-ember shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "bg-accent-ring/70"
        )}
      />
      <span className="flex-1 leading-6">{text}</span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onTogglePin}
          aria-label={pinned ? "Открепить" : "Закрепить"}
          title={pinned ? "Открепить" : "Закрепить"}
          className={cn(
            "rounded-md p-1 transition",
            pinned
              ? "text-ember hover:text-ember/70"
              : "text-subtle opacity-0 hover:text-accent-ring group-hover:opacity-100"
          )}
        >
          <Pin size={12} className={pinned ? "fill-ember/30" : ""} />
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить"
            title="Удалить"
            className="rounded-md p-1 text-subtle opacity-0 transition hover:text-fg group-hover:opacity-100"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </li>
  );
}

type Presence = "present" | "speaking" | "watching" | "away";

const presenceMeta: Record<
  Presence,
  {
    label: string;
    dot: string;
    pill: string;
    text: string;
    icon: typeof MessageSquare | null;
    pulse?: boolean;
  }
> = {
  speaking: {
    label: "Говорит",
    dot: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
    pill: "border-ember/40 bg-ember/15 text-ember-soft",
    text: "Говорит сейчас",
    icon: MessageSquare,
    pulse: true
  },
  present: {
    label: "В сцене",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]",
    pill: "border-emerald-400/30 bg-emerald-400/12 text-emerald-200",
    text: "В сцене",
    icon: null
  },
  watching: {
    label: "Наблюдает",
    dot: "bg-slate-300/80",
    pill: "border-line/15 bg-surface-3/40 text-muted",
    text: "Наблюдает",
    icon: null
  },
  away: {
    label: "Вне сцены",
    dot: "bg-slate-600",
    pill: "border-line/10 bg-surface-3/30 text-subtle",
    text: "Вне сцены",
    icon: EyeOff
  }
};

function CharacterRow({
  character,
  paletteClass,
  presence,
  onMention
}: {
  character: Character;
  paletteClass: string;
  presence: Presence;
  onMention: () => void;
}) {
  const meta = presenceMeta[presence];
  const isAway = presence === "away";
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "hover-lift group flex items-center gap-3 rounded-2xl border border-line/15 bg-surface-2/40 p-3 transition",
        isAway && "opacity-60"
      )}
    >
      <div className="relative shrink-0">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-glow",
            paletteClass,
            isAway && "grayscale"
          )}
        >
          {initialOf(character.name)}
        </span>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-2",
            meta.dot,
            meta.pulse && "animate-pulse"
          )}
          aria-hidden
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{character.name}</p>
        <p className="truncate text-xs text-accent-ring/90">{character.role}</p>
        <span
          className={cn(
            "mt-1 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
            meta.pill
          )}
        >
          {Icon && <Icon size={10} />}
          {meta.text}
        </span>
      </div>
      <button
        type="button"
        onClick={onMention}
        title={`Обратиться к ${character.name}`}
        aria-label={`Обратиться к ${character.name}`}
        className="interactive-glow grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line/15 bg-surface-3/40 text-muted transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-ring"
      >
        <AtSign size={14} />
      </button>
    </div>
  );
}

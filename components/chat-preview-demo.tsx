"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Feather, MoreHorizontal, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Story } from "@/lib/types";

const NARRATION_TEXT =
  "Ночь опускается на город. Фонари бросают дрожащий свет на мокрую брусчатку. Вдалеке слышен колокольный звон. Ты стоишь перед дверью старой библиотеки.";
const LIRA_TEXT = "Ты пришёл. Я знала, что ты не оставишь меня одну.";
const KAYR_TEXT = "Время уходит, и тени становятся ближе. Что будем делать?";
const USER_TEXT = "Я осматриваюсь и ищу другой вход.";

// All times in milliseconds within one cycle
const T = {
  narrTypingStart: 200,
  narrTypewriterStart: 1300,
  narrTypewriterEnd: 7000,
  liraTypingStart: 7800,
  liraTypingEnd: 8800,
  kayrTypingStart: 10800,
  kayrTypingEnd: 11800,
  userTypewriterStart: 13800,
  userTypewriterEnd: 16500,
  userSendBeat: 16800,
  userMsgStart: 17100,
  fadeOutStart: 21500,
  cycleEnd: 23500,
};

function useCycleTick(cycleMs: number) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      setElapsed((now - startRef.current) % cycleMs);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [cycleMs]);

  return elapsed;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function typewriterCount(t: number, start: number, end: number, total: number) {
  if (t < start) return 0;
  if (t > end) return total;
  return Math.floor(((t - start) / (end - start)) * total);
}

function TypingDots({ palette = "muted" }: { palette?: "muted" | "violet" | "ember" }) {
  const dotCls =
    palette === "violet"
      ? "bg-accent"
      : palette === "ember"
        ? "bg-ember"
        : "bg-muted";
  return (
    <span className="inline-flex items-end gap-1 py-1">
      <span className={cn("typing-dot h-1.5 w-1.5 rounded-full", dotCls)} />
      <span className={cn("typing-dot h-1.5 w-1.5 rounded-full", dotCls)} />
      <span className={cn("typing-dot h-1.5 w-1.5 rounded-full", dotCls)} />
    </span>
  );
}

export function ChatPreviewDemo({ story }: { story: Story | undefined }) {
  const t = useCycleTick(T.cycleEnd);

  const narrCount = typewriterCount(
    t,
    T.narrTypewriterStart,
    T.narrTypewriterEnd,
    NARRATION_TEXT.length,
  );
  const userInputCount = typewriterCount(
    t,
    T.userTypewriterStart,
    T.userTypewriterEnd,
    USER_TEXT.length,
  );

  const narrTypingDots = t >= T.narrTypingStart && t < T.narrTypewriterStart;
  const narrShown = t >= T.narrTypewriterStart;
  const narrTypingCaret = t >= T.narrTypewriterStart && t < T.narrTypewriterEnd;

  const liraTypingDots = t >= T.liraTypingStart && t < T.liraTypingEnd;
  const liraShown = t >= T.liraTypingEnd;

  const kayrTypingDots = t >= T.kayrTypingStart && t < T.kayrTypingEnd;
  const kayrShown = t >= T.kayrTypingEnd;

  const userTypewriterActive =
    t >= T.userTypewriterStart && t < T.userSendBeat;
  const userSendPulse = t >= T.userSendBeat && t < T.userMsgStart;
  const userMsgShown = t >= T.userMsgStart;

  const fadeProgress = clamp(
    (t - T.fadeOutStart) / (T.cycleEnd - T.fadeOutStart),
    0,
    1,
  );
  const cycleOpacity = 1 - fadeProgress;

  if (!story) return null;

  const inputDisplay = userTypewriterActive
    ? USER_TEXT.slice(0, userInputCount)
    : userMsgShown || userSendPulse
      ? ""
      : "";

  return (
    <aside
      className="reveal-up reveal-delay-1 glass relative flex flex-col rounded-3xl border border-line/15 p-5 shadow-2xl"
      aria-label="Демо-чат истории"
      role="figure"
    >
      <header className="flex items-start justify-between gap-3 border-b border-line/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/25 via-fuchsia-500/15 to-ember/15 text-accent-ring shadow-glow">
            <Feather size={18} />
          </span>
          <div>
            <p className="font-serif text-base font-semibold text-fg">
              {story.title}
            </p>
            <p className="text-xs text-muted">Глава {story.chapter}. Пробуждение</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted" aria-hidden="true">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line/15">
            <Bot size={14} />
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line/15">
            <MoreHorizontal size={14} />
          </span>
        </div>
      </header>

      <div
        className="mt-4 flex min-h-[280px] flex-col gap-4"
        style={{ opacity: cycleOpacity }}
      >
        {/* narration */}
        {(narrTypingDots || narrShown) && (
          <div className="message-enter flex gap-3">
            <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-line/15 bg-surface-2/60 text-accent-ring">
              <Feather size={12} />
            </span>
            <div className="flex-1 text-sm leading-6 text-muted">
              {narrTypingDots ? (
                <TypingDots />
              ) : (
                <>
                  <p className="italic">
                    {NARRATION_TEXT.slice(0, narrCount)}
                    {narrTypingCaret && (
                      <span className="caret-blink text-accent-ring" />
                    )}
                  </p>
                  {!narrTypingCaret && (
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">
                      19:21
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Лира */}
        {(liraTypingDots || liraShown) && (
          <div className="message-enter flex gap-3">
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent via-fuchsia-500 to-pink-400 text-xs font-semibold text-white shadow-glow">
              Л
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-accent-ring">Лира</p>
              {liraTypingDots ? (
                <div className="mt-1">
                  <TypingDots palette="violet" />
                </div>
              ) : (
                <>
                  <p className="mt-1 text-sm leading-6 text-fg">{LIRA_TEXT}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">
                    19:21
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Кайр */}
        {(kayrTypingDots || kayrShown) && (
          <div className="message-enter flex gap-3">
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ember via-amber-400 to-yellow-300 text-xs font-semibold text-white shadow-glow">
              К
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-accent-ring">Кайр</p>
              {kayrTypingDots ? (
                <div className="mt-1">
                  <TypingDots palette="ember" />
                </div>
              ) : (
                <>
                  <p className="mt-1 text-sm leading-6 text-fg">{KAYR_TEXT}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-subtle">
                    19:22
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* User message bubble */}
        {userMsgShown && (
          <div className="message-enter flex justify-end">
            <div className="relative max-w-[85%] rounded-2xl rounded-tr-md border border-accent/30 bg-accent-hover/95 px-4 py-2 text-sm text-white shadow-glow">
              <span className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-ember/60 to-transparent" />
              <p>{USER_TEXT}</p>
              <p className="mt-1 text-right text-[11px] uppercase tracking-[0.18em] text-white/75">
                19:22
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "mt-5 flex items-center gap-2 rounded-2xl border bg-surface-2/60 px-4 py-2 transition",
          userTypewriterActive
            ? "border-accent shadow-glow"
            : "border-line/15",
        )}
        aria-hidden="true"
      >
        <p className="flex-1 truncate text-sm text-fg">
          {inputDisplay ? (
            <>
              {inputDisplay}
              {userTypewriterActive && (
                <span className="caret-blink text-accent-ring" />
              )}
            </>
          ) : (
            <span className="text-subtle">Ваше действие или реплика...</span>
          )}
        </p>
        <span className="text-accent-ring">
          <Sparkles size={16} />
        </span>
        <Link
          href={`/app/story/${story.id}`}
          aria-label="Открыть историю"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-fuchsia-500 to-ember text-white shadow-glow transition",
            userSendPulse && "scale-110",
          )}
        >
          <Send size={14} />
        </Link>
      </div>
    </aside>
  );
}

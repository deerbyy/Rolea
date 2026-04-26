"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Lightbulb, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { demoTemplates, formats, genres } from "@/lib/demo-data";
import type { AiSceneResponse, OnboardingDraft } from "@/lib/types";

type AssistField = "world" | "protagonist" | "userRole" | "genre" | "format";

const worldIdeas = [
  "Город-библиотека под вечной луной, где двери открываются на тех, кто прочитал нужную книгу",
  "Космостанция-колония, где сны экипажа транслируются в общий эфир",
  "Подводный купол с садами и забытыми храмами, где время идёт назад"
];

const protagonistIdeas = [
  "Хранительница запретной библиотеки, помнящая чужие сны",
  "Бывший наёмник с эхом голоса погибшего брата в голове",
  "Юный изобретатель, чьи механизмы оживают только ночью"
];

const userRoleIdeas = [
  "Главный герой — детектив, читающий следы как страницы книги",
  "Союзник героини, чья верность станет проверкой в финале",
  "Свидетель, который медленно превращается в участника событий"
];

const userRoleTones: { id: string; label: string; description: string; gradient: string }[] = [
  {
    id: "mentor",
    label: "Наставник",
    description: "Ведёт героев, делится знаниями, прячет тайну",
    gradient: "from-amber-300 via-ember to-orange-500"
  },
  {
    id: "rival",
    label: "Соперник",
    description: "Идёт к той же цели — но своим путём",
    gradient: "from-rose-400 via-fuchsia-500 to-purple-500"
  },
  {
    id: "mystery",
    label: "Загадка",
    description: "Никто не понимает, на чьей стороне",
    gradient: "from-indigo-400 via-accent to-fuchsia-500"
  },
  {
    id: "shadow",
    label: "Тень",
    description: "Действует из-за кулис, влияет молча",
    gradient: "from-slate-500 via-slate-700 to-slate-900"
  }
];

const initialDraft: OnboardingDraft = {
  genre: "Фэнтези",
  format: "Книга",
  world: "",
  protagonist: "",
  userRole: ""
};

const steps = ["Жанр", "Формат", "Мир", "Персонаж", "Роль", "Готово"];

export function OnboardingWizard() {
  const searchParams = useSearchParams();
  const selectedTemplate = demoTemplates.find(
    (template) => template.id === searchParams.get("template")
  );

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(() => {
    if (!selectedTemplate) {
      return initialDraft;
    }

    return {
      ...initialDraft,
      genre: selectedTemplate.genre,
      format: selectedTemplate.format,
      world: `${selectedTemplate.title}: ${selectedTemplate.description}`
    };
  });
  const [scene, setScene] = useState<AiSceneResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [assistingField, setAssistingField] = useState<AssistField | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-onboarding", "1");
    return () => document.body.removeAttribute("data-onboarding");
  }, []);

  function update<K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function callAssist(field: AssistField, currentValue: string, snapshot: OnboardingDraft) {
    const response = await fetch("/api/ai/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, currentValue, draft: snapshot })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error ?? "AI-помощник не смог улучшить текст.");
    }

    return payload.text as string;
  }

  async function assist(field: AssistField) {
    setAssistingField(field);
    setError(null);
    try {
      const text = await callAssist(field, draft[field], draft);
      update(field, text);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ошибка AI-помощника.");
    } finally {
      setAssistingField(null);
    }
  }

  async function autoFill() {
    setAutoFilling(true);
    setError(null);
    try {
      let snapshot: OnboardingDraft = { ...draft };
      const fields: AssistField[] = ["world", "protagonist", "userRole"];
      for (const field of fields) {
        const text = await callAssist(field, snapshot[field], snapshot);
        snapshot = { ...snapshot, [field]: text };
        update(field, text);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось заполнить с AI.");
    } finally {
      setAutoFilling(false);
    }
  }

  async function generate() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Не удалось создать сцену.");
      return;
    }

    setScene(payload);
  }

  return (
    <div className="grid h-[calc(100dvh-140px)] gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="glass reveal-up relative flex min-h-0 flex-col overflow-hidden rounded-3xl p-5">
        <div className="ambient-grid opacity-20" />
        <p className="relative text-xs uppercase tracking-[0.18em] text-accent-ring/90">Онбординг</p>
        {selectedTemplate && (
          <p className="message-enter relative mt-2 rounded-2xl border border-accent/30 bg-accent/12 p-2 text-xs text-accent-ring">
            Основа: {selectedTemplate.title}
          </p>
        )}
        <h1 className="relative mt-2 font-serif text-2xl font-semibold leading-tight md:text-3xl">
          Создай первую сцену
        </h1>

        <Button
          onClick={autoFill}
          disabled={autoFilling}
          variant="soft"
          size="sm"
          className="relative mt-3 w-full"
        >
          {autoFilling ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
          AI заполнит мир, героя и роль
        </Button>

        <div className="relative mt-4 flex flex-1 flex-col gap-1.5 min-h-0">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              aria-current={index === step ? "step" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition duration-200 ${
                index === step
                  ? "border-accent/40 bg-accent/22 text-fg"
                  : "border-line/15 bg-surface-2/30 text-muted hover:text-fg"
              }`}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                  index === step ? "bg-accent text-accent-fg" : "bg-surface-3/50 text-muted"
                }`}
              >
                {index + 1}
              </span>
              {label}
            </button>
          ))}
        </div>

        <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-ember transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </aside>

      <section className="glass reveal-up reveal-delay-1 flex min-h-0 flex-col overflow-hidden rounded-3xl p-6">
        <div className="flex-1 overflow-y-auto pr-1">
        <div key={step} className="message-enter">
          {step === 0 && (
            <ChoiceStep
              title="Выбери жанр"
              description="Можно выбрать несколько жанров или вписать свой. AI сам разберёт, что ты имеешь в виду."
              options={genres}
              value={draft.genre}
              multiple
              onSelect={(value) => update("genre", value)}
              onAssist={() => assist("genre")}
              assisting={assistingField === "genre"}
            />
          )}
          {step === 1 && (
            <ChoiceStep
              title="Выбери формат"
              description="Формат влияет на ритм сцен. Можно выбрать готовый вариант или написать свой."
              options={formats}
              value={draft.format}
              onSelect={(value) => update("format", value)}
              onAssist={() => assist("format")}
              assisting={assistingField === "format"}
            />
          )}
          {step === 2 && (
            <TextStep
              title="Опиши мир или локацию"
              value={draft.world}
              onChange={(value) => update("world", value)}
              onAssist={() => assist("world")}
              assisting={assistingField === "world"}
              assistLabel="AI допишет атмосферу, законы и тайну этого мира."
              placeholder="Например: академия магии на краю ледяного моря…"
              ideas={worldIdeas}
            />
          )}
          {step === 3 && (
            <TextStep
              title="Добавь ключевого персонажа"
              value={draft.protagonist}
              onChange={(value) => update("protagonist", value)}
              onAssist={() => assist("protagonist")}
              assisting={assistingField === "protagonist"}
              assistLabel="AI допишет характер, мотивацию и тайну героя."
              placeholder="Имя, роль, характер, тайна…"
              ideas={protagonistIdeas}
              preview={<CharacterPreview text={draft.protagonist} />}
            />
          )}
          {step === 4 && (
            <TextStep
              title="Кем ты будешь в истории?"
              value={draft.userRole}
              onChange={(value) => update("userRole", value)}
              onAssist={() => assist("userRole")}
              assisting={assistingField === "userRole"}
              assistLabel="AI оформит роль, способности и завязку конфликта."
              placeholder="Главный герой, союзник, свидетель, антагонист…"
              ideas={userRoleIdeas}
              tones={userRoleTones}
            />
          )}
          {step === 5 && <ReviewStep draft={draft} onJump={(i) => setStep(i)} />}
        </div>

        {error && (
          <p className="mt-5 rounded-2xl border border-danger/30 bg-danger/15 p-4 text-sm text-danger">
            {error}
          </p>
        )}

        {scene && (
          <div className="message-enter mt-8 rounded-3xl border border-accent/30 bg-accent/12 p-5 shadow-glow">
            <p className="text-sm text-accent-ring">Сцена создана</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">{scene.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{scene.openingScene}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {scene.suggestions.map((suggestion) => (
                <span
                  key={suggestion}
                  className="hover-lift rounded-full border border-line/20 bg-surface-2/40 px-3 py-2 text-xs text-muted"
                >
                  {suggestion}
                </span>
              ))}
            </div>
            <Link
              href="/app/story/vesperia"
              className="interactive-glow mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-accent-fg transition hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Начать играть <ArrowRight size={18} />
            </Link>
          </div>
        )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 border-t border-line/10 pt-4">
          <Button
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            variant="secondary"
            size="md"
          >
            Назад
          </Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
              size="md"
            >
              Далее <ArrowRight size={18} />
            </Button>
          ) : (
            <Button onClick={generate} disabled={loading} size="md">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Получить первую сцену
            </Button>
          )}
        </div>

      </section>
    </div>
  );
}

function ChoiceStep({
  title,
  description,
  options,
  value,
  multiple = false,
  onSelect,
  onAssist,
  assisting = false
}: {
  title: string;
  description: string;
  options: string[];
  value: string;
  multiple?: boolean;
  onSelect: (value: string) => void;
  onAssist?: () => void;
  assisting?: boolean;
  assistKind?: string;
}) {
  const [custom, setCustom] = useState("");
  const selected = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  function pick(option: string) {
    if (!multiple) {
      onSelect(option);
      return;
    }

    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onSelect(next.join(", "));
  }

  function addCustom() {
    const normalized = custom.trim();
    if (!normalized) {
      return;
    }

    if (multiple) {
      onSelect([...selected.filter((item) => item !== normalized), normalized].join(", "));
    } else {
      onSelect(normalized);
    }

    setCustom("");
  }

  return (
    <>
      <h2 className="font-serif text-2xl font-semibold md:text-3xl">{title}</h2>
      <p className="mt-1.5 text-sm text-muted">{description}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => pick(option)}
              aria-pressed={active}
              className={cn(
                "relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition duration-200",
                active
                  ? "border-accent/70 bg-accent/22 text-fg hover:bg-accent/28"
                  : "border-line/15 bg-surface-2/30 text-muted hover:border-line/30 hover:bg-surface-2/50 hover:text-fg"
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition",
                  active
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line/25 bg-surface/60 text-transparent"
                )}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <span className="text-sm font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      {value && (
        <p className="mt-3 rounded-xl border border-accent/30 bg-accent/12 px-3 py-1.5 text-xs text-accent-ring">
          Выбрано: {value}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-accent/25 bg-accent/8 p-2 sm:flex-nowrap">
        <input
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustom();
            }
          }}
          className="h-10 min-w-0 flex-1 rounded-xl border border-line/15 bg-surface px-3 text-sm text-fg outline-none transition focus:border-accent"
          placeholder={
            multiple
              ? "Свой жанр или смесь: романтика + хоррор + школа магии"
              : "Свой формат: аниме-сериал, дневник, интерактивная манга…"
          }
        />
        <Button onClick={addCustom} variant="secondary" size="sm" type="button">
          Добавить
        </Button>
        {onAssist && (
          <Button
            onClick={onAssist}
            disabled={assisting}
            variant="primary"
            size="sm"
            type="button"
          >
            {assisting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {custom.trim() || value ? `Доработать с AI` : `Сгенерировать с AI`}
          </Button>
        )}
      </div>
    </>
  );
}

function TextStep({
  title,
  value,
  placeholder,
  onAssist,
  assisting = false,
  assistLabel,
  onChange,
  ideas,
  preview,
  tones
}: {
  title: string;
  value: string;
  placeholder: string;
  onAssist?: () => void;
  assisting?: boolean;
  assistLabel?: string;
  onChange: (value: string) => void;
  ideas?: string[];
  preview?: React.ReactNode;
  tones?: { id: string; label: string; description: string; gradient: string }[];
}) {
  function applyTone(tone: { label: string; description: string }) {
    const prefix = `${tone.label}: ${tone.description}.`;
    if (!value.trim()) {
      onChange(prefix);
      return;
    }
    if (value.startsWith(prefix)) return;
    onChange(`${prefix}\n\n${value}`);
  }

  return (
    <>
      <h2 className="font-serif text-2xl font-semibold md:text-3xl">{title}</h2>

      <div className={cn("mt-5 grid gap-4", preview ? "lg:grid-cols-[1fr_260px]" : "")}>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-[160px] w-full resize-none rounded-3xl border border-line/15 bg-surface-2/40 p-5 leading-7 text-fg outline-none transition focus:border-accent"
        />
        {preview && <div className="h-[160px]">{preview}</div>}
      </div>

      {tones && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
            Тон роли
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tones.map((tone) => {
              const active = value.startsWith(`${tone.label}:`);
              return (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => applyTone(tone)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border px-3 py-2 text-left transition duration-200",
                    active
                      ? "border-accent/70 bg-accent/15"
                      : "border-line/15 bg-surface-2/40 hover:border-line/30"
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-20 transition group-hover:opacity-30",
                      tone.gradient
                    )}
                  />
                  <span className="relative block text-sm font-medium text-fg">{tone.label}</span>
                  <span className="relative block text-[11px] text-muted">{tone.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {ideas && ideas.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
            <Lightbulb size={12} className="text-ember" /> Идеи для вдохновения
          </p>
          <div className="flex flex-wrap gap-2">
            {ideas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => onChange(idea)}
                className="rounded-full border border-line/15 bg-surface-2/40 px-3 py-1.5 text-left text-xs text-muted transition duration-200 hover:border-accent/40 hover:text-fg"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>
      )}

      {onAssist && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-accent/25 bg-accent/12 px-4 py-3">
          <p className="flex-1 text-sm leading-6 text-accent-ring">{assistLabel}</p>
          <Button onClick={onAssist} disabled={assisting} variant="primary" size="sm" type="button">
            {assisting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {value.trim() ? "Доработать с AI" : "Сгенерировать с AI"}
          </Button>
        </div>
      )}
    </>
  );
}

function CharacterPreview({ text }: { text: string }) {
  const trimmed = text.trim();
  const lines = trimmed.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const firstLine = lines[0] ?? "";
  const sepMatch = firstLine.match(/^(.+?)\s*(?:—|–|-|:|,)\s*(.+)$/);

  let name = "Без имени";
  let descPrefix = "";
  if (sepMatch) {
    name = sepMatch[1].trim() || "Без имени";
    descPrefix = sepMatch[2].trim();
  } else if (firstLine) {
    name = firstLine;
  }

  const restLines = lines.slice(1).join("\n");
  const description = [descPrefix, restLines].filter(Boolean).join("\n").trim();
  const initial = (name === "Без имени" ? "?" : name.charAt(0).toUpperCase()) || "?";
  const summary = description
    ? description.length > 200
      ? `${description.slice(0, 200)}…`
      : description
    : "Здесь появится описание — допиши через «—», «:» или с новой строки.";

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/15 p-5">
      <div className="ambient-grid opacity-15" />
      <p className="relative text-[10px] uppercase tracking-[0.22em] text-accent-ring/85">
        Превью персонажа
      </p>
      <div className="relative mt-3 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent via-fuchsia-500 to-ember text-lg font-semibold text-accent-fg">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-lg leading-tight">{name}</p>
          <p className="text-[11px] text-subtle">появится в этой истории</p>
        </div>
      </div>
      <p
        className={cn(
          "relative mt-3 text-sm leading-6",
          description ? "text-muted" : "text-subtle italic"
        )}
      >
        {summary}
      </p>
    </div>
  );
}

function ReviewStep({
  draft,
  onJump
}: {
  draft: OnboardingDraft;
  onJump: (step: number) => void;
}) {
  const fields: Array<{ label: string; value: string; step: number }> = [
    { label: "Жанр", value: draft.genre, step: 0 },
    { label: "Формат", value: draft.format, step: 1 },
    { label: "Мир", value: draft.world, step: 2 },
    { label: "Ключевой персонаж", value: draft.protagonist, step: 3 },
    { label: "Роль пользователя", value: draft.userRole, step: 4 }
  ];

  return (
    <>
      <h2 className="font-serif text-3xl font-semibold md:text-4xl">Проверь черновик</h2>
      <p className="mt-3 text-muted">
        Мы соберём первую сцену по этим полям. Любое можно поправить — нажми на блок, чтобы вернуться к шагу.
      </p>
      <div className="mt-6 space-y-3">
        {fields.map((field) => (
          <button
            key={field.label}
            type="button"
            onClick={() => onJump(field.step)}
            className="hover-lift block w-full rounded-2xl border border-line/15 bg-surface-2/40 p-4 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.16em] text-accent-ring/90">{field.label}</p>
              <span className="text-xs text-subtle">Изменить</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-fg">
              {field.value.trim() ? field.value : <span className="text-subtle">Пусто — AI подхватит сам.</span>}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}

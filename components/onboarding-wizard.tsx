"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <aside className="glass reveal-up overflow-hidden rounded-3xl p-6">
        <div className="ambient-grid opacity-20" />
        <p className="relative text-sm uppercase tracking-[0.18em] text-accent-ring/90">Онбординг</p>
        {selectedTemplate && (
          <p className="message-enter relative mt-4 rounded-2xl border border-accent/30 bg-accent/12 p-3 text-sm text-accent-ring">
            Основа выбрана: {selectedTemplate.title}
          </p>
        )}
        <h1 className="relative mt-4 font-serif text-4xl font-semibold md:text-5xl">
          Создай первую сцену
        </h1>
        <p className="relative mt-4 text-sm leading-6 text-muted">
          Шесть шагов превращают идею в историю. Поля можно заполнить самому или нажать «AI заполнит за меня».
        </p>

        <Button
          onClick={autoFill}
          disabled={autoFilling}
          variant="soft"
          size="md"
          className="relative mt-5 w-full"
        >
          {autoFilling ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
          AI заполнит мир, героя и роль
        </Button>

        <div className="relative mt-6 space-y-2">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              aria-current={index === step ? "step" : undefined}
              className={`nav-hover flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                index === step
                  ? "border-accent/40 bg-accent/22 text-fg"
                  : "border-line/15 bg-surface-2/30 text-muted hover:text-fg"
              }`}
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-sm ${
                  index === step ? "bg-accent text-accent-fg pulse-ring" : "bg-surface-3/50 text-muted"
                }`}
              >
                {index + 1}
              </span>
              {label}
            </button>
          ))}
        </div>

        <div className="relative mt-8 h-1.5 overflow-hidden rounded-full bg-surface-3/60">
          <div
            className="progress-shine h-full rounded-full bg-gradient-to-r from-accent to-ember transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </aside>

      <section className="glass reveal-up reveal-delay-1 rounded-3xl p-6">
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
              assistKind="жанр"
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
              assistKind="формат"
            />
          )}
          {step === 2 && (
            <TextStep
              title="Опиши мир или локацию"
              value={draft.world}
              onChange={(value) => update("world", value)}
              onAssist={() => assist("world")}
              assisting={assistingField === "world"}
              assistLabel="AI может придумать мир с нуля или улучшить твой набросок. Мир будет относиться только к этой истории."
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
              assistLabel="AI поможет дописать характер, мотивацию, слабость и тайну персонажа именно для этой истории."
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
              assistLabel="AI поможет оформить твою роль, способности и первый конфликт, от которого начнётся сцена."
              placeholder="Главный герой, союзник, свидетель, антагонист…"
              ideas={userRoleIdeas}
              tones={userRoleTones}
            />
          )}
          {step === 5 && <ReviewStep draft={draft} onJump={(i) => setStep(i)} />}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
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
  assisting = false,
  assistKind
}: {
  title: string;
  description: string;
  options: string[];
  value: string;
  multiple?: boolean;
  onSelect: (value: string) => void;
  onAssist?: () => void;
  assisting?: boolean;
  assistKind: "жанр" | "формат";
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
      <h2 className="font-serif text-3xl font-semibold md:text-4xl">{title}</h2>
      <p className="mt-3 text-muted">{description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => pick(option)}
              aria-pressed={active}
              className={cn(
                "hover-lift relative flex items-center gap-3 rounded-2xl border p-5 text-left transition",
                active
                  ? "border-accent/70 bg-accent/22 text-fg shadow-glow ring-1 ring-accent/40"
                  : "border-line/15 bg-surface-2/30 text-muted hover:border-line/30 hover:bg-surface-2/50 hover:text-fg"
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
                  active
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line/25 bg-surface/60 text-transparent"
                )}
              >
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      {value && (
        <p className="mt-4 rounded-2xl border border-accent/30 bg-accent/12 px-3 py-2 text-xs text-accent-ring">
          Выбрано: {value}
        </p>
      )}

      <div className="mt-5 rounded-3xl border border-accent/25 bg-accent/8 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-fg">
              {multiple ? "Свой жанр или смесь жанров" : "Свой формат"}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Опиши своими словами — AI допишет, конкретизирует или придумает с нуля.
            </p>
          </div>
          {onAssist && (
            <Button
              onClick={onAssist}
              disabled={assisting}
              variant="primary"
              size="sm"
              type="button"
            >
              {assisting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              {custom.trim() || value ? `Доработать ${assistKind} с AI` : `Сгенерировать ${assistKind}`}
            </Button>
          )}
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustom();
              }
            }}
            className="min-h-12 flex-1 rounded-2xl border border-line/15 bg-surface px-4 text-fg outline-none transition focus:border-accent"
            placeholder={
              multiple
                ? "Например: романтика + хоррор + школа магии"
                : "Например: аниме-сериал, дневник, интерактивная манга…"
            }
          />
          <Button onClick={addCustom} variant="secondary" size="md" type="button">
            Добавить
          </Button>
        </div>
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
      <h2 className="font-serif text-3xl font-semibold md:text-4xl">{title}</h2>
      <div className={cn("mt-6 grid gap-5", preview ? "lg:grid-cols-[1fr_240px]" : "")}> 
        <div>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="min-h-[220px] w-full resize-none rounded-3xl border border-line/15 bg-surface-2/40 p-5 leading-7 text-fg outline-none transition focus:-translate-y-0.5 focus:border-accent focus:shadow-glow"
          />

          {tones && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
                Тон роли
              </p>
              <div className="flex flex-wrap gap-2">
                {tones.map((tone) => {
                  const active = value.startsWith(`${tone.label}:`);
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => applyTone(tone)}
                      className={cn(
                        "hover-lift group relative overflow-hidden rounded-2xl border px-4 py-2 text-left transition",
                        active
                          ? "border-accent/70 bg-accent/15 shadow-glow"
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
                    className="hover-lift rounded-full border border-line/15 bg-surface-2/40 px-3 py-1.5 text-left text-xs text-muted transition hover:border-accent/40 hover:text-fg"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onAssist && (
            <div className="mt-4 rounded-3xl border border-accent/25 bg-accent/12 p-4">
              <p className="text-sm leading-6 text-accent-ring">{assistLabel}</p>
              <Button onClick={onAssist} disabled={assisting} variant="primary" size="md" className="mt-3" type="button">
                {assisting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {value.trim() ? "Улучшить с AI" : "Сгенерировать с AI"}
              </Button>
            </div>
          )}
        </div>

        {preview && <div className="lg:sticky lg:top-4 lg:self-start">{preview}</div>}
      </div>
    </>
  );
}

function CharacterPreview({ text }: { text: string }) {
  const trimmed = text.trim();
  const firstLine = trimmed.split(/\n|\.|,/).map((s) => s.trim()).filter(Boolean)[0] ?? "";
  const name = firstLine.split(/\s—|:|–/)[0]?.trim() || "Без имени";
  const initial = name.charAt(0).toUpperCase() || "?";
  const summary = trimmed
    ? trimmed.length > 200
      ? `${trimmed.slice(0, 200)}…`
      : trimmed
    : "Здесь появится живая карточка героя — имя, роль и краткое описание из текста выше.";

  return (
    <div className="glass relative overflow-hidden rounded-3xl border border-line/15 p-5">
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
      <p className="relative mt-4 text-sm leading-6 text-muted">{summary}</p>
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

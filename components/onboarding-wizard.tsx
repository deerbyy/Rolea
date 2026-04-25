"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { demoTemplates, formats, genres } from "@/lib/demo-data";
import type { AiSceneResponse, OnboardingDraft } from "@/lib/types";

const initialDraft: OnboardingDraft = {
  genre: "Фэнтези",
  format: "Книга",
  world: "Весперия, город библиотек под вечной луной",
  protagonist: "Лира, хранительница запретной библиотеки",
  userRole: "Автор играет героя, который умеет слышать слова старых книг"
};

const steps = ["Жанр", "Формат", "Мир", "Персонаж", "Роль"];

export function OnboardingWizard() {
  const searchParams = useSearchParams();
  const selectedTemplate = demoTemplates.find((template) => template.id === searchParams.get("template"));
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
  const [assistingField, setAssistingField] = useState<"world" | "protagonist" | "userRole" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function update<K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
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

  async function assist(field: "world" | "protagonist" | "userRole") {
    setAssistingField(field);
    setError(null);

    const response = await fetch("/api/ai/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, currentValue: draft[field], draft })
    });

    const payload = await response.json();
    setAssistingField(null);

    if (!response.ok) {
      setError(payload.error ?? "AI-помощник не смог улучшить текст.");
      return;
    }

    update(field, payload.text);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <aside className="glass reveal-up overflow-hidden rounded-3xl p-6">
        <div className="ambient-grid opacity-20" />
        <p className="relative text-sm uppercase tracking-[0.18em] text-violet-200">Онбординг</p>
        {selectedTemplate && (
          <p className="message-enter relative mt-4 rounded-2xl border border-violet-300/20 bg-violet-500/12 p-3 text-sm text-violet-100">
            Основа выбрана: {selectedTemplate.title}
          </p>
        )}
        <h1 className="relative mt-4 font-serif text-5xl font-semibold">Создай первую сцену</h1>
        <p className="relative mt-4 text-sm leading-6 text-white/62">
          Пять шагов превращают идею в историю. Поля можно заполнить самому или оставить как основу для AI.
        </p>

        <div className="relative mt-8 space-y-3">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`nav-hover flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                index === step
                  ? "border-violet-400/50 bg-violet-500/20"
                  : "border-white/10 bg-white/[0.04] text-white/62 hover:text-white"
              }`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm ${index === step ? "pulse-ring" : ""}`}>
                {index + 1}
              </span>
              {label}
            </button>
          ))}
        </div>

        <div className="relative mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="progress-shine h-full rounded-full bg-gradient-to-r from-violet-400 to-amber-300 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </aside>

      <section className="glass reveal-up reveal-delay-1 rounded-3xl p-6">
        <div key={step} className="message-enter">
          {step === 0 && (
          <ChoiceStep
            title="Выбери жанр"
            description="Можно выбрать несколько жанров или вписать свой. AI сам разберет, что ты имеешь в виду."
            options={genres}
            value={draft.genre}
            multiple
            onSelect={(value) => update("genre", value)}
          />
          )}
          {step === 1 && (
          <ChoiceStep
            title="Выбери формат"
            description="Формат влияет на ритм сцен. Можно выбрать готовый вариант или написать свой."
            options={formats}
            value={draft.format}
            onSelect={(value) => update("format", value)}
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
            placeholder="Например: академия магии на краю ледяного моря..."
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
            placeholder="Имя, роль, характер, тайна..."
          />
          )}
          {step === 4 && (
          <TextStep
            title="Кем ты будешь в истории?"
            value={draft.userRole}
            onChange={(value) => update("userRole", value)}
            onAssist={() => assist("userRole")}
            assisting={assistingField === "userRole"}
            assistLabel="AI поможет оформить твою роль, способности и первый конфликт, от которого начнется сцена."
            placeholder="Главный герой, союзник, свидетель, антагонист..."
          />
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/70 transition hover:-translate-y-0.5 hover:text-white"
          >
            Назад
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
              className="interactive-glow inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-violet-500"
            >
              Далее <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="interactive-glow inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-violet-500 disabled:opacity-65"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Получить первую сцену
            </button>
          )}
        </div>

        {error && <p className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</p>}

        {scene && (
          <div className="message-enter mt-8 rounded-3xl border border-violet-300/20 bg-violet-500/10 p-5 shadow-glow">
            <p className="text-sm text-violet-200">Сцена создана</p>
            <h2 className="mt-2 font-serif text-4xl">{scene.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">{scene.openingScene}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {scene.suggestions.map((suggestion) => (
                <span key={suggestion} className="hover-lift rounded-full border border-white/10 bg-white/7 px-3 py-2 text-xs text-white/70">
                  {suggestion}
                </span>
              ))}
            </div>
            <Link
              href="/app/story/vesperia"
              className="interactive-glow mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950"
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
  onSelect
}: {
  title: string;
  description: string;
  options: string[];
  value: string;
  multiple?: boolean;
  onSelect: (value: string) => void;
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
      <h2 className="font-serif text-4xl font-semibold">{title}</h2>
      <p className="mt-3 text-white/60">{description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => pick(option)}
            className={`hover-lift rounded-2xl border p-5 text-left transition ${
              selected.includes(option)
                ? "border-violet-400 bg-violet-500/20 text-white"
                : "border-white/10 bg-white/[0.04] text-white/68 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm text-white/62">{multiple ? "Свой жанр или смесь жанров" : "Свой формат"}</p>
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
            className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-violet-300/50"
            placeholder={multiple ? "Например: романтика + хоррор + школа магии" : "Например: аниме-сериал, дневник, интерактивная манга..."}
          />
          <button
            type="button"
            onClick={addCustom}
            className="interactive-glow rounded-2xl border border-violet-200/50 bg-violet-600 px-5 py-3 text-sm font-semibold transition active:scale-[0.97] hover:bg-violet-500"
          >
            Добавить
          </button>
        </div>
        {value && <p className="mt-3 text-xs text-violet-100">Выбрано: {value}</p>}
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
  onChange
}: {
  title: string;
  value: string;
  placeholder: string;
  onAssist?: () => void;
  assisting?: boolean;
  assistLabel?: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <h2 className="font-serif text-4xl font-semibold">{title}</h2>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-6 min-h-[240px] w-full resize-none rounded-3xl border border-white/10 bg-white/[0.04] p-5 leading-7 text-white outline-none transition focus:-translate-y-0.5 focus:border-violet-400 focus:shadow-glow placeholder:text-white/35"
      />
      {onAssist && (
        <div className="mt-4 rounded-3xl border border-violet-300/20 bg-violet-500/10 p-4">
          <p className="text-sm leading-6 text-violet-100">{assistLabel}</p>
          <button
            type="button"
            onClick={onAssist}
            disabled={assisting}
            className="interactive-glow mt-3 inline-flex items-center gap-2 rounded-2xl border border-violet-200/60 bg-violet-600 px-5 py-3 text-sm font-semibold transition active:scale-[0.97] hover:bg-violet-500 disabled:opacity-65"
          >
            {assisting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {value.trim() ? "Улучшить с AI" : "Сгенерировать с AI"}
          </button>
        </div>
      )}
    </>
  );
}

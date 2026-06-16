"use client";

import { useState } from "react";
import { Bell, BookOpen, LogOut, Mail, Save, ShieldAlert, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";
import { ThemeToggle } from "@/components/theme-toggle";

const tones = [
  { value: "cinematic", label: "Кинематографичный" },
  { value: "warm", label: "Тёплый, человеческий" },
  { value: "dark", label: "Мрачный нуар" },
  { value: "playful", label: "Игривый, лёгкий" }
];

const ratings = [
  { value: "13+", label: "13+" },
  { value: "16+", label: "16+ (по умолчанию)" },
  { value: "18+", label: "18+ (со временем)" }
];

const languages = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" }
];

export default function SettingsPage() {
  const [name, setName] = useState("Алиса");
  const [tone, setTone] = useState("cinematic");
  const [rating, setRating] = useState("16+");
  const [language, setLanguage] = useState("ru");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <PageContainer size="narrow">
      <header className="reveal-up mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-gradient-to-r from-accent/15 via-fuchsia-500/12 to-ember/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fg"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-ember" />Настройки</span>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Профиль автора</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Имя, тон AI-режиссёра, рейтинг историй и тема приложения. Всё привязано к demo-аккаунту, пока не подключён Supabase.
        </p>
      </header>

      <section className="glass reveal-up rounded-3xl p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-ember/80 to-accent text-3xl font-semibold text-accent-fg">
            {name.slice(0, 1) || "А"}
          </div>
          <div className="flex-1">
            <label className="block text-sm text-muted">
              Имя автора
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-3 text-fg outline-none transition focus:border-accent"
              />
            </label>
          </div>
          <Button onClick={save} size="md">
            <Save size={16} /> Сохранить
          </Button>
        </div>
        {saved && (
          <p className="message-enter mt-4 rounded-2xl border border-accent/30 bg-accent/12 p-3 text-sm text-accent-ring">
            Профиль сохранён локально. Реальное сохранение появится с Supabase.
          </p>
        )}
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="glass hover-lift rounded-3xl p-5">
          <Mail className="icon-breathe text-accent-ring" />
          <h2 className="mt-4 font-serif text-2xl">Аккаунт</h2>
          <p className="mt-2 text-sm text-muted">demo@rolea.app</p>
          <p className="mt-4 rounded-2xl border border-line/15 bg-surface-2/40 p-3 text-sm text-muted">
            Demo-аккаунт. Реальная авторизация включится через Supabase env.
          </p>
        </div>
        <div className="glass hover-lift rounded-3xl p-5">
          <Sparkles className="icon-breathe text-accent-ring" />
          <h2 className="mt-4 font-serif text-2xl">Тема</h2>
          <p className="mt-2 text-sm text-muted">
            Переключатель темы сохраняет выбор локально.
          </p>
          <div className="mt-5">
            <ThemeToggle />
          </div>
        </div>
      </section>

      <section className="glass reveal-up mt-5 rounded-3xl p-6">
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="text-accent-ring" size={20} />
          <h2 className="font-serif text-2xl">Стиль AI-режиссёра</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {tones.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTone(option.value)}
              className={`hover-lift rounded-2xl border p-4 text-left transition ${
                tone === option.value
                  ? "border-accent/50 bg-accent/22 text-fg"
                  : "border-line/15 bg-surface-2/40 text-muted hover:text-fg"
              }`}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="mt-1 text-xs text-subtle">
                {option.value === "cinematic"
                  ? "Сцены строятся как в кино: атмосфера, паузы, крупные планы."
                  : option.value === "warm"
                    ? "Сцены ближе к личным дневникам и тёплому общению."
                    : option.value === "dark"
                      ? "Сцены мрачные, медленные, с напряжением и тенями."
                      : "Лёгкий темп, юмор и быстрые повороты."}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="glass reveal-up mt-5 grid gap-5 rounded-3xl p-6 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-accent-ring/90">Рейтинг по умолчанию</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ratings.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRating(option.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  rating === option.value
                    ? "border-accent/50 bg-accent/22 text-fg"
                    : "border-line/15 bg-surface-2/40 text-muted hover:text-fg"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-accent-ring/90">Язык интерфейса</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {languages.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  language === option.value
                    ? "border-accent/50 bg-accent/22 text-fg"
                    : "border-line/15 bg-surface-2/40 text-muted hover:text-fg"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="glass reveal-up mt-5 flex flex-col gap-4 rounded-3xl p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Bell className="mt-1 text-accent-ring" size={20} />
          <div>
            <h2 className="font-serif text-2xl">Уведомления</h2>
            <p className="mt-1 text-sm text-muted">
              Письма о новых ответах в публичных историях и обновлениях Rolea.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setNotifications((current) => !current)}
          aria-pressed={notifications}
          className={`relative h-7 w-12 rounded-full transition ${
            notifications ? "bg-accent" : "bg-surface-3/60"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-surface transition ${
              notifications ? "left-6" : "left-1"
            }`}
          />
        </button>
      </section>

      <section className="glass reveal-up mt-5 rounded-3xl border border-danger/30 bg-danger/12 p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-1 text-danger" size={20} />
          <div>
            <h2 className="font-serif text-2xl text-danger">Опасная зона</h2>
            <p className="mt-1 text-sm text-danger/85">
              Экспорт всех историй или удаление аккаунта. Действия станут активны после подключения Supabase.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href="/auth" variant="secondary" size="md">
            <LogOut size={16} /> На страницу входа
          </Button>
          <Button variant="danger" size="md" onClick={() => setSaved(true)}>
            <User size={16} /> Запросить экспорт данных
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}

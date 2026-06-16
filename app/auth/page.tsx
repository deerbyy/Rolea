"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    "Demo-режим: вход выполнится локально без Supabase, если ключи не заполнены."
  );
  const [tone, setTone] = useState<"info" | "error" | "success">("info");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || password.length < 6) {
      setTone("error");
      setMessage("Введи email и пароль не короче 6 символов.");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      window.setTimeout(() => {
        setTone("success");
        setMessage("Demo-вход выполнен. В реальном проекте добавь Supabase ключи в .env.local.");
        setLoading(false);
        window.location.href = "/app";
      }, 450);
      return;
    }

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: name || undefined } }
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setTone("error");
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/app";
  }

  function handleProvider(provider: string) {
    setTone("info");
    setMessage(`OAuth через ${provider} появится после подключения Supabase OAuth.`);
  }

  const messageClass =
    tone === "error"
      ? "border-danger/30 bg-danger/15 text-danger"
      : tone === "success"
        ? "border-accent/30 bg-accent/15 text-accent-ring"
        : "border-line/15 bg-surface-2/40 text-muted";

  return (
    <main className="grid min-h-screen bg-bg text-fg lg:grid-cols-[1fr_520px]">
      <section className="relative hidden overflow-hidden lg:block">
        <div className="animated-hero absolute inset-0 hero-image" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/88 via-bg/28 to-transparent" />
        <div className="ambient-grid" />
        <div className="mist-layer" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center gap-3 text-muted hover:text-fg">
            <ArrowLeft size={18} /> На главную
          </Link>
          <div className="reveal-up max-w-xl">
            <p className="text-accent-ring">Rolea account</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight md:text-6xl">
              Сохраняй миры, героев и каждое решение.
            </h1>
            <p className="mt-4 max-w-md text-muted">
              Аккаунт нужен, чтобы истории не терялись между устройствами и можно было публиковать их в галерею.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="font-serif text-4xl font-semibold text-accent-ring md:text-5xl">
            Rolea
          </Link>

          <div className="glass reveal-up mt-10 rounded-3xl p-6">
            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-surface-2/60 p-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  mode === "signin" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  mode === "signup" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                }`}
              >
                Регистрация
              </button>
            </div>

            {mode === "signup" && (
              <label className="mb-4 block text-sm text-muted">
                Имя автора
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-3 text-fg outline-none transition focus:border-accent"
                  placeholder="Алиса"
                />
              </label>
            )}

            <label className="block text-sm text-muted">
              Email
              <input
                value={email}
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-3 text-fg outline-none transition focus:border-accent"
                placeholder="you@rolea.app"
              />
            </label>
            <label className="mt-4 block text-sm text-muted">
              Пароль
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-3 text-fg outline-none transition focus:border-accent"
                placeholder="Минимум 6 символов"
              />
            </label>

            <Button onClick={submit} disabled={loading} size="lg" className="mt-6 w-full">
              {loading && <Loader2 className="animate-spin" size={18} />}
              {mode === "signup" ? "Создать аккаунт" : "Войти"}
            </Button>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-subtle">
              <span className="h-px flex-1 bg-line/20" />
              или
              <span className="h-px flex-1 bg-line/20" />
            </div>

            <div className="grid gap-2">
              <Button onClick={() => handleProvider("Google")} variant="secondary" size="md">
                <Mail size={16} /> Продолжить с Google
              </Button>
              <Button onClick={() => handleProvider("Yandex")} variant="secondary" size="md">
                <Mail size={16} /> Продолжить с Yandex
              </Button>
            </div>

            <p className={`mt-5 rounded-2xl border px-4 py-3 text-sm leading-6 ${messageClass}`}>
              {message}
            </p>

            <p className="mt-4 text-xs text-subtle">
              Регистрируясь, ты соглашаешься, что Rolea — продукт 16+. Истории по умолчанию приватны.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

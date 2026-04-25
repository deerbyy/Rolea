"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Demo mode включен, если Supabase env не заполнены.");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setTimeout(() => {
        setMessage("Demo-вход выполнен. В реальном проекте добавь Supabase ключи в .env.local.");
        setLoading(false);
        window.location.href = "/app";
      }, 450);
      return;
    }

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/app";
  }

  return (
    <main className="grid min-h-screen bg-[#050915] text-white lg:grid-cols-[1fr_520px]">
      <section className="relative hidden overflow-hidden lg:block">
        <div className="animated-hero absolute inset-0 hero-image" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050915]/88 via-[#050915]/28 to-transparent" />
        <div className="ambient-grid" />
        <div className="mist-layer" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center gap-3 text-white/70 hover:text-white">
            <ArrowLeft size={18} /> На главную
          </Link>
          <div className="reveal-up max-w-xl">
            <p className="text-violet-200">Rolea account</p>
            <h1 className="mt-4 font-serif text-6xl font-semibold leading-tight">
              Сохраняй миры, героев и каждое решение.
            </h1>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="font-serif text-5xl font-semibold text-violet-300">
            Rolea
          </Link>
          <div className="glass reveal-up mt-10 rounded-3xl p-6">
            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-white/6 p-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-xl px-4 py-3 text-sm ${mode === "signin" ? "bg-violet-600 text-white" : "text-white/60"}`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-xl px-4 py-3 text-sm ${mode === "signup" ? "bg-violet-600 text-white" : "text-white/60"}`}
              >
                Регистрация
              </button>
            </div>
            <label className="block text-sm text-white/70">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-violet-400"
                placeholder="you@rolea.app"
              />
            </label>
            <label className="mt-4 block text-sm text-white/70">
              Пароль
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-violet-400"
                placeholder="Минимум 6 символов"
              />
            </label>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="interactive-glow mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-4 font-semibold transition hover:-translate-y-0.5 hover:bg-violet-500 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {mode === "signup" ? "Создать аккаунт" : "Войти"}
            </button>
            <p className="mt-4 text-sm leading-6 text-white/56">{message}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

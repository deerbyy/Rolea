import Link from "next/link";
import { LogOut, Mail, User } from "lucide-react";
import { SoonButton } from "@/components/soon-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <header className="reveal-up mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Настройки</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">Профиль</h1>
        <p className="mt-4 max-w-2xl text-white/62">
          Минимальный экран профиля: имя автора, demo-аккаунт, тема и базовые действия.
        </p>
      </header>

      <section className="glass reveal-up rounded-3xl p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-amber-200 to-violet-400 text-3xl font-semibold text-slate-950">
            А
          </div>
          <div className="flex-1">
            <label className="block text-sm text-white/58">
              Имя автора
              <input
                defaultValue="Алиса"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-violet-300/50"
              />
            </label>
          </div>
          <SoonButton>
            <User size={16} /> Сохранить
          </SoonButton>
        </div>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="glass hover-lift rounded-3xl p-5">
          <Mail className="icon-breathe text-violet-300" />
          <h2 className="mt-4 font-serif text-3xl">Аккаунт</h2>
          <p className="mt-2 text-sm text-white/58">demo@rolea.app</p>
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/58">
            Demo account. Реальная авторизация включится через Supabase env.
          </p>
        </div>
        <div className="glass hover-lift rounded-3xl p-5">
          <h2 className="font-serif text-3xl">Тема</h2>
          <p className="mt-2 text-sm text-white/58">Переключатель темы сохраняет выбор локально.</p>
          <div className="mt-5">
            <ThemeToggle />
          </div>
        </div>
      </section>

      <section className="glass mt-5 rounded-3xl p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-3xl">Выход</h2>
            <p className="mt-2 text-sm text-white/58">Пока можно вернуться на страницу входа. Реальный logout появится после Supabase session.</p>
          </div>
          <Link
            href="/auth"
            className="interactive-glow inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/78 transition active:scale-[0.97] hover:text-white"
          >
            <LogOut size={16} /> На страницу входа
          </Link>
        </div>
      </section>
    </div>
  );
}

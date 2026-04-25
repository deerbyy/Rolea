"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  Boxes,
  Compass,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  demoCharacters,
  demoNotifications,
  demoStories,
  demoTemplates,
  demoWorlds
} from "@/lib/demo-data";

const navItems = [
  { href: "/app", label: "Главная", icon: Home, match: ["/app"] },
  { href: "/app/stories", label: "Мои истории", icon: BookOpen, match: ["/app/stories", "/app/story"] },
  { href: "/app/onboarding", label: "Создать историю", icon: Plus, match: ["/app/onboarding"] },
  { href: "/app/characters", label: "Персонажи", icon: Users, match: ["/app/characters"] },
  { href: "/app/worlds", label: "Миры и локации", icon: Compass, match: ["/app/worlds"] },
  { href: "/app/templates", label: "Шаблоны", icon: Boxes, match: ["/app/templates"] },
  { href: "/app/community", label: "Сообщество", icon: Sparkles, match: ["/app/community"] },
  { href: "/app/billing", label: "Подписка", icon: Shield, match: ["/app/billing"] },
  { href: "/app/settings", label: "Настройки", icon: Settings, match: ["/app/settings"] }
];

const bottomNav = navItems.slice(0, 4);
const moreNav = navItems.slice(4);

function isActive(pathname: string, item: (typeof navItems)[number]) {
  if (item.href === "/app") {
    return pathname === "/app";
  }

  return item.match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mainScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMoreOpen(false);
  }, [pathname]);

  return (
    <div className="h-screen overflow-hidden bg-[#050915] text-white">
      <div className="animated-hero fixed inset-0 -z-10 opacity-50 hero-image" />
      <div className="ambient-grid fixed -z-10" />
      <div className="h-screen overflow-hidden">
        <aside className="rolea-sidebar glass border-y-0 border-l-0 p-6">
          <div className="shrink-0">
            <Link href="/app" className="reveal-up font-serif text-5xl font-semibold text-violet-300">
              Rolea
            </Link>
          </div>

          <nav className="mt-10 shrink-0 space-y-2">
            {navItems.map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-hover group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition active:scale-[0.97] ${
                    active
                      ? "border border-violet-300/30 bg-violet-500/24 text-white shadow-glow"
                      : "border border-transparent text-white/68 hover:bg-white/7 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.8)]" />
                  )}
                  <Icon className={active ? "icon-breathe" : ""} size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto shrink-0 space-y-4 pt-8">
            <div className="hover-lift rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-violet-400 text-lg font-semibold text-slate-950">
                  А
                </div>
                <div>
                  <p className="font-semibold">Алиса</p>
                  <p className="text-xs text-white/55">Уровень 12</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="progress-shine h-full w-[60%] rounded-full bg-gradient-to-r from-violet-400 to-amber-300" />
              </div>
              <p className="mt-2 text-xs text-white/55">1200 / 2000 XP</p>
            </div>
            <ThemeToggle />
          </div>
        </aside>

        <main ref={mainScrollRef} className="rolea-main">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050915]/78 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex max-w-7xl items-center gap-4">
              <Link href="/app" className="hidden font-serif text-3xl font-semibold text-violet-300">
                Rolea
              </Link>
              <div className="ml-auto flex flex-1 items-center justify-end gap-3">
                <label className="hidden max-w-md flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55 transition focus-within:border-violet-300/50 focus-within:bg-white/8 md:flex">
                  <Search size={18} />
                  <input
                    onFocus={() => setSearchOpen(true)}
                    onClick={() => setSearchOpen(true)}
                    className="w-full bg-transparent outline-none placeholder:text-white/45"
                    placeholder="Поиск историй, персонажей, миров..."
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setNotificationOpen((open) => !open)}
                  className="pulse-ring grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition active:scale-[0.97] hover:text-white"
                  aria-label="Открыть уведомления"
                >
                  <Bell size={18} />
                </button>
                <Link
                  href="/auth"
                  className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:text-white md:inline-flex"
                >
                  Войти
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setLogoutMessage(true);
                    window.setTimeout(() => setLogoutMessage(false), 2200);
                  }}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition active:scale-[0.97] hover:text-white"
                  aria-label="Выйти"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            {notificationOpen && <NotificationsPanel />}
            {logoutMessage && (
              <div className="message-enter absolute right-4 top-20 z-40 rounded-2xl border border-violet-300/20 bg-[#0a1020] p-4 text-sm text-white/72 shadow-2xl md:right-8">
                Demo: реальный выход подключится после Supabase auth.
              </div>
            )}
          </header>
          {children}
        </main>
      </div>
      <MobileNav pathname={pathname} moreOpen={moreOpen} setMoreOpen={setMoreOpen} />
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const base = [
      ...navItems.map((item) => ({
        href: item.href,
        title: item.label,
        meta: "Раздел приложения",
        icon: item.icon
      })),
      ...demoStories.map((story) => ({
        href: `/app/story/${story.id}`,
        title: story.title,
        meta: `История · ${story.genre}`,
        icon: BookOpen
      })),
      ...demoCharacters.map((character) => ({
        href: "/app/characters",
        title: character.name,
        meta: `Персонаж · ${character.role}`,
        icon: Users
      })),
      ...demoWorlds.map((world) => ({
        href: "/app/worlds",
        title: world.name,
        meta: `Мир · ${world.storyTitle}`,
        icon: Compass
      })),
      ...demoTemplates.map((template) => ({
        href: "/app/templates",
        title: template.title,
        meta: `Шаблон · ${template.format}`,
        icon: Boxes
      })),
      {
        href: "/app/billing",
        title: "Улучшить подписку",
        meta: "Быстрое действие",
        icon: CreditCard
      }
    ];

    const normalized = query.toLowerCase().trim();
    if (!normalized) {
      return base.slice(0, 9);
    }

    return base
      .filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(normalized))
      .slice(0, 10);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-black/58 px-4 py-20 backdrop-blur-sm" onClick={onClose}>
      <div className="message-enter mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#080d1c] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <label className="flex items-center gap-3 rounded-2xl border border-violet-300/30 bg-white/[0.06] px-4 py-4 text-white/70">
          <Search size={20} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                onClose();
              }
            }}
            className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/35"
            placeholder="Найти историю, персонажа, мир, настройку..."
          />
        </label>
        <div className="mt-3 max-h-[420px] space-y-2 overflow-auto scrollbar-thin">
          {results.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.href}-${item.title}`}
                href={item.href}
                onClick={onClose}
                className="nav-hover flex items-center gap-4 rounded-2xl border border-transparent p-4 text-left transition active:scale-[0.98] hover:border-violet-300/25 hover:bg-white/[0.06]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/18 text-violet-100">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block font-semibold">{item.title}</span>
                  <span className="text-sm text-white/50">{item.meta}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div className="message-enter absolute right-4 top-20 z-40 w-[min(360px,calc(100vw-32px))] rounded-3xl border border-white/10 bg-[#080d1c] p-4 shadow-2xl md:right-8">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-serif text-2xl">Уведомления</p>
        <span className="rounded-full bg-violet-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-violet-100">
          demo
        </span>
      </div>
      <div className="space-y-2">
        {demoNotifications.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex justify-between gap-3">
              <p className="font-semibold">{item.title}</p>
              <span className="text-xs text-white/38">{item.time}</span>
            </div>
            <p className="mt-1 text-sm leading-5 text-white/58">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileNav({
  pathname,
  moreOpen,
  setMoreOpen
}: {
  pathname: string;
  moreOpen: boolean;
  setMoreOpen: (open: boolean) => void;
}) {
  return (
    <>
      {moreOpen && (
        <div className="message-enter fixed bottom-20 left-3 right-3 z-40 hidden rounded-3xl border border-white/10 bg-[#080d1c] p-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {moreNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/76 active:scale-[0.97]"
                >
                  <Icon className="mb-2 text-violet-200" size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-40 hidden border-t border-white/10 bg-[#050915]/92 px-2 py-2 backdrop-blur">
        <div className="grid grid-cols-5 gap-1">
          {bottomNav.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition active:scale-[0.96] ${
                  active ? "bg-violet-500/24 text-white" : "text-white/54"
                }`}
              >
                <Icon size={18} />
                <span>{item.label.replace("Мои ", "")}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition active:scale-[0.96] ${
              moreOpen || moreNav.some((item) => isActive(pathname, item))
                ? "bg-violet-500/24 text-white"
                : "text-white/54"
            }`}
          >
            <Menu size={18} />
            <span>Еще</span>
          </button>
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Users,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  demoCharacters,
  demoNotifications,
  demoTemplates,
  demoWorlds
} from "@/lib/demo-data";
import { useStories } from "@/lib/stories-store";
import { fuzzySearch, type Highlighted } from "@/lib/search";
import { Highlight } from "@/components/highlight";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/app", label: "Главная", icon: Home, match: ["/app"] },
  {
    href: "/app/stories",
    label: "Мои истории",
    icon: BookOpen,
    match: ["/app/stories", "/app/story"]
  },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mainScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setMoreOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "Escape") {
        setSearchOpen(false);
        setMoreOpen(false);
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-bg text-fg">
      <div className="animated-hero fixed inset-0 -z-10 opacity-50 hero-image" />
      <div className="ambient-grid fixed -z-10" />

      <div className="h-screen overflow-hidden">
        <aside
          className="rolea-sidebar glass border-y-0 border-l-0 p-6"
          data-open={sidebarOpen ? "true" : "false"}
        >
          <div className="flex shrink-0 items-center justify-between">
            <Link
              href="/app"
              className="reveal-up font-serif text-4xl font-semibold tracking-tight"
            >
              <span className="bg-gradient-to-r from-accent via-fuchsia-400 to-ember bg-clip-text text-transparent">
                Rolea
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Закрыть меню"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line/15 bg-surface-2/60 text-muted lg:hidden"
            >
              <X size={18} />
            </button>
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
                  className={cn(
                    "nav-hover group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition active:scale-[0.97]",
                    active
                      ? "border border-accent/30 bg-gradient-to-r from-accent/30 via-fuchsia-500/18 to-ember/14 text-fg shadow-glow"
                      : "border border-transparent text-muted hover:bg-surface-2/60 hover:text-fg"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-accent-ring via-fuchsia-400 to-ember shadow-[0_0_18px_rgba(196,181,253,0.8)]" />
                  )}
                  <Icon className={active ? "icon-breathe" : ""} size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto shrink-0 space-y-4 pt-8">
            <div className="hover-lift rounded-2xl border border-line/15 bg-surface-2/40 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-ember/80 to-accent text-lg font-semibold text-accent-fg">
                  А
                </div>
                <div>
                  <p className="font-semibold">Алиса</p>
                  <p className="text-xs text-subtle">Уровень 12</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-3/60">
                <div className="progress-shine h-full w-[60%] rounded-full bg-gradient-to-r from-accent to-ember" />
              </div>
              <p className="mt-2 text-xs text-subtle">1200 / 2000 XP</p>
            </div>
            <ThemeToggle />
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Закрыть боковое меню"
            className="fixed inset-0 z-20 bg-black/55 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main ref={mainScrollRef} className="rolea-main">
          <header className="sticky top-0 z-20 border-b border-line/10 bg-bg/78 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex max-w-7xl items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Открыть боковое меню"
                className="grid h-11 w-11 place-items-center rounded-full border border-line/15 bg-surface-2/40 text-muted transition hover:text-fg lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div className="ml-auto flex flex-1 items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="hidden flex-1 items-center gap-3 rounded-2xl border border-line/15 bg-surface-2/40 px-4 py-3 text-sm text-subtle transition hover:border-accent/40 hover:text-fg md:flex md:max-w-md"
                >
                  <Search size={18} />
                  <span className="flex-1 text-left">Поиск историй, персонажей, миров…</span>
                  <kbd className="rounded-md border border-line/15 bg-surface-3/40 px-1.5 py-0.5 text-[10px]">
                    ⌘K
                  </kbd>
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationOpen((open) => !open)}
                  className="pulse-ring grid h-11 w-11 place-items-center rounded-full border border-line/15 bg-surface-2/40 text-muted transition active:scale-[0.97] hover:text-fg"
                  aria-label="Открыть уведомления"
                >
                  <Bell size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLogoutMessage(true);
                    window.setTimeout(() => setLogoutMessage(false), 2200);
                  }}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line/15 bg-surface-2/40 text-muted transition active:scale-[0.97] hover:text-fg"
                  aria-label="Выйти"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            {notificationOpen && <NotificationsPanel />}
            {logoutMessage && (
              <div className="message-enter absolute right-4 top-20 z-40 rounded-2xl border border-accent/20 bg-surface px-4 py-3 text-sm text-muted shadow-2xl md:right-8">
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

type CommandItem = {
  href: string;
  title: string;
  meta: string;
  icon: typeof Home;
  category: "Разделы" | "Истории" | "Персонажи" | "Миры" | "Шаблоны" | "Действия";
};

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { stories } = useStories();
  const listRef = useRef<HTMLDivElement | null>(null);

  const base: CommandItem[] = useMemo(
    () => [
      ...navItems.map<CommandItem>((item) => ({
        href: item.href,
        title: item.label,
        meta: "Раздел приложения",
        icon: item.icon,
        category: "Разделы"
      })),
      ...stories.map<CommandItem>((story) => ({
        href: `/app/story/${story.id}`,
        title: story.title,
        meta: `${story.genre} · глава ${story.chapter}`,
        icon: BookOpen,
        category: "Истории"
      })),
      ...demoCharacters.map<CommandItem>((character) => ({
        href: "/app/characters",
        title: character.name,
        meta: character.role,
        icon: Users,
        category: "Персонажи"
      })),
      ...demoWorlds.map<CommandItem>((world) => ({
        href: "/app/worlds",
        title: world.name,
        meta: world.storyTitle,
        icon: Compass,
        category: "Миры"
      })),
      ...demoTemplates.map<CommandItem>((template) => ({
        href: "/app/templates",
        title: template.title,
        meta: `${template.format} · ${template.genre}`,
        icon: Boxes,
        category: "Шаблоны"
      })),
      {
        href: "/app/billing",
        title: "Улучшить подписку",
        meta: "Открыть тарифы Rolea",
        icon: CreditCard,
        category: "Действия"
      },
      {
        href: "/app/onboarding",
        title: "Создать новую историю",
        meta: "Запустить мастер сцены",
        icon: Plus,
        category: "Действия"
      }
    ],
    [stories]
  );

  type Scored = { item: CommandItem; highlights: Record<string, Highlighted> };

  const results: Scored[] = useMemo(() => {
    if (!query.trim()) {
      return base.slice(0, 12).map((item) => ({ item, highlights: {} }));
    }

    return fuzzySearch(
      base,
      query,
      (item) => ({ title: item.title, meta: item.meta, category: item.category }),
      { weights: { title: 4, meta: 1.5, category: 1 }, limit: 14 }
    ).map(({ item, highlights }) => ({ item, highlights }));
  }, [base, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function go(item: CommandItem) {
    onClose();
    router.push(item.href);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const result = results[activeIndex];
      if (result) {
        go(result.item);
      }
    }
  }

  // Group consecutive results by category for nicer reading.
  const grouped: Array<{ category: string; entries: Array<{ result: Scored; index: number }> }> =
    [];
  results.forEach((result, index) => {
    const last = grouped[grouped.length - 1];
    if (last && last.category === result.item.category) {
      last.entries.push({ result, index });
    } else {
      grouped.push({ category: result.item.category, entries: [{ result, index }] });
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/58 px-4 py-20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="message-enter mx-auto max-w-2xl rounded-3xl border border-line/15 bg-surface p-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <label className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-surface-2/40 px-4 py-4 text-muted focus-within:shadow-glow">
          <Search size={20} className="text-accent-ring" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            className="w-full bg-transparent text-base text-fg outline-none placeholder:text-subtle"
            placeholder="Найти историю, персонажа, мир, настройку…"
          />
          <span className="hidden items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-subtle md:inline-flex">
            ↑↓ <span className="opacity-50">·</span> Enter
          </span>
        </label>

        <div ref={listRef} className="mt-3 max-h-[440px] space-y-1 overflow-auto scrollbar-thin">
          {grouped.length === 0 && (
            <div className="px-2 py-10 text-center text-sm text-muted">
              Ничего не нашлось. Попробуй сформулировать иначе.
            </div>
          )}
          {grouped.map((group) => (
            <div key={group.category} className="pt-2 first:pt-0">
              <p className="px-3 pb-1 text-[11px] uppercase tracking-[0.18em] text-subtle">
                {group.category}
              </p>
              {group.entries.map(({ result, index }) => {
                const Icon = result.item.icon;
                const active = index === activeIndex;
                return (
                  <button
                    key={`${result.item.href}-${result.item.title}`}
                    type="button"
                    data-index={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(result.item)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition active:scale-[0.98]",
                      active
                        ? "border-accent/40 bg-gradient-to-r from-accent/22 via-fuchsia-500/14 to-ember/12 text-fg shadow-glow"
                        : "border-transparent text-muted hover:border-line/15 hover:bg-surface-2/40 hover:text-fg"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                        active
                          ? "bg-gradient-to-br from-accent/40 via-fuchsia-500/30 to-ember/30 text-white shadow-glow"
                          : "bg-accent/18 text-accent-ring"
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-fg">
                        <Highlight parts={result.highlights.title} fallback={result.item.title} />
                      </span>
                      <span className="block truncate text-xs text-muted">
                        <Highlight parts={result.highlights.meta} fallback={result.item.meta} />
                      </span>
                    </span>
                    {active && (
                      <span className="hidden text-[10px] uppercase tracking-[0.18em] text-accent-ring md:inline">
                        Enter
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div className="message-enter absolute right-4 top-20 z-40 w-[min(360px,calc(100vw-32px))] rounded-3xl border border-line/15 bg-surface p-4 shadow-2xl md:right-8">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-serif text-2xl">Уведомления</p>
        <span className="rounded-full bg-accent/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-accent-ring">
          demo
        </span>
      </div>
      <div className="space-y-2">
        {demoNotifications.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-line/15 bg-surface-2/40 p-3"
          >
            <div className="flex justify-between gap-3">
              <p className="font-semibold">{item.title}</p>
              <span className="text-xs text-subtle">{item.time}</span>
            </div>
            <p className="mt-1 text-sm leading-5 text-muted">{item.text}</p>
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
        <div className="message-enter fixed bottom-20 left-3 right-3 z-40 rounded-3xl border border-line/15 bg-surface p-3 shadow-2xl lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {moreNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="rounded-2xl border border-line/15 bg-surface-2/40 p-3 text-sm text-muted active:scale-[0.97]"
                >
                  <Icon className="mb-2 text-accent-ring" size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-line/10 bg-bg/92 px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid w-full grid-cols-5 gap-1">
          {bottomNav.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition active:scale-[0.96]",
                  active ? "bg-accent/24 text-fg" : "text-muted"
                )}
              >
                <Icon size={18} />
                <span>{item.label.replace("Мои ", "")}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition active:scale-[0.96]",
              moreOpen || moreNav.some((item) => isActive(pathname, item))
                ? "bg-accent/24 text-fg"
                : "text-muted"
            )}
          >
            <Menu size={18} />
            <span>Ещё</span>
          </button>
        </div>
      </nav>
    </>
  );
}

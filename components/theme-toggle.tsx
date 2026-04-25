"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("rolea-theme") as Theme | null;
    const initial =
      saved ??
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("rolea-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 items-center gap-3 rounded-full border border-line/15 bg-surface-2/40 px-4 text-sm text-muted transition hover:border-accent/40 hover:text-fg"
      aria-label="Переключить тему"
    >
      {mounted ? (
        <>
          {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
          <span>{theme === "dark" ? "Тёмная" : "Светлая"}</span>
        </>
      ) : (
        <>
          <Moon size={17} />
          <span>Тема</span>
        </>
      )}
    </button>
  );
}

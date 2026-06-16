"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { demoStories } from "@/lib/demo-data";
import type { Story } from "@/lib/types";

const STORAGE_KEY = "rolea:stories";

type StoriesContextValue = {
  stories: Story[];
  hydrated: boolean;
  getStory: (id: string) => Story | undefined;
  addStory: (story: Story) => void;
  updateStory: (id: string, patch: Partial<Story>) => void;
  removeStory: (id: string) => void;
  duplicateStory: (id: string) => Story | null;
  reset: () => void;
};

const StoriesContext = createContext<StoriesContextValue | null>(null);

function loadFromStorage(): Story[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Story[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(stories: Story[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch {
    // ignore quota / privacy errors
  }
}

export function StoriesProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>(demoStories);
  const [hydrated, setHydrated] = useState(false);
  const skipPersist = useRef(true);

  useEffect(() => {
    const fromStorage = loadFromStorage();
    if (fromStorage && fromStorage.length > 0) {
      setStories(fromStorage);
    }
    setHydrated(true);
    skipPersist.current = false;
  }, []);

  useEffect(() => {
    if (skipPersist.current) return;
    saveToStorage(stories);
  }, [stories]);

  const getStory = useCallback((id: string) => stories.find((story) => story.id === id), [stories]);

  const addStory = useCallback((story: Story) => {
    setStories((current) => [story, ...current]);
  }, []);

  const updateStory = useCallback((id: string, patch: Partial<Story>) => {
    setStories((current) =>
      current.map((story) => (story.id === id ? { ...story, ...patch } : story))
    );
  }, []);

  const removeStory = useCallback((id: string) => {
    setStories((current) => current.filter((story) => story.id !== id));
  }, []);

  const duplicateStory = useCallback(
    (id: string) => {
      let created: Story | null = null;
      setStories((current) => {
        const source = current.find((story) => story.id === id);
        if (!source) return current;
        const newId = `${source.id}-copy-${Math.random().toString(36).slice(2, 7)}`;
        created = {
          ...source,
          id: newId,
          title: `${source.title} (копия)`,
          status: "draft",
          progress: 0,
          chapter: 1
        };
        return [created, ...current];
      });
      return created;
    },
    []
  );

  const reset = useCallback(() => {
    setStories(demoStories);
  }, []);

  const value = useMemo<StoriesContextValue>(
    () => ({ stories, hydrated, getStory, addStory, updateStory, removeStory, duplicateStory, reset }),
    [stories, hydrated, getStory, addStory, updateStory, removeStory, duplicateStory, reset]
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}

export function useStories(): StoriesContextValue {
  const ctx = useContext(StoriesContext);
  if (!ctx) {
    // Fallback for components rendered outside the provider (shouldn't happen
    // inside /app, but keeps type-safety simple).
    return {
      stories: demoStories,
      hydrated: false,
      getStory: (id: string) => demoStories.find((story) => story.id === id),
      addStory: () => undefined,
      updateStory: () => undefined,
      removeStory: () => undefined,
      duplicateStory: () => null,
      reset: () => undefined
    };
  }
  return ctx;
}

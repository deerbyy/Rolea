/**
 * Stories repository.
 *
 * Single entry point for reading/writing story records. When Supabase is
 * configured (env vars present), it queries the `stories` table; otherwise it
 * falls back to the in-memory demo dataset so the app stays usable in demo
 * mode without surprising the UI layer.
 */

import { demoStories } from "@/lib/demo-data";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Story } from "@/lib/types";

export async function listStories(): Promise<Story[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return demoStories;
  }

  const { data, error } = await supabase
    .from("stories")
    .select("id, title, genre, format, summary, status, progress, chapter, mood")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return demoStories;
  }

  return data.map((row) => ({
    id: row.id as string,
    title: (row.title as string) ?? "",
    genre: (row.genre as string) ?? "",
    format: (row.format as string) ?? "",
    chapter: Number(row.chapter ?? 1),
    progress: Number(row.progress ?? 0),
    status: (row.status as Story["status"]) ?? "draft",
    summary: (row.summary as string) ?? "",
    mood: (row.mood as string) ?? ""
  }));
}

export async function findStory(id: string): Promise<Story | null> {
  const stories = await listStories();
  return stories.find((story) => story.id === id) ?? null;
}

export async function setStoryVisibility(storyId: string, publish: boolean) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { ok: true as const, demo: true };
  }

  const { error } = await supabase
    .from("stories")
    .update({
      visibility: publish ? "public" : "private",
      status: publish ? "published" : "active",
      published_at: publish ? new Date().toISOString() : null
    })
    .eq("id", storyId);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, demo: false };
}

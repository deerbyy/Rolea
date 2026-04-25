import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type PublishBody = {
  storyId: string;
  publish: boolean;
};

export async function POST(request: Request) {
  const { storyId, publish } = (await request.json()) as PublishBody;
  const supabase = createSupabaseAdminClient();

  if (!storyId) {
    return NextResponse.json({ error: "storyId is required" }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({
      storyId,
      visibility: publish ? "public" : "private",
      mode: "demo"
    });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ storyId, visibility: publish ? "public" : "private" });
}

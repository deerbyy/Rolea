import { NextResponse } from "next/server";
import { setStoryVisibility } from "@/lib/repo/stories";

type PublishBody = {
  storyId: string;
  publish: boolean;
};

export async function POST(request: Request) {
  const { storyId, publish } = (await request.json()) as PublishBody;

  if (!storyId) {
    return NextResponse.json({ error: "storyId is required" }, { status: 400 });
  }

  const result = await setStoryVisibility(storyId, publish);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    storyId,
    visibility: publish ? "public" : "private",
    mode: result.demo ? "demo" : "live"
  });
}

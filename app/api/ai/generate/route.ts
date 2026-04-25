import { NextResponse } from "next/server";
import { generateScene } from "@/lib/ai/gemini";
import { checkContentSafety } from "@/lib/safety";
import type { OnboardingDraft } from "@/lib/types";

export async function POST(request: Request) {
  const draft = (await request.json()) as OnboardingDraft;
  const safety = checkContentSafety(Object.values(draft).join("\n"));

  if (!safety.allowed) {
    return NextResponse.json({ error: safety.reason }, { status: 400 });
  }

  const scene = await generateScene(draft);

  return NextResponse.json(scene);
}

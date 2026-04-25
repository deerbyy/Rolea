import { NextResponse } from "next/server";
import { assistStoryField } from "@/lib/ai/gemini";
import { checkContentSafety } from "@/lib/safety";
import type { OnboardingDraft } from "@/lib/types";

type AssistBody = {
  field: "world" | "protagonist" | "userRole";
  currentValue: string;
  draft: OnboardingDraft;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AssistBody;
  const safety = checkContentSafety(`${body.currentValue}\n${Object.values(body.draft ?? {}).join("\n")}`);

  if (!safety.allowed) {
    return NextResponse.json({ error: safety.reason }, { status: 400 });
  }

  const text = await assistStoryField(body);

  return NextResponse.json({ text });
}

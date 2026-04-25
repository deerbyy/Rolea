import { NextResponse } from "next/server";
import { continueStory } from "@/lib/ai/gemini";
import { checkContentSafety } from "@/lib/safety";
import type { ChatMessage } from "@/lib/types";

type RequestBody = {
  action: string;
  messages: ChatMessage[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const safety = checkContentSafety(body.action);

  if (!safety.allowed) {
    return NextResponse.json({ error: safety.reason }, { status: 400 });
  }

  const result = await continueStory(body.messages ?? [], body.action);

  return NextResponse.json(result);
}

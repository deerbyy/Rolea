import type { AiSceneResponse, ChatMessage, OnboardingDraft } from "@/lib/types";
import { demoCharacters } from "@/lib/demo-data";
import { env } from "@/lib/env";

type GeminiPart = {
  text?: string;
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[];
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

function extractGeminiText(payload: GeminiResponse) {
  return (
    payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim() || ""
  );
}

const GEMINI_TIMEOUT_MS = 20_000;

async function callGemini(prompt: string) {
  if (!env.geminiApiKey) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.85,
            topP: 0.92,
            maxOutputTokens: 900
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        }),
        cache: "no-store",
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed: ${response.status}`);
    }

    return extractGeminiText((await response.json()) as GeminiResponse);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return null;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function safeParseJson<T>(text: string): T | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

function fallbackScene(draft: OnboardingDraft): AiSceneResponse {
  const genre = draft.genre || "Фэнтези";
  const world = draft.world || "Весперия, город библиотек под вечной луной";

  return {
    title: genre === "Сай-фай" ? "Сигнал Элизиума" : "Тени Весперии",
    world,
    characters: demoCharacters,
    openingScene:
      "Дождь стихает ровно в тот момент, когда ты подходишь к запечатанным воротам. На камне вспыхивают слова, будто кто-то пишет их изнутри: `Назови роль, которую готов сыграть`. Лира смотрит на тебя, а Кайр уже тянется к клинку.",
    suggestions: ["Назвать свою роль", "Спросить Лиру о воротах", "Осмотреть руны на камне"]
  };
}

function fallbackReply(action: string) {
  return {
    narration:
      "Твой выбор меняет воздух вокруг. Руны на двери отвечают мягким фиолетовым светом, и старая улица будто отступает, оставляя только библиотеку и тех, кто решился войти.",
    character:
      action.length > 80
        ? "Лира внимательно слушает и кивает: `Ты говоришь так, будто уже видел финал этой истории`."
        : "Кайр усмехается: `Наконец-то решение. Только держись рядом`.",
    suggestions: ["Войти первым", "Попросить объяснить правила мира", "Проверить, кто наблюдает из окна"]
  };
}

export async function generateScene(draft: OnboardingDraft): Promise<AiSceneResponse> {
  const prompt = [
    "Ты AI-режиссер Rolea. Создай стартовую сцену для русскоязычной ролевой истории 16+.",
    "Ответь строго JSON без markdown.",
    `Жанр: ${draft.genre}`,
    `Формат: ${draft.format}`,
    `Мир/локация: ${draft.world}`,
    `Ключевой персонаж: ${draft.protagonist}`,
    `Роль пользователя: ${draft.userRole}`,
    "JSON shape: {\"title\":\"...\",\"world\":\"...\",\"characters\":[{\"id\":\"...\",\"name\":\"...\",\"role\":\"...\",\"traits\":[\"...\"],\"description\":\"...\"}],\"openingScene\":\"...\",\"suggestions\":[\"...\",\"...\",\"...\"]}"
  ].join("\n");

  const text = await callGemini(prompt);
  if (!text) {
    return fallbackScene(draft);
  }

  const parsed = safeParseJson<AiSceneResponse>(text);
  if (parsed) {
    return parsed;
  }

  const fallback = fallbackScene(draft);
  return { ...fallback, openingScene: text };
}

export async function continueStory(messages: ChatMessage[], action: string) {
  const prompt = [
    "Ты AI-режиссер Rolea. Продолжи сцену на русском в стиле cinematic roleplay.",
    "Пиши безопасно для 16+. Раздели ответ на повествование, реплику персонажа и 3 короткие подсказки.",
    "Ответь строго JSON без markdown: {\"narration\":\"...\",\"character\":\"...\",\"suggestions\":[\"...\",\"...\",\"...\"]}",
    `Последние сообщения: ${JSON.stringify(messages.slice(-8))}`,
    `Действие пользователя: ${action}`
  ].join("\n");

  const text = await callGemini(prompt);
  if (!text) {
    return fallbackReply(action);
  }

  const parsed = safeParseJson<ReturnType<typeof fallbackReply>>(text);
  if (parsed) {
    return parsed;
  }

  const fallback = fallbackReply(action);
  return { ...fallback, narration: text };
}

export type AssistField = "world" | "protagonist" | "userRole" | "genre" | "format";

export async function assistStoryField({
  field,
  currentValue,
  draft
}: {
  field: AssistField;
  currentValue: string;
  draft: OnboardingDraft;
}) {
  const labels: Record<AssistField, string> = {
    world: "мир или локацию истории",
    protagonist: "ключевого персонажа истории",
    userRole: "роль пользователя в истории",
    genre: "жанр или микс жанров истории",
    format: "формат подачи истории"
  };

  const fallback: Record<AssistField, string> = {
    world:
      currentValue.trim().length > 20
        ? `${currentValue.trim()}\n\nAI-дополнение: добавь одно правило мира, одну опасную локацию и одну тайну, которую персонажи пока не понимают. Мир должен работать только внутри этой истории и не переноситься в другие сюжеты.`
        : "Весперия — город под вечной луной, где библиотека отвечает на решения героя. Каждая дверь открывается только после выбора роли, а тени становятся опаснее, когда персонажи лгут.",
    protagonist:
      currentValue.trim().length > 20
        ? `${currentValue.trim()}\n\nAI-дополнение: уточни мотивацию, слабость, тайну и то, как этот персонаж связан именно с этой историей.`
        : "Лира — хранительница запретной библиотеки. Она спокойна, опасно честна и помнит чужие сны. Ее тайна связана с дверью, которую герой должен открыть первым.",
    userRole:
      currentValue.trim().length > 20
        ? `${currentValue.trim()}\n\nAI-дополнение: опиши сильную сторону героя, внутренний конфликт и первое решение, которое сразу повлияет на сцену.`
        : "Пользователь играет героя, который слышит слова старых книг. Его сила — замечать скрытые смыслы, а слабость — страх выбрать роль, из которой нельзя выйти.",
    genre: currentValue.trim()
      ? `${currentValue.trim()}, готическая мистика, медленный психологический хоррор`
      : "Тёмное фэнтези с готическим хоррором и нотками детектива — туман, библиотеки, древние ритуалы",
    format: currentValue.trim()
      ? `${currentValue.trim()} с короткими главами, дневниковыми вставками и нелинейными воспоминаниями`
      : "Атмосферная глава-квест: 3-5 сцен на сессию, акцент на диалогах и решениях, между главами — короткие письма и записи в дневник героя"
  };

  const constraints: Record<AssistField, string> = {
    world: "Верни только улучшенный текст без markdown. 4-7 предложений.",
    protagonist: "Верни только улучшенный текст без markdown. 4-7 предложений.",
    userRole: "Верни только улучшенный текст без markdown. 4-7 предложений.",
    genre:
      "Верни ТОЛЬКО короткую строку (1-2 строки) — название жанра или микс из 2-4 жанров через запятую/плюс, без пояснений и markdown.",
    format:
      "Верни ТОЛЬКО короткую строку (1-2 строки) — название формата с уточнением ритма/структуры, без markdown."
  };

  const prompt = [
    "Ты AI-помощник Rolea. Улучши поле онбординга для русскоязычной ролевой истории 16+.",
    `Поле: ${labels[field]}`,
    `Жанр: ${draft.genre}`,
    `Формат: ${draft.format}`,
    `Текущий текст пользователя: ${currentValue || "пусто"}`,
    constraints[field],
    "Важно: персонажи и мир относятся только к одной конкретной истории."
  ].join("\n");

  const text = await callGemini(prompt);
  return text || fallback[field];
}

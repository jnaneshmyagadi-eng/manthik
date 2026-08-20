/**
 * AI Provider Abstraction
 * When AI_API_KEY is missing → demo mode (structured, clearly labelled).
 * When present → calls OpenAI-compatible endpoint (xAI / others).
 */

export type AIMessage = { role: "system" | "user" | "assistant"; content: string };

export function isLiveAI(): boolean {
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.length > 8);
}

export async function chatCompletion(
  messages: AIMessage[],
  opts?: { temperature?: number; maxTokens?: number }
): Promise<{ content: string; isDemo: boolean }> {
  if (!isLiveAI()) {
    return { content: "", isDemo: true };
  }

  const base = process.env.AI_BASE_URL || "https://api.x.ai/v1";
  const model = process.env.AI_MODEL || "grok-2-latest";
  const key = process.env.AI_API_KEY!;

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts?.temperature ?? 0.4,
      max_tokens: opts?.maxTokens ?? 2000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI provider error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  return { content, isDemo: false };
}

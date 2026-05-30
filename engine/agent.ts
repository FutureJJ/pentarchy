import { Decision, type Bundle, type NationCode } from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS: Record<NationCode, string> = {
  CLD: "anthropic/claude-opus-4.7",
  GPT: "openai/gpt-5.5",
  GRK: "x-ai/grok-4.3",
  DSK: "deepseek/deepseek-v4-pro",
  GMN: "google/gemini-3.5-flash",
};

export type DecideResult = {
  code: NationCode;
  decision: Decision;
  raw: string;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

async function callOpenRouter({
  model,
  system,
  user,
}: {
  model: string;
  system: string;
  user: string;
}): Promise<{ content: string; usage?: DecideResult["usage"] }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://pentarchy.world",
      "X-Title": "Pentarchy Observatory",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter ${response.status}: ${errText.slice(0, 500)}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
    usage?: DecideResult["usage"];
  };

  const content = data.choices?.[0]?.message?.content ?? "";
  return { content, usage: data.usage };
}

function tryParseDecision(raw: string): Decision {
  // Models occasionally wrap JSON in ```json fences despite instructions.
  let body = raw.trim();
  if (body.startsWith("```")) {
    body = body.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  const parsed = JSON.parse(body);
  return Decision.parse(parsed);
}

export async function decide(
  code: NationCode,
  bundle: Bundle,
): Promise<DecideResult> {
  const model = MODELS[code];
  const system = buildSystemPrompt(code);
  const user = buildUserPrompt(bundle);

  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { content, usage } = await callOpenRouter({ model, system, user });
      const decision = tryParseDecision(content);
      return { code, decision, raw: content, model, usage };
    } catch (e) {
      lastErr = e;
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  throw new Error(
    `decide(${code}) failed after retries: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  );
}

export async function decideAll(
  bundles: Record<NationCode, Bundle>,
): Promise<{
  results: Partial<Record<NationCode, DecideResult>>;
  errors: Partial<Record<NationCode, string>>;
}> {
  const codes = Object.keys(bundles) as NationCode[];
  const settled = await Promise.allSettled(
    codes.map((c) => decide(c, bundles[c])),
  );

  const results: Partial<Record<NationCode, DecideResult>> = {};
  const errors: Partial<Record<NationCode, string>> = {};

  settled.forEach((r, i) => {
    const code = codes[i];
    if (r.status === "fulfilled") {
      results[code] = r.value;
    } else {
      errors[code] = r.reason instanceof Error ? r.reason.message : String(r.reason);
    }
  });

  return { results, errors };
}

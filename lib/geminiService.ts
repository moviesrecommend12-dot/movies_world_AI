// ════════════════════════════════════════════════════════════════════════════
// geminiService.ts — خدمة العميل (Client) للتواصل مع /api/gemini
// المعادل المباشر لـ GeminiService.dart (دون مفتاح API — يبقى على السيرفر)
// ════════════════════════════════════════════════════════════════════════════

async function chat(prompt: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Gemini API request failed.");
  }
  return data.text as string;
}

// ── محلل JSON (Parser) — معادل _parseTitles ─────────────────────────────────
function parseTitles(raw: string): string[] {
  let text = raw.trim();

  // تنظيف أي رموز Markdown إن وجدت
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) text = fenceMatch[1].trim();

  try {
    const decoded = JSON.parse(text);
    for (const key of ["titles", "movies", "recommendations", "films", "results"]) {
      if (decoded && Array.isArray(decoded[key])) {
        return decoded[key].map((e: unknown) => {
          if (typeof e === "string") return e;
          if (e && typeof e === "object") {
            const obj = e as Record<string, unknown>;
            return String(obj.title ?? obj.name ?? Object.values(obj)[0]);
          }
          return String(e);
        });
      }
    }
    throw new Error("Could not find a titles list in the response.");
  } catch {
    // Fallback: استخراج أي نصوص بين علامتي تنصيص
    const matches = [...text.matchAll(/"([^"]+)"/g)];
    const titles = matches
      .map((m) => m[1])
      .filter((s) => s.length > 3 && !s.includes("{") && !s.includes("}"));

    if (titles.length > 0) return titles;
    throw new Error(`Could not parse titles. Raw: ${raw}`);
  }
}

// ── البحث بالقصة (للمستخدمين الذين يصفون قصة أو فكرة) ───────────────────────
// معادل GeminiService.getTitlesByStory
export async function getTitlesByStory(description: string): Promise<string[]> {
  const prompt = `You are an expert film critic and recommendation engine. Find 8 real movies whose plot, themes, or narrative closely match this description: "${description}".

You MUST return ONLY a valid JSON object with this exact format:
{"titles": ["Movie Title 1", "Movie Title 2", ...]}

Rules:
- Return ONLY the JSON object, no explanations, no markdown.
- Movie titles must be in English.
- Prioritise films that genuinely fit the description.
- Return exactly 8 titles.`;

  const raw = await chat(prompt);
  return parseTitles(raw);
}

// ── البحث بالمود (للمستخدمين الذين يختارون تصنيفات) — معادل getTitlesByMood ──
export async function getTitlesByMood(moods: string[], count: number): Promise<string[]> {
  const moodStr = moods.join(", ");
  const prompt = `You are a world-class movie curator. Recommend exactly ${count} acclaimed movies that perfectly match these moods: ${moodStr}.

You MUST return ONLY a valid JSON object with this exact format:
{"titles": ["Movie Title 1", "Movie Title 2", ...]}

Rules:
- Return ONLY the JSON object, no explanations, no markdown.
- Movie titles must be in English.
- Return exactly ${count} titles.`;

  const raw = await chat(prompt);
  return parseTitles(raw);
}

// ── يقبل prompt جاهز مبني من فلاتر متقدمة — معادل getTitlesByPrompt ─────────
export async function getTitlesByPrompt(prompt: string): Promise<string[]> {
  const raw = await chat(prompt);
  return parseTitles(raw);
}

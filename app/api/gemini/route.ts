// ════════════════════════════════════════════════════════════════════════════
// app/api/gemini/route.ts — POST /api/gemini
// يخفي GEMINI_API_KEY عن المتصفح (المعادل لـ app/api/gemini/route.ts في الهيكلية)
// المنطق مطابق لـ GeminiService._chat في GeminiService.dart (نفس النموذج،
// نفس إعادة المحاولة 3 مرات عند 429 / 5xx، نفس responseMimeType json)
// ════════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";

// ✅ النموذج الوحيد المستخدم (مطابق لما هو مستخدم حالياً في تطبيق Flutter)
const MODEL = "gemini-2.5-flash-lite";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const runtime = "nodejs";

async function callGemini(
  prompt: string,
  apiKey: string,
  temperature = 0.1,
  maxTokens = 1024
): Promise<string> {
  const url = `${BASE_URL}?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
  };

  let lastError: Error | null = null;

  // ✅ إعادة المحاولة 3 مرات لحل مشاكل الشبكة العابرة (مطابق لـ Dart)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof rawText === "string") return rawText;
        throw new Error("Unexpected Gemini response shape.");
      }

      lastError = new Error(`Gemini API Error ${response.status}`);

      // إعادة المحاولة فقط عند Rate Limit (429) أو خطأ سيرفر (5xx)
      if (response.status === 429 || response.status >= 500) {
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }
      } else {
        break; // أخطاء 400/401/403/404 لا فائدة من إعادة المحاولة
      }
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("Connection failed");
      if (attempt < 3) await new Promise((r) => setTimeout(r, 2000));
    }
  }

  throw lastError ?? new Error("Failed to connect to Gemini API after 3 attempts.");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured." },
      { status: 500 }
    );
  }

  let payload: { prompt?: string; temperature?: number; maxTokens?: number };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { prompt, temperature, maxTokens } = payload;
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
  }

  try {
    const text = await callGemini(prompt, apiKey, temperature, maxTokens);
    return NextResponse.json({ text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gemini request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

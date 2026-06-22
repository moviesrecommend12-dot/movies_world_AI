// ════════════════════════════════════════════════════════════════════════════
// omdbService.ts — خدمة العميل (Client) للتواصل مع /api/omdb
// المعادل المباشر لـ omdb_service.dart (دون مفتاح API — يبقى على السيرفر)
// ════════════════════════════════════════════════════════════════════════════
import type { Movie } from "@/lib/types";

/** جلب فيلم كامل بعنوانه. ترجع null عند الفشل لتسمح بتدهور بصمت. */
export async function fetchByTitle(title: string): Promise<Movie | null> {
  try {
    const res = await fetch(`/api/omdb?title=${encodeURIComponent(title)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.movie ?? null;
  } catch {
    return null;
  }
}

/** جلب فيلم عن طريق IMDb ID (مثل "tt0111161"). */
export async function fetchById(imdbId: string): Promise<Movie | null> {
  try {
    const res = await fetch(`/api/omdb?i=${encodeURIComponent(imdbId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.movie ?? null;
  } catch {
    return null;
  }
}

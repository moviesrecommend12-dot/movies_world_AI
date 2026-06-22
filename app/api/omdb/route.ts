// ════════════════════════════════════════════════════════════════════════════
// app/api/omdb/route.ts — GET /api/omdb?title=Inception  أو  ?i=tt1375666
// يخفي OMDB_API_KEY عن المتصفح. المعادل المباشر لـ omdb_service.dart
// ════════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import type { Movie } from "@/lib/types";

const BASE_URL = "https://www.omdbapi.com/";

export const runtime = "nodejs";

function movieFromOMDb(json: Record<string, unknown>): Movie {
  const rawRatings = Array.isArray(json.Ratings) ? json.Ratings : [];
  const clean = (v: unknown) =>
    typeof v === "string" && v !== "N/A" ? v : "";
  const str = (v: unknown) => (typeof v === "string" ? v : "");

  return {
    title: str(json.Title),
    year: str(json.Year),
    genre: str(json.Genre),
    rating: parseFloat(str(json.imdbRating)) || 0,
    description: str(json.Plot),
    posterUrl: clean(json.Poster),
    director: clean(json.Director),
    actors: clean(json.Actors),
    runtime: clean(json.Runtime),
    country: clean(json.Country),
    language: clean(json.Language),
    awards: clean(json.Awards),
    ratings: rawRatings.map((r: Record<string, unknown>) => ({
      source: str(r.Source),
      value: str(r.Value),
    })),
    omdbEnriched: true,
  };
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OMDb API key not configured." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const imdbId = searchParams.get("i");

  if (!title && !imdbId) {
    return NextResponse.json(
      { error: "Provide either ?title= or ?i=" },
      { status: 400 }
    );
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("plot", "full");
  if (title) url.searchParams.set("t", title);
  if (imdbId) url.searchParams.set("i", imdbId);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const response = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ movie: null });
    }

    const data = await response.json();
    if (data.Response === "True") {
      return NextResponse.json({ movie: movieFromOMDb(data) });
    }
    return NextResponse.json({ movie: null });
  } catch {
    // تدهور بصمت — العنوان (stub) سيظهر بدون إثراء
    return NextResponse.json({ movie: null });
  }
}

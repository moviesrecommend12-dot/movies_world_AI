// ════════════════════════════════════════════════════════════════════════════
// types.ts — تعريفات TypeScript المشتركة
// المعادل المباشر لـ lib/models/Movie.dart + enum PipelineStep من HomeController.dart
// ════════════════════════════════════════════════════════════════════════════

export interface MovieRating {
  source: string;
  value: string;
}

export interface Movie {
  title: string;
  year: string;
  genre: string;
  rating: number;
  description: string;
  director: string;
  actors: string;
  posterUrl: string;
  runtime: string;
  country: string;
  language: string;
  awards: string;
  ratings: MovieRating[];
  /** true إذا تم إثراء الفيلم ببيانات حقيقية من OMDb */
  omdbEnriched: boolean;
}

/** معرّف فريد مشتق من العنوان — مطابق لـ Movie.id في Dart */
export function movieId(movie: Movie): string {
  return movie.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

/** Stub من عنوان مجرد — معادل Movie.fromTitle */
export function movieFromTitle(title: string): Movie {
  return {
    title,
    year: "",
    genre: "",
    rating: 0,
    description: "",
    director: "",
    actors: "",
    posterUrl: "",
    runtime: "",
    country: "",
    language: "",
    awards: "",
    ratings: [],
    omdbEnriched: false,
  };
}

/** دمج بيانات OMDb على stub — معادل Movie.mergeOMDb */
export function mergeOMDb(stub: Movie, omdb: Movie): Movie {
  return {
    title: omdb.title || stub.title,
    year: omdb.year || stub.year,
    genre: omdb.genre || stub.genre,
    rating: omdb.rating > 0 ? omdb.rating : stub.rating,
    description: omdb.description || stub.description,
    director: omdb.director || stub.director,
    actors: omdb.actors || stub.actors,
    posterUrl: omdb.posterUrl || stub.posterUrl,
    runtime: omdb.runtime,
    country: omdb.country,
    language: omdb.language,
    awards: omdb.awards,
    ratings: omdb.ratings,
    omdbEnriched: omdb.omdbEnriched,
  };
}

/** معادل enum PipelineStep من HomeController.dart */
export type PipelineStep = "idle" | "ai" | "omdb" | "done" | "error";

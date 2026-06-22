"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/movies/MovieCard.tsx — بطاقة الفيلم
// المعادل المباشر لـ lib/widgets/MovieCard.dart
// ════════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import type { Movie } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasPoster = !!movie.posterUrl && !imgError;
  const primaryGenre = movie.genre ? movie.genre.split(",")[0].trim() : "Cinema";
  const genreChips = movie.genre
    ? movie.genre.split(",").slice(0, 2).map((g) => g.trim())
    : ["Cinema", "Drama"];

  return (
    <button
      onClick={onClick}
      className="group relative aspect-[2/3] w-full text-right rounded-2xl outline-none"
    >
      {/* التوهج النيوني الدوار عند الـ Hover */}
      <div className="movie-card-glow absolute inset-0 rounded-2xl" />

      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-bg-card transition-transform duration-400 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02]">
        {/* البوستر */}
        {hasPoster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.posterUrl}
            alt={movie.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-card-hover">
            <span className="text-4xl opacity-40">🎬</span>
          </div>
        )}

        {/* التدرج السفلي */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--bg-primary) 0%, transparent 45%, transparent 100%)",
          }}
        />

        {/* شارة AI */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-coral/30 bg-coral/15 px-2.5 py-1 backdrop-blur-md">
          <span className="text-[11px]">✨</span>
          <span className="text-[11px] font-semibold text-coral">98% Match</span>
        </div>

        {/* زر التشغيل عند Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-250 group-hover:opacity-100">
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white/95 shadow-[0_0_24px_4px_rgba(26,146,255,0.5)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#131313">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* لوحة المعلومات السفلية */}
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <h3 className="truncate font-sora text-[15px] font-bold tracking-tight text-text-primary">
            {movie.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {movie.rating > 0 && (
              <>
                <span className="text-gold">★</span>
                <span className="font-bold text-gold">{movie.rating.toFixed(1)}</span>
                <Dot />
              </>
            )}
            <span className="font-medium text-text-second">{movie.year || "—"}</span>
            <Dot />
            <span className="truncate font-semibold text-coral">{primaryGenre}</span>
          </div>

          {/* Genre Chips عند الـ Hover */}
          <div className="mt-0 grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows,margin] duration-280 ease-out group-hover:mt-2.5 group-hover:grid-rows-[1fr]">
            <div className="flex flex-wrap gap-1.5 overflow-hidden">
              {genreChips.map((g) => (
                <span
                  key={g}
                  className="rounded border border-border/30 bg-bg-card-hover/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-text-muted"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function Dot() {
  return <span className="mx-0.5 h-[3px] w-[3px] rounded-full bg-text-muted/45" />;
}

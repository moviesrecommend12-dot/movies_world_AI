"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/movies/MovieHero.tsx — بطاقة العرض الكبيرة لأول نتيجة
// المعادل المباشر لـ lib/widgets/HeroSection.dart
// ════════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import type { Movie } from "@/lib/types";

interface MovieHeroProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieHero({ movie, onClick }: MovieHeroProps) {
  const [imgError, setImgError] = useState(false);
  const hasPoster = !!movie.posterUrl && !imgError;
  const genres = movie.genre ? movie.genre.split(",").slice(0, 2).join(", ") : "";

  return (
    <button
      onClick={onClick}
      className="relative block h-[300px] w-full overflow-hidden text-right sm:h-[340px]"
    >
      {hasPoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={movie.posterUrl}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-card">
          <span className="text-6xl">🎬</span>
        </div>
      )}

      {/* تدرج التعتيم */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(19,19,19,0.6) 55%, var(--bg-primary) 100%)",
        }}
      />

      <div className="absolute inset-x-7 bottom-6 text-right">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-ai-accent/40 bg-ai-accent/10 px-2 py-0.5 text-[11px] font-bold tracking-wide text-ai-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-ai-accent" />
          Featured Pick
        </span>
        <h2 className="font-sora text-2xl font-extrabold leading-tight text-text-primary sm:text-3xl">
          {movie.title}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-gold">
          {movie.year && <span>{movie.year}</span>}
          {movie.year && genres && <span className="text-text-muted"> · </span>}
          {genres && <span className="truncate">{genres}</span>}
          {movie.rating > 0 && (
            <>
              <span className="text-text-muted"> · </span>
              <span>★ {movie.rating.toFixed(1)}</span>
            </>
          )}
        </div>
        {movie.description && (
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-text-second">
            {movie.description}
          </p>
        )}
      </div>
    </button>
  );
}

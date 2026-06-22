// ════════════════════════════════════════════════════════════════════════════
// components/movies/MovieGrid.tsx — شبكة عرض الأفلام
// المعادل المباشر لـ _MoviesGrid في ResultsScreen.dart
// ════════════════════════════════════════════════════════════════════════════
import type { Movie } from "@/lib/types";
import { movieId } from "@/lib/types";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, i) => (
        <div
          key={`${movieId(movie)}_${i}`}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(i * 50, 600)}ms` }}
        >
          <MovieCard movie={movie} onClick={() => onSelect(movie)} />
        </div>
      ))}
    </div>
  );
}

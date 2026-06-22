"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/movies/MovieModal.tsx — نافذة تفاصيل الفيلم
// المعادل المباشر لـ lib/widgets/MovieDetailDialog.dart
// ════════════════════════════════════════════════════════════════════════════
import { useEffect, useState } from "react";
import type { Movie } from "@/lib/types";
import { ResponsiveAdBanner, AdBanner } from "@/components/ads/AdBanner";

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [watchToast, setWatchToast] = useState(false);
  const [vocabToast, setVocabToast] = useState(false);

  // ── منع تمرير الصفحة الخلفية عند فتح النافذة ──
  useEffect(() => {
    if (!movie) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [movie]);

  useEffect(() => {
    if (!movie) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [movie, onClose]);

  if (!movie) return null;

  const flashToast = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 1800);
  };

  const otherRatings = movie.ratings.filter((r) => r.source !== "Internet Movie Database");
  const genreChips = movie.genre ? movie.genre.split(",").slice(0, 2).map((g) => g.trim()) : [];
  const castShort = movie.actors ? movie.actors.split(",").slice(0, 3).join(", ") : "";

  return (
    // ── الـ Backdrop: يملأ الشاشة كاملة ويسمح بالتمرير من الداخل ──
    <div
      onClick={onClose}
      className="animate-fade-in-up fixed inset-0 z-50 overflow-y-auto bg-black/85"
      // إضافة -webkit-overflow-scrolling لضمان التمرير السلس على iOS
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* ── wrapper يمركز البطاقة ويضيف padding حول البطاقة ── */}
      <div className="flex min-h-full items-start justify-center p-4 py-8 sm:items-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[760px] overflow-hidden rounded-[20px] border border-border/60 bg-bg-secondary"
        >
          {/* ── Hero Band: البوستر الكبير في الأعلى ── */}
          <div className="relative h-[220px] sm:h-[280px] w-full overflow-hidden bg-bg-card">
            {movie.posterUrl ? (
              // object-cover بدل object-contain لتغطية كامل المساحة بدون فراغات
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="absolute inset-0 h-full w-full object-cover object-top"
                style={{ filter: "brightness(0.65)" }}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #0d1b2a 0%, #1a0a2e 50%, #0f3460 100%)",
                }}
              />
            )}
            {/* التدرج الذي يوصل البوستر بالمحتوى بالأسفل */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(28,27,27,0.7) 60%, var(--bg-secondary) 100%), linear-gradient(to right, rgba(28,27,27,0.85) 0%, transparent 55%)",
              }}
            />
            <button
              onClick={onClose}
              className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-text-second backdrop-blur-md transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* ── Content Grid: البوستر الصغير + المعلومات ── */}
          <div className="flex gap-4 px-4 sm:gap-5 sm:px-6 pb-5 pt-0">
            {/* البوستر المرفوع — يختفي في الشاشات الصغيرة جداً */}
            <div className="-mt-12 shrink-0 hidden xs:block sm:block"
              style={{ display: "block" }}
            >
              <div className="h-[180px] w-[120px] sm:h-[210px] sm:w-[140px] overflow-hidden rounded-xl border-[1.5px] border-coral/25 shadow-2xl">
                {movie.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                    style={{ filter: "brightness(0.85)" }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-bg-card-hover text-3xl">
                    🎬
                  </div>
                )}
              </div>
            </div>

            {/* عمود المعلومات */}
            <div className="min-w-0 flex-1 pt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-coral/25 bg-coral/12 px-2.5 py-1 text-[11px] font-semibold text-coral backdrop-blur-md">
                ✨ 98% AI Match
              </span>

              <h2 className="mt-2 font-sora text-xl sm:text-2xl font-extrabold tracking-tight text-text-primary leading-tight">
                {movie.title}
              </h2>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {movie.year && <MetaChip text={movie.year} variant="gold" />}
                {movie.runtime && <MetaChip text={movie.runtime} variant="gold" />}
                {genreChips.map((g) => (
                  <MetaChip key={g} text={g} variant="blue" />
                ))}
              </div>

              <div className="mt-2.5 space-y-1">
                {movie.director && <InfoRow label="Director" value={movie.director} />}
                {castShort && <InfoRow label="Cast" value={castShort} />}
                {movie.country && <InfoRow label="Country" value={movie.country} />}
                {movie.language && <InfoRow label="Language" value={movie.language} />}
              </div>

              {(movie.rating > 0 || otherRatings.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {movie.rating > 0 && <RatingChip source="IMDb" value={`★ ${movie.rating.toFixed(1)}`} />}
                  {otherRatings.map((r) => (
                    <RatingChip
                      key={r.source}
                      source={r.source.replace("Rotten Tomatoes", "RT").replace("Metacritic", "MC")}
                      value={r.value}
                    />
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ToastWrap show={watchToast} label="🎬  Coming soon">
                  <button
                    onClick={() => flashToast(setWatchToast)}
                    className="flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_16px_0_rgba(26,146,255,0.3)]"
                    style={{ background: "linear-gradient(135deg, #1a92ff, #6f00be)" }}
                  >
                    ▶ Watch
                  </button>
                </ToastWrap>
                <ToastWrap show={vocabToast} label="📚  Coming soon">
                  <button
                    onClick={() => flashToast(setVocabToast)}
                    className="flex items-center gap-1.5 rounded-[10px] border border-gold/30 bg-gold/8 px-4 py-2.5 text-[13px] font-bold text-gold"
                  >
                    📖 Learn Vocab
                  </button>
                </ToastWrap>
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${movie.omdbEnriched ? "bg-success" : "bg-coral"}`}
                />
                <span className="text-[10px] text-text-muted">
                  {movie.omdbEnriched
                    ? "Data from OMDb · Titles by Gemini AI"
                    : "Title by Gemini AI · OMDb lookup unavailable"}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Body — Awards + Synopsis */}
          <div className="p-4 sm:p-6">
            {movie.awards && movie.awards !== "N/A" && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-gold/18 bg-gold/[0.07] px-3 py-2">
                <span className="text-gold">🏆</span>
                <span className="text-[13px] text-gold">{movie.awards}</span>
              </div>
            )}
            <h3 className="font-sora text-[17px] font-bold text-text-primary">Synopsis</h3>
            <p className="mt-2 leading-relaxed text-text-second">
              {movie.description || "No synopsis available."}
            </p>
          </div>

          {/* إعلان بانر أول */}
          <div className="flex justify-center px-4 sm:px-6 py-4 opacity-80">
            <ResponsiveAdBanner label="إعلان ممول · Adsterra" />
          </div>

          <div className="h-px bg-border/50" />

          {/* إعلان بانر ثاني */}
          <div className="flex justify-center px-4 sm:px-6 py-4 opacity-80">
            <AdBanner size="medium300x250" label="إعلان · Adsterra" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaChip({ text, variant }: { text: string; variant: "gold" | "blue" }) {
  const cls =
    variant === "gold"
      ? "bg-gold/10 border-gold/25 text-gold"
      : "bg-coral/10 border-coral/25 text-coral";
  return (
    <span className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {text}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-14 shrink-0 text-text-muted">{label}</span>
      <span className="text-text-second">{value}</span>
    </div>
  );
}

function RatingChip({ source, value }: { source: string; value: string }) {
  return (
    <span className="rounded-md border border-border bg-bg-card px-2.5 py-1 text-[11px]">
      <span className="text-text-second">{source} </span>
      <span className="font-bold text-gold">{value}</span>
    </span>
  );
}

function ToastWrap({
  show,
  label,
  children,
}: {
  show: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      {show && (
        <div className="animate-fade-in-up absolute -top-12 left-0 whitespace-nowrap rounded-lg border border-coral/30 bg-bg-card px-3 py-1.5 text-xs font-semibold text-coral shadow-lg">
          {label}
        </div>
      )}
    </div>
  );
}
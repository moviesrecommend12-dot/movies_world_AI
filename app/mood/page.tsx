"use client";

import { useEffect, useRef, useState } from "react";
import MoodFilters from "@/components/search/MoodFilters";
import PipelineStatus from "@/components/pipeline/PipelineStatus";
import ErrorBanner from "@/components/pipeline/ErrorBanner";
import MovieHero from "@/components/movies/MovieHero";
import MovieGrid from "@/components/movies/MovieGrid";
import MovieModal from "@/components/movies/MovieModal";
import { RewardedAdOverlay, AdLoadingOverlay, useRewardedAd } from "@/components/ads/AdOverlay";
import { useMoodStore } from "@/store/moodStore";
import { useFilterStore } from "@/store/filterStore";
import { containsBannedContent } from "@/lib/contentFilter";
import type { Movie } from "@/lib/types";

export default function MoodSearchPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const { movies, loading, pipelineStep, pipelineMsg, errorMsg, loadMovies } = useMoodStore();
  const filters = useFilterStore();
  const { isShowing, isLoading, countdown, trigger, skip } = useRewardedAd();

  const pipelineRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pipelineStep === "ai" || pipelineStep === "omdb") {
      setTimeout(() => pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }
  }, [pipelineStep]);

  useEffect(() => {
    if (pipelineStep === "done" && movies.length > 0) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    }
  }, [pipelineStep, movies.length]);

  const showContentWarning = () => {
    setWarning("عذراً، المحتوى الذي كتبته مخالف لسياسات الاستخدام. يرجى تعديل الفلاتر.");
    setTimeout(() => setWarning(null), 4000);
  };

  // ── تشغيل البحث عبر إعلان البانر الإجباري — معادل _triggerSearchWithAd ──
  const handleSearch = () => {
    if (loading) return;
    const allText = [
      ...filters.selectedMoods,
      ...filters.selectedVibes,
      filters.directorQuery,
      filters.actorQuery,
    ].join(" ");
    if (containsBannedContent(allText)) {
      showContentWarning();
      return;
    }
    if (!filters.hasAnySelection()) {
      showContentWarning0();
      return;
    }
    trigger(() => loadMovies());
  };

  const showContentWarning0 = () => {
    setWarning("يرجى اختيار مود أو تحديد فلتر واحد على الأقل.");
    setTimeout(() => setWarning(null), 4000);
  };

  const hero = movies[0];
  const rest = movies.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      {warning && (
        <div className="animate-fade-in-up fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-gold/40 bg-bg-card px-4 py-3 text-sm text-text-primary shadow-2xl">
          <span className="ml-2 text-gold">⚠</span>
          {warning}
        </div>
      )}

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-9 sm:px-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-sora text-2xl font-extrabold text-text-primary sm:text-[26px]">
              البحث المتقدم
            </h1>
            <p className="mt-1.5 text-sm text-text-second">
              أكثر من 42 مود · 12 نبضة عاطفية · فلاتر لغة وجوائز وأكثر
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="w-full shrink-0 lg:w-[380px]">
            <MoodFilters onSearch={handleSearch} loading={loading} />
          </div>

          <div className="min-w-0 flex-1">
            {/* شريط المعلومات */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/30 bg-bg-card/40 px-5 py-3.5">
              <span className="text-sm text-text-second">{movies.length} نتيجة</span>
              <ActiveFiltersBadge />
            </div>

            <div ref={pipelineRef} className="mt-4">
              <PipelineStatus step={pipelineStep} message={pipelineMsg} />
            </div>

            {errorMsg && <ErrorBanner message={errorMsg} />}

            <div ref={resultsRef} className="mt-6">
              {movies.length === 0 && pipelineStep === "idle" && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 py-20 text-center">
                  <span className="text-4xl">🎭</span>
                  <p className="mt-3 font-cairo text-sm text-text-muted">
                    اختر مودات أو فلاتر من القائمة الجانبية، ثم اضغط &quot;ابحث بالذكاء الاصطناعي&quot;
                  </p>
                </div>
              )}

              {hero && (
                <div className="mb-7 overflow-hidden rounded-2xl">
                  <MovieHero movie={hero} onClick={() => setSelectedMovie(hero)} />
                </div>
              )}
              {rest.length > 0 && <MovieGrid movies={rest} onSelect={setSelectedMovie} />}
            </div>
          </div>
        </div>
      </main>

      <RewardedAdOverlay isShowing={isShowing} countdown={countdown} onSkip={skip} />
      <AdLoadingOverlay isLoading={isLoading} />
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

function ActiveFiltersBadge() {
  const f = useFilterStore();
  const parts: string[] = [];
  if (f.selectedMoods.length) parts.push(`${f.selectedMoods.length} مود`);
  if (f.selectedVibes.length) parts.push(`${f.selectedVibes.length} نبضة`);
  if (f.awardWinnerOnly) parts.push("جائزة");
  if (f.minImdbRating > 0) parts.push(`IMDb +${f.minImdbRating}`);
  if (parts.length === 0) return null;
  return (
    <span className="rounded-lg bg-bg-primary px-2.5 py-1 text-[11px] text-text-muted">
      {parts.join(" · ")}
    </span>
  );
}

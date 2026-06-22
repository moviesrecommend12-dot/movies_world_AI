"use client";

import { useEffect, useRef, useState } from "react";
import StorySearch from "@/components/search/StorySearch";
import InspireCards from "@/components/search/InspireCards";
import PipelineStatus from "@/components/pipeline/PipelineStatus";
import ErrorBanner from "@/components/pipeline/ErrorBanner";
import MovieHero from "@/components/movies/MovieHero";
import MovieGrid from "@/components/movies/MovieGrid";
import MovieModal from "@/components/movies/MovieModal";
import { RewardedAdOverlay, AdLoadingOverlay, useRewardedAd } from "@/components/ads/AdOverlay";
import { ResponsiveAdBanner } from "@/components/ads/AdBanner";
import { useMoviesStore } from "@/store/moviesStore";
import { containsBannedContent } from "@/lib/contentFilter";
import type { Movie } from "@/lib/types";

export default function Home() {
  const [description, setDescription] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const { movies, loading, pipelineStep, pipelineMsg, errorMsg, searchByStory } =
    useMoviesStore();
  const { isShowing, isLoading, countdown, trigger, skip } = useRewardedAd();

  const pipelineRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pipelineStep === "ai" || pipelineStep === "omdb") {
      setTimeout(() => {
        pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [pipelineStep]);

  useEffect(() => {
    if (pipelineStep === "done" && movies.length > 0) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }, [pipelineStep, movies.length]);

  const showContentWarning = () => {
    setWarning("عذراً، المحتوى الذي كتبته مخالف لسياسات الاستخدام. يرجى إدخال وصف لائق.");
    setTimeout(() => setWarning(null), 4000);
  };

  const handleSubmit = () => {
    if (loading) return;
    const text = description.trim();
    if (!text) return;
    if (containsBannedContent(text)) {
      showContentWarning();
      return;
    }
    trigger(() => {
      searchByStory(text);
    });
  };

  const handlePick = (desc: string) => {
    if (containsBannedContent(desc)) {
      showContentWarning();
      return;
    }
    setDescription(desc);
  };

  const hero = movies[0];
  const rest = movies.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      {warning && (
        <div className="animate-fade-in-up fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-gold/40 bg-bg-card px-4 py-3 text-sm text-text-primary shadow-2xl">
          <span className="ml-2 text-gold">⚠</span>
          {warning}
        </div>
      )}

      <main className="mx-auto w-full max-w-[840px] flex-1 px-6 py-10 sm:px-8">
        <h1
          className="font-sora text-[26px] font-extrabold leading-tight sm:text-[28px]"
          style={{
            background: "linear-gradient(135deg, #a4c9ff, #ddb7ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          أهلاً بك في عالم الذكاء السينمائي
        </h1>
        <p className="mt-2 leading-relaxed text-text-second">
          صف فكرة، مشهد، أو شعور لفيلم يدور في ذهنك.. وسيقوم الـ AI و IMDb ببناء قائمة العرض
          الخاصة بك فوراً.
        </p>

        <div className="mt-9">
          <StorySearch
            value={description}
            onChange={setDescription}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        <div className="mt-10">
          <InspireCards onPick={handlePick} />
        </div>

        <div ref={pipelineRef}>
          <PipelineStatus step={pipelineStep} message={pipelineMsg} />
        </div>

        {errorMsg && <ErrorBanner message={errorMsg} />}
      </main>

      <div ref={resultsRef}>
        {movies.length > 0 && hero && (
          <section className="animate-fade-in-up">
            <MovieHero movie={hero} onClick={() => setSelectedMovie(hero)} />
            <div className="mx-auto max-w-[1400px] px-6 py-7 sm:px-9">
              <SectionHeader
                icon="🔍"
                title="Story Matches"
                subtitle={`${movies.length} movies · ${
                  movies.filter((m) => m.omdbEnriched).length
                } enriched via OMDb`}
              />

              {/* ── إعلان بين البطل وشبكة النتائج ── */}
              <div className="mt-5 flex justify-center">
                <ResponsiveAdBanner label="إعلان ممول · Adsterra" />
              </div>

              <div className="mt-4">
                <MovieGrid movies={rest} onSelect={setSelectedMovie} />
              </div>

              <div className="mt-9 flex items-center gap-2.5 rounded-xl border border-border bg-bg-card p-4 text-[11px] text-text-muted">
                <span>ℹ</span>
                <span className="flex-1">
                  {movies.length} movies total · {movies.filter((m) => m.omdbEnriched).length}{" "}
                  enriched with real posters &amp; metadata via IMDb · Titles generated by AI
                </span>
                <span className="flex items-center gap-1">
                  <Dot color="bg-[#4CAF50]" /> IMDB
                  <Dot color="bg-coral" /> AI
                </span>
              </div>
            </div>
          </section>
        )}
      </div>

      <RewardedAdOverlay isShowing={isShowing} countdown={countdown} onSkip={skip} />
      <AdLoadingOverlay isLoading={isLoading} />
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
        {icon}
      </span>
      <div>
        <h2 className="font-sora text-[19px] font-bold text-text-primary">{title}</h2>
        <p className="text-[11px] text-text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className={`mx-1 inline-block h-2 w-2 rounded-full ${color}`} />;
}
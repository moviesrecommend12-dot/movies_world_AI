// ════════════════════════════════════════════════════════════════════════════
// store/moviesStore.ts — حالة الأفلام ونتائج البحث (Zustand)
// المعادل المباشر لـ SearchController.dart (State management بدلاً من GetX)
// ════════════════════════════════════════════════════════════════════════════
import { create } from "zustand";
import type { Movie, PipelineStep } from "@/lib/types";
import { movieFromTitle, mergeOMDb } from "@/lib/types";
import { getTitlesByStory } from "@/lib/geminiService";
import { fetchByTitle } from "@/lib/omdbService";

interface MoviesState {
  movies: Movie[];
  loading: boolean;
  pipelineStep: PipelineStep;
  pipelineMsg: string;
  errorMsg: string;

  searchByStory: (description: string) => Promise<void>;
  reset: () => void;
}

export const useMoviesStore = create<MoviesState>((set, get) => ({
  movies: [],
  loading: false,
  pipelineStep: "idle",
  pipelineMsg: "",
  errorMsg: "",

  // ── البحث بالقصة — معادل SearchController.searchByStory ───────────────────
  searchByStory: async (description: string) => {
    if (get().loading) return;
    const trimmed = description.trim();
    if (!trimmed) {
      set({ errorMsg: "Please describe the story first." });
      return;
    }

    set({ loading: true, errorMsg: "", movies: [] });

    try {
      // Stage 1 – AI
      set({ pipelineStep: "ai", pipelineMsg: " AI: Analyzing your story…" });

      const titles = await getTitlesByStory(trimmed);
      if (titles.length === 0) {
        throw new Error("AI returned no matches. Try rephrasing your description.");
      }

      set({
        pipelineMsg: `AI: Found ${titles.length} candidates. Fetching real data…`,
      });

      // Stage 2 – OMDb enrichment
      set({ pipelineStep: "omdb" });

      const fetched: Movie[] = await Promise.all(
        titles.map(async (title) => {
          const stub = movieFromTitle(title);
          const omdb = await fetchByTitle(title);
          return omdb ? mergeOMDb(stub, omdb) : stub;
        })
      );

      const enrichedCount = fetched.filter((m) => m.omdbEnriched).length;
      set({
        movies: fetched,
        pipelineStep: "done",
        pipelineMsg: `Done! ${enrichedCount}/${fetched.length} enriched via OMDb.`,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      set({ pipelineStep: "error", errorMsg: message.replace(/^Error: /, "") });
    } finally {
      set({ loading: false });
    }
  },

  reset: () =>
    set({
      movies: [],
      loading: false,
      pipelineStep: "idle",
      pipelineMsg: "",
      errorMsg: "",
    }),
}));

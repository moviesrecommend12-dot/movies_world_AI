// ════════════════════════════════════════════════════════════════════════════
// store/moodStore.ts — حالة نتائج البحث المتقدم بالمود
// المعادل المباشر لـ movies/loading/pipelineStep في HomeController.dart
// ════════════════════════════════════════════════════════════════════════════
import { create } from "zustand";
import type { Movie, PipelineStep } from "@/lib/types";
import { movieFromTitle, mergeOMDb } from "@/lib/types";
import { getTitlesByPrompt } from "@/lib/geminiService";
import { fetchByTitle } from "@/lib/omdbService";
import { useFilterStore } from "@/store/filterStore";

interface MoodState {
  movies: Movie[];
  loading: boolean;
  pipelineStep: PipelineStep;
  pipelineMsg: string;
  errorMsg: string;

  loadMovies: () => Promise<void>;
  reset: () => void;
}

function parseRuntimeMinutes(runtime: string): number {
  const match = runtime.replace(/[^0-9]/g, "");
  return match ? parseInt(match, 10) : 999;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  movies: [],
  loading: false,
  pipelineStep: "idle",
  pipelineMsg: "",
  errorMsg: "",

  // ── معادل HomeController.loadMovies ────────────────────────────────────
  loadMovies: async () => {
    if (get().loading) return;

    const filters = useFilterStore.getState();
    if (!filters.hasAnySelection()) {
      set({ errorMsg: "يرجى اختيار مود أو تحديد فلتر واحد على الأقل." });
      return;
    }

    set({ loading: true, errorMsg: "", movies: [] });

    try {
      // Stage 1 – AI
      set({ pipelineStep: "ai", pipelineMsg: "AI: يحلل الفلاتر المحددة ويبحث عن أفضل الأفلام…" });

      const prompt = filters.buildEnhancedPrompt();
      const titles = await getTitlesByPrompt(prompt);

      if (titles.length === 0) {
        throw new Error("لم يعثر الذكاء الاصطناعي على نتائج. جرّب فلاتر مختلفة.");
      }

      set({ pipelineMsg: `AI: وجد ${titles.length} فيلم. جاري جلب التفاصيل من OMDb…` });

      // Stage 2 – OMDb + فلترة محلية بالتقييم والمدة
      set({ pipelineStep: "omdb" });

      const { minImdbRating, maxDuration } = filters;
      const candidates = await Promise.all(
        titles.map(async (title) => {
          const stub = movieFromTitle(title);
          const omdb = await fetchByTitle(title);
          return omdb ? mergeOMDb(stub, omdb) : stub;
        })
      );

      const fetched = candidates.filter((movie) => {
        if (minImdbRating > 0 && movie.omdbEnriched && movie.rating < minImdbRating) {
          return false;
        }
        if (maxDuration > 0 && movie.omdbEnriched) {
          if (parseRuntimeMinutes(movie.runtime) > maxDuration) return false;
        }
        return true;
      });

      const enrichedCount = fetched.filter((m) => m.omdbEnriched).length;
      set({
        movies: fetched,
        pipelineStep: "done",
        pipelineMsg: `جاهز! تم إثراء ${enrichedCount}/${fetched.length} فيلم عبر OMDb.`,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      set({ pipelineStep: "error", errorMsg: message.replace(/^Error: /, "") });
    } finally {
      set({ loading: false });
    }
  },

  reset: () =>
    set({ movies: [], loading: false, pipelineStep: "idle", pipelineMsg: "", errorMsg: "" }),
}));

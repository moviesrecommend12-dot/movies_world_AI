// ════════════════════════════════════════════════════════════════════════════
// store/filterStore.ts — حالة الفلاتر المختارة في البحث المتقدم بالمود
// المعادل المباشر لحقول الفلاتر في HomeController.dart
// ════════════════════════════════════════════════════════════════════════════
import { create } from "zustand";

export type ContentType = "movie" | "series";

interface FilterState {
  selectedMoods: string[];
  selectedVibes: string[];
  selectedPlotTypes: string[];
  contentType: ContentType;
  yearFrom: number;
  yearTo: number;
  minImdbRating: number;
  maxDuration: number;
  selectedLanguage: string;
  selectedNationality: string;
  awardWinnerOnly: boolean;
  specificAward: string;
  directorQuery: string;
  actorQuery: string;
  ageRating: string;
  movieCount: number;

  toggleMood: (value: string) => void;
  toggleVibe: (value: string) => void;
  togglePlotType: (value: string) => void;
  setContentType: (v: ContentType) => void;
  setYearRange: (from: number, to: number) => void;
  setMinImdbRating: (v: number) => void;
  setMaxDuration: (v: number) => void;
  setSelectedLanguage: (v: string) => void;
  setSelectedNationality: (v: string) => void;
  setAwardWinnerOnly: (v: boolean) => void;
  setSpecificAward: (v: string) => void;
  setDirectorQuery: (v: string) => void;
  setActorQuery: (v: string) => void;
  setAgeRating: (v: string) => void;
  setMovieCount: (v: number) => void;
  resetAllFilters: () => void;

  /** عدد الفلاتر النشطة — معادل hasFilters/count في الـ Sidebar */
  activeFilterCount: () => number;
  /** بناء prompt الذكاء الاصطناعي من جميع الفلاتر — معادل _buildEnhancedPrompt */
  buildEnhancedPrompt: () => string;
  /** هل يوجد فلتر واحد على الأقل مُحدّد لتفعيل زر البحث */
  hasAnySelection: () => boolean;
}

const DEFAULTS = {
  selectedMoods: [] as string[],
  selectedVibes: [] as string[],
  selectedPlotTypes: [] as string[],
  contentType: "movie" as ContentType,
  yearFrom: 2000,
  yearTo: 2026,
  minImdbRating: 0,
  maxDuration: 0,
  selectedLanguage: "",
  selectedNationality: "",
  awardWinnerOnly: false,
  specificAward: "",
  directorQuery: "",
  actorQuery: "",
  ageRating: "",
  movieCount: 6,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...DEFAULTS,

  toggleMood: (value) =>
    set((s) => ({
      selectedMoods: s.selectedMoods.includes(value)
        ? s.selectedMoods.filter((m) => m !== value)
        : [...s.selectedMoods, value],
    })),

  toggleVibe: (value) =>
    set((s) => ({
      selectedVibes: s.selectedVibes.includes(value)
        ? s.selectedVibes.filter((m) => m !== value)
        : [...s.selectedVibes, value],
    })),

  togglePlotType: (value) =>
    set((s) => ({
      selectedPlotTypes: s.selectedPlotTypes.includes(value)
        ? s.selectedPlotTypes.filter((m) => m !== value)
        : [...s.selectedPlotTypes, value],
    })),

  setContentType: (v) => set({ contentType: v }),
  setYearRange: (from, to) => set({ yearFrom: from, yearTo: to }),
  setMinImdbRating: (v) => set({ minImdbRating: v }),
  setMaxDuration: (v) => set({ maxDuration: v }),
  setSelectedLanguage: (v) => set({ selectedLanguage: v }),
  setSelectedNationality: (v) => set({ selectedNationality: v }),
  setAwardWinnerOnly: (v) => set({ awardWinnerOnly: v }),
  setSpecificAward: (v) => set({ specificAward: v }),
  setDirectorQuery: (v) => set({ directorQuery: v }),
  setActorQuery: (v) => set({ actorQuery: v }),
  setAgeRating: (v) => set({ ageRating: v }),
  setMovieCount: (v) => set({ movieCount: v }),

  resetAllFilters: () => set({ ...DEFAULTS }),

  activeFilterCount: () => {
    const s = get();
    return s.selectedMoods.length + s.selectedVibes.length + s.selectedPlotTypes.length;
  },

  hasAnySelection: () => {
    const s = get();
    return (
      s.selectedMoods.length > 0 ||
      s.selectedVibes.length > 0 ||
      s.selectedPlotTypes.length > 0 ||
      s.directorQuery.trim().length > 0 ||
      s.actorQuery.trim().length > 0
    );
  },

  buildEnhancedPrompt: () => {
    const s = get();
    const lines: string[] = [];

    lines.push(
      `Recommend ${s.movieCount} ${s.contentType === "series" ? "TV series" : "movies"} with the following criteria:`
    );

    if (s.selectedMoods.length) lines.push(`- Genre/mood: ${s.selectedMoods.join(", ")}`);
    if (s.selectedVibes.length) lines.push(`- Emotional vibe: ${s.selectedVibes.join(", ")}`);
    if (s.selectedPlotTypes.length) lines.push(`- Plot type: ${s.selectedPlotTypes.join(", ")}`);
    if (s.yearFrom !== 1950 || s.yearTo !== 2026) {
      lines.push(`- Released between ${s.yearFrom} and ${s.yearTo}`);
    }
    if (s.minImdbRating > 0) lines.push(`- Minimum IMDb rating: ${s.minImdbRating}`);
    if (s.maxDuration > 0) lines.push(`- Maximum runtime: ${s.maxDuration} minutes`);
    if (s.selectedLanguage) lines.push(`- Original language: ${s.selectedLanguage}`);
    if (s.selectedNationality) lines.push(`- Country of origin: ${s.selectedNationality}`);
    if (s.awardWinnerOnly) {
      lines.push(s.specificAward ? `- Must have won: ${s.specificAward}` : "- Must be an award-winning film");
    }
    if (s.directorQuery.trim()) lines.push(`- Director: ${s.directorQuery.trim()}`);
    if (s.actorQuery.trim()) lines.push(`- Starring: ${s.actorQuery.trim()}`);
    if (s.ageRating) lines.push(`- Age rating: ${s.ageRating}`);

    lines.push("");
    lines.push("You MUST return ONLY a valid JSON object with this exact format:");
    lines.push('{"titles": ["Movie Title 1", "Movie Title 2", ...]}');
    lines.push("");
    lines.push("Rules:");
    lines.push("- Return ONLY the JSON object, no explanations, no markdown.");
    lines.push("- Movie titles must be in English.");
    lines.push(`- Return exactly ${s.movieCount} titles.`);

    return lines.join("\n");
  },
}));

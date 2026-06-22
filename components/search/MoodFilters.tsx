"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/search/MoodFilters.tsx — لوحة الفلاتر الكاملة للبحث المتقدم
// المعادل المباشر لـ _buildSidebar + كل أقسام الأكورديون في
// AdvancedSearchScreen.dart
// ════════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import {
  MOOD_CATEGORIES,
  VIBES,
  PLOT_TYPES,
  LANGUAGES,
  NATIONALITIES,
  AWARDS,
  AGE_RATINGS,
  QUICK_ERAS,
  DURATIONS,
  RATING_OPTIONS,
  MOVIE_COUNT_OPTIONS,
} from "@/lib/moodData";
import {
  Accordion,
  FilterChip,
  SegButton,
  SegButtonNumber,
  DurationChip,
  QuickEraButton,
  CountBadge,
  FilterLabel,
  Dropdown,
} from "./filterWidgets";
import YearRangeSlider from "./YearRangeSlider";
import { ResponsiveAdBanner } from "@/components/ads/AdBanner";

interface MoodFiltersProps {
  onSearch: () => void;
  loading: boolean;
}

export default function MoodFilters({ onSearch, loading }: MoodFiltersProps) {
  const [moodSearch, setMoodSearch] = useState("");
  const f = useFilterStore();
  const activeCount = f.activeFilterCount();
  const hasFilters =
    activeCount > 0 ||
    f.minImdbRating > 0 ||
    f.awardWinnerOnly ||
    f.directorQuery.length > 0 ||
    f.actorQuery.length > 0;

  return (
    <div className="rounded-[20px] border border-border/30 bg-bg-card/60 p-5 shadow-2xl">
      {/* رأس الفلاتر */}
      <div className="flex items-center gap-2.5">
        <span className="text-coral">🎚</span>
        <h2 className="font-sora text-lg font-bold text-text-primary">عوامل التصفية</h2>
        <div className="flex-1" />
        {activeCount > 0 && <CountBadge count={activeCount} />}
        {hasFilters && (
          <button
            onClick={() => {
              f.resetAllFilters();
              setMoodSearch("");
            }}
            className="flex items-center gap-1 text-xs font-semibold text-coral"
          >
            ↻ إعادة تعيين
          </button>
        )}
      </div>

      <div className="my-4 h-px bg-border/50" />

      {/* قسم 0: نوع المحتوى */}
      <Accordion icon="🎬" title="نوع المحتوى" defaultOpen>
        <div className="flex gap-2">
          <SegButton label="🎬 أفلام" value="movie" current={f.contentType} onSelect={f.setContentType} />
          <SegButton label="📺 مسلسلات" value="series" current={f.contentType} onSelect={f.setContentType} />
        </div>
      </Accordion>

      {/* قسم 1: المودات ① */}
      <Accordion
        icon="🎨"
        title="① المود والتصنيف (42 خيار)"
        defaultOpen
        badge={f.selectedMoods.length > 0 ? <CountBadge count={f.selectedMoods.length} /> : null}
      >
        <input
          value={moodSearch}
          onChange={(e) => setMoodSearch(e.target.value)}
          placeholder="ابحث في المودات…"
          className="mb-4 w-full rounded-[10px] border border-border/40 bg-bg-primary px-3 py-2.5 font-cairo text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-coral"
        />
        {MOOD_CATEGORIES.map((cat) => {
          const filtered = cat.moods.filter(
            (m) =>
              !moodSearch ||
              m.label.toLowerCase().includes(moodSearch.toLowerCase()) ||
              m.value.toLowerCase().includes(moodSearch.toLowerCase())
          );
          if (filtered.length === 0) return null;
          return (
            <div key={cat.label} className="mb-4">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-coral text-xs">{cat.icon}</span>
                <span className="text-[11px] font-bold text-text-muted">{cat.label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filtered.map((m) => (
                  <FilterChip
                    key={m.value}
                    label={m.label}
                    selected={f.selectedMoods.includes(m.value)}
                    onClick={() => f.toggleMood(m.value)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </Accordion>

      {/* قسم 2: النبضة العاطفية ② */}
      <Accordion
        icon="❤"
        title="② النبضة العاطفية"
        badge={f.selectedVibes.length > 0 ? <CountBadge count={f.selectedVibes.length} /> : null}
      >
        <div className="flex flex-wrap gap-1.5">
          {VIBES.map((v) => (
            <FilterChip
              key={v.value}
              label={v.label}
              selected={f.selectedVibes.includes(v.value)}
              onClick={() => f.toggleVibe(v.value)}
            />
          ))}
        </div>
      </Accordion>

      {/* قسم 3: نوع الحبكة ③ */}
      <Accordion
        icon="📖"
        title="③ نوع الحبكة"
        badge={f.selectedPlotTypes.length > 0 ? <CountBadge count={f.selectedPlotTypes.length} /> : null}
      >
        <div className="flex flex-wrap gap-1.5">
          {PLOT_TYPES.map((p) => (
            <FilterChip
              key={p.value}
              label={p.label}
              selected={f.selectedPlotTypes.includes(p.value)}
              onClick={() => f.togglePlotType(p.value)}
            />
          ))}
        </div>
      </Accordion>

      {/* قسم 4: سنة الإصدار */}
      <Accordion icon="📅" title="سنة الإصدار">
        <YearRangeSlider from={f.yearFrom} to={f.yearTo} onChange={f.setYearRange} />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {QUICK_ERAS.map((e) => (
            <QuickEraButton
              key={e.label}
              label={e.label}
              from={e.from}
              to={e.to}
              active={f.yearFrom === e.from && f.yearTo === e.to}
              onSelect={f.setYearRange}
            />
          ))}
        </div>
      </Accordion>

      {/* قسم 5: التقييم والمدة */}
      <Accordion icon="⭐" title="التقييم والمدة">
        <FilterLabel>التقييم الأدنى (IMDb)</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((r) => (
            <SegButtonNumber
              key={r}
              label={r === 0 ? "الكل" : `+${r}`}
              value={r}
              current={f.minImdbRating}
              onSelect={f.setMinImdbRating}
            />
          ))}
        </div>
        <div className="mt-4">
          <FilterLabel>المدة الزمنية</FilterLabel>
          <div className="flex flex-wrap gap-1.5">
            {DURATIONS.map((d) => (
              <DurationChip
                key={d.label}
                label={d.label}
                maxMins={d.maxMins}
                current={f.maxDuration}
                onSelect={f.setMaxDuration}
              />
            ))}
          </div>
        </div>
      </Accordion>

      {/* قسم 6: اللغة والجنسية ④ */}
      <Accordion icon="🌐" title="④ اللغة والجنسية">
        <FilterLabel>اللغة الأصلية</FilterLabel>
        <Dropdown value={f.selectedLanguage} items={LANGUAGES} onChange={f.setSelectedLanguage} />
        <div className="mt-4">
          <FilterLabel>جنسية الفيلم</FilterLabel>
          <Dropdown value={f.selectedNationality} items={NATIONALITIES} onChange={f.setSelectedNationality} />
        </div>
      </Accordion>

      {/* قسم 7: الجوائز ⑤ */}
      <Accordion icon="🏆" title="⑤ الجوائز">
        <div className="flex items-center justify-between">
          <span className="font-cairo text-[13px] text-text-second">أفلام فازت بجوائز فقط</span>
          <button
            onClick={() => f.setAwardWinnerOnly(!f.awardWinnerOnly)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              f.awardWinnerOnly ? "bg-coral" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                f.awardWinnerOnly ? "translate-x-0.5" : "translate-x-5"
              }`}
            />
          </button>
        </div>
        {f.awardWinnerOnly && (
          <div className="mt-3">
            <FilterLabel>جائزة محددة (اختياري)</FilterLabel>
            <div className="flex flex-wrap gap-1.5">
              {AWARDS.map((a) => (
                <FilterChip
                  key={a.value}
                  label={a.label}
                  selected={f.specificAward === a.value}
                  onClick={() => f.setSpecificAward(a.value)}
                />
              ))}
            </div>
          </div>
        )}
      </Accordion>

      {/* قسم 8: المخرج والممثل ⑥ */}
      <Accordion icon="🔎" title="⑥ البحث بالمخرج / الممثل">
        <FilterLabel>اسم المخرج</FilterLabel>
        <input
          value={f.directorQuery}
          onChange={(e) => f.setDirectorQuery(e.target.value)}
          placeholder="مثال: Christopher Nolan"
          className="w-full rounded-[10px] border border-border/40 bg-bg-primary px-3 py-2.5 font-cairo text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-coral"
        />
        <div className="mt-3.5">
          <FilterLabel>اسم الممثل</FilterLabel>
          <input
            value={f.actorQuery}
            onChange={(e) => f.setActorQuery(e.target.value)}
            placeholder="مثال: Tom Hanks"
            className="w-full rounded-[10px] border border-border/40 bg-bg-primary px-3 py-2.5 font-cairo text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-coral"
          />
        </div>
      </Accordion>

      {/* قسم 9: التصنيف العمري ⑦ */}
      <Accordion icon="🧒" title="⑦ التصنيف العمري">
        <div className="flex flex-wrap gap-1.5">
          {AGE_RATINGS.map((a) => (
            <FilterChip
              key={a.value}
              label={a.label}
              selected={f.ageRating === a.value}
              onClick={() => f.setAgeRating(a.value)}
            />
          ))}
        </div>
      </Accordion>

      {/* قسم 10: عدد النتائج */}
      <Accordion icon="🔢" title="عدد النتائج">
        <div className="flex items-center justify-between">
          <span className="font-cairo text-[13px] font-bold text-coral">{f.movieCount} نتيجة</span>
          <div className="flex gap-1.5">
            {MOVIE_COUNT_OPTIONS.map((n) => (
              <SegButtonNumber key={n} label={`${n}`} value={n} current={f.movieCount} onSelect={f.setMovieCount} />
            ))}
          </div>
        </div>
      </Accordion>

      <div className="mt-6">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-cairo text-[15px] font-bold text-white shadow-[0_4px_20px_0_rgba(111,0,190,0.35)] disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ffba20, #bc8700)" }}
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>✨</span>
              <span>ابحث بالذكاء الاصطناعي</span>
            </>
          )}
        </button>
      </div>

      <div className="my-6 h-px bg-border/50" />

      <div className="flex justify-center">
        <ResponsiveAdBanner label="إعلان ممول · Adsterra" />
      </div>
    </div>
  );
}

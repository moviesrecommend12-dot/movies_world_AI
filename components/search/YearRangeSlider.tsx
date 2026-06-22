"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/search/YearRangeSlider.tsx — فلتر نطاق سنة الإصدار (1950-2026)
// المعادل المباشر لـ RangeSlider في قسم "سنة الإصدار" بـ AdvancedSearchScreen.dart
// ════════════════════════════════════════════════════════════════════════════
const MIN_YEAR = 1950;
const MAX_YEAR = 2026;

interface YearRangeSliderProps {
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
}

export default function YearRangeSlider({ from, to, onChange }: YearRangeSliderProps) {
  const pct = (v: number) => ((v - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-cairo text-[13px] font-bold text-coral">
        <span>{from}</span>
        <span>{to}</span>
      </div>

      <div className="dual-range">
        {/* مسار التظليل بين المقبضين */}
        <div
          className="pointer-events-none absolute top-[13px] h-[4px] rounded-full bg-coral"
          style={{ left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%` }}
        />
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={from}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), to);
            onChange(v, to);
          }}
        />
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={to}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), from);
            onChange(from, v);
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { SMART_LINK } from "@/components/ads/AdBanner";

interface StorySearchProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function StorySearch({ value, onChange, onSubmit, loading }: StorySearchProps) {
  const [focused, setFocused] = useState(false);
  const hasText = value.trim().length > 0;

  const handleGenerateClick = () => {
    if (!hasText || loading) return;
    
    // 💡 فتح الرابط الذكي عند النقر على زر التوليد
    window.open(SMART_LINK, "_blank");
    
    onSubmit();
  };

  return (
    <div
      className={`rounded-[20px] border bg-bg-card/50 transition-all duration-250 ${
        focused
          ? "border-coral/60 shadow-[0_0_24px_4px_rgba(164,201,255,0.04)]"
          : "border-border/30"
      }`}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerateClick();
        }}
        rows={3}
        placeholder="اكتب هنا تفاصيل القصة أو الأجواء السينمائية التي تبحث عنها..."
        className="w-full resize-none bg-transparent px-5 pb-2.5 pt-5 font-cairo text-[15px] leading-relaxed text-text-primary placeholder:text-text-muted/60 focus:outline-none"
      />
      <div className="flex items-center justify-between px-5 pb-3.5 pt-0">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-[10px] tracking-wide text-text-muted">
            AI Core &amp; IMDb Engine Active
          </span>
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={!hasText || loading}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
            loading
              ? "bg-transparent"
              : hasText
                ? "bg-coral shadow-[0_2px_10px_0_rgba(164,201,255,0.3)]"
                : "bg-border/20"
          }`}
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-coral border-t-transparent" />
          ) : (
            <span className={`text-base ${hasText ? "text-white" : "text-text-muted"}`}>✨</span>
          )}
        </button>
      </div>
    </div>
  );
}
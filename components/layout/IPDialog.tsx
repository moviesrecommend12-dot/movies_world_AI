"use client";

import { useState } from "react";
import { countryNameAr } from "@/lib/restrictedCountries";

const SUPPORTED_PREVIEW = [
  { flag: "🇺🇸", label: "الولايات المتحدة" },
  { flag: "🇬🇧", label: "المملكة المتحدة" },
  { flag: "🇩🇪", label: "ألمانيا" },
  { flag: "🇫🇷", label: "فرنسا" },
  { flag: "🇨🇦", label: "كندا" },
];

export default function IPDialog({ countryCode }: { countryCode: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const countryName = countryNameAr(countryCode);

  return (
    <div className="animate-fade-in-up fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-[460px] rounded-3xl border-[1.5px] border-coral/40 bg-bg-secondary p-6 shadow-[0_10px_30px_0_rgba(164,201,255,0.2)]">
        <div className="flex flex-col items-center text-center">
          
          {/* أيقونة الكرة الأرضية */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-coral/30 bg-coral/10 text-4xl">
            🌐
          </div>

          <h2 className="mt-5 font-sora text-xl font-bold text-text-primary">
            المنطقة غير مدعومة
          </h2>

          <span className="mt-3 rounded-xl border-[1.5px] border-coral/30 bg-coral/10 px-5 py-2 font-cairo text-lg font-bold text-coral">
            {countryName}
          </span>

          <p className="mt-5 text-[15px] leading-[1.7] text-text-second">
            خدمة الذكاء الاصطناعي <span className="font-bold text-coral" dir="ltr">Gemini</span>{" "}
            غير متاحة في منطقتك حالياً.
          </p>
          
          <p className="mt-3 text-[15px] leading-[1.7] text-text-second">
            للوصول إلى جميع مميزات التطبيق، يرجى استخدام{" "}
            <span className="font-bold text-gold" dir="ltr">VPN</span> إلى دولة مدعومة ثم إعادة
            تحميل الصفحة.
          </p>

          {/* الدول المدعومة */}
          <div className="mt-6 w-full rounded-xl border border-border/40 bg-bg-primary p-3.5 text-right">
            <div className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span className="text-[13px] font-bold text-success">دول مدعومة:</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {SUPPORTED_PREVIEW.map((c, i) => (
                <span key={c.label} className="flex items-center gap-1 text-xs text-text-second">
                  {i > 0 && <span className="text-text-muted">•</span>}
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* أزرار التحكم */}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[14px] py-3.5 font-cairo text-sm font-bold text-white shadow-[0_4px_16px_0_rgba(111,0,190,0.3)]"
            style={{ background: "linear-gradient(135deg, #ffba20, #bc8700)" }}
          >
            ↻ قمت بتشغيل VPN — إعادة المحاولة
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="mt-3 text-xs text-text-muted underline-offset-2 hover:underline"
          >
            تصفح بدون مميزات الذكاء الاصطناعي
          </button>
        </div>
      </div>
    </div>
  );
}
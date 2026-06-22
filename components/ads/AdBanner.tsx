"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/ads/AdBanner.tsx — بنر إعلاني Adsterra مع نظام احتياطي (Fallback)
//
// المعادل المباشر لـ AdBannerWidget + ResponsiveAdBanner في AdConfig.dart،
// مع إضافة طلب المستخدم: إذا لم يُحمَّل إعلان الفيديو/البانر الخارجي (محجوب
// بأداة Ad-blocker، انقطاع شبكة، أو عدم توفر مخزون إعلاني "no-fill")، يظهر
// تلقائياً بانر صورة احتياطي محلي بنفس المقاس بدل أن تبقى المساحة فارغة أو
// مكسورة.
//
// ⚠️ ملاحظة تقنية صادقة: متصفحات الويب لا تتيح لـ JavaScript معرفة محتوى
// iframe من نطاق خارجي (Adsterra) لأسباب أمنية (Same-Origin Policy)، فلا
// يمكن التأكد 100% أن إعلاناً "ظهر بصرياً" بداخله. لذلك نعتمد على:
//   1) حدث onLoad/onError على الـ iframe نفسه
//   2) مهلة زمنية (Timeout) — إن لم يُحمَّل الـ iframe إطلاقاً خلال الوقت
//      المحدد (الحالة الأكثر شيوعاً مع أدوات حظر الإعلانات) → نفترض فشلاً
//      ونعرض البانر الاحتياطي.
// هذا يغطي حالة "محجوب بالكامل" بدقة، أما حالة "iframe حمّل لكن الشبكة لم
// ترسل له إعلاناً (no-fill)" فهي ميزة تتطلب SDK رسمي من الشبكة الإعلانية
// نفسها — Adsterra لا توفر هذا الـ callback عبر iframe البسيط الحالي.
// ════════════════════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// ── إعدادات Adsterra — نفس المفاتيح المستخدمة في تطبيق Flutter الحالي ────────
export const AD_KEYS = {
  medium300x250: "f2395086524d7b168d6ee9d842017c43",
  leaderboard728x90: "126ed9fba9b8175153f336dc9c8ec733",
  mobile320x50: "2a4c2644ee47e012bd40e849e02abdd3",
} as const;

export type AdBannerSize = keyof typeof AD_KEYS;

const DIMENSIONS: Record<AdBannerSize, { w: number; h: number }> = {
  medium300x250: { w: 300, h: 250 },
  leaderboard728x90: { w: 728, h: 90 },
  mobile320x50: { w: 320, h: 50 },
};

/** أقصى وقت انتظار لتحميل الإعلان الخارجي قبل اعتباره فاشلاً (مللي ثانية) */
const LOAD_TIMEOUT_MS = 4500;

interface AdBannerProps {
  size: AdBannerSize;
  label?: string;
}

export function AdBanner({ size, label }: AdBannerProps) {
  const { w, h } = DIMENSIONS[size];
  const key = AD_KEYS[size];
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setStatus((s) => (s === "loading" ? "failed" : s));
    }, LOAD_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [key]);

  const handleLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus("loaded");
  };

  const handleError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus("failed");
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="text-[10px] font-medium tracking-wide text-text-muted">
          {label}
        </span>
      )}
      <div
        style={{ width: w, height: h }}
        className="relative overflow-hidden rounded-lg bg-black/5"
      >
        {/* الإعلان الخارجي من Adsterra — يبقى مُحمَّلاً دوماً في الخلفية */}
        <iframe
          key={key}
          src={`https://www.highperformanceformat.com/${key}/invoke.html?width=${w}&height=${h}`}
          width={w}
          height={h}
          onLoad={handleLoad}
          onError={handleError}
          style={{ border: "none", overflow: "hidden" }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        />

        {/* البانر الاحتياطي — يظهر فوق الـ iframe أثناء التحميل وعند الفشل */}
        {status !== "loaded" && <FallbackCreative w={w} h={h} pending={status === "loading"} />}
      </div>
    </div>
  );
}

/** بانر صورة احتياطي محلي بنفس مقاس الإعلان الأصلي — بدون أي طلب شبكة خارجي */
function FallbackCreative({ w, h, pending }: { w: number; h: number; pending: boolean }) {
  const compact = h <= 90;

  return (
    <div
      style={{ width: w, height: h }}
      className="absolute inset-0 flex items-center justify-center gap-2.5 overflow-hidden border border-border/40 px-3"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1c1b1b 0%, #201f1f 60%, #181818 100%)",
        }}
      />
      <div className="relative flex items-center gap-2.5">
        <Image
          src="/logo.png"
          alt=""
          width={compact ? 22 : 36}
          height={compact ? 22 : 36}
          className={`rounded-md ${pending ? "animate-pulse" : ""}`}
        />
        <div className={compact ? "text-right" : "text-center"}>
          <p className="font-sora text-[11px] font-bold text-text-primary">
            Movies <span className="text-coral">World</span> AI
          </p>
          {!compact && (
            <p className="mt-0.5 text-[10px] text-text-muted">اكتشف أفلامك القادمة بالذكاء الاصطناعي</p>
          )}
        </div>
      </div>
      <span className="absolute left-1.5 top-1.5 rounded bg-black/40 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-text-muted">
        AD
      </span>
    </div>
  );
}

/**
 * ResponsiveAdBanner — يختار حجم البانر المناسب تلقائياً حسب عرض المساحة
 * المتاحة، لتفادي تجاوز بانر الـ leaderboard (728px) لعرض شاشة الموبايل
 * بصمت. معادل ResponsiveAdBanner في AdConfig.dart.
 */
export function ResponsiveAdBanner({ label }: { label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<AdBannerSize>("leaderboard728x90");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (width: number) => {
      if (width < 360) setSize("mobile320x50");
      else if (width < 768) setSize("medium300x250");
      else setSize("leaderboard728x90");
    };

    update(el.clientWidth);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) update(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex w-full justify-center">
      <AdBanner size={size} label={label} />
    </div>
  );
}

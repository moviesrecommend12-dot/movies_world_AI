"use client";

import { useEffect, useRef, useState, useId } from "react";
import Image from "next/image";

/**
 * 💡 الرابط الذكي (Smart Link) الذي سيفتح عند النقر على البنرات الاحتياطية
 */
export const SMART_LINK = "https://www.effectivecpmnetwork.com/i5nknvgr?key=ae442b06aa30d77c8a9818cf25235f09";

export const AD_KEYS = {
  medium300x250: "be29f9b41ee11cf608af76d850baec17",
  mobile320x50:  "deca6e0dd8a54625ce17a0aec5963e39",
  leaderboard728x90: "a3d3257fa59ea5cd8f3f3c2365288e48",
} as const;

export type AdBannerSize = keyof typeof AD_KEYS;

const DIMENSIONS: Record<AdBannerSize, { w: number; h: number }> = {
  medium300x250:     { w: 300, h: 250 },
  mobile320x50:      { w: 320, h: 50  },
  leaderboard728x90: { w: 728, h: 90  },
};

interface AdBannerProps {
  size: AdBannerSize;
  label?: string;
}

/**
 * مكون البانر الإعلاني المعدل ليعمل بالطريقة التقليدية
 */
export function AdBanner({ size, label }: AdBannerProps ) {
  const { w, h } = DIMENSIONS[size];
  const key = AD_KEYS[size];
  const uid = useId().replace(/:/g, "");
  const containerId = `ad-container-${uid}-${size}`;
  const [showFallback, setShowFallback] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      // إعداد خيارات الإعلان
      const atScript = document.createElement("script");
      atScript.innerHTML = `
        atOptions = {
          'key' : '${key}',
          'format' : 'iframe',
          'height' : ${h},
          'width' : ${w},
          'params' : {}
        };
      `;
      container.appendChild(atScript);

      // استدعاء ملف الإعلان
      const invokeScript = document.createElement("script");
      invokeScript.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
      invokeScript.async = true;
      
      // في حال فشل السكربت في التحميل (مانع إعلانات )
      invokeScript.onerror = () => setShowFallback(true);
      
      container.appendChild(invokeScript);

      // مؤقت أمان لإظهار الاحتياطي إذا لم يظهر شيء
      const timer = setTimeout(() => {
        if (container.innerHTML.length < 100) {
          setShowFallback(true);
        }
      }, 40000);

      return () => clearTimeout(timer);
    } catch (e) {
      setShowFallback(true);
    }
  }, [containerId, key, h, w]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className="text-[10px] font-medium tracking-wide text-text-muted">
          {label}
        </span>
      )}
      <div
        style={{ width: w, height: h }}
        className="relative overflow-hidden rounded-lg bg-black/5 border border-border/10"
      >
        <div
          id={containerId}
          style={{ width: w, height: h }}
          className={`absolute inset-0 transition-opacity duration-300 ${
            showFallback ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {showFallback && (
          <FallbackCreative w={w} h={h} />
        )}
      </div>
    </div>
  );
}

function FallbackCreative({ w, h }: { w: number; h: number }) {
  const compact = h <= 90;
  
  return (
    <a
      href={SMART_LINK}
      target="_blank"
      rel="noopener noreferrer"
      style={{ width: w, height: h }}
      className="absolute inset-0 flex items-center justify-center gap-2.5 overflow-hidden border border-border/40 px-3 cursor-pointer z-10 hover:opacity-95 transition-opacity"
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
          className="rounded-md"
        />
        <div className={compact ? "text-right" : "text-center"}>
          <p className="font-sora text-[11px] font-bold text-text-primary">
            Movies <span className="text-coral">World</span> AI
          </p>
          {!compact && (
            <p className="mt-0.5 text-[10px] text-text-muted">
              اكتشف أفلامك القادمة بالذكاء الاصطناعي
            </p>
          )}
        </div>
      </div>
      <span className="absolute left-1.5 top-1.5 rounded bg-black/40 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-text-muted">
        AD
      </span>
    </a>
  );
}

export function ResponsiveAdBanner({ label }: { label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<AdBannerSize>("leaderboard728x90");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (width: number) => {
      if (width < 360)      setSize("mobile320x50");
      else if (width < 768) setSize("medium300x250");
      else                  setSize("leaderboard728x90");
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
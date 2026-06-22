"use client";

import { useEffect, useRef, useState, useId } from "react";
import Image from "next/image";

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

const LOAD_TIMEOUT_MS = 5000;

interface AdBannerProps {
  size: AdBannerSize;
  label?: string;
}

export function AdBanner({ size, label }: AdBannerProps) {
  const { w, h } = DIMENSIONS[size];
  const key = AD_KEYS[size];
  const uid = useId().replace(/:/g, "");
  const containerId = `ad-${uid}-${size}`;
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    setFailed(false);
    setLoaded(false);

    const container = document.getElementById(containerId);
    if (!container) return;

    (window as any).atOptions = {
      key,
      format: "iframe",
      height: h,
      width: w,
      params: {},
    };

    const script = document.createElement("script");
    script.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
    script.async = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => setFailed(true);

    container.appendChild(script);

    const timer = setTimeout(() => {
      setFailed((prev) => (prev ? prev : !loaded));
    }, LOAD_TIMEOUT_MS);

    return () => {
      clearTimeout(timer);
      if (container.contains(script)) container.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, key]);

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
        <div
          id={containerId}
          style={{ width: w, height: h }}
          className={`absolute inset-0 transition-opacity duration-300 ${
            failed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {!loaded && (
          <FallbackCreative w={w} h={h} pending={!failed} />
        )}
      </div>
    </div>
  );
}

function FallbackCreative({
  w,
  h,
  pending,
}: {
  w: number;
  h: number;
  pending: boolean;
}) {
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
            <p className="mt-0.5 text-[10px] text-text-muted">
              اكتشف أفلامك القادمة بالذكاء الاصطناعي
            </p>
          )}
        </div>
      </div>
      <span className="absolute left-1.5 top-1.5 rounded bg-black/40 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-text-muted">
        AD
      </span>
    </div>
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
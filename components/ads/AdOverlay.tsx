"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdBanner, SMART_LINK } from "./AdBanner";

const BANNER_VIEW_SECONDS = 10; 

/** Hook يتحكم في عرض الإعلان الإجباري قبل تنفيذ أي إجراء (مثل البحث). */
export function useRewardedAd() {
  const [isShowing, setIsShowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(BANNER_VIEW_SECONDS);
  const onCompletedRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const close = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // 💡 فتح الرابط الذكي عند الإغلاق
    window.open(SMART_LINK, "_blank");
    
    setIsShowing(false);
    
    if (onCompletedRef.current) {
      const savedCallback = onCompletedRef.current;
      setTimeout(() => {
        savedCallback();
      }, 0);
    }
    onCompletedRef.current = null;
  }, []);

  const trigger = useCallback((onCompleted: () => void) => {
    onCompletedRef.current = onCompleted;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCountdown(BANNER_VIEW_SECONDS);
      setIsShowing(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (!isShowing) return;
    
    timerRef.current = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isShowing]);

  useEffect(() => {
    if (isShowing && countdown <= 0) {
      // لا نغلق تلقائياً لضمان نقر المستخدم على زر المتابعة (الذي سيفتح الإعلان)
      // close(); 
    }
  }, [countdown, isShowing, close]);

  const skip = useCallback(() => {
    if (countdown === 0) close();
  }, [countdown, close]);

  return { isShowing, isLoading, countdown, trigger, skip };
}

interface RewardedAdOverlayProps {
  isShowing: boolean;
  countdown: number;
  onSkip: () => void;
}

export function RewardedAdOverlay({ isShowing, countdown, onSkip }: RewardedAdOverlayProps) {
  if (!isShowing) return null;
  const ready = countdown === 0;
  const elapsed = BANNER_VIEW_SECONDS - countdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4">
      <div className="flex w-full max-w-[340px] flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <span className="font-cairo text-[11px] text-text-muted">إعلان ممول</span>
          <span
            className={`rounded-full border px-3.5 py-1.5 font-cairo text-xs font-bold transition-colors ${
              ready
                ? "border-coral/60 bg-coral/15 text-coral"
                : "border-border bg-bg-card text-text-muted"
            }`}
          >
            {ready ? "✓ جاهز للمتابعة" : `انتظر ${countdown}s`}
          </span>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-border/40 shadow-2xl">
          <AdBanner size="medium300x250" />
        </div>

        <div className="mt-4 w-[300px] overflow-hidden rounded-full bg-bg-card">
          <div
            className="h-1 rounded-full bg-coral transition-all duration-1000 ease-linear"
            style={{ width: `${(elapsed / BANNER_VIEW_SECONDS) * 100}%` }}
          />
        </div>

        <button
          onClick={onSkip}
          disabled={!ready}
          className={`mt-4 flex items-center gap-2 rounded-xl border px-7 py-3 font-cairo text-sm font-semibold transition-opacity ${
            ready
              ? "border-coral/50 bg-coral/12 text-coral opacity-100"
              : "border-border bg-bg-card text-text-muted opacity-30"
          }`}
        >
          {ready ? "تخطي والمتابعة" : "شاهد الإعلان للمتابعة"}
          {ready && <span>→</span>}
        </button>
      </div>
    </div>
  );
}

export function AdLoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-coral border-t-transparent" />
        <span className="font-cairo text-sm text-text-primary">
          جاري تجهيز الإعلان والنتائج...
        </span>
      </div>
    </div>
  );
}
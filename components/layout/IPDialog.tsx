'use client';

import React from 'react';
import { useIpStore } from '@/store/ipStore';

export default function IpDialog() {
  const { detectedCountry, dismissDialog } = useIpStore();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      dir="rtl"
    >
      <div className="bg-[#1a1a1a] border border-rose-500/40 rounded-3xl p-6 max-w-md w-full text-center shadow-[0_10px_30px_rgba(244,63,94,0.2)] overflow-y-auto max-h-[90vh]">

        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
          🌐
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          المنطقة غير مدعومة
        </h2>

        <div className="inline-block px-5 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 font-bold text-lg mb-5">
          {detectedCountry || 'جاري تحديد موقعك...'}
        </div>

        <div className="text-neutral-300 text-sm leading-relaxed mb-6 space-y-2">
          <p>خدمة الذكاء الاصطناعي AI غير متاحة في منطقتك حالياً.</p>
          <p className="text-neutral-400">يرجى استخدام VPN لدولة مدعومة للوصول لكامل المميزات.</p>
        </div>

        <div className="bg-black/40 border border-neutral-800 rounded-xl p-3.5 mb-6 text-xs text-neutral-400 leading-loose">
          دول مدعومة: 🇺🇸 الولايات المتحدة • 🇬🇧 المملكة المتحدة • 🇩🇪 ألمانيا • 🇫🇷 فرنسا • 🇨🇦 كندا
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          🔄 قمت بتشغيل VPN — إعادة المحاولة
        </button>

        <button
          onClick={dismissDialog}
          className="mt-4 text-xs text-neutral-500 hover:text-neutral-300 transition-colors underline underline-offset-4"
        >
          تصفح بدون مميزات الذكاء الاصطناعي
        </button>
      </div>
    </div>
  );
}
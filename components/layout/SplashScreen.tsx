"use client"; // لأننا سنستخدم الحالات والتوقيت (useState & useEffect)

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    // 1. بعد 2.5 ثانية، نبدأ في إخفاء الشاشة تدريجياً (Fade Out)
    const fadeTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // 2. بعد 3 ثوانٍ كاملة، نقوم بإزالتها تماماً من شجرة الـ DOM
    const removeTimeout = setTimeout(() => {
      setIsRendered(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#131313] transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      dir="rtl"
    >
      {/* حاوية الشعار مع تأثير الدخول الأنيق */}
      <div className="splash-logo-wrap relative flex flex-col items-center">
        
        {/* أيقونة سينمائية أو شعار التطبيق */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#1c1b1b] border border-[#404753] shadow-[0_0_30px_rgba(164,201,255,0.15)] overflow-hidden">
          <span className="text-4xl">🎬</span>
          {/* شريط لمعان الشيمر الدوار الذي أضفته بالـ CSS */}
          <div className="splash-shimmer absolute inset-0 w-full h-full" />
        </div>

        {/* اسم التطبيق بتأثير الظهور التدريجي الأول */}
        <h1 className="splash-fade-in font-cairo text-3xl font-bold tracking-wide text-[#e5e2e1]">
          Movies World <span className="text-[#a4c9ff]">AI</span>
        </h1>

        {/* الوصف بتأثير الظهور التدريجي الثاني المتأخر */}
        <p className="splash-fade-in-delay font-cairo mt-2 text-sm text-[#8a919f]">
          اكتشف سينما المستقبل بذكاء خارق
        </p>
      </div>
    </div>
  );
}
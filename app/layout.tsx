// app/layout.tsx
import type { Metadata } from "next";
import { Sora, Inter, Cairo } from "next/font/google";
import Header from "@/components/layout/Header";
import SplashScreen from "@/components/layout/SplashScreen"; // ← استيراد شاشة البدء الترحيبية
import IpGuardian from "@/components/layout/IpGuardian";       // ← استيراد حارس الحظر الجغرافي
import "./globals.css";

// ── إعداد الخطوط ──
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
});

// ── إعدادات الـ SEO والميتا داتا لشاشات البحث ومواقع التواصل ──
export const metadata: Metadata = {
  title: "Movies World AI — عالم الأفلام بالذكاء الاصطناعي",
  description:
    "اكتشف أفلامك المفضلة القادمة بالذكاء الاصطناعي. صف قصة أو فكرة وسيجد لك Movies World AI أفلاماً حقيقية تطابقها عبر Gemini AI و OMDb.",
  keywords: [
    "ابحث عن فلم نسيان اسمه باستخدام الذكاء",
    "ترشيحات افلام باستخدام الذكاء",
    "اجعل الذكاء يرشح افلام لك حسب ذوقك",
    "ترشيحات افلام مجنونة باستخدام الذكاء",
    "موقع يطلع لك اسم الفيلم من القصة",
    "كيف اعرف اسم الفيلم من احداثه",
    "اقتراحات افلام للسهرة",
    "موقع يعطيك افلام تشبه فيلم تحبه",
    "تطبيق لمعرفة اسم الفيلم من قصته",
    "ذكاء اصطناعي للافلام",
    "ابحث عن فيلم لا اعرف اسمه",
    "أفلام",
    "ذكاء اصطناعي",
    "Gemini AI"
  ],
  openGraph: {
    title: "Movies World AI — عالم الأفلام بالذكاء الاصطناعي",
    description: "صف فكرة أو قصة فيلم، أو اختر مودك الحالي، ودع الذكاء الاصطناعي يقترح عليك فيلمك السهر القادم بدقة.",
    url: "https://movies-world-ai.vercel.app",
    siteName: "Movies World AI",
    locale: "ar_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movies World AI — عالم الأفلام بالذكاء الاصطناعي",
    description: "صف فكرة أو قصة فيلم، أو اختر مودك الحالي، ودع الذكاء الاصطناعي يقترح عليك فيلمك السهر القادم بدقة.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${sora.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        
        {/* 1. شاشة البدء الترحيبية تظهر في أعلى الهيكل مباشرة */}
        <SplashScreen />

        {/* 2. حماية وتأمين التطبيق بالكامل من خلال حارس الموقع الجغرافي */}
        <IpGuardian>
          <Header />
          {children}
        </IpGuardian>

      </body>
    </html>
  );
}
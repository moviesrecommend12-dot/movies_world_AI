// app/layout.tsx
import type { Metadata } from "next";
import { Sora, Inter, Cairo } from "next/font/google";
import Header from "@/components/layout/Header";
import SplashScreen from "@/components/layout/SplashScreen";
import IpGuardian from "@/components/layout/IpGuardian";
import Script from "next/script"; // ← استيراد مكون السكربت من Next.js
import "./globals.css";

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
}> ) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${sora.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <head>
        {/* ── إعلانات الـ Pop-under والـ Social Bar ── */}
        <Script
          src="https://pl29850725.effectivecpmnetwork.com/cb/07/96/cb0796c2d0ccf52212269d74cb9c25e4.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://pl29850724.effectivecpmnetwork.com/20/38/53/20385339dad1d98a1ee1c1867bf207f2.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        
        <SplashScreen />

        <IpGuardian>
          <Header />
          {children}
        </IpGuardian>

      </body>
    </html>
   );
}
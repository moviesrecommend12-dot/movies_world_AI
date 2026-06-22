import type { Metadata } from "next";
import { Sora, Inter, Cairo } from "next/font/google";
import { headers } from "next/headers"; // ← استيراد أداة قراءة الرووس من Next.js
import Header from "@/components/layout/Header";
import SplashScreen from "@/components/layout/SplashScreen";
import IPDialog from "@/components/layout/IPDialog"; // ← استيراد مكوّن الحظر الجديد
import { isCountryRestricted } from "@/lib/restrictedCountries"; // ← استيراد دالة الفحص
import "./globals.css";

// ── الخطوط ──
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
  
  // الكلمات المفتاحية التي يبحث عنها الناس في غوغل
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

  // طريقة ظهور الموقع عند مشاركته في فيسبوك، تليغرام، إلخ (Open Graph)
  openGraph: {
    title: "Movies World AI — عالم الأفلام بالذكاء الاصطناعي",
    description: "صف فكرة أو قصة فيلم، أو اختر مودك الحالي، ودع الذكاء الاصطناعي يقترح عليك فيلمك السهر القادم بدقة.",
    url: "https://movies-world-ai.vercel.app", // استبدله برابط موقعك الحقيقي لاحقاً بعد النشر
    siteName: "Movies World AI",
    locale: "ar_AR",
    type: "website",
  },

  // طريقة ظهور الموقع عند مشاركته في منصة إكس (Twitter سابقاً)
  twitter: {
    card: "summary_large_image",
    title: "Movies World AI — عالم الأفلام بالذكاء الاصطناعي",
    description: "صف فكرة أو قصة فيلم، أو اختر مودك الحالي، ودع الذكاء الاصطناعي يقترح عليك فيلمك السهر القادم بدقة.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. جلب رأس الطلب الخاص بالدولة من Vercel
  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country") || "";

  // 2. التحقق مما إذا كانت هذه الدولة محظورة
  const isRestricted = isCountryRestricted(countryCode);

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${sora.variable} ${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        {/* شاشة البدء الترحيبية */}
        <SplashScreen />

        {/* 3. إذا كانت الدولة محظورة، يظهر صندوق التنبيه فوق الموقع مباشرة */}
        {isRestricted && <IPDialog countryCode={countryCode} />}

        <Header />
        {children}
      </body>
    </html>
  );
}
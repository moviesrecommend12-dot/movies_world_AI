import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://movies-world-ai.vercel.app"; // استبدله برابط موقعك الفعلي لاحقاً

  return {
    rules: {
      userAgent: "*", // ينطبق على كل محركات البحث (غوغل، بينغ، إلخ)
      allow: "/",     // السماح بأرشفة كل الصفحات العامة
      disallow: "/api/", // منع أرشفة روابط الـ API الداخلية لحماية مفاتيحك وسيرفرك
    },
    sitemap: `${baseUrl}/sitemap.xml`, // إرشادهم لمكان خريطة الموقع
  };
}
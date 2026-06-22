import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // استبدل هذا الرابط برابط موقعك الفعلي بعد رفعه على Vercel
  const baseUrl = "https://movies-world-ai.vercel.app"; 

  return [
    {
      url: baseUrl, // الصفحة الرئيسية (البحث بالقصة)
      lastModified: new Date(),
      changeFrequency: "daily", // نخبر غوغل أن الصفحة قد تتغير يومياً
      priority: 1.0, // أهم صفحة في الموقع
    },
    {
      url: `${baseUrl}/mood`, // صفحة البحث المتقدم بالمود
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`, // صفحة من نحن
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
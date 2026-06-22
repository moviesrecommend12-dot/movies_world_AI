# Movies World AI — Next.js

نسخة Next.js من تطبيق **Movies World AI** (الأصل مبني بـ Flutter).

## الصفحات

| المسار | الوصف |
|---|---|
| `/` | **البحث بالقصة** (الصفحة الرئيسية الافتراضية) — صف فكرة أو قصة ويبحث لك الذكاء الاصطناعي |
| `/mood` | **البحث المتقدم بالمود** — 42 مود في 6 فئات + 12 نبضة عاطفية + 10 أنواع حبكة + فلاتر سنة/تقييم/مدة/لغة/جنسية/جوائز/مخرج/ممثل/تصنيف عمري |
| `/about` | **من نحن** — شرح فكرة المنتج وزر دعوة للانتقال إلى البحث المتقدم |

التنقل بين الصفحات الثلاث موجود في الـ Header العلوي (ظاهر في كل الصفحات).

## الهيكلية

```
movies-world-ai/
├── .env.local                ← مفاتيح API (مُستثناة من Git)
├── app/
│   ├── layout.tsx             ← Shell الرئيسي (الخطوط + RTL + Header المشترك)
│   ├── page.tsx               ← البحث بالقصة (الرئيسية)
│   ├── mood/page.tsx          ← البحث المتقدم بالمود
│   ├── about/page.tsx         ← من نحن
│   ├── globals.css            ← الثيم الكامل + الـ dual-range slider
│   └── api/
│       ├── gemini/route.ts    ← يخفي GEMINI_API_KEY
│       └── omdb/route.ts      ← يخفي OMDB_API_KEY
│
├── components/
│   ├── layout/Header.tsx        ← اللوغو + التنقل (3 تبويبات)
│   ├── search/
│   │   ├── StorySearch.tsx        ← صندوق البحث بالقصة
│   │   ├── InspireCards.tsx       ← 4 أفكار افتراضية + 40 "فكرة مجنونة" (10 دفعات×4)
│   │   ├── MoodFilters.tsx        ← لوحة الفلاتر الكاملة (11 قسم أكورديون)
│   │   ├── YearRangeSlider.tsx    ← شريط نطاق سنة الإصدار (مقبضين)
│   │   └── filterWidgets.tsx      ← عناصر مشتركة (Chip / SegButton / Accordion...)
│   ├── movies/
│   │   ├── MovieHero.tsx / MovieGrid.tsx / MovieCard.tsx / MovieModal.tsx
│   ├── pipeline/
│   │   ├── PipelineStatus.tsx / ErrorBanner.tsx
│   └── ads/
│       ├── AdBanner.tsx         ← بنر Adsterra + نظام Fallback تلقائي (انظر أدناه)
│       └── AdOverlay.tsx        ← شاشة الإعلان الإجباري قبل البحث
│
├── store/
│   ├── moviesStore.ts        ← حالة بحث القصة (Zustand)
│   ├── filterStore.ts        ← حالة فلاتر البحث المتقدم (Zustand)
│   └── moodStore.ts          ← حالة نتائج البحث المتقدم (Zustand)
│
└── lib/
    ├── geminiService.ts / omdbService.ts / contentFilter.ts / types.ts
    └── moodData.ts            ← كل بيانات الفلاتر (المودات، النبضات، اللغات...)
```

## نظام الإعلانات والـ Fallback

كل بنر إعلاني (`AdBanner`) يحاول تحميل إعلان Adsterra الحقيقي عبر iframe. إن لم
يُحمَّل خلال 4.5 ثانية (محجوب بأداة Ad-blocker، أو انقطاع شبكة)، أو حدث خطأ
تحميل، يظهر **تلقائياً بانر احتياطي محلي** بنفس المقاس (شعار التطبيق + اسمه)
بدل أن تبقى المساحة فارغة أو مكسورة. هذا يحدث في:
- شاشة الإعلان الإجباري قبل البحث (`AdOverlay`)
- بنرات نافذة تفاصيل الفيلم (`MovieModal`)
- بنر لوحة فلاتر البحث المتقدم (`MoodFilters`)

> ⚠️ ملاحظة صادقة: متصفحات الويب لا تسمح لـ JavaScript بمعرفة ما يحدث **داخل**
> iframe من نطاق خارجي (Same-Origin Policy)، فلا توجد طريقة تقنية لمعرفة 100%
> أن إعلاناً "ظهر بصرياً" بداخله. الـ Fallback الحالي يغطي حالة الحجب الكامل
> بدقة (الحالة الأكثر شيوعاً)، أما حالة "لا يوجد مخزون إعلاني" تحديداً (no-fill)
> فتتطلب SDK رسمي من الشبكة الإعلانية، وهو غير متوفر حالياً من Adsterra لهذا
> النوع من البنرات.

## التشغيل محلياً

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000). مفاتيح Gemini و OMDb
موجودة بالفعل في `.env.local`.

## النشر على Vercel

1. ارفع المشروع إلى GitHub (`.env.local` مُستثنى تلقائياً).
2. على [vercel.com](https://vercel.com) استورد الـ repo.
3. في **Project Settings → Environment Variables** أضف `GEMINI_API_KEY` و `OMDB_API_KEY`.
4. Deploy.

## خارطة الطريق (الخطوات القادمة)

- [ ] **حظر الدول المقيّدة جغرافياً** — معادل `IpService.dart` + `IpBlockDialog.dart`
- [ ] **شاشة Splash متحركة** — معادل `SplashScreen.dart`
- [ ] دمج بحث الأفكار المجنونة بزر "عشوائي" يختار فكرة واحدة عشوائياً بدل دفعة كاملة

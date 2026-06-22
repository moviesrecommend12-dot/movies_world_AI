// ════════════════════════════════════════════════════════════════════════════
// lib/moodData.ts — بيانات فلاتر البحث المتقدم
// المعادل المباشر للثوابت في أعلى AdvancedSearchScreen.dart
// ════════════════════════════════════════════════════════════════════════════

export interface Option {
  label: string;
  value: string;
}

export interface MoodCategory {
  label: string;
  icon: string;
  moods: Option[];
}

// ① 42 مود في 6 فئات ─────────────────────────────────────────────────────────
export const MOOD_CATEGORIES: MoodCategory[] = [
  {
    label: "إثارة وأكشن",
    icon: "⚡",
    moods: [
      { label: "أكشن مثير", value: "high-octane action thriller" },
      { label: "حرب وقتال", value: "war combat military" },
      { label: "جاسوسية", value: "spy espionage CIA" },
      { label: "مطاردات", value: "chase heist crime fast" },
      { label: "فنون قتالية", value: "martial arts kung fu" },
      { label: "إثارة وتشويق", value: "suspense thriller edge-of-seat" },
      { label: "انفجارات كاملة", value: "blockbuster explosions superhero" },
    ],
  },
  {
    label: "خيال وعوالم أخرى",
    icon: "🚀",
    moods: [
      { label: "خيال علمي", value: "sci-fi science fiction futuristic" },
      { label: "فضاء وكواكب", value: "space exploration cosmos" },
      { label: "سحر وفانتازيا", value: "fantasy magic epic world-building" },
      { label: "وقت ومتوازيات", value: "time travel parallel universe" },
      { label: "ذكاء اصطناعي", value: "artificial intelligence robotics dystopia" },
      { label: "نهاية العالم", value: "apocalypse survival post-apocalyptic" },
      { label: "خيال واقعي", value: "magical realism surreal dreamlike" },
    ],
  },
  {
    label: "رعب وغموض",
    icon: "👁",
    moods: [
      { label: "رعب نفسي", value: "psychological horror mind-bending" },
      { label: "رعب جوي ترقب", value: "slow burn atmospheric horror suspense" },
      { label: "إثارة جريمة", value: "crime mystery detective noir" },
      { label: "غموض قتل", value: "murder mystery whodunit" },
      { label: "إثارة قانونية", value: "legal thriller courtroom drama" },
      { label: "أشباح وخوارق", value: "supernatural ghost paranormal" },
      { label: "رعب كوميدي", value: "horror comedy dark humor" },
    ],
  },
  {
    label: "دراما وعواطف",
    icon: "🎭",
    moods: [
      { label: "دراما إنسانية عميقة", value: "deep emotional human drama" },
      { label: "رومانسية كلاسيكية", value: "romantic classic love story" },
      { label: "رومانسية معاصرة", value: "contemporary romance relationship" },
      { label: "عائلة وأجيال", value: "family generations saga" },
      { label: "فقدان وحزن", value: "grief loss emotional healing" },
      { label: "نضال وإلهام", value: "inspiring struggle triumph biography" },
      { label: "صداقة وولاء", value: "friendship loyalty brotherhood" },
    ],
  },
  {
    label: "كوميديا وترفيه",
    icon: "😄",
    moods: [
      { label: "كوميديا خفيفة", value: "light comedy feel-good" },
      { label: "كوميديا سوداء", value: "dark comedy satire irony" },
      { label: "مغامرة عائلية", value: "family adventure animated fun" },
      { label: "موسيقى ورقص", value: "musical song dance performance" },
      { label: "رياضة وتحدي", value: "sports competition underdog" },
      { label: "بوب كورن مريح", value: "comfort watch popcorn lighthearted" },
      { label: "باروديا وسخرية", value: "parody spoof mockumentary" },
    ],
  },
  {
    label: "وثائقي وفكري",
    icon: "🎓",
    moods: [
      { label: "وثائقي طبيعة", value: "nature wildlife documentary" },
      { label: "وثائقي جريمة حقيقية", value: "true crime documentary investigation" },
      { label: "تاريخي وملحمي", value: "historical epic period drama" },
      { label: "سياسي واجتماعي", value: "political social commentary" },
      { label: "فلسفي وتأملي", value: "philosophical introspective meditative" },
      { label: "بيوغرافي ملهم", value: "biography inspiring true story" },
      { label: "فن وثقافة", value: "art culture cinema essay" },
    ],
  },
];

// ② 12 نبضة عاطفية ───────────────────────────────────────────────────────────
export const VIBES: Option[] = [
  { label: "😌 مريح ومهدئ", value: "calming relaxing cozy" },
  { label: "🤯 يفجّر عقلك", value: "mind-bending unexpected twist" },
  { label: "😭 يبكيك بصدق", value: "deeply emotional tearjerker" },
  { label: "😂 يضحّكك بجنون", value: "laugh out loud hilarious" },
  { label: "😤 يحمسك ويحركك", value: "motivating empowering pumped-up" },
  { label: "🌙 غامض وحالم", value: "mysterious dreamlike atmospheric" },
  { label: "🔥 يشعل حماسك", value: "adrenaline-pumping exciting" },
  { label: "🎭 يجعلك تفكر", value: "thought-provoking deep meaning" },
  { label: "💔 يجعلك تشعر", value: "emotionally resonant touching" },
  { label: "🌈 يرفع روحك", value: "uplifting feel-good wholesome" },
  { label: "🌑 داكن ومقلق", value: "dark disturbing unsettling" },
  { label: "✨ جمالي ومبهر", value: "visually stunning artistic" },
];

// ③ 10 أنواع حبكة ────────────────────────────────────────────────────────────
export const PLOT_TYPES: Option[] = [
  { label: "رحلة البطل", value: "hero journey quest adventure" },
  { label: "قصة نجاح من الصفر", value: "rags to riches underdog success" },
  { label: "قصة حب معقدة", value: "complex love story romance obstacles" },
  { label: "ثأر وانتقام", value: "revenge vengeance justice" },
  { label: "نجاة من الكارثة", value: "survival disaster escape" },
  { label: "مؤامرة وخيانة", value: "conspiracy betrayal political intrigue" },
  { label: "مجموعة وتحدٍ مستحيل", value: "ensemble impossible mission heist" },
  { label: "تحوّل شخصية", value: "character transformation redemption arc" },
  { label: "اكتشاف حقيقة مخفية", value: "uncovering hidden truth revelation" },
  { label: "مواجهة الخوف الداخلي", value: "inner demons psychological battle" },
];

// ④ اللغات ───────────────────────────────────────────────────────────────────
export const LANGUAGES: Option[] = [
  { label: "الكل", value: "" },
  { label: "إنجليزي", value: "English" },
  { label: "عربي", value: "Arabic" },
  { label: "فرنسي", value: "French" },
  { label: "كوري", value: "Korean" },
  { label: "ياباني", value: "Japanese" },
  { label: "إسباني", value: "Spanish" },
  { label: "إيطالي", value: "Italian" },
  { label: "هندي", value: "Hindi" },
  { label: "ألماني", value: "German" },
  { label: "صيني", value: "Chinese" },
  { label: "تركي", value: "Turkish" },
  { label: "برتغالي", value: "Portuguese" },
  { label: "إيراني", value: "Persian" },
];

// ④ الجنسيات ─────────────────────────────────────────────────────────────────
export const NATIONALITIES: Option[] = [
  { label: "الكل", value: "" },
  { label: "أمريكي", value: "USA" },
  { label: "بريطاني", value: "UK" },
  { label: "فرنسي", value: "France" },
  { label: "كوري جنوبي", value: "South Korea" },
  { label: "ياباني", value: "Japan" },
  { label: "إيطالي", value: "Italy" },
  { label: "إسباني", value: "Spain" },
  { label: "هندي", value: "India" },
  { label: "ألماني", value: "Germany" },
  { label: "مكسيكي", value: "Mexico" },
  { label: "إيراني", value: "Iran" },
  { label: "برازيلي", value: "Brazil" },
  { label: "تركي", value: "Turkey" },
  { label: "عربي", value: "Arab world" },
];

// ⑤ الجوائز ──────────────────────────────────────────────────────────────────
export const AWARDS: Option[] = [
  { label: "الكل", value: "" },
  { label: "🏆 أوسكار", value: "Academy Award Oscar" },
  { label: "🌴 كان", value: "Cannes Palme d'Or" },
  { label: "🎭 بافتا", value: "BAFTA Award" },
  { label: "🌟 صندانس", value: "Sundance Film Festival" },
  { label: "🐻 برلين", value: "Berlin Golden Bear" },
  { label: "🦁 فينيسيا", value: "Venice Golden Lion" },
];

// ⑦ التصنيف العمري ───────────────────────────────────────────────────────────
export const AGE_RATINGS: Option[] = [
  { label: "الكل", value: "" },
  { label: "G (عائلي)", value: "G" },
  { label: "PG", value: "PG" },
  { label: "PG-13", value: "PG-13" },
  { label: "R (بالغون)", value: "R" },
  { label: "NR", value: "NR" },
];

// أزرار العصر السريعة لفلتر السنة
export const QUICK_ERAS = [
  { label: "🎞 كلاسيكي", from: 1950, to: 1979 },
  { label: "🕹 ريترو", from: 1980, to: 1999 },
  { label: "🌐 الألفية", from: 2000, to: 2012 },
  { label: "🚀 الحديث", from: 2013, to: 2026 },
] as const;

// خيارات المدة الزمنية
export const DURATIONS = [
  { label: "الكل", maxMins: 0 },
  { label: "قصير (−90د)", maxMins: 90 },
  { label: "عادي (−120د)", maxMins: 120 },
  { label: "ملحمي (+120د)", maxMins: 300 },
] as const;

export const RATING_OPTIONS = [0, 6, 7, 8, 8.5] as const;
export const MOVIE_COUNT_OPTIONS = [6, 10, 16, 24] as const;

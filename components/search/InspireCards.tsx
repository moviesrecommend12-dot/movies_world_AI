"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/search/InspireCards.tsx — كروت الاقتراحات الاستكشافية
// المعادل المباشر لـ _kDefaultPrompts + _kCrazyPromptBatches + _AiSuggestionCard
// في SearchScreen.dart
// ════════════════════════════════════════════════════════════════════════════
import { useState } from "react";

interface Prompt {
  title: string;
  desc: string;
  icon: string;
}

const DEFAULT_PROMPTS: Prompt[] = [
  {
    title: "سفر عبر الزمن والأبعاد",
    desc: "رجل يسافر عبر الثقوب الدودية لإنقاذ البشرية ويعود ليجد ابنته قد كبرت في السن",
    icon: "⏳",
  },
  {
    title: "سرقة داخل الأحلام",
    desc: "مجموعة من المحترفين يدخلون عقول الآخرين لسرقة أسرارهم من العقل الباطن",
    icon: "🌙",
  },
  {
    title: "الغموض والتحقيق النفسي",
    desc: "محقق يكتشف تدريجياً وبشكل بطيء ومثير أنه هو نفسه القاتل الذي يبحث عنه",
    icon: "🧠",
  },
  {
    title: "عوالم موازية ومحاكاة",
    desc: "عالم مستقبلي يكتشف فيه البشر أنهم يعيشون داخل محاكاة حاسوبية وهمية ضخمة",
    icon: "♾️",
  },
];

const CRAZY_BATCHES: Prompt[][] = [
  [
    { title: "ذكاء اصطناعي يتمرد", desc: "روبوت يكتسب مشاعر حقيقية ويقرر الهروب من مختبره لاستكشاف العالم البشري", icon: "🤖" },
    { title: "الزمن يسير عكساً", desc: "شخصية تعيش حياتها من الموت إلى الولادة وتحاول تغيير مصيرها قبل فوات الأوان", icon: "↩️" },
    { title: "مدينة تحت الماء", desc: "حضارة بشرية كاملة تعيش في قاع المحيط هربًا من كارثة سطح الأرض المدمرة", icon: "🌊" },
    { title: "لعبة فيديو حقيقية", desc: "ناجون محاصرون داخل لعبة مفتوحة العالم يبحثون عن كود الخروج قبل حذف اللعبة", icon: "🎮" },
  ],
  [
    { title: "نبوءة الفنان", desc: "رسام يكتشف أن كل لوحاته تتحول إلى أحداث حقيقية بعد 48 ساعة بالضبط", icon: "🎨" },
    { title: "جيش النمل الذكي", desc: "مستعمرة نمل تطور ذكاءً جماعياً خارقاً وتبدأ بمحاكاة السلوك البشري المعقد", icon: "🐜" },
    { title: "فندق بلا نهاية", desc: "مسافر يصل إلى فندق لا يمكن الخروج منه وكل غرفة تقود إلى عالم مختلف تماماً", icon: "🏨" },
    { title: "صوت من الكون", desc: "إشارة راديو غامضة من الفضاء تحمل تعليمات لبناء جهاز مجهول الهدف", icon: "📡" },
  ],
  [
    { title: "آخر إنسان على الأرض", desc: "شخص يستيقظ ليجد أن كل البشر اختفوا فجأة وهو وحيد تماماً على كوكب الأرض", icon: "🧍" },
    { title: "ذاكرة مستعارة", desc: "عملية طبية تسمح بزرع ذكريات شخص آخر تتسبب في أزمة هوية وجودية عميقة", icon: "💾" },
    { title: "المدينة الصامتة", desc: "مدينة يُمنع فيها الصوت كلياً وسكانها طوروا لغة إشارة سرية للتواصل", icon: "🔇" },
    { title: "بائع الأحلام", desc: "تاجر غامض يبيع أحلاماً مسجلة للأثرياء وأحد عملائه يكتشف سراً خطيراً", icon: "🛏️" },
  ],
  [
    { title: "الكوكب المرايا", desc: "بعثة فضائية تصل لكوكب يعكس لكل شخص أسوأ نسخة ممكنة منه في المستقبل", icon: "🪐" },
    { title: "متحف الأشياء المنسية", desc: "أمين متحف يكتشف أن كل قطعة معروضة تنقله لحظياً إلى ذكرى صاحبها الأصلي", icon: "🏛️" },
    { title: "قرية بلا أطفال", desc: "محقق يصل لقرية معزولة يكتشف أن كل أطفالها اختفوا في ليلة واحدة منذ عقد", icon: "🏘️" },
    { title: "الرجل الذي توقف عمره", desc: "شخص يتوقف عن التقدم بالسن فجأة في عمر الثلاثين ويعيش قروناً وسط البشر العاديين", icon: "⏱️" },
  ],
  [
    { title: "سفينة الذكريات المهجورة", desc: "سفينة فضائية تائهة يجد طاقمها أن كل غرفة فيها تعيد تجسيد ذكرى من ماضيهم", icon: "🚀" },
    { title: "النحات الذي يحيي تماثيله", desc: "نحات يكتشف أن تماثيله تنبض بالحياة ليلاً وتطلب منه إنهاء قصصها الناقصة", icon: "🗿" },
    { title: "المدرسة التي لا تُغادر", desc: "خريجون يكتشفون أن مدرستهم الثانوية تستدعيهم كل عشر سنوات لإعادة امتحان مصيري", icon: "🏫" },
    { title: "بحّار يطارد جزيرة وهمية", desc: "صياد عجوز يرى جزيرة تظهر وتختفي في البحر وكل من يصلها لا يعود كما كان", icon: "🏝️" },
  ],
  [
    { title: "السمكة التي تتكلم بالحقيقة", desc: "صياد يصطاد سمكة نادرة تتحدث وتكشف له أسراراً مظلمة عن كل من يقابله", icon: "🐟" },
    { title: "مصنع الضحكات المسروقة", desc: "شركة غامضة تستخرج الفرح من الناس وتبيعه كمنتج، وموظف يقرر كشف الحقيقة", icon: "😄" },
    { title: "الطفلة التي ترسم المستقبل", desc: "طفلة صغيرة ترسم كوارث قبل حدوثها بأيام وعائلتها تحاول إيقاف القدر", icon: "🖍️" },
    { title: "نزل في منتصف العدم", desc: "سائقو شاحنات يتوقفون في محطة وقود غامضة تقع خارج حدود الزمن والمكان", icon: "⛽" },
  ],
  [
    { title: "العاصفة التي تحمل أصواتاً", desc: "إعصار غريب يحمل في داخله أصوات أشخاص ماتوا منذ عقود يطلبون المساعدة", icon: "🌀" },
    { title: "بوابة في خزانة الجد", desc: "أحفاد يكتشفون أن خزانة جدهم القديمة بوابة سرية لحرب نسيها التاريخ", icon: "🚪" },
    { title: "موسيقي يعزف القدر", desc: "عازف كمان يكتشف أن كل قطعة يعزفها تتحكم فعلياً في مصائر من حوله", icon: "🎻" },
    { title: "المدينة المعلقة في الهواء", desc: "مدينة كاملة تطفو فوق السحاب وسكانها يخشون السقوط نحو عالم سطحي مجهول", icon: "☁️" },
  ],
  [
    { title: "صندوق بريد يصل للماضي", desc: "رجل يجد صندوق بريد قديم يرسل رسائله مباشرة إلى نفسه قبل عشرين عاماً", icon: "📮" },
    { title: "السيرك الذي لا يغلق أبداً", desc: "عائلة تنضم لسيرك متجول يكتشفون أن عروضه تتغذى على مخاوف الجمهور الحقيقية", icon: "🎪" },
    { title: "الجزيرة التي تنسى زوارها", desc: "سائحون يصلون جزيرة استوائية تمحو ذكرياتهم تدريجياً كل يوم يبقون فيه", icon: "🌴" },
    { title: "نهر يجري بالاتجاه الخطأ", desc: "قروي يلاحظ أن النهر المحلي بدأ يجري عكس اتجاهه الطبيعي منذ كسوف غريب", icon: "🏞️" },
  ],
  [
    { title: "الخريطة التي ترسم نفسها", desc: "مستكشف يجد خريطة قديمة تُضيف تفاصيل جديدة كل ليلة تقوده لمكان لا يجب الوصول إليه", icon: "🗺️" },
    { title: "البيت الذي يكبر مع أصحابه", desc: "عائلة تكتشف أن منزلهم يضيف غرفاً جديدة كل عام تعكس مرحلة حياتهم القادمة", icon: "🏠" },
    { title: "الفراشات التي تحمل أرواحاً", desc: "بيولوجية تكتشف أن فراشات نادرة تحمل وعياً بشرياً من أشخاص فقدوا أجسادهم", icon: "🦋" },
    { title: "المايسترو الذي يقود الطبيعة", desc: "موسيقي يكتشف قدرته على التحكم بالطقس عبر قيادة أوركسترا في ساحة عامة", icon: "🎼" },
  ],
  [
    { title: "القطار الذي لا توجد له محطة أخيرة", desc: "ركاب قطار ليلي يدركون أن القطار يسير منذ سنوات بلا توقف وبلا تفسير", icon: "🚂" },
    { title: "المرأة التي تحفظ كل وجه رأته", desc: "امرأة بذاكرة استثنائية تستخدم قدرتها لحل جريمة غامضة تتقاطع مع ماضيها", icon: "👁️" },
    { title: "الكوخ الذي يعيد تشكيل الزوار", desc: "مجموعة أصدقاء تصل كوخاً في الغابة يبدأ بتغيير شخصياتهم الحقيقية تدريجياً", icon: "🪵" },
    { title: "ساعة المدينة التي تتقدم وحدها", desc: "ساعة برج المدينة التاريخية تبدأ بالتقدم بسرعة غريبة وكل من يقترب منها يشيخ", icon: "🕰️" },
  ],
];

const ALL_CRAZY_COUNT = CRAZY_BATCHES.reduce((sum, b) => sum + b.length, 0);

interface InspireCardsProps {
  onPick: (desc: string) => void;
}

export default function InspireCards({ onPick }: InspireCardsProps) {
  const [batchIndex, setBatchIndex] = useState(-1);
  const prompts = batchIndex === -1 ? DEFAULT_PROMPTS : CRAZY_BATCHES[batchIndex];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-coral text-base">🧭</span>
          <span className="font-cairo text-[13px] font-semibold text-text-primary">
            أفكار ملهمة للبدء في البحث:
          </span>
        </div>
        <button
          onClick={() => setBatchIndex((i) => (i + 1) % CRAZY_BATCHES.length)}
          className="rounded-full border border-neon-pink/35 bg-neon-pink/10 px-3.5 py-1.5 font-cairo text-xs text-gold-light transition-colors hover:bg-neon-pink/20"
        >
          ألهمني بأفكار مجنونة ✨{" "}
          {batchIndex >= 0 && (
            <span className="text-[10px] opacity-70">
              ({batchIndex + 1}/{CRAZY_BATCHES.length} · {ALL_CRAZY_COUNT} فكرة)
            </span>
          )}
        </button>
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {prompts.map((p, i) => (
          <SuggestionCard key={p.title} prompt={p} delay={i * 80} onClick={() => onPick(p.desc)} />
        ))}
      </div>
    </div>
  );
}

function SuggestionCard({
  prompt,
  delay,
  onClick,
}: {
  prompt: Prompt;
  delay: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className="animate-fade-in-up group flex items-start gap-3.5 rounded-2xl border border-border/15 bg-bg-card/30 p-4 text-right transition-colors hover:border-coral/40 hover:bg-bg-card-hover/60"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-border/10 text-base transition-colors group-hover:bg-coral/15">
        {prompt.icon}
      </span>
      <div className="min-w-0">
        <p className="font-cairo text-xs font-bold text-text-primary group-hover:text-white">
          {prompt.title}
        </p>
        <p className="mt-1 line-clamp-2 font-cairo text-[11px] leading-relaxed text-text-muted">
          {prompt.desc}
        </p>
      </div>
    </button>
  );
}

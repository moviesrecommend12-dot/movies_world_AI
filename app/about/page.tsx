import Link from "next/link";

// ════════════════════════════════════════════════════════════════════════════
// app/about/page.tsx — صفحة "من نحن"
// المعادل المباشر لـ AboutUsScreen.dart
// ════════════════════════════════════════════════════════════════════════════
export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* الترويسة الكبيرة */}
      <div className="relative flex h-[260px] items-center justify-center overflow-hidden">
        <div
          className="absolute -top-12 h-[300px] w-[300px] rounded-full"
          style={{ background: "rgba(111,0,190,0.15)" }}
        />
        <div className="relative text-center">
          <h1
            className="font-sora text-[40px] font-extrabold tracking-tight sm:text-[48px]"
            style={{
              background: "linear-gradient(135deg, #ffba20, #bc8700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Movies World AI
          </h1>
          <p className="mt-3 text-base text-text-second">مستقبلك السينمائي، يُدار بالذكاء.</p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[840px] flex-1 px-6 py-8 sm:px-8">
        <SectionTitle icon="💡" title="الفكرة الجوهرية" />
        <div className="mt-4 rounded-[20px] border border-border/50 bg-bg-card/60 p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-coral/30 bg-bg-primary text-2xl text-coral">
              🔎
            </span>
            <h3 className="font-sora text-lg font-bold text-text-primary">
              وداعاً للحيرة، مرحباً بالدقة
            </h3>
          </div>
          <p className="mt-5 leading-[1.8] text-text-second">
            كم مرة قضيت ساعات في التمرير عبر المنصات دون جدوى؟ Movies World AI وُلد ليحل هذه
            المشكلة. نحن نستخدم ذكاءً اصطناعياً متطوراً لتحليل ليس فقط تصنيف الفيلم، بل روحه،
            أجوائه، وعمق قصته لنوصلك بما تريد مشاهدته بدقة مذهلة.
          </p>
        </div>

        <div className="mt-9">
          <SectionTitle icon="✨" title="سحر الذكاء الاصطناعي" />
          <div className="mt-4 rounded-[20px] border border-neon-pink/20 bg-bg-card/50 p-7 backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl text-neon-pink">🧠</span>
              <p className="mt-5 max-w-[520px] font-medium leading-[1.8] text-text-primary">
                نحن لا نبحث بالكلمات المفتاحية فقط. محركنا يغوص في الأنماط القصصية، تحليل
                المشاعر، وبناء الشخصيات ليفهم &quot;لماذا&quot; أحببت فيلماً معيناً، ثم يجد لك
                توأمه السينمائي.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-9">
          <SectionTitle icon="✓" title="لماذا Movies World AI؟" />
          <div className="mt-4 flex flex-wrap gap-3">
            <PillarChip label="تحليل عميق" icon="📊" color="#ffba20" />
            <PillarChip label="تخصيص فائق" icon="🎯" color="#00e0a4" />
            <PillarChip label="اكتشاف ذكي" icon="🧭" color="#a4c9ff" />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center text-center">
          <p className="text-base text-text-muted">جاهز لتغيير طريقتك في مشاهدة الأفلام؟</p>
          <Link
            href="/mood"
            className="mt-6 flex items-center gap-2.5 rounded-2xl px-12 py-4.5 font-cairo text-[15px] font-extrabold text-white shadow-[0_4px_20px_0_rgba(111,0,190,0.4)]"
            style={{ background: "linear-gradient(135deg, #ffba20, #bc8700)" }}
          >
            ابدأ الاستكشاف الذكي الآن
            <span>✨</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-coral text-lg">{icon}</span>
      <h2 className="font-sora text-xl font-bold text-text-primary">{title}</h2>
    </div>
  );
}

function PillarChip({ label, icon, color }: { label: string; icon: string; color: string }) {
  return (
    <span
      className="flex items-center gap-2.5 rounded-full border bg-bg-card px-4.5 py-3"
      style={{ borderColor: `${color}66` }}
    >
      <span style={{ color }}>{icon}</span>
      <span className="font-cairo text-[13px] text-text-primary">{label}</span>
    </span>
  );
}

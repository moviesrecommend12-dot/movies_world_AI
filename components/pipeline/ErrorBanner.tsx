// ════════════════════════════════════════════════════════════════════════════
// components/pipeline/ErrorBanner.tsx — كارت الأخطاء والتحذيرات
// المعادل المباشر لـ lib/widgets/ErrorBanner.dart
// ════════════════════════════════════════════════════════════════════════════
export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="animate-fade-in-up animate-shake mt-4 overflow-hidden rounded-2xl border border-coral/25 bg-coral/[0.04] shadow-[0_0_20px_1px_rgba(164,201,255,0.08)] backdrop-blur-md">
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral/12 text-coral">
          🛡
        </span>
        <div>
          <p className="font-cairo text-[11px] font-bold tracking-wide text-coral">
            إشعار من النظام / System Alert
          </p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-text-primary">{message}</p>
        </div>
      </div>
    </div>
  );
}

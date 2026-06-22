// ════════════════════════════════════════════════════════════════════════════
// components/pipeline/PipelineStatus.tsx — خط معالجة الذكاء الاصطناعي
// المعادل المباشر لـ lib/widgets/PipelineStatusWidget.dart
// ════════════════════════════════════════════════════════════════════════════
import type { PipelineStep } from "@/lib/types";

interface PipelineStatusProps {
  step: PipelineStep;
  message: string;
}

type NodeState = "upcoming" | "active" | "done" | "error";

const ORDER: PipelineStep[] = ["ai", "omdb", "done"];

function stateFor(current: PipelineStep, target: PipelineStep): NodeState {
  if (current === "error") return "error";
  const curIdx = ORDER.indexOf(current);
  const tgtIdx = ORDER.indexOf(target);
  if (tgtIdx < curIdx) return "done";
  if (tgtIdx === curIdx) return "active";
  return "upcoming";
}

const STEPS: { target: PipelineStep; label: string; subtitle: string }[] = [
  { target: "ai", label: "المرحلة 1 · AI", subtitle: "توليد واقتراح عناوين الأفلام بدقة ذكية" },
  { target: "omdb", label: "المرحلة 2 · IMDb Engine", subtitle: "جلب البوسترات، التقييمات والمعلومات السينمائية" },
  { target: "done", label: "المرحلة 3 · Render Engine", subtitle: "بناء وتجهيز منصة العرض السينمائية المخصصة" },
];

export default function PipelineStatus({ step, message }: PipelineStatusProps) {
  if (step === "idle") return null;
  const isError = step === "error";

  return (
    <div className="animate-fade-in-up mt-4 rounded-2xl border border-border/20 bg-bg-card/40 p-5 backdrop-blur-md">
      {/* رأس اللوحة */}
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            isError ? "bg-coral/10 text-coral" : "bg-coral/10 text-coral"
          }`}
        >
          {isError ? "⚠" : "⚙"}
        </span>
        <h3 className="font-sora text-sm font-bold text-text-primary">
          {isError ? "توقفت العملية" : "جاري معالجة طلبك ذكياً"}
        </h3>
      </div>

      {/* الخط الزمني */}
      <div className="mt-6 flex flex-col">
        {STEPS.map((s, i) => {
          const state = stateFor(step, s.target);
          const isLast = i === STEPS.length - 1;
          return (
            <div key={s.target} className="flex items-stretch gap-4">
              <div className="flex flex-col items-center">
                <Node state={state} />
                {!isLast && (
                  <div
                    className={`mt-1 mb-1 w-0.5 flex-1 ${
                      state === "done" ? "bg-success" : "bg-border/40"
                    }`}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={`text-xs ${
                    state === "active" ? "font-bold text-text-primary" : "text-text-second"
                  } ${state === "error" ? "text-coral" : ""}`}
                >
                  {s.label}
                </p>
                <p
                  className={`mt-0.5 text-[10px] ${
                    state === "upcoming" ? "text-text-muted" : "text-text-second"
                  }`}
                >
                  {s.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-3">
          <p className={`flex-1 text-[11px] ${isError ? "text-coral" : "text-text-second"}`}>
            {message}
          </p>
          {!isError && step !== "done" && (
            <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-coral border-t-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}

function Node({ state }: { state: NodeState }) {
  if (state === "done") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-[9px] text-white">
        ✓
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="flex h-4 w-4 items-center justify-center">
        <span className="pulse-neon-dot h-2.5 w-2.5 rounded-full bg-coral" />
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[9px] text-white">
        ✕
      </span>
    );
  }
  return <span className="h-4 w-4 rounded-full border-2 border-border bg-bg-primary" />;
}

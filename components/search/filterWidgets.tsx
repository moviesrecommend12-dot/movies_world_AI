"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/search/filterWidgets.tsx — عناصر واجهة صغيرة قابلة لإعادة الاستخدام
// المعادل المباشر للـ private widgets (_FilterChip, _segBtn, _DurationChip,
// _QuickEraButton, _buildAccordion, _buildDropdown...) في AdvancedSearchScreen.dart
// ════════════════════════════════════════════════════════════════════════════
import { useState, type ReactNode } from "react";

export function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-cairo text-[12px] font-medium transition-colors ${
        selected
          ? "border-coral bg-coral/15 text-coral"
          : "border-border/40 bg-bg-primary text-text-second hover:border-border"
      }`}
    >
      {label}
    </button>
  );
}

export function SegButton<T extends string>({
  label,
  value,
  current,
  onSelect,
}: {
  label: string;
  value: T;
  current: T;
  onSelect: (v: T) => void;
}) {
  const selected = value === current;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`flex-1 rounded-[10px] border px-3 py-2 font-cairo text-[12.5px] font-semibold transition-colors ${
        selected
          ? "border-coral bg-coral/15 text-coral"
          : "border-border/40 bg-bg-primary text-text-second"
      }`}
    >
      {label}
    </button>
  );
}

export function SegButtonNumber({
  label,
  value,
  current,
  onSelect,
}: {
  label: string;
  value: number;
  current: number;
  onSelect: (v: number) => void;
}) {
  const selected = value === current;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`rounded-lg border px-2.5 py-1.5 font-cairo text-[12px] font-semibold transition-colors ${
        selected
          ? "border-coral bg-coral/15 text-coral"
          : "border-border/40 bg-bg-primary text-text-second"
      }`}
    >
      {label}
    </button>
  );
}

export function DurationChip({
  label,
  maxMins,
  current,
  onSelect,
}: {
  label: string;
  maxMins: number;
  current: number;
  onSelect: (v: number) => void;
}) {
  const selected = maxMins === current;
  return (
    <button
      onClick={() => onSelect(maxMins)}
      className={`rounded-full border px-3 py-1.5 font-cairo text-[12px] font-medium transition-colors ${
        selected
          ? "border-coral bg-coral/15 text-coral"
          : "border-border/40 bg-bg-primary text-text-second"
      }`}
    >
      {label}
    </button>
  );
}

export function QuickEraButton({
  label,
  from,
  to,
  active,
  onSelect,
}: {
  label: string;
  from: number;
  to: number;
  active: boolean;
  onSelect: (from: number, to: number) => void;
}) {
  return (
    <button
      onClick={() => onSelect(from, to)}
      className={`rounded-lg border px-2.5 py-1.5 font-cairo text-[11px] font-medium transition-colors ${
        active
          ? "border-coral bg-coral/15 text-coral"
          : "border-border/40 bg-bg-primary text-text-muted"
      }`}
    >
      {label}
    </button>
  );
}

export function CountBadge({ count }: { count: number }) {
  return (
    <span className="rounded-full border border-coral/50 bg-coral/15 px-2 py-0.5 text-[11px] font-bold text-coral">
      {count}
    </span>
  );
}

export function FilterLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold text-text-muted">{children}</p>;
}

export function Dropdown({
  value,
  items,
  onChange,
}: {
  value: string;
  items: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[10px] border border-border/40 bg-bg-primary px-3 py-2.5 font-cairo text-[13px] text-text-primary outline-none focus:border-coral"
    >
      {items.map((item) => (
        <option key={item.value} value={item.value} className="bg-bg-primary">
          {item.label}
        </option>
      ))}
    </select>
  );
}

interface AccordionProps {
  icon: string;
  title: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Accordion({ icon, title, badge, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/25 py-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-right"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-coral text-[15px]">{icon}</span>
          <span className="font-cairo text-[13px] font-bold text-text-primary">{title}</span>
          {badge}
        </span>
        <span
          className={`text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>
      <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

"use client";

// ════════════════════════════════════════════════════════════════════════════
// components/layout/Header.tsx — شريط العنوان + اللوغو + التنقل بين الصفحات
// ════════════════════════════════════════════════════════════════════════════
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "بحث بالقصة", icon: "✨" },
  { href: "/mood", label: "البحث بالمود", icon: "🎭" },
  { href: "/about", label: "من نحن", icon: "ℹ" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/20 bg-bg-primary/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="Movies World AI"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-sora text-[15px] font-bold text-text-primary">
            Movies <span className="text-coral">World</span> AI
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-border/30 bg-bg-card/40 p-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-cairo text-[12.5px] font-semibold transition-colors sm:px-4 ${
                  active
                    ? "bg-coral text-bg-primary"
                    : "text-text-second hover:text-text-primary"
                }`}
              >
                <span className="text-[12px]">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

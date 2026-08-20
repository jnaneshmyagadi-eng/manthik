"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "today", label: "Today" },
  { href: "overview", label: "Overview" },
  { href: "intelligence", label: "Intelligence" },
  { href: "opportunities", label: "Opportunities" },
  { href: "strategy", label: "Strategy" },
  { href: "content", label: "Content" },
  { href: "experiments", label: "Experiments" },
  { href: "settings", label: "Settings" },
];

export function AppNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/app/projects/${projectId}`;

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 text-sm border-b border-[var(--border)] mb-6">
      {links.map((l) => {
        const href = `${base}/${l.href}`;
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={l.href}
            href={href}
            className={cn(
              "whitespace-nowrap px-3 py-2 rounded-md transition-colors",
              active
                ? "bg-[var(--card)] text-[var(--foreground)] font-medium"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

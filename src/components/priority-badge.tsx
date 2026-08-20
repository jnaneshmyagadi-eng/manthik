import { cn } from "@/lib/utils";

export function PriorityBadge({ priority }: { priority: string }) {
  const p = priority?.toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        p === "HIGH" && "bg-emerald-500/15 text-emerald-400",
        p === "MEDIUM" && "bg-amber-500/15 text-amber-400",
        p === "LOW" && "bg-zinc-500/15 text-zinc-400"
      )}
    >
      {p}
    </span>
  );
}

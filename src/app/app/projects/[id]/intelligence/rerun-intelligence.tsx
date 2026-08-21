"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RerunIntelligence({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMsg(null);
    const res = await fetch(`/api/projects/${projectId}/intelligence`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    setMsg(data.source === "failed" ? "Fetch failed — see Product section" : "Updated");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--accent)] disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Re-run analysis"}
      </button>
      {msg && <span className="text-[10px] text-[var(--muted)]">{msg}</span>}
    </div>
  );
}

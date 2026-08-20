"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContentActions({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Generate failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={generate}
        className="rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--accent-fg)] disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate drafts"}
      </button>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}

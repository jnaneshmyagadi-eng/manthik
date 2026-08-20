"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContentStatusButtons({
  projectId,
  itemId,
  status,
}: { projectId: string; itemId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: string) {
    setLoading(true);
    await fetch(`/api/projects/${projectId}/content/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-1 shrink-0">
      {status !== "published" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("published")}
          className="text-[10px] rounded border border-[var(--border)] px-2 py-1 hover:bg-[var(--background)] disabled:opacity-50"
        >
          Mark published
        </button>
      )}
      {status !== "ready" && status !== "published" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("ready")}
          className="text-[10px] rounded border border-[var(--border)] px-2 py-1 hover:bg-[var(--background)] disabled:opacity-50"
        >
          Ready
        </button>
      )}
    </div>
  );
}

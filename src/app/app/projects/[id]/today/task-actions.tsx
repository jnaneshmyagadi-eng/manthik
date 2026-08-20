"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TaskActions({
  projectId,
  taskId,
  status,
}: {
  projectId: string;
  taskId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: string) {
    setLoading(true);
    await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    router.refresh();
  }

  if (status === "done") {
    return (
      <span className="text-xs font-medium text-emerald-400 shrink-0">Done</span>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => setStatus("done")}
      className="shrink-0 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs hover:bg-[var(--background)] disabled:opacity-50"
    >
      {loading ? "…" : "Mark done"}
    </button>
  );
}

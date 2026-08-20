"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ExperimentControls({
  projectId,
  expId,
  status,
  result,
}: {
  projectId: string;
  expId: string;
  status: string;
  result: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    await fetch(`/api/projects/${projectId}/experiments/${expId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1 items-end shrink-0">
      {status === "draft" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => patch({ status: "running" })}
          className="text-[10px] rounded border border-[var(--border)] px-2 py-1 disabled:opacity-50"
        >
          Start
        </button>
      )}
      {status === "running" && (
        <>
          <button
            type="button"
            disabled={loading}
            onClick={() => patch({ status: "completed", result: "win" })}
            className="text-[10px] rounded border border-emerald-500/40 px-2 py-1 text-emerald-400 disabled:opacity-50"
          >
            Win
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => patch({ status: "completed", result: "loss" })}
            className="text-[10px] rounded border border-[var(--border)] px-2 py-1 disabled:opacity-50"
          >
            Loss
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => patch({ status: "completed", result: "inconclusive" })}
            className="text-[10px] rounded border border-[var(--border)] px-2 py-1 disabled:opacity-50"
          >
            Inconclusive
          </button>
        </>
      )}
      {result && <span className="text-[10px] text-[var(--muted)]">Logged</span>}
    </div>
  );
}

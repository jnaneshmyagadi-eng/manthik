"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ExperimentForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [channel, setChannel] = useState("");
  const [metric, setMetric] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/experiments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, hypothesis, channel: channel || undefined, metric: metric || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not create");
      return;
    }
    setName("");
    setHypothesis("");
    setChannel("");
    setMetric("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-[var(--border)] px-3.5 py-2 text-sm hover:bg-[var(--card)]"
      >
        New experiment
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
      <input
        required
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
      />
      <textarea
        required
        rows={2}
        placeholder="Hypothesis"
        value={hypothesis}
        onChange={(e) => setHypothesis(e.target.value)}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Channel (optional)"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <input
          placeholder="Primary metric"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--accent-fg)] disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save draft"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-[var(--muted)] px-2">
          Cancel
        </button>
      </div>
    </form>
  );
}

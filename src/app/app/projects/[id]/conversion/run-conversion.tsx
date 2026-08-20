"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RunConversionButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/projects/${projectId}/conversion`, { method: "POST" });
        setLoading(false);
        router.refresh();
      }}
      className="rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--accent-fg)] disabled:opacity-60"
    >
      {loading ? "Analyzing…" : "Run analysis"}
    </button>
  );
}

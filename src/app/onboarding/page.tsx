"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const stages = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "launched", label: "Launched" },
  { value: "growing", label: "Growing" },
  { value: "scaling", label: "Scaling" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    product_url: "",
    description: "",
    target_market: "",
    current_stage: "mvp",
    current_users: 0,
    main_goal: "Get my first 1,000 users",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        product_url: form.product_url || undefined,
        current_users: Number(form.current_users) || 0,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not create project");
      return;
    }
    router.push(`/app/projects/${data.project.id}/today`);
    router.refresh();
  }

  return (
    <main className="min-h-screen px-4 py-12 max-w-lg mx-auto">
      <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">Step 1</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create a Growth Project</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Manthik will build your Growth Intelligence profile automatically.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Field label="Product name" required>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. OpinionX"
            className="input"
          />
        </Field>
        <Field label="Product URL">
          <input
            type="url"
            value={form.product_url}
            onChange={(e) => setForm({ ...form, product_url: e.target.value })}
            placeholder="https://…"
            className="input"
          />
        </Field>
        <Field label="Short description">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does it do and for whom?"
            className="input"
          />
        </Field>
        <Field label="Target market">
          <input
            value={form.target_market}
            onChange={(e) => setForm({ ...form, target_market: e.target.value })}
            placeholder="e.g. indie SaaS founders"
            className="input"
          />
        </Field>
        <Field label="Current stage">
          <select
            value={form.current_stage}
            onChange={(e) => setForm({ ...form, current_stage: e.target.value })}
            className="input"
          >
            {stages.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Current users / customers">
          <input
            type="number"
            min={0}
            value={form.current_users}
            onChange={(e) => setForm({ ...form, current_users: Number(e.target.value) })}
            className="input"
          />
        </Field>
        <Field label="Main goal">
          <input
            value={form.main_goal}
            onChange={(e) => setForm({ ...form, main_goal: e.target.value })}
            placeholder="Get my first 1,000 users"
            className="input"
          />
        </Field>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent)] py-3 text-sm font-medium text-[var(--accent-fg)] disabled:opacity-60"
        >
          {loading ? "Building intelligence…" : "Build Growth Intelligence"}
        </button>
      </form>

      <style jsx>{`
        .input {
          margin-top: 0.25rem;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--card);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          box-shadow: 0 0 0 2px var(--accent);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-[var(--muted)]">
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}

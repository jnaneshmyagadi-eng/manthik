import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DemoBanner } from "@/components/demo-banner";
import { RunConversionButton } from "./run-conversion";

export default async function ConversionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, memory")
    .eq("id", id)
    .single();
  if (!project) notFound();

  const memory = (project.memory as Record<string, unknown>) || {};
  const report = memory.conversion as
    | {
        conversion_score: number;
        summary: string;
        headline: { recommendation: string };
        cta: { recommendation: string };
        trust: { recommendation: string };
        onboarding: { recommendation: string };
        experiments: string[];
      }
    | undefined;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Conversion</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Score, CTA, and onboarding friction — demo analysis until live AI is enabled.
          </p>
        </div>
        <RunConversionButton projectId={id} />
      </div>
      <DemoBanner show />

      {!report ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
          Run conversion analysis to get a score and recommendations.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 flex items-center gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Conversion score</div>
              <div className="text-3xl font-semibold tabular-nums">{report.conversion_score}</div>
            </div>
            <p className="text-sm text-[var(--muted)] flex-1">{report.summary}</p>
          </div>
          {[
            { t: "Headline", d: report.headline.recommendation },
            { t: "CTA", d: report.cta.recommendation },
            { t: "Trust", d: report.trust.recommendation },
            { t: "Onboarding", d: report.onboarding.recommendation },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
              <h2 className="font-medium">{x.t}</h2>
              <p className="mt-1 text-[var(--muted)]">{x.d}</p>
            </div>
          ))}
          {report.experiments?.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
              <h2 className="font-medium">Suggested experiments</h2>
              <ul className="mt-2 list-disc pl-4 text-[var(--muted)] space-y-1">
                {report.experiments.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import {
  demoProductIntelligence,
  demoCustomerSegments,
  demoCompetitors,
  demoOpportunities,
  demoDailyTasks,
  demoStrategy,
} from "./demo-intelligence";
import { isLiveAI } from "./provider";
import { fetchPageSignals } from "@/lib/intelligence/fetch-page";
import {
  analyzeFromPage,
  deriveSegments,
  deriveCompetitorsFromPage,
  deriveOpportunities,
  deriveDailyTasks,
  deriveStrategy,
} from "@/lib/intelligence/analyze-product";

export type ProjectInput = {
  id: string;
  name: string;
  product_url?: string | null;
  description?: string | null;
  target_market?: string | null;
  main_goal?: string | null;
};

/**
 * GrowthOrchestrator — runs the intelligence pipeline.
 * When product_url is present: live page fetch + structured analysis.
 * Demo generators only when no URL and no page data.
 */
export async function runFullIntelligence(project: ProjectInput) {
  const supabase = await createClient();
  const liveAI = isLiveAI();
  let usedDemo = false;
  let analysisSource = "demo";

  let product: ReturnType<typeof demoProductIntelligence> & {
    category?: string | null;
    raw_analysis?: Record<string, unknown>;
  };
  let segments: ReturnType<typeof demoCustomerSegments>;
  let competitors: ReturnType<typeof demoCompetitors>;
  let opps: ReturnType<typeof demoOpportunities>;
  let strategy: ReturnType<typeof demoStrategy>;
  let tasks: ReturnType<typeof demoDailyTasks>;

  if (project.product_url) {
    const signals = await fetchPageSignals(project.product_url);
    const analysis = analyzeFromPage(signals, {
      name: project.name,
      description: project.description,
      target_market: project.target_market,
      main_goal: project.main_goal,
    });
    analysisSource = analysis.source;
    usedDemo = analysis.source === "demo";

    product = {
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      positioning: analysis.positioning,
      conversion_problems: analysis.conversion_problems,
      opportunities: analysis.opportunities,
      confidence: analysis.confidence,
      source: analysis.source as "demo",
      category: analysis.category,
      raw_analysis: {
        ...analysis.raw,
        cta: analysis.cta,
        pricing_public: analysis.pricing_public,
        target_audience_signals: analysis.target_audience_signals,
        fetch_ok: signals.ok,
        fetch_error: signals.error || null,
      },
    };

    segments = deriveSegments(analysis, project) as unknown as ReturnType<
      typeof demoCustomerSegments
    >;
    competitors = deriveCompetitorsFromPage(analysis, project.name) as unknown as ReturnType<
      typeof demoCompetitors
    >;
    opps = deriveOpportunities(analysis, project) as unknown as ReturnType<
      typeof demoOpportunities
    >;
    strategy = deriveStrategy(analysis, opps as unknown as Parameters<typeof deriveStrategy>[1], project) as unknown as ReturnType<
      typeof demoStrategy
    >;
    tasks = deriveDailyTasks(
      analysis,
      opps as unknown as Parameters<typeof deriveDailyTasks>[1],
      project
    ) as unknown as ReturnType<typeof demoDailyTasks>;
  } else {
    usedDemo = true;
    product = demoProductIntelligence({
      name: project.name,
      url: project.product_url,
      description: project.description,
      goal: project.main_goal,
    });
    segments = demoCustomerSegments(project);
    competitors = demoCompetitors(project);
    opps = demoOpportunities({ name: project.name, goal: project.main_goal });
    strategy = demoStrategy({ name: project.name, goal: project.main_goal });
    tasks = demoDailyTasks({ name: project.name, goal: project.main_goal });
  }

  // Clear prior generated intel for re-runs (same project)
  await supabase.from("growth_tasks").delete().eq("project_id", project.id);
  await supabase.from("daily_plans").delete().eq("project_id", project.id);
  await supabase.from("opportunities").delete().eq("project_id", project.id);
  await supabase.from("growth_strategies").delete().eq("project_id", project.id);
  await supabase.from("competitors").delete().eq("project_id", project.id);
  await supabase.from("customer_segments").delete().eq("project_id", project.id);
  await supabase.from("product_intelligence").delete().eq("project_id", project.id);

  await supabase.from("product_intelligence").insert({
    project_id: project.id,
    summary: product.summary,
    strengths: product.strengths,
    weaknesses: product.weaknesses,
    positioning: product.positioning,
    conversion_problems: product.conversion_problems,
    opportunities: product.opportunities,
    confidence: product.confidence,
    source: product.source,
    raw_analysis: product.raw_analysis || null,
  });

  for (const s of segments) {
    await supabase.from("customer_segments").insert({
      project_id: project.id,
      name: s.name,
      description: s.description,
      jobs_to_be_done: s.jobs_to_be_done,
      pain_points: s.pain_points,
      objections: s.objections,
      motivations: s.motivations,
      buying_triggers: s.buying_triggers,
      language_cues: s.language_cues,
      messaging_angles: s.messaging_angles,
      rank: s.rank,
      fit_score: s.fit_score,
      source: s.source,
    });
  }

  for (const c of competitors) {
    await supabase.from("competitors").insert({
      project_id: project.id,
      name: c.name,
      url: c.url,
      positioning: c.positioning,
      pricing_summary: c.pricing_summary,
      features: c.features,
      audience: c.audience,
      acquisition_channels: c.acquisition_channels,
      strengths: c.strengths,
      weaknesses: c.weaknesses,
      differentiation_opportunities: c.differentiation_opportunities,
      source: c.source,
    });
  }

  for (const o of opps) {
    await supabase.from("opportunities").insert({
      project_id: project.id,
      title: o.title,
      description: o.description,
      channel: o.channel,
      opportunity_score: o.opportunity_score,
      priority: o.priority,
      audience_fit: o.audience_fit,
      demand: o.demand,
      competition: o.competition,
      effort: o.effort,
      cost: o.cost,
      speed: o.speed,
      expected_impact: o.expected_impact,
      confidence: o.confidence,
      evidence: o.evidence,
      recommended_actions: o.recommended_actions,
      status: o.status,
      source: o.source,
    });
  }

  await supabase.from("growth_strategies").insert({
    project_id: project.id,
    goal: strategy.goal,
    timeline_days: strategy.timeline_days,
    weekly_plan: strategy.weekly_plan,
    key_channels: strategy.key_channels,
    success_metrics: strategy.success_metrics,
    status: "active",
    source: strategy.source,
  });

  const today = new Date().toISOString().slice(0, 10);
  const { data: plan } = await supabase
    .from("daily_plans")
    .insert({
      project_id: project.id,
      plan_date: today,
      summary: tasks[0]
        ? `Today: ${tasks[0].title}`
        : `Growth plan for ${project.name}`,
    })
    .select("id")
    .single();

  for (const t of tasks) {
    await supabase.from("growth_tasks").insert({
      project_id: project.id,
      daily_plan_id: plan?.id ?? null,
      title: t.title,
      why: t.why,
      expected_outcome: t.expected_outcome,
      difficulty: t.difficulty,
      estimated_minutes: t.estimated_minutes,
      channel: t.channel,
      cta: t.cta,
      impact: t.impact,
      status: "todo",
      sort_order: t.sort_order,
    });
  }

  const score = Math.round(
    30 +
      (product.confidence || 0.4) * 40 +
      Math.min(opps.length, 5) * 4 +
      (competitors.length ? 5 : 0)
  );

  await supabase
    .from("projects")
    .update({
      growth_score: Math.min(score, 92),
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", project.id);

  await supabase.from("ai_runs").insert({
    project_id: project.id,
    agent: "GrowthOrchestrator",
    status: "completed",
    is_demo: usedDemo && !project.product_url,
    output: {
      mode: project.product_url ? "page-analysis" : usedDemo ? "demo" : "live",
      source: analysisSource,
      liveAI,
      agents: ["Product", "Customer", "Competitor", "Opportunity", "Strategy", "Daily"],
      competitors_found: competitors.length,
    },
    completed_at: new Date().toISOString(),
  });

  await supabase.from("ai_insights").insert({
    project_id: project.id,
    category: "product_intelligence",
    title: project.product_url ? "Live page analysis completed" : "Demo intelligence generated",
    body: product.summary.slice(0, 500),
    priority: 1,
    metadata: { source: analysisSource },
  });

  return { demo: usedDemo && !project.product_url, source: analysisSource };
}

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
 * Demo mode when no AI key; live mode later with same interface.
 */
export async function runFullIntelligence(project: ProjectInput) {
  const supabase = await createClient();
  const demo = !isLiveAI();

  // 1. Product Intelligence
  const product = demoProductIntelligence(project);
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
  });

  // 2. Customer segments
  const segments = demoCustomerSegments(project);
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

  // 3. Competitors
  const competitors = demoCompetitors(project);
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

  // 4. Opportunities
  const opps = demoOpportunities(project);
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

  // 5. Strategy
  const strategy = demoStrategy(project);
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

  // 6. Today's plan + tasks
  const today = new Date().toISOString().slice(0, 10);
  const { data: plan } = await supabase
    .from("daily_plans")
    .insert({
      project_id: project.id,
      plan_date: today,
      summary: `Focus on positioning clarity and high-signal distribution for ${project.name}.`,
    })
    .select("id")
    .single();

  const tasks = demoDailyTasks(project);
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

  // Update project score (demo baseline)
  await supabase
    .from("projects")
    .update({ growth_score: 42, status: "active", updated_at: new Date().toISOString() })
    .eq("id", project.id);

  await supabase.from("ai_runs").insert({
    project_id: project.id,
    agent: "GrowthOrchestrator",
    status: "completed",
    is_demo: demo,
    output: { mode: demo ? "demo" : "live", agents: ["Product", "Customer", "Competitor", "Opportunity", "Strategy", "Daily"] },
    completed_at: new Date().toISOString(),
  });

  return { demo };
}

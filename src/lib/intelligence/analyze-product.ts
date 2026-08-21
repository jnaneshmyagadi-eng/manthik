import type { PageSignals } from "./fetch-page";

export type ProductAnalysis = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  positioning: string;
  conversion_problems: string[];
  opportunities: string[];
  confidence: number;
  source: "page" | "page+heuristic" | "demo" | "failed";
  category: string | null;
  target_audience_signals: string[];
  cta: string | null;
  pricing_public: string | null;
  raw: Record<string, unknown>;
};

export type DerivedSegment = {
  name: string;
  description: string;
  jobs_to_be_done: string[];
  pain_points: string[];
  objections: string[];
  motivations: string[];
  buying_triggers: string[];
  language_cues: string[];
  messaging_angles: string[];
  rank: number;
  fit_score: number;
  source: string;
};

export type DerivedOpportunity = {
  title: string;
  description: string;
  channel: string;
  opportunity_score: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  audience_fit: number;
  demand: number;
  competition: number;
  effort: number;
  cost: number;
  speed: number;
  expected_impact: number;
  confidence: number;
  evidence: string[];
  recommended_actions: string[];
  status: string;
  source: string;
};

export type DerivedTask = {
  title: string;
  why: string;
  expected_outcome: string;
  difficulty: "easy" | "medium" | "hard";
  estimated_minutes: number;
  channel: string;
  cta: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  sort_order: number;
};

export function analyzeFromPage(
  signals: PageSignals,
  project: {
    name: string;
    description?: string | null;
    target_market?: string | null;
    main_goal?: string | null;
  }
): ProductAnalysis {
  if (!signals.ok) {
    return {
      summary: `Could not analyze ${project.name}: ${signals.error || "unknown error"}. Add a reachable public product URL or a longer description and re-run intelligence.`,
      strengths: project.description
        ? ["Founder provided a product description"]
        : [],
      weaknesses: [
        "Website could not be fetched",
        signals.error || "Fetch failed",
      ],
      positioning: project.description || "Unknown — page unavailable",
      conversion_problems: ["Cannot assess conversion without a live page"],
      opportunities: ["Fix URL accessibility or paste a richer product description"],
      confidence: 0.15,
      source: "failed",
      category: null,
      target_audience_signals: project.target_market ? [project.target_market] : [],
      cta: null,
      pricing_public: null,
      raw: { error: signals.error, status: signals.status },
    };
  }

  const headline = signals.h1[0] || signals.ogTitle || signals.title || project.name;
  const desc =
    signals.description ||
    signals.ogDescription ||
    project.description ||
    "";

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const conversion_problems: string[] = [];
  const opportunities: string[] = [];

  if (headline) strengths.push(`Clear primary message: "${headline.slice(0, 120)}"`);
  if (desc) strengths.push("Meta/description present for SEO and sharing");
  if (signals.hasSocialProof) strengths.push("Social proof signals detected on page");
  if (signals.hasPricingSection || signals.pricingSignals.length)
    strengths.push("Pricing information appears publicly available");
  if (signals.ctaCandidates.length)
    strengths.push(`CTA language found: ${signals.ctaCandidates.slice(0, 3).join(", ")}`);
  if (signals.featureCandidates.length >= 3)
    strengths.push("Multiple feature/section headings present");

  if (!desc) weaknesses.push("Missing or weak meta description");
  if (!signals.h1.length) weaknesses.push("No H1 detected — hierarchy may hurt clarity and SEO");
  if (signals.ctaCandidates.length === 0)
    weaknesses.push("No strong CTA phrases detected above typical conversion patterns");
  if (!signals.hasSocialProof) weaknesses.push("Limited social proof (testimonials/logos/user counts)");
  if (!signals.hasPricingSection && !signals.pricingSignals.length)
    weaknesses.push("Pricing not clearly visible — can increase friction for ready buyers");
  if (signals.wordCount < 120)
    weaknesses.push("Very thin on-page copy — may under-explain value");
  if (signals.wordCount > 3500)
    weaknesses.push("Long page — risk of diluted message without clear hierarchy");

  if (signals.ctaCandidates.length === 0)
    conversion_problems.push("Primary CTA is unclear or weak");
  if (!signals.hasSignupForm && !signals.ctaCandidates.length)
    conversion_problems.push("No obvious signup/start path detected");
  if (!signals.hasSocialProof)
    conversion_problems.push("Trust signals may be insufficient near conversion points");
  if (!signals.hasPricingSection)
    conversion_problems.push("Pricing visibility may force an extra step before commitment");

  if (!signals.hasSocialProof)
    opportunities.push("Add concrete social proof near the primary CTA");
  if (signals.ctaCandidates.length <= 1)
    opportunities.push("Test a more outcome-led hero CTA");
  if (!signals.hasPricingSection)
    opportunities.push("Surface a simple pricing anchor or ‘from $X’ signal");
  opportunities.push("Ship comparison or alternative pages for high-intent SEO");
  opportunities.push("Founder-led distribution on channels where ICP already talks");

  const category = guessCategory(headline + " " + desc + " " + project.description);
  const audienceSignals: string[] = [];
  if (project.target_market) audienceSignals.push(project.target_market);
  const audienceHints =
    bodyAudienceHints(signals.bodyTextSample + " " + desc + " " + (project.description || ""));
  audienceSignals.push(...audienceHints);

  const confidence = Math.min(
    0.85,
    0.35 +
      (headline ? 0.1 : 0) +
      (desc ? 0.1 : 0) +
      (signals.ctaCandidates.length ? 0.08 : 0) +
      (signals.featureCandidates.length ? 0.07 : 0) +
      (signals.wordCount > 200 ? 0.1 : 0)
  );

  return {
    summary: `${project.name} — live page analysis of ${signals.finalUrl}. Primary message: "${headline}". ${desc ? desc.slice(0, 220) : "No meta description found."} Analysis is based on publicly fetched HTML signals, not invented claims.`,
    strengths: strengths.slice(0, 8),
    weaknesses: weaknesses.slice(0, 8),
    positioning: desc || headline || project.description || "Positioning not extractable from page",
    conversion_problems: conversion_problems.slice(0, 6),
    opportunities: opportunities.slice(0, 8),
    confidence,
    source: "page+heuristic",
    category,
    target_audience_signals: [...new Set(audienceSignals)].slice(0, 6),
    cta: signals.ctaCandidates[0] || null,
    pricing_public: signals.pricingSignals.slice(0, 5).join("; ") || null,
    raw: {
      title: signals.title,
      h1: signals.h1,
      h2: signals.h2.slice(0, 12),
      ctas: signals.ctaCandidates,
      pricing: signals.pricingSignals,
      features: signals.featureCandidates,
      wordCount: signals.wordCount,
      hasSignupForm: signals.hasSignupForm,
      hasSocialProof: signals.hasSocialProof,
      hasPricingSection: signals.hasPricingSection,
      competitorMentions: signals.competitorMentions,
      finalUrl: signals.finalUrl,
    },
  };
}

function guessCategory(text: string): string | null {
  const t = text.toLowerCase();
  if (/saas|software|platform|dashboard|api/.test(t)) return "SaaS / software";
  if (/agency|marketing|consult/.test(t)) return "Services / agency";
  if (/course|community|creator|newsletter/.test(t)) return "Creator / education";
  if (/ecommerce|shop|store|buy now/.test(t)) return "E-commerce";
  if (/ai|artificial intelligence|gpt|llm/.test(t)) return "AI product";
  return "Digital product";
}

function bodyAudienceHints(text: string): string[] {
  const t = text.toLowerCase();
  const out: string[] = [];
  if (/founder|startup|indie/.test(t)) out.push("Startup founders / indie builders");
  if (/marketer|marketing team/.test(t)) out.push("Marketers");
  if (/developer|engineer|api/.test(t)) out.push("Developers");
  if (/agency/.test(t)) out.push("Agencies");
  if (/creator|youtube|newsletter/.test(t)) out.push("Creators");
  if (/enterprise|compliance/.test(t)) out.push("Enterprise teams");
  return out;
}

export function deriveSegments(
  analysis: ProductAnalysis,
  project: { name: string; target_market?: string | null }
): DerivedSegment[] {
  const primary =
    project.target_market ||
    analysis.target_audience_signals[0] ||
    "Early adopters evaluating this product";

  const segments: DerivedSegment[] = [
    {
      name: primary,
      description: `Primary ICP inferred from project inputs and page language for ${project.name}.`,
      jobs_to_be_done: [
        "Solve the core problem described on the product page",
        "Evaluate fit quickly without a long sales cycle",
      ],
      pain_points: analysis.weaknesses.slice(0, 3).length
        ? analysis.weaknesses.slice(0, 3)
        : ["Unclear path from awareness to activation"],
      objections: analysis.conversion_problems.slice(0, 2),
      motivations: ["Speed", "Clarity", "Measurable outcome"],
      buying_triggers: ["Active pain", "Peer recommendation", "Clear before/after"],
      language_cues: analysis.raw.h1
        ? (analysis.raw.h1 as string[]).slice(0, 3)
        : [project.name],
      messaging_angles: [
        analysis.positioning.slice(0, 160),
        analysis.cta ? `Lead with CTA language: ${analysis.cta}` : "Lead with outcome, not features",
      ],
      rank: 1,
      fit_score: 0.75,
      source: analysis.source,
    },
  ];

  if (analysis.target_audience_signals[1]) {
    segments.push({
      name: analysis.target_audience_signals[1],
      description: "Secondary audience signal from on-page language.",
      jobs_to_be_done: ["Compare options", "Justify adoption"],
      pain_points: ["Too many generic tools", "Hard to prioritize growth work"],
      objections: ["Switching cost", "Unproven ROI"],
      motivations: ["Team alignment", "Efficiency"],
      buying_triggers: ["Missed targets", "New initiative"],
      language_cues: [],
      messaging_angles: ["Make the next action obvious"],
      rank: 2,
      fit_score: 0.6,
      source: analysis.source,
    });
  }

  return segments;
}

export function deriveCompetitorsFromPage(
  analysis: ProductAnalysis,
  projectName: string
): {
  name: string;
  url: string | null;
  positioning: string;
  pricing_summary: string | null;
  features: string[];
  audience: string | null;
  acquisition_channels: string[];
  strengths: string[];
  weaknesses: string[];
  differentiation_opportunities: string[];
  source: string;
}[] {
  const mentions = (analysis.raw.competitorMentions as string[]) || [];
  if (!mentions.length) {
    // Do not invent competitors. Return empty — UI should explain.
    return [];
  }
  return mentions.slice(0, 5).map((m) => ({
    name: m,
    url: null,
    positioning: `Mentioned on ${projectName}'s page (comparison/alternative language).`,
    pricing_summary: null,
    features: [],
    audience: null,
    acquisition_channels: [],
    strengths: ["Visible enough to be referenced on the product page"],
    weaknesses: ["Details not fetched — no invented claims"],
    differentiation_opportunities: [
      `Clarify how ${projectName} differs from "${m}" on a dedicated comparison page`,
    ],
    source: "page",
  }));
}

export function deriveOpportunities(
  analysis: ProductAnalysis,
  project: { name: string; main_goal?: string | null }
): DerivedOpportunity[] {
  const opps: DerivedOpportunity[] = [];

  if (analysis.conversion_problems.length) {
    opps.push({
      title: "Fix conversion friction on primary landing page",
      description: analysis.conversion_problems.join(" · "),
      channel: "Conversion",
      opportunity_score: 88,
      priority: "HIGH",
      audience_fit: 0.9,
      demand: 0.7,
      competition: 0.3,
      effort: 0.35,
      cost: 0.1,
      speed: 0.9,
      expected_impact: 0.85,
      confidence: analysis.confidence,
      evidence: analysis.conversion_problems,
      recommended_actions: [
        "Rewrite hero to outcome + proof",
        "Make primary CTA singular and visible",
        "Add one trust signal near CTA",
      ],
      status: "open",
      source: analysis.source,
    });
  }

  opps.push({
    title: "Founder-led distribution on X",
    description: `Share product learning and ICP language for ${project.name}. Fast feedback loop.`,
    channel: "X",
    opportunity_score: 80,
    priority: "HIGH",
    audience_fit: 0.85,
    demand: 0.7,
    competition: 0.55,
    effort: 0.3,
    cost: 0.05,
    speed: 0.95,
    expected_impact: 0.75,
    confidence: 0.55,
    evidence: ["Early products learn messaging fastest in public short-form"],
    recommended_actions: ["Post 1 insight/day", "Engage 10 ICP accounts", "Pin CTA"],
    status: "open",
    source: analysis.source,
  });

  opps.push({
    title: "Problem-aware Reddit presence",
    description: "Answer real questions in communities where the ICP already seeks solutions.",
    channel: "Reddit",
    opportunity_score: 74,
    priority: "HIGH",
    audience_fit: 0.8,
    demand: 0.65,
    competition: 0.4,
    effort: 0.45,
    cost: 0.05,
    speed: 0.7,
    expected_impact: 0.7,
    confidence: 0.5,
    evidence: ["High-intent threads outperform cold outreach for many B2B/SaaS tools"],
    recommended_actions: ["Map 5 communities", "Help first, mention product second"],
    status: "open",
    source: analysis.source,
  });

  if (!analysis.raw || !(analysis.raw as { competitorMentions?: string[] }).competitorMentions?.length) {
    opps.push({
      title: "Create comparison / alternative pages",
      description: "High-intent SEO for buyers evaluating options — even before full competitor crawl.",
      channel: "SEO",
      opportunity_score: 70,
      priority: "MEDIUM",
      audience_fit: 0.75,
      demand: 0.8,
      competition: 0.6,
      effort: 0.55,
      cost: 0.15,
      speed: 0.4,
      expected_impact: 0.8,
      confidence: 0.45,
      evidence: ["Comparison intent typically converts above brand search"],
      recommended_actions: ["Pick 3 alternatives buyers mention", "Write honest comparison", "Strong CTA"],
      status: "open",
      source: analysis.source,
    });
  } else {
    opps.push({
      title: "Ship comparison pages for mentioned alternatives",
      description: `Page already references: ${(analysis.raw.competitorMentions as string[]).join(", ")}`,
      channel: "SEO",
      opportunity_score: 76,
      priority: "HIGH",
      audience_fit: 0.8,
      demand: 0.8,
      competition: 0.55,
      effort: 0.5,
      cost: 0.15,
      speed: 0.45,
      expected_impact: 0.85,
      confidence: 0.6,
      evidence: analysis.raw.competitorMentions as string[],
      recommended_actions: ["One page per alternative", "Fair feature matrix", "Clear CTA"],
      status: "open",
      source: analysis.source,
    });
  }

  if (!analysis.pricing_public) {
    opps.push({
      title: "Clarify pricing path",
      description: "Public pricing (or a clear ‘from $X’) reduces sales-cycle friction.",
      channel: "Conversion",
      opportunity_score: 62,
      priority: "MEDIUM",
      audience_fit: 0.7,
      demand: 0.6,
      competition: 0.3,
      effort: 0.4,
      cost: 0.1,
      speed: 0.7,
      expected_impact: 0.65,
      confidence: analysis.confidence,
      evidence: ["Pricing not detected on fetched page"],
      recommended_actions: ["Add pricing section or ‘from’ anchor", "Test annual vs monthly framing"],
      status: "open",
      source: analysis.source,
    });
  }

  return opps.sort((a, b) => b.opportunity_score - a.opportunity_score);
}

export function deriveDailyTasks(
  analysis: ProductAnalysis,
  opps: DerivedOpportunity[],
  project: { name: string }
): DerivedTask[] {
  const tasks: DerivedTask[] = [];
  let order = 1;

  if (analysis.weaknesses.some((w) => /h1|message|cta|headline/i.test(w)) || !analysis.cta) {
    tasks.push({
      title: `Rewrite the hero headline and primary CTA for ${project.name}`,
      why: "Page analysis found weak or unclear conversion messaging.",
      expected_outcome: "One outcome-led headline + single primary CTA",
      difficulty: "easy",
      estimated_minutes: 25,
      channel: "Conversion",
      cta: "Update landing",
      impact: "HIGH",
      sort_order: order++,
    });
  }

  if (analysis.weaknesses.some((w) => /social proof|trust/i.test(w))) {
    tasks.push({
      title: "Add one concrete trust signal near the primary CTA",
      why: "Social proof was not detected on the live page.",
      expected_outcome: "Logo bar, metric, or short testimonial above the fold",
      difficulty: "easy",
      estimated_minutes: 30,
      channel: "Conversion",
      cta: "Ship proof",
      impact: "HIGH",
      sort_order: order++,
    });
  }

  const topChannel = opps.find((o) => o.channel === "X") || opps[0];
  if (topChannel) {
    tasks.push({
      title: `Publish one ${topChannel.channel} post using ICP language from your page`,
      why: topChannel.description.slice(0, 160),
      expected_outcome: "Messaging test + profile visits",
      difficulty: "easy",
      estimated_minutes: 20,
      channel: topChannel.channel,
      cta: "Draft post",
      impact: "HIGH",
      sort_order: order++,
    });
  }

  if (opps.some((o) => o.channel === "Reddit")) {
    tasks.push({
      title: "Map 5 communities where your ICP already asks for help",
      why: "Reddit opportunity ranked high for problem-aware demand.",
      expected_outcome: "List of subreddits + example threads",
      difficulty: "medium",
      estimated_minutes: 35,
      channel: "Reddit",
      cta: "Save to opportunities",
      impact: "HIGH",
      sort_order: order++,
    });
  }

  if (tasks.length < 3) {
    tasks.push({
      title: `Write a 3-bullet positioning statement for ${project.name}`,
      why: "Reusable positioning improves every channel.",
      expected_outcome: "Who / what / outcome in three bullets",
      difficulty: "easy",
      estimated_minutes: 20,
      channel: "Positioning",
      cta: "Save to memory",
      impact: "MEDIUM",
      sort_order: order++,
    });
  }

  return tasks.slice(0, 4);
}

export function deriveStrategy(
  analysis: ProductAnalysis,
  opps: DerivedOpportunity[],
  project: { name: string; main_goal?: string | null }
) {
  const channels = [...new Set(opps.slice(0, 4).map((o) => o.channel))];
  return {
    goal: project.main_goal || "Acquire and activate more customers",
    timeline_days: 30,
    weekly_plan: [
      {
        week: 1,
        focus: "Clarity & conversion",
        actions: [
          "Fix hero + CTA from product analysis",
          "Add trust signal",
          `Start ${channels[0] || "X"} cadence`,
        ],
      },
      {
        week: 2,
        focus: "Distribution",
        actions: channels.slice(0, 3).map((c) => `Run one experiment on ${c}`),
      },
      {
        week: 3,
        focus: "Double down",
        actions: ["Kill weak channels", "Increase volume on winners", "Talk to 5 users"],
      },
      {
        week: 4,
        focus: "Systemize",
        actions: ["Document wins in Growth Memory", "Ship one comparison page", "Set next month targets"],
      },
    ],
    key_channels: channels,
    success_metrics: ["Signups", "Activation", "Channel conversion", "Task completion rate"],
    source: analysis.source,
  };
}

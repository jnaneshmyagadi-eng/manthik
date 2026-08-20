/** Structured demo intelligence — clearly labelled. Never presented as live research. */

export function demoProductIntelligence(input: {
  name: string;
  url?: string | null;
  description?: string | null;
  goal?: string | null;
}) {
  return {
    summary: `${input.name} is positioned as a digital product. Based on the provided description, it targets early-stage growth and customer acquisition. (Demo analysis — connect AI for live website/page intelligence.)`,
    strengths: [
      "Clear product name and stated goal",
      "Founder is focused on measurable user growth",
      "Opportunity to own a narrow positioning",
    ],
    weaknesses: [
      "Landing page conversion path not yet analyzed live",
      "Limited social proof signals in current inputs",
      "Messaging may still be generic for the target market",
    ],
    positioning:
      "Early-stage product seeking product-market fit and first 1,000 users through focused channels.",
    conversion_problems: [
      "Unknown CTA clarity and friction",
      "Possible missing trust signals",
      "Onboarding flow not instrumented yet",
    ],
    opportunities: [
      "Ship 3 high-intent comparison / alternative pages",
      "Founder-led content on X and Reddit",
      "Simple referral loop after first value moment",
    ],
    confidence: 0.45,
    source: "demo" as const,
  };
}

export function demoCustomerSegments(input: { name: string; target_market?: string | null }) {
  const market = input.target_market || "early adopters and indie builders";
  return [
    {
      name: "Indie hackers & solo founders",
      description: `Builders shipping side projects or first SaaS who need customers for ${input.name}.`,
      jobs_to_be_done: ["Validate idea quickly", "Get first paying users", "Avoid marketing overwhelm"],
      pain_points: ["Don't know where to find customers", "Generic content doesn't convert", "Limited time"],
      objections: ["Too busy to run experiments", "Tried ads before with poor ROI"],
      motivations: ["Independence", "Proof of traction", "Revenue"],
      buying_triggers: ["Seeing peers grow", "Clear before/after stories"],
      language_cues: ["first 100 users", "launch week", "build in public"],
      messaging_angles: ["Get your first customers without a marketing team", "Daily actions that compound"],
      rank: 1,
      fit_score: 0.82,
      source: "demo",
    },
    {
      name: "Early SaaS teams (2–10 people)",
      description: `Small product teams in ${market} looking for a growth system.`,
      jobs_to_be_done: ["Prioritize growth work", "Align team on next actions"],
      pain_points: ["Scattered tools", "No single source of truth for experiments"],
      objections: ["Already using Notion + spreadsheets"],
      motivations: ["Speed", "Clarity", "Accountability"],
      buying_triggers: ["Missed growth targets", "New hire needs a system"],
      language_cues: ["growth score", "what should we do this week"],
      messaging_angles: ["Your AI growth team", "One place for opportunities and daily actions"],
      rank: 2,
      fit_score: 0.71,
      source: "demo",
    },
    {
      name: "Agencies & freelancers",
      description: "Consultants who need repeatable growth frameworks for clients.",
      jobs_to_be_done: ["Deliver strategy faster", "Show clients clear next steps"],
      pain_points: ["Custom research is slow", "Hard to scale advice"],
      objections: ["Clients expect custom decks"],
      motivations: ["Margin", "Repeatable process"],
      buying_triggers: ["New client onboarding"],
      language_cues: ["client growth plan", "playbook"],
      messaging_angles: ["White-label ready growth OS"],
      rank: 3,
      fit_score: 0.58,
      source: "demo",
    },
  ];
}

export function demoCompetitors(input: { name: string }) {
  return [
    {
      name: "Generic AI writing tools",
      url: null,
      positioning: "Content generation focused",
      pricing_summary: "Freemium / seat-based",
      features: ["Blog drafts", "Social captions"],
      audience: "Marketers",
      acquisition_channels: ["SEO", "Product Hunt", "YouTube"],
      strengths: ["High volume content", "Low learning curve"],
      weaknesses: ["No growth prioritization", "Generic output"],
      differentiation_opportunities: [
        `${input.name} can own "what to do next" not just "what to write"`,
      ],
      source: "demo",
    },
    {
      name: "Marketing dashboards / analytics suites",
      url: null,
      positioning: "Measure everything",
      pricing_summary: "Higher seat + data fees",
      features: ["Attribution", "Dashboards"],
      audience: "Growth teams",
      acquisition_channels: ["Outbound", "Integrations marketplace"],
      strengths: ["Data depth"],
      weaknesses: ["Does not tell you the next action"],
      differentiation_opportunities: ["Daily Growth Agent + ranked opportunities"],
      source: "demo",
    },
  ];
}

export function demoOpportunities(input: { name: string; goal?: string | null }) {
  return [
    {
      title: "Founder-led X (Twitter) presence",
      description: `Ship short-form insights and product stories for ${input.name} daily. High speed, low cost.`,
      channel: "X",
      opportunity_score: 86,
      priority: "HIGH" as const,
      audience_fit: 0.9,
      demand: 0.75,
      competition: 0.55,
      effort: 0.3,
      cost: 0.1,
      speed: 0.95,
      expected_impact: 0.8,
      confidence: 0.6,
      evidence: ["Demo: early-stage founders still convert well from authentic threads"],
      recommended_actions: ["Post 1 insight/day", "Engage 10 relevant accounts", "Pin a simple CTA"],
      status: "open",
      source: "demo",
    },
    {
      title: "Reddit problem-aware threads",
      description: "Answer high-intent questions in relevant communities without spam.",
      channel: "Reddit",
      opportunity_score: 78,
      priority: "HIGH" as const,
      audience_fit: 0.85,
      demand: 0.7,
      competition: 0.4,
      effort: 0.45,
      cost: 0.05,
      speed: 0.7,
      expected_impact: 0.75,
      confidence: 0.55,
      evidence: ["Demo: problem-aware posts drive qualified traffic"],
      recommended_actions: ["Map 5 subreddits", "Draft helpful answers", "Track referral signups"],
      status: "open",
      source: "demo",
    },
    {
      title: "High-intent comparison landing pages",
      description: "Create 'X vs Y' and 'alternative to' pages for SEO and paid landing.",
      channel: "SEO",
      opportunity_score: 72,
      priority: "MEDIUM" as const,
      audience_fit: 0.8,
      demand: 0.8,
      competition: 0.65,
      effort: 0.6,
      cost: 0.2,
      speed: 0.4,
      expected_impact: 0.85,
      confidence: 0.5,
      evidence: ["Demo: comparison intent converts higher than brand search"],
      recommended_actions: ["Pick 3 competitors", "Write honest comparison", "Add clear CTA"],
      status: "open",
      source: "demo",
    },
    {
      title: "Product Hunt launch preparation",
      description: "Build assets and hunter relationships for a focused launch.",
      channel: "Product Hunt",
      opportunity_score: 58,
      priority: "MEDIUM" as const,
      audience_fit: 0.7,
      demand: 0.6,
      competition: 0.7,
      effort: 0.7,
      cost: 0.15,
      speed: 0.35,
      expected_impact: 0.7,
      confidence: 0.45,
      evidence: ["Demo: still useful for awareness spikes when prepared"],
      recommended_actions: ["Draft gallery + tagline", "Recruit supporters early"],
      status: "open",
      source: "demo",
    },
    {
      title: "Simple referral loop",
      description: "After activation, invite friends for mutual credit or early access.",
      channel: "Referral",
      opportunity_score: 64,
      priority: "MEDIUM" as const,
      audience_fit: 0.75,
      demand: 0.5,
      competition: 0.3,
      effort: 0.55,
      cost: 0.25,
      speed: 0.5,
      expected_impact: 0.7,
      confidence: 0.5,
      evidence: ["Demo: low CAC when product has clear aha moment"],
      recommended_actions: ["Define reward", "Add post-activation prompt"],
      status: "open",
      source: "demo",
    },
  ];
}

export function demoDailyTasks(input: { name: string; goal?: string | null }) {
  return [
    {
      title: `Write a 3-bullet positioning statement for ${input.name}`,
      why: "Clear positioning improves every downstream message and page.",
      expected_outcome: "One paragraph you can reuse in bios, landing, and posts.",
      difficulty: "easy" as const,
      estimated_minutes: 25,
      channel: "Positioning",
      cta: "Save to project memory",
      impact: "HIGH" as const,
      sort_order: 1,
    },
    {
      title: "Post one founder insight on X about the problem you solve",
      why: "Builds audience fit and tests messaging language in public.",
      expected_outcome: "Engagement signal + possible profile visits.",
      difficulty: "easy" as const,
      estimated_minutes: 20,
      channel: "X",
      cta: "Draft post",
      impact: "HIGH" as const,
      sort_order: 2,
    },
    {
      title: "List 5 Reddit communities where your ideal users ask questions",
      why: "Reddit is high-intent when you help first.",
      expected_outcome: "Channel map for the Opportunity Engine.",
      difficulty: "medium" as const,
      estimated_minutes: 35,
      channel: "Reddit",
      cta: "Add to opportunities",
      impact: "HIGH" as const,
      sort_order: 3,
    },
    {
      title: "Audit your primary CTA above the fold",
      why: "Conversion friction kills paid and organic traffic.",
      expected_outcome: "1 concrete CTA or headline experiment to run.",
      difficulty: "medium" as const,
      estimated_minutes: 30,
      channel: "Conversion",
      cta: "Log experiment",
      impact: "MEDIUM" as const,
      sort_order: 4,
    },
  ];
}

export function demoStrategy(input: { name: string; goal?: string | null }) {
  const goal = input.goal || "Get first 1,000 users";
  return {
    goal,
    timeline_days: 30,
    weekly_plan: [
      {
        week: 1,
        focus: "Clarity & foundations",
        actions: [
          "Fix landing headline + CTA",
          "Publish 5 short-form posts",
          "Map top 5 communities",
          "Create 1 comparison outline",
        ],
      },
      {
        week: 2,
        focus: "Distribution experiments",
        actions: [
          "Double down on best-performing post format",
          "Helpful Reddit answers (no spam)",
          "Ship first comparison page",
          "Talk to 5 users or prospects",
        ],
      },
      {
        week: 3,
        focus: "Loops & partners",
        actions: [
          "Launch simple referral prompt",
          "Reach out to 10 complementary tools",
          "Iterate onboarding from feedback",
        ],
      },
      {
        week: 4,
        focus: "Scale what works",
        actions: [
          "Kill low-ROI channels",
          "Increase volume on winners",
          "Document playbook in Growth Memory",
        ],
      },
    ],
    key_channels: ["X", "Reddit", "SEO comparison pages", "Referral"],
    success_metrics: ["Signups", "Activation rate", "Referral rate", "Content engagement"],
    source: "demo" as const,
  };
}

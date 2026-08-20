export function demoConversionReport(input: {
  name: string;
  product_url?: string | null;
  description?: string | null;
}) {
  return {
    conversion_score: 48,
    summary: `Conversion readiness for ${input.name} is mid-range in demo mode. Live analysis needs page fetch + AI. Focus on headline clarity, single primary CTA, and trust near the fold.`,
    headline: {
      current_issue: "Value proposition may be buried or generic",
      recommendation: `Lead with the outcome users buy, not the feature list for ${input.name}.`,
    },
    cta: {
      current_issue: "Primary CTA may compete with secondary links",
      recommendation: "One primary action above the fold; secondary links quieter.",
    },
    trust: {
      current_issue: "Social proof and specifics often missing on early sites",
      recommendation: "Add one concrete metric, logo strip, or short founder quote.",
    },
    onboarding: {
      current_issue: "Unknown friction after signup",
      recommendation: "Measure time-to-first-value; remove one optional field from signup.",
    },
    experiments: [
      "Headline A/B: outcome-led vs product-led",
      "CTA copy: Start free vs Get first customers",
      "Add trust line under CTA",
    ],
    source: "demo" as const,
  };
}

/** Demo content drafts — clearly labelled, platform-native structure. */

export type ContentDraft = {
  platform: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
};

export function demoContentDrafts(input: {
  name: string;
  goal?: string | null;
  description?: string | null;
}): ContentDraft[] {
  const product = input.name;
  const goal = input.goal || "get more customers";
  const desc = input.description || "your product";

  return [
    {
      platform: "X",
      title: "Founder insight thread opener",
      hook: `Most founders ask "what should I post?" Wrong question.`,
      body: `The right question: what problem are my next 10 customers already talking about?\n\nFor ${product}, that problem is clear if you listen.\n\n${desc}\n\nToday: write one post that names the pain, not the feature.\n\n(Demo draft — refine before publishing.)`,
      cta: `Try ${product} → link in bio`,
    },
    {
      platform: "LinkedIn",
      title: "Problem → system post",
      hook: `Growth is not a content calendar. It is a prioritisation problem.`,
      body: `We built ${product} because founders do not need more AI text.\n\nThey need to know: what should I do next to ${goal}?\n\nThat is the job of a Growth OS — intelligence, ranked opportunities, and a daily plan.\n\nIf that resonates, comment "growth" and I will share how we structure the Today view.\n\n(Demo draft.)`,
      cta: `See ${product}`,
    },
    {
      platform: "Reddit",
      title: "Helpful community answer template",
      hook: `When someone asks how to get first users…`,
      body: `I would not start with ads.\n\n1. Talk to 5 people who have the problem.\n2. Ship one high-intent page (comparison or alternative).\n3. Show up where they already ask questions — help first.\n\nTools like ${product} can organise the "what next" list, but the work is still yours.\n\n(Demo — adapt to the actual thread; never spam.)`,
      cta: `Happy to share the checklist`,
    },
    {
      platform: "Blog",
      title: `${product}: a practical way to prioritise growth this week`,
      hook: `If everything is a priority, nothing is.`,
      body: `## The problem\n\nFounders drown in channels. SEO, X, Reddit, Product Hunt, partnerships — all feel urgent.\n\n## A better default\n\nRank opportunities by audience fit, effort, speed, and expected impact. Then do the top 3 actions today.\n\n## How ${product} helps\n\n${desc}\n\n## This week\n\n1. Clarify positioning in one paragraph.\n2. One distribution experiment.\n3. One conversion check on your primary CTA.\n\n(Demo article outline.)`,
      cta: `Start a Growth Project`,
    },
  ];
}

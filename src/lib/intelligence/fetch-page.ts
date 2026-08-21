/**
 * Server-side website fetch + lightweight HTML signal extraction.
 * No external paid APIs. Never invents page content.
 */

export type PageSignals = {
  url: string;
  finalUrl: string;
  ok: boolean;
  error?: string;
  status?: number;
  title: string | null;
  description: string | null;
  h1: string[];
  h2: string[];
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  links: { href: string; text: string }[];
  ctaCandidates: string[];
  pricingSignals: string[];
  featureCandidates: string[];
  bodyTextSample: string;
  wordCount: number;
  hasSignupForm: boolean;
  hasLoginLink: boolean;
  hasPricingSection: boolean;
  hasSocialProof: boolean;
  hasFaq: boolean;
  competitorMentions: string[];
};

const UA =
  "ManthikBot/1.0 (+https://manthik-os-jnanesh.vercel.app; product-intelligence)";

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
    "i"
  );
  const m = html.match(re) || html.match(re2);
  return m?.[1]?.trim() || null;
}

function allMatches(html: string, re: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = r.exec(html)) !== null) {
    const t = stripTags(m[1] || "").trim();
    if (t && t.length < 200) out.push(t);
  }
  return [...new Set(out)].slice(0, 20);
}

const CTA_WORDS =
  /\b(get started|start free|start for free|try free|try it|sign up|signup|join|book a demo|request demo|start growing|create account|buy now|subscribe|start trial|free trial)\b/i;

export async function fetchPageSignals(rawUrl: string): Promise<PageSignals> {
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  const empty = (partial: Partial<PageSignals> & { ok: boolean; error?: string }): PageSignals => ({
    url: rawUrl,
    finalUrl: url,
    title: null,
    description: null,
    h1: [],
    h2: [],
    canonical: null,
    ogTitle: null,
    ogDescription: null,
    links: [],
    ctaCandidates: [],
    pricingSignals: [],
    featureCandidates: [],
    bodyTextSample: "",
    wordCount: 0,
    hasSignupForm: false,
    hasLoginLink: false,
    hasPricingSection: false,
    hasSocialProof: false,
    hasFaq: false,
    competitorMentions: [],
    ...partial,
  });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return empty({ ok: false, error: "Invalid URL" });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return empty({ ok: false, error: "Only http/https URLs are supported" });
  }

  let res: Response;
  try {
    res = await fetch(parsed.toString(), {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12000),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fetch failed";
    return empty({ ok: false, error: `Could not fetch URL: ${msg}` });
  }

  if (!res.ok) {
    return empty({
      ok: false,
      status: res.status,
      finalUrl: res.url,
      error: `HTTP ${res.status} when fetching page`,
    });
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    return empty({
      ok: false,
      status: res.status,
      finalUrl: res.url,
      error: `Unsupported content-type: ${contentType || "unknown"}`,
    });
  }

  const html = (await res.text()).slice(0, 500_000);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]).slice(0, 200) : null;
  const description = metaContent(html, "description");
  const ogTitle = metaContent(html, "og:title");
  const ogDescription = metaContent(html, "og:description");
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const h1 = allMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2 = allMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i);

  const bodyText = stripTags(html);
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  const ctaCandidates: string[] = [];
  const buttonTexts = allMatches(html, /<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/i);
  for (const t of buttonTexts) {
    if (CTA_WORDS.test(t) || t.length < 40) {
      if (CTA_WORDS.test(t)) ctaCandidates.push(t);
    }
  }

  const pricingSignals: string[] = [];
  const priceRe = /\$\s?\d+(?:\.\d{2})?(?:\s*\/\s*(?:mo|month|yr|year))?|€\s?\d+|free trial|freemium|starting at/gi;
  const priceHits = bodyText.match(priceRe) || [];
  pricingSignals.push(...[...new Set(priceHits)].slice(0, 12));

  const featureCandidates = h2.filter(
    (t) =>
      t.length > 3 &&
      t.length < 80 &&
      !/cookie|privacy|terms|copyright|©/i.test(t)
  ).slice(0, 12);

  const lower = bodyText.toLowerCase();
  const hasSignupForm =
    /type=["']email["']|type=["']password["']|sign\s*up|create account/i.test(html);
  const hasLoginLink = /\blog\s*in\b|\bsign\s*in\b/i.test(lower);
  const hasPricingSection = /pricing|plans|subscription/i.test(lower);
  const hasSocialProof =
    /trusted by|customers|testimonial|reviews|\d+[k+]?\+?\s*(users|customers|companies)/i.test(
      lower
    );
  const hasFaq = /\bfaq\b|frequently asked/i.test(lower);

  // Only extract competitor-like phrases when the page itself uses comparison language
  const competitorMentions: string[] = [];
  const vsMatches = bodyText.match(/\b([A-Z][A-Za-z0-9]+)\s+vs\.?\s+([A-Z][A-Za-z0-9]+)/g) || [];
  for (const v of vsMatches.slice(0, 5)) competitorMentions.push(v);
  const altMatches =
    bodyText.match(/alternative(?:s)?\s+to\s+([A-Z][A-Za-z0-9\s]{2,30})/gi) || [];
  for (const a of altMatches.slice(0, 5)) competitorMentions.push(a.trim());

  const links: { href: string; text: string }[] = [];
  const linkRe = /<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(html)) !== null && links.length < 40) {
    const href = lm[1];
    const text = stripTags(lm[2]).slice(0, 80);
    if (href.startsWith("mailto:") || href.startsWith("javascript:")) continue;
    links.push({ href, text });
  }

  return {
    url: rawUrl,
    finalUrl: res.url,
    ok: true,
    status: res.status,
    title,
    description,
    h1,
    h2,
    canonical: canonicalMatch?.[1] || null,
    ogTitle,
    ogDescription,
    links,
    ctaCandidates: [...new Set(ctaCandidates)].slice(0, 10),
    pricingSignals,
    featureCandidates,
    bodyTextSample: bodyText.slice(0, 2500),
    wordCount,
    hasSignupForm,
    hasLoginLink,
    hasPricingSection,
    hasSocialProof,
    hasFaq,
    competitorMentions: [...new Set(competitorMentions)].slice(0, 10),
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://manthik.vercel.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/app/", "/onboarding", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}

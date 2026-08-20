import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Manthik — AI Growth Operating System",
    template: "%s · Manthik",
  },
  description:
    "Turn your product into customers. An AI Growth OS that finds opportunities, builds strategy, and tells you what to do next.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://manthik.vercel.app"),
  openGraph: {
    title: "Manthik — AI Growth Operating System",
    description: "Turn your product into customers.",
    type: "website",
    siteName: "Manthik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manthik — AI Growth Operating System",
    description: "Turn your product into customers.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

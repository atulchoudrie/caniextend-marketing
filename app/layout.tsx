import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://caniextend.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Can I Extend? — AI-Powered Home Extension Planning for UK Homeowners",
    template: "%s | Can I Extend",
  },
  description:
    "Find out if you can extend your home. Get a professionally designed extension with costs and planning compliance — powered by AI. Free for UK homeowners.",
  keywords: [
    "can I extend my home",
    "home extension planner UK",
    "permitted development checker",
    "home extension cost calculator",
    "extension proposal AI",
    "UK home extension planning",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BASE_URL,
    siteName: "Can I Extend",
    title: "Can I Extend? — AI-Powered Home Extension Planning",
    description:
      "Find out if you can extend your home. Get a professionally designed extension with costs and planning compliance — powered by AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Can I Extend — Extension Proposals in Minutes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Can I Extend? — AI-Powered Home Extension Planning",
    description:
      "Find out if you can extend your home. Get a professionally designed extension with costs and planning compliance — powered by AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Can I Extend Ltd",
  url: BASE_URL,
  description:
    "Can I Extend makes home extension planning accessible to every UK homeowner using AI-powered floorplan analysis.",
  areaServed: { "@type": "Country", name: "United Kingdom" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <meta name="theme-color" content="#2E61FF" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

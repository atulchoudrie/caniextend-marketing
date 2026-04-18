import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const BASE_URL = "https://caniextend.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "caniextend — AI-Powered Home Extension Planning for UK Homeowners",
    template: "%s | caniextend",
  },
  description:
    "Could your home fit an extension? Upload your floorplan and get a professional extension proposal, cost estimate, and planning guidance — in minutes.",
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
    siteName: "caniextend",
    title: "caniextend — AI-Powered Home Extension Planning",
    description:
      "Could your home fit an extension? Get a professional proposal, cost estimate, and planning guidance — in minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "caniextend — Extension Proposals in Minutes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "caniextend — AI-Powered Home Extension Planning",
    description:
      "Could your home fit an extension? Get a professional proposal, cost estimate, and planning guidance — in minutes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE_URL },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "caniextend Ltd",
  url: BASE_URL,
  description:
    "caniextend makes home extension planning accessible to every UK homeowner using AI-powered floorplan analysis.",
  areaServed: { "@type": "Country", name: "United Kingdom" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <head>
        <meta name="theme-color" content="#0F2240" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

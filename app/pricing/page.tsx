import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for your home extension proposal. No subscription required — pay only when you need a report.",
  openGraph: {
    type: "website",
    siteName: "caniextend",
    title: "Pricing | caniextend",
    description:
      "Simple, transparent pricing for your home extension proposal. No subscription required — pay only when you need a report.",
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
    title: "Pricing | caniextend",
    description:
      "Simple, transparent pricing for your home extension proposal. No subscription required — pay only when you need a report.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://caniextend.com/pricing" },
};

export default function PricingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F2240",
        fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <a
        href="/"
        style={{
          color: "#7BAFD4",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textDecoration: "none",
          marginBottom: "2rem",
          display: "block",
        }}
      >
        ← caniextend
      </a>
      <h1
        style={{
          color: "#ffffff",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontFamily: "var(--font-dm-serif, Georgia, serif)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          marginBottom: "1rem",
        }}
      >
        Pricing
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "480px", lineHeight: 1.7 }}>
        Pricing details coming soon. Join the{" "}
        <a href="/#waitlist" style={{ color: "#7BAFD4", textDecoration: "underline" }}>
          early access waitlist
        </a>{" "}
        for founding member rates.
      </p>
    </main>
  );
}

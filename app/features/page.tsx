import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — AI Extension Planning",
  description:
    "Explore how caniextend analyses your floorplan, checks UK planning rules, and delivers a complete extension proposal with cost breakdown in under 5 minutes.",
  openGraph: {
    type: "website",
    siteName: "caniextend",
    title: "Features — AI Extension Planning | caniextend",
    description:
      "Explore how caniextend analyses your floorplan, checks UK planning rules, and delivers a complete extension proposal with cost breakdown in under 5 minutes.",
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
    title: "Features — AI Extension Planning | caniextend",
    description:
      "Explore how caniextend analyses your floorplan, checks UK planning rules, and delivers a complete extension proposal with cost breakdown in under 5 minutes.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://caniextend.com/features" },
};

export default function FeaturesPage() {
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
        Features
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "480px", lineHeight: 1.7 }}>
        Full features page coming soon. In the meantime,{" "}
        <a href="/#how-it-works" style={{ color: "#7BAFD4", textDecoration: "underline" }}>
          see how it works
        </a>
        .
      </p>
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Upload your floorplan and get a professionally designed extension proposal, full cost breakdown, and UK planning compliance check — in under 5 minutes.",
  openGraph: {
    type: "website",
    siteName: "caniextend",
    title: "Get Started | caniextend",
    description:
      "Upload your floorplan and get a professionally designed extension proposal, full cost breakdown, and UK planning compliance check — in under 5 minutes.",
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
    title: "Get Started | caniextend",
    description:
      "Upload your floorplan and get a professionally designed extension proposal, full cost breakdown, and UK planning compliance check — in under 5 minutes.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://caniextend.com/signup" },
};

export default function SignupPage() {
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
        Get Started
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "480px", lineHeight: 1.7, marginBottom: "2rem" }}>
        The full product is coming soon. Join the waitlist to be first in line.
      </p>
      <a
        href="/#waitlist"
        style={{
          display: "inline-block",
          background: "#4A7FA5",
          color: "#ffffff",
          fontWeight: 600,
          padding: "14px 32px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "15px",
          letterSpacing: "-0.01em",
        }}
      >
        Join the waitlist
      </a>
    </main>
  );
}

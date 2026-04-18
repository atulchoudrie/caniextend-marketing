import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "We're making home extension planning accessible to every UK homeowner — using AI to turn any floorplan into a professional extension proposal in minutes.",
  openGraph: {
    type: "website",
    siteName: "caniextend",
    title: "About | caniextend",
    description:
      "We're making home extension planning accessible to every UK homeowner — using AI to turn any floorplan into a professional extension proposal in minutes.",
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
    title: "About | caniextend",
    description:
      "We're making home extension planning accessible to every UK homeowner — using AI to turn any floorplan into a professional extension proposal in minutes.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://caniextend.com/about" },
};

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--navy)",
        fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <a
        href="/"
        style={{
          color: "var(--blue-light)",
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
        About caniextend
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "560px", lineHeight: 1.7 }}>
        We&apos;re on a mission to make home extension planning accessible to every UK homeowner.
        Using AI-powered floorplan analysis, we turn any floor plan into a professionally designed,
        costed, and regulation-checked extension proposal — in minutes, not months.
      </p>
    </main>
  );
}

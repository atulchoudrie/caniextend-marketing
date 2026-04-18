import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the caniextend team. We're here to help with your home extension planning questions.",
  openGraph: {
    type: "website",
    siteName: "caniextend",
    title: "Contact | caniextend",
    description:
      "Get in touch with the caniextend team. We're here to help with your home extension planning questions.",
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
    title: "Contact | caniextend",
    description:
      "Get in touch with the caniextend team. We're here to help with your home extension planning questions.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://caniextend.com/contact" },
};

export default function ContactPage() {
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
        Contact
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "480px", lineHeight: 1.7 }}>
        Reach us at{" "}
        <a href="mailto:hello@caniextend.com" style={{ color: "var(--blue-light)", textDecoration: "underline" }}>
          hello@caniextend.com
        </a>
        . We aim to respond within one working day.
      </p>
    </main>
  );
}

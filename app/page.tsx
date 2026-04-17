"use client";

import { useState, useEffect, useRef } from "react";

/* ── Hooks ─────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return scrolled;
}

/* ── Logo ───────────────────────────────────────────────────────────── */
function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const stroke = dark ? "#FFFFFF" : "#0F2240";
  const accent = dark ? "#7BAFD4" : "#4A7FA5";
  const fill = dark ? "#FFFFFF" : "#0F2240";
  return (
    <svg
      viewBox="60 40 210 150"
      className={`h-10 w-auto ${className}`}
      aria-label="caniextend"
      role="img"
      focusable="false"
    >
      <rect x="80" y="90" width="90" height="65" fill="none" stroke={stroke} strokeWidth="2.5" />
      <polygon points="72,90 125,52 178,90" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="170" y="108" width="50" height="47" fill="none" stroke={accent} strokeWidth="2" />
      <line x1="170" y1="108" x2="220" y2="108" stroke={accent} strokeWidth="2" />
      <rect x="109" y="118" width="18" height="37" fill="none" stroke={stroke} strokeWidth="1.5" />
      <rect x="143" y="102" width="18" height="18" fill="none" stroke={stroke} strokeWidth="1.5" />
      <rect x="180" y="118" width="22" height="18" fill="none" stroke={accent} strokeWidth="1.5" />
      <text
        x="160"
        y="178"
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontSize="20"
        fontWeight="500"
        letterSpacing="0.5"
        fill={fill}
        textAnchor="middle"
      >
        caniextend
      </text>
    </svg>
  );
}

/* ── Nav ────────────────────────────────────────────────────────────── */
function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/97 backdrop-blur-sm nav-scrolled" : "bg-transparent"
        }`}
        style={{ height: "64px" }}
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <a href="/" aria-label="caniextend — home">
            <Logo dark={!scrolled} />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#how-it-works", label: "How it works" },
              { href: "#waitlist", label: "Pricing" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`text-[15px] font-medium transition-colors duration-200 ${
                  scrolled
                    ? "text-[#2D3748] hover:text-[#0F2240]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </a>
            ))}
            <a
              href="#waitlist"
              className={`text-[15px] font-semibold px-5 py-2.5 rounded-[4px] transition-colors duration-200 ${
                scrolled
                  ? "bg-[#0F2240] text-white hover:bg-[#1a3a60]"
                  : "bg-white text-[#0F2240] hover:bg-white/90"
              }`}
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-md ${scrolled ? "text-[#0F2240]" : "text-white"}`}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-[#0F2240] flex flex-col pt-20 px-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <ul className="space-y-1">
            {[
              { href: "#how-it-works", label: "How it works" },
              { href: "#waitlist", label: "Pricing" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-xl font-medium text-white/80 hover:text-white border-b border-white/10 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="mt-8 block w-full bg-white text-[#0F2240] text-center font-semibold py-4 rounded-[4px] text-lg"
          >
            Get Started
          </a>
        </div>
      )}
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="hero-bg relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Radial glow overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,127,165,0.20) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center py-28 pt-36">
        <p className="animate-fade-up text-[#7BAFD4] text-sm font-medium uppercase tracking-[0.1em] mb-6">
          AI-powered extension planning for UK homeowners
        </p>

        <h1
          id="hero-heading"
          className="animate-fade-up animate-fade-up-1 text-white mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: "1.1",
          }}
        >
          Could your home fit<br className="hidden sm:block" /> an extension?
        </h1>

        <p
          className="animate-fade-up animate-fade-up-2 text-white/70 max-w-xl mx-auto leading-relaxed mb-10"
          style={{ fontSize: "clamp(16px, 2.5vw, 18px)" }}
        >
          Upload your floorplan. Get a professional extension proposal, cost
          estimate, and planning guidance — in minutes.
        </p>

        <div className="animate-fade-up animate-fade-up-3 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 bg-[#4A7FA5] text-white font-semibold px-8 py-4 rounded-[4px] hover:bg-[#3d6e91] transition-colors text-base"
            style={{ minHeight: "56px" }}
          >
            Upload your floorplan
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <p className="animate-fade-up mt-8 text-white/45 text-sm">
          Early access: 50 homeowners + 10 estate agents
        </p>
      </div>
    </section>
  );
}

/* ── Trust strip ────────────────────────────────────────────────────── */
function TrustStrip() {
  const items = [
    {
      label: "RIBA-aligned guidance",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18M5 21V8l7-5 7 5v13" />
          <path d="M10 21v-5h4v5" />
        </svg>
      ),
    },
    {
      label: "UK planning regulations checked",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Results in under 5 minutes",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#F5F4F1] py-6 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              {item.icon}
              <span className="text-[14px] font-semibold text-[#0F2240]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── How it works ───────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload your floorplan",
      body: "Take a photo of your property's floorplan — estate agent brochure, architect drawing, or a hand sketch. We accept PDF, JPG, and PNG.",
      visual: (
        <div className="w-full max-w-xs aspect-square rounded-[8px] bg-[#F5F4F1] flex items-center justify-center border border-[#E2E8F0]">
          <svg viewBox="0 0 120 120" className="w-2/3" aria-hidden="true">
            <rect x="10" y="10" width="100" height="100" rx="3" fill="none" stroke="#0F2240" strokeWidth="1.5" />
            <rect x="22" y="22" width="32" height="28" fill="none" stroke="#4A7FA5" strokeWidth="1.5" />
            <rect x="62" y="22" width="36" height="28" fill="none" stroke="#4A7FA5" strokeWidth="1.5" />
            <rect x="22" y="58" width="76" height="36" fill="none" stroke="#4A7FA5" strokeWidth="1.5" />
            <text x="38" y="40" fontSize="7" fill="#4A7FA5" textAnchor="middle" fontFamily="sans-serif">Bed</text>
            <text x="80" y="40" fontSize="7" fill="#4A7FA5" textAnchor="middle" fontFamily="sans-serif">Bath</text>
            <text x="60" y="80" fontSize="7" fill="#4A7FA5" textAnchor="middle" fontFamily="sans-serif">Living Room</text>
          </svg>
        </div>
      ),
    },
    {
      number: "02",
      title: "Our AI analyses your property",
      body: "We cross-reference your floorplan with UK planning rules, your property boundaries, and local authority records to identify your extension options.",
      visual: (
        <div className="w-full max-w-xs aspect-square rounded-[8px] bg-[#0F2240] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={24 * (i + 1)} x2="120" y2={24 * (i + 1)} stroke="rgba(74,127,165,0.18)" strokeWidth="0.75" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`v${i}`} x1={24 * (i + 1)} y1="0" x2={24 * (i + 1)} y2="120" stroke="rgba(74,127,165,0.18)" strokeWidth="0.75" />
            ))}
            <rect x="22" y="42" width="54" height="52" fill="none" stroke="#4A7FA5" strokeWidth="1.5" />
            <polygon points="16,42 49,20 82,42" fill="none" stroke="#4A7FA5" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="76" y="54" width="28" height="40" fill="rgba(74,127,165,0.15)" stroke="#7BAFD4" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="49" cy="42" r="3" fill="#4A7FA5" />
            <circle cx="76" cy="54" r="3" fill="#7BAFD4" />
            <line x1="49" y1="42" x2="76" y2="54" stroke="#4A7FA5" strokeWidth="1" strokeDasharray="3 2" />
            <text x="90" y="50" fontSize="6" fill="#7BAFD4" textAnchor="middle" fontFamily="sans-serif">New</text>
          </svg>
        </div>
      ),
    },
    {
      number: "03",
      title: "Get your extension proposal",
      body: "In minutes you receive a complete extension design, cost estimate, planning compliance check, and comparison with similar properties nearby.",
      visual: (
        <div className="w-full max-w-xs aspect-square rounded-[8px] bg-[#F5F4F1] border border-[#E2E8F0] flex flex-col overflow-hidden">
          <div className="bg-[#0F2240] px-4 py-3 flex-shrink-0">
            <div className="text-white text-xs font-semibold">Extension Proposal</div>
            <div className="text-white/55 text-[10px] mt-0.5">24 Clarence St, SE15</div>
          </div>
          <div className="flex-1 p-5 space-y-4">
            {[
              { label: "Estimated cost", value: "£62k–£74k" },
              { label: "Planning route", value: "Permitted Dev." },
              { label: "Build time", value: "10–14 weeks" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-baseline text-xs">
                <span className="text-[#2D3748]/60">{label}</span>
                <span className="font-semibold text-[#0F2240]">{value}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-[#E2E8F0]">
              <span className="inline-flex items-center gap-1 bg-[#F0FAF6] text-[#1A7F5A] text-[10px] font-semibold px-2 py-1 rounded-[4px]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12l5 5L20 7" />
                </svg>
                Permitted Development
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-[80px] bg-white px-6" aria-labelledby="how-it-works-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 reveal">
          <h2
            id="how-it-works-heading"
            className="font-semibold text-[#0F2240] leading-tight mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 32px)" }}
          >
            From floor plan to proposal in minutes
          </h2>
          <p className="text-[#2D3748] max-w-xl mx-auto leading-relaxed">
            No architect needed. No waiting weeks. Upload your floorplan and get a complete proposal in under five minutes.
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="w-full lg:w-1/2 flex justify-center">
                {step.visual}
              </div>
              <div className="w-full lg:w-1/2">
                <div
                  className="text-[56px] font-bold leading-none mb-4 select-none"
                  style={{ color: "#E2E8F0" }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                <h3 className="text-[20px] font-semibold text-[#0F2240] mb-3">{step.title}</h3>
                <p className="text-[#2D3748] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────────────────── */
function Testimonials() {
  const quotes = [
    {
      body: "We'd been putting off the extension conversation for years. caniextend gave us a clear answer in ten minutes — and the cost estimate was remarkably accurate.",
      name: "Sarah M.",
      location: "Hackney, London",
    },
    {
      body: "Used it before making an offer on a property. Checked extension potential without paying for a surveyor. Saved me from a costly mistake.",
      name: "James K.",
      location: "Clifton, Bristol",
    },
    {
      body: "The planning compliance check was worth it alone. Knowing our rear extension fell under Permitted Development gave us real confidence to proceed.",
      name: "Priya T.",
      location: "Didsbury, Manchester",
    },
  ];

  return (
    <section className="py-[80px] bg-[#F5F4F1] px-6" aria-label="Customer testimonials">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 reveal">
          <h2 className="font-semibold text-[#0F2240]" style={{ fontSize: "clamp(26px, 4vw, 32px)" }}>
            What homeowners say
          </h2>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="testimonial-track flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {quotes.map((q, i) => (
            <article
              key={q.name}
              className="reveal flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-auto snap-start bg-white rounded-[8px] p-6"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="text-[52px] leading-none text-[#4A7FA5] mb-1 select-none"
                style={{ fontFamily: "var(--font-display)" }}
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <p className="text-[16px] italic text-[#2D3748] leading-relaxed mb-5">{q.body}</p>
              <footer>
                <div className="font-semibold text-[#0F2240] text-[14px]">{q.name}</div>
                <div className="text-[#2D3748]/55 text-[13px]">{q.location}</div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ───────────────────────────────────────────────────────── */
function Features() {
  const items = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
      title: "Extension design",
      body: "A scaled architectural drawing of your proposed extension, showing the new layout alongside your existing floorplan.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: "Planning compliance check",
      body: "We check your extension against Permitted Development rights and local planning rules — so you know before you build.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      title: "Cost estimate",
      body: "A realistic cost breakdown based on current UK build rates, your location, and extension type — updated quarterly from RICS data.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      ),
      title: "Neighbour comparison",
      body: "See what similar extensions nearby have been approved for, with actual costs and planning outcomes from Land Registry.",
    },
  ];

  return (
    <section id="features" className="py-[80px] bg-white px-6" aria-labelledby="features-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 reveal">
          <h2
            id="features-heading"
            className="font-semibold text-[#0F2240] leading-tight mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 32px)" }}
          >
            Everything you need to plan your extension
          </h2>
          <p className="text-[#2D3748] max-w-xl mx-auto leading-relaxed">
            No more paying thousands for a feasibility study. Get the same quality insight in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="reveal flex gap-5 p-6 rounded-[8px] border border-[#E2E8F0] hover:border-[#4A7FA5] hover:shadow-[0_6px_16px_rgba(15,34,64,0.08)] transition-all duration-200"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-[4px] bg-[#F5F4F1]">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[#0F2240] mb-2">{item.title}</h3>
                <p className="text-sm text-[#2D3748] leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Secondary CTA ──────────────────────────────────────────────────── */
function SecondaryCTA() {
  return (
    <section className="py-[80px] bg-[#F5F4F1] px-6">
      <div className="max-w-2xl mx-auto text-center reveal">
        <h2
          className="font-semibold text-[#0F2240] leading-tight mb-4"
          style={{ fontSize: "clamp(26px, 4vw, 32px)" }}
        >
          Ready to find out what&apos;s possible?
        </h2>
        <p className="text-[#2D3748] mb-8 leading-relaxed">
          No account needed. Free to start.
        </p>
        <a
          href="#waitlist"
          className="inline-flex items-center justify-center gap-2 bg-[#0F2240] text-white font-semibold px-8 py-4 rounded-[4px] hover:bg-[#1a3a60] transition-colors text-base"
          style={{ minHeight: "56px" }}
        >
          Upload your floorplan
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ── Waitlist ───────────────────────────────────────────────────────── */
function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="waitlist" className="py-[80px] bg-white px-6" aria-labelledby="waitlist-heading">
      <div className="max-w-xl mx-auto text-center">
        <div className="reveal">
          <p className="text-[#4A7FA5] text-sm font-medium uppercase tracking-[0.1em] mb-4">
            Early access
          </p>
          <h2
            id="waitlist-heading"
            className="font-semibold text-[#0F2240] leading-tight mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 32px)" }}
          >
            Your home has more potential<br className="hidden sm:block" /> than you think
          </h2>
          <p className="text-[#2D3748] mb-8 leading-relaxed">
            Join the waitlist and be among the first to find out if you can extend.
          </p>
        </div>

        {status === "success" ? (
          <div className="reveal bg-[#F0FAF6] border border-[#1A7F5A]/25 rounded-[8px] p-8">
            <svg
              className="w-10 h-10 mx-auto mb-3 text-[#1A7F5A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-5" />
            </svg>
            <h3 className="font-semibold text-[#1A7F5A] text-lg mb-1">You&apos;re on the list!</h3>
            <p className="text-[#1A7F5A]/80 text-sm">
              We&apos;ll be in touch as soon as early access is ready.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="reveal"
            noValidate
            aria-label="Waitlist signup form"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="waitlist-email" className="sr-only">
                Your email address
              </label>
              <input
                ref={inputRef}
                id="waitlist-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3.5 rounded-[4px] border border-[#E2E8F0] text-[#0F2240] text-base placeholder:text-[#2D3748]/35 bg-white"
                style={{ minHeight: "56px" }}
                aria-describedby={errorMsg ? "waitlist-error" : undefined}
                aria-invalid={!!errorMsg || undefined}
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#0F2240] text-white font-semibold px-6 py-3.5 rounded-[4px] hover:bg-[#1a3a60] disabled:opacity-55 transition-colors whitespace-nowrap"
                style={{ minHeight: "56px" }}
              >
                {status === "loading" ? "Joining…" : "Join the waitlist"}
              </button>
            </div>
            {errorMsg && (
              <p id="waitlist-error" role="alert" className="mt-2 text-sm text-[#B45309]">
                {errorMsg}
              </p>
            )}
            <p className="mt-3 text-xs text-[#2D3748]/55">
              No spam. One email when early access opens. Unsubscribe any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#0F2240] py-12 px-6" role="contentinfo">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-10 pb-8 border-b border-white/10">
          <div>
            <a href="/" aria-label="caniextend — home" className="inline-block mb-4">
              <Logo dark />
            </a>
            <p className="text-white/50 text-sm leading-relaxed max-w-[220px]">
              Making home extension planning accessible to every UK homeowner.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "#how-it-works", label: "How it works" },
                  { href: "#features", label: "Features" },
                  { href: "#waitlist", label: "Join the waitlist" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/privacy", label: "Privacy policy" },
                  { href: "/terms", label: "Terms" },
                  { href: "mailto:hello@caniextend.com", label: "Contact" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© 2026 caniextend.com · All rights reserved.</p>
          <p>Registered in England and Wales · Based on GPDO 2015</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function HomePage() {
  useReveal();
  const scrolled = useNavScroll();

  return (
    <>
      <Nav scrolled={scrolled} />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Testimonials />
        <Features />
        <SecondaryCTA />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";

/* ── Hooks ─────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
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

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
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

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#how-it-works", label: "How it works" },
              { href: "#waitlist", label: "Pricing" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`nav-link text-[15px] font-medium transition-colors duration-200 ${
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
              className={`text-[15px] font-semibold px-5 py-2.5 rounded-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] ${
                scrolled
                  ? "bg-[#0F2240] text-white hover:bg-[#1a3a60]"
                  : "bg-white/10 text-white border border-white/25 hover:bg-white/20"
              }`}
            >
              Get Started
            </a>
          </div>

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
            className="mt-8 block w-full bg-white text-[#0F2240] text-center font-semibold py-4 rounded-sm text-lg"
          >
            Get Started
          </a>
        </div>
      )}
    </>
  );
}

/* ── Animated Floorplan SVG ─────────────────────────────────────────── */
function AnimatedFloorplan() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none" aria-hidden="true">
      <svg viewBox="0 0 300 220" className="w-full h-auto">
        {/* Grid overlay */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0" y1={(i + 1) * 20} x2="300" y2={(i + 1) * 20}
            stroke="rgba(74,127,165,0.08)" strokeWidth="0.75"
          />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={(i + 1) * 20} y1="0" x2={(i + 1) * 20} y2="220"
            stroke="rgba(74,127,165,0.08)" strokeWidth="0.75"
          />
        ))}

        {/* Existing house: main body — perimeter 2*(140+100)=480 */}
        <rect
          x="40" y="80" width="140" height="100"
          fill="rgba(74,127,165,0.04)" stroke="#4A7FA5" strokeWidth="1.75"
          className="fp-house"
        />

        {/* Roof: two segments each ~116px, total ~233 */}
        <polyline
          points="30,80 110,28 220,80"
          fill="none" stroke="#4A7FA5" strokeWidth="1.75" strokeLinejoin="round"
          className="fp-roof"
        />

        {/* Door */}
        <rect x="97" y="141" width="22" height="39"
          fill="none" stroke="rgba(74,127,165,0.55)" strokeWidth="1.25"
          className="fp-detail"
        />

        {/* Window left */}
        <rect x="52" y="98" width="28" height="22"
          fill="none" stroke="rgba(74,127,165,0.55)" strokeWidth="1.25"
          className="fp-detail"
        />

        {/* Window right */}
        <rect x="138" y="98" width="28" height="22"
          fill="none" stroke="rgba(74,127,165,0.55)" strokeWidth="1.25"
          className="fp-detail"
        />

        {/* EXTENSION: rear — perimeter 2*(60+80)=280 */}
        <rect
          x="180" y="100" width="60" height="80"
          fill="rgba(123,175,212,0.08)" stroke="#7BAFD4" strokeWidth="1.75"
          strokeDasharray="5 3"
          className="fp-extension"
        />

        {/* Extension interior line (open wall connection) */}
        <line
          x1="180" y1="100" x2="180" y2="180"
          stroke="rgba(74,127,165,0.3)" strokeWidth="1" strokeDasharray="3 3"
          className="fp-extension-detail"
        />

        {/* "NEW" badge */}
        <rect x="193" y="128" width="34" height="14" rx="2"
          fill="rgba(123,175,212,0.15)" stroke="rgba(123,175,212,0.4)" strokeWidth="0.75"
          className="fp-extension-detail"
        />
        <text x="210" y="139" fontSize="7" fill="#7BAFD4" textAnchor="middle"
          fontFamily="'DM Sans', system-ui, sans-serif" fontWeight="600" letterSpacing="0.08em"
          className="fp-extension-detail"
        >
          NEW
        </text>

        {/* Measurement bracket */}
        <line x1="183" y1="192" x2="237" y2="192"
          stroke="rgba(123,175,212,0.4)" strokeWidth="0.75"
          className="fp-extension-detail"
        />
        <line x1="183" y1="188" x2="183" y2="196"
          stroke="rgba(123,175,212,0.4)" strokeWidth="0.75"
          className="fp-extension-detail"
        />
        <line x1="237" y1="188" x2="237" y2="196"
          stroke="rgba(123,175,212,0.4)" strokeWidth="0.75"
          className="fp-extension-detail"
        />
        <text x="210" y="205" fontSize="7" fill="rgba(123,175,212,0.55)" textAnchor="middle"
          fontFamily="'DM Sans', system-ui, sans-serif"
          className="fp-extension-detail"
        >
          4.8m extension
        </text>

        {/* Corner nodes */}
        {[
          { cx: 40, cy: 80, d: "0.2s" },
          { cx: 180, cy: 80, d: "0.35s" },
          { cx: 40, cy: 180, d: "0.5s" },
          { cx: 180, cy: 180, d: "0.65s" },
          { cx: 240, cy: 100, d: "2.0s" },
          { cx: 240, cy: 180, d: "2.1s" },
        ].map(({ cx, cy, d }) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx} cy={cy} r={3}
            fill="#4A7FA5" opacity="0"
            className="fp-node"
            style={{ animationDelay: d }}
          />
        ))}

        {/* AI scan line */}
        <line
          x1="0" y1="110" x2="300" y2="110"
          stroke="rgba(74,127,165,0)" strokeWidth="1.5"
          className="fp-scan"
        />
      </svg>
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="hero-bg relative min-h-screen flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Left radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 15% 55%, rgba(74,127,165,0.18) 0%, transparent 55%)",
        }}
      />

      {/* Right dim */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden lg:block"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 80% 50%, rgba(15,34,64,0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-[1fr_1fr] items-center gap-12 py-32 pt-40 lg:pt-32">

        {/* Left: Typography */}
        <div>
          <p
            className="animate-fade-up text-[#7BAFD4] text-xs font-semibold uppercase tracking-[0.12em] mb-8"
          >
            AI-powered extension planning · UK homeowners
          </p>

          <div
            id="hero-heading"
            role="heading"
            aria-level={1}
          >
            <p
              className="animate-fade-up animate-fade-up-1 text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 6.5vw, 84px)",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
              }}
            >
              Your home has
            </p>
            <p
              className="animate-fade-up animate-fade-up-1"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(44px, 6.5vw, 84px)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                color: "#7BAFD4",
                marginBottom: "2rem",
              }}
              aria-hidden="true"
            >
              more space in it.
            </p>
          </div>

          <p
            className="animate-fade-up animate-fade-up-2 text-white/65 leading-relaxed mb-10"
            style={{ fontSize: "clamp(16px, 1.8vw, 19px)", maxWidth: "460px" }}
          >
            Upload your floorplan. Get a professionally designed extension
            proposal, full cost breakdown, and planning compliance check — in
            under 5 minutes.
          </p>

          <div className="animate-fade-up animate-fade-up-3 flex flex-col sm:flex-row gap-3">
            <a
              href="#waitlist"
              className="hero-cta-primary inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-sm transition-all duration-200"
              style={{ minHeight: "56px", letterSpacing: "-0.01em", fontSize: "15px" }}
            >
              Upload your floorplan
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 text-white/65 font-medium px-6 py-4 rounded-sm border border-white/15 hover:border-white/35 hover:text-white transition-all duration-200"
              style={{ minHeight: "56px", fontSize: "15px" }}
            >
              See how it works
            </a>
          </div>

          <p className="animate-fade-up mt-6 text-white/30 text-sm">
            No account required · Free to start
          </p>
        </div>

        {/* Right: Animated floorplan */}
        <div className="hidden lg:flex items-center justify-center animate-fade-up animate-fade-up-2">
          <AnimatedFloorplan />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up animate-fade-up-3"
        aria-hidden="true"
      >
        <div className="scroll-cue" />
      </div>
    </section>
  );
}

/* ── Trust strip ────────────────────────────────────────────────────── */
function TrustStrip() {
  const items = [
    { label: "RIBA-aligned guidance" },
    { label: "UK planning regulations checked" },
    { label: "Results in under 5 minutes" },
    { label: "RICS 2025 build rates" },
  ];

  return (
    <div className="bg-[#F5F4F1] py-5 px-6 border-b border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-2 reveal"
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className="w-1 h-1 rounded-full bg-[#4A7FA5]" aria-hidden="true" />
              <span className="text-[13px] font-medium text-[#0F2240]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Animated Cost Estimate Feature ─────────────────────────────────── */
function CostEstimateFeature() {
  const { ref, inView } = useInView(0.25);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const target = 47250;
    const duration = 1800;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView]);

  const lineItems = [
    { label: "Rear wall (brick 6×2.7m)", value: "£3,564" },
    { label: "Side walls ×2", value: "£4,752" },
    { label: "Foundation & floor slab", value: "£2,880" },
    { label: "Flat roof (24 m²)", value: "£2,280" },
    { label: "Bi-fold doors + glazing", value: "£4,450" },
    { label: "Planning fees + contingency", value: "£3,566" },
  ];

  return (
    <section
      id="cost-estimate"
      className="cost-feature-bg py-32 px-6 overflow-hidden"
      aria-labelledby="cost-feature-heading"
    >
      <div ref={ref} className="max-w-6xl mx-auto">

        {/* Label */}
        <p
          className="text-[#4A7FA5] text-xs font-semibold uppercase tracking-[0.12em] mb-6 reveal"
        >
          Cost estimate
        </p>

        {/* Main heading */}
        <h2
          id="cost-feature-heading"
          className="text-white mb-20 reveal"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
          }}
        >
          Your extension.<br />
          <em style={{ color: "rgba(123,175,212,0.85)" }}>Costed to the pound.</em>
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: Big animated number */}
          <div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "clamp(64px, 7vw, 96px)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              £{count.toLocaleString("en-GB")}
            </div>

            <p className="text-white/45 text-sm mt-4 leading-relaxed">
              24 m² rear extension · Victorian terrace<br />East Dulwich, London SE22
            </p>

            {/* Cost range bar */}
            <div className="mt-10">
              <div className="flex justify-between text-xs text-white/35 mb-2">
                <span>Lower estimate</span>
                <span>Upper estimate</span>
              </div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4A7FA5] to-[#7BAFD4]"
                  style={{
                    width: inView ? "52%" : "0%",
                    transition: "width 1.6s ease 0.6s",
                  }}
                  role="meter"
                  aria-valuenow={47250}
                  aria-valuemin={37800}
                  aria-valuemax={61400}
                  aria-label="Cost estimate position in range"
                />
              </div>
              <div className="flex justify-between text-xs text-white/25 mt-1.5">
                <span>£37,800</span>
                <span>£61,400</span>
              </div>
            </div>

            <p className="text-white/25 text-xs mt-6">
              RICS 2025 regional rates · Updated quarterly
            </p>
          </div>

          {/* Right: Cascading breakdown */}
          <div>
            <div className="space-y-0">
              {lineItems.map((item, i) => (
                <div
                  key={item.label}
                  className="flex justify-between py-4 border-b border-white/8"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(28px)",
                    transition: `opacity 0.5s ease ${0.35 + i * 0.11}s, transform 0.5s ease ${0.35 + i * 0.11}s`,
                  }}
                >
                  <span className="text-white/55 text-sm pr-4">{item.label}</span>
                  <span className="text-white font-medium text-sm whitespace-nowrap tabular-nums">
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Total */}
              <div
                className="flex justify-between pt-5 mt-1"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.6s ease ${0.35 + lineItems.length * 0.11 + 0.15}s`,
                }}
              >
                <span className="text-white font-semibold">Total estimate (mid)</span>
                <span
                  className="text-[#4A7FA5] font-bold text-base tabular-nums"
                >
                  £47,250
                </span>
              </div>
            </div>

            <p
              className="text-white/25 text-xs mt-5"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ease 1.8s`,
              }}
            >
              Itemised from 8 cost categories · Includes planning fees and 10% contingency
            </p>

            {/* CTA inline */}
            <div
              className="mt-8"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ease 2.0s`,
              }}
            >
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 text-[#7BAFD4] text-sm font-medium hover:text-white transition-colors duration-200 group"
              >
                Get your estimate
                <svg
                  width="14" height="14" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5} aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
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
              <span className="inline-flex items-center gap-1 bg-[#F0FAF6] text-[#1A7F5A] text-[10px] font-semibold px-2 py-1 rounded-sm">
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
    <section id="how-it-works" className="py-[96px] bg-white px-6" aria-labelledby="how-it-works-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 reveal">
          <h2
            id="how-it-works-heading"
            className="text-[#0F2240] leading-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "-0.02em",
            }}
          >
            From floor plan to proposal<br className="hidden sm:block" /> in minutes
          </h2>
          <p className="text-[#2D3748] max-w-xl mx-auto leading-relaxed">
            No architect needed. No waiting weeks. Upload your floorplan and get a complete proposal in under five minutes.
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`${i % 2 === 1 ? "reveal-left" : "reveal-right"} flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="w-full lg:w-1/2 flex justify-center">
                {step.visual}
              </div>
              <div className="w-full lg:w-1/2">
                <div
                  className="text-[64px] font-bold leading-none mb-5 select-none"
                  style={{ color: "#E2E8F0" }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                <h3
                  className="text-[#0F2240] mb-3"
                  style={{ fontSize: "22px", fontWeight: 600 }}
                >
                  {step.title}
                </h3>
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
    <section className="py-[96px] bg-[#F5F4F1] px-6" aria-label="Customer testimonials">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal">
          <h2
            className="text-[#0F2240]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 40px)",
              letterSpacing: "-0.02em",
            }}
          >
            What homeowners say
          </h2>
        </div>

        <div className="testimonial-track flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {quotes.map((q, i) => (
            <article
              key={q.name}
              className="reveal flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-auto snap-start bg-white rounded-[8px] p-7 border border-[#E2E8F0] hover:border-[#4A7FA5]/40 hover:shadow-[0_4px_16px_rgba(15,34,64,0.07)] transition-all duration-200"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="text-[48px] leading-none text-[#4A7FA5] mb-2 select-none"
                style={{ fontFamily: "var(--font-display)" }}
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <p className="text-[16px] italic text-[#2D3748] leading-relaxed mb-6">{q.body}</p>
              <footer>
                <div className="font-semibold text-[#0F2240] text-[14px]">{q.name}</div>
                <div className="text-[#2D3748]/50 text-[13px]">{q.location}</div>
              </footer>
            </article>
          ))}
        </div>
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
    <section id="waitlist" className="py-[96px] bg-[#0F2240] px-6" aria-labelledby="waitlist-heading">
      <div className="max-w-xl mx-auto text-center">
        <div className="reveal">
          <p className="text-[#7BAFD4] text-xs font-semibold uppercase tracking-[0.12em] mb-5">
            Early access
          </p>
          <h2
            id="waitlist-heading"
            className="text-white leading-tight mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 4vw, 44px)",
              letterSpacing: "-0.02em",
            }}
          >
            Your home has more<br className="hidden sm:block" /> potential than you think
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Join the waitlist and be among the first to find out if you can extend.
          </p>
        </div>

        {status === "success" ? (
          <div className="reveal bg-[#1A7F5A]/15 border border-[#1A7F5A]/30 rounded-[8px] p-8">
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
                className="flex-1 px-4 py-3.5 rounded-sm border border-white/20 text-white text-base placeholder:text-white/30 bg-white/8 focus:border-[#4A7FA5] focus:outline-none transition-colors"
                style={{ minHeight: "56px" }}
                aria-describedby={errorMsg ? "waitlist-error" : undefined}
                aria-invalid={!!errorMsg || undefined}
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#4A7FA5] text-white font-semibold px-6 py-3.5 rounded-sm hover:bg-[#3d6e91] disabled:opacity-55 transition-all duration-200 whitespace-nowrap hover:scale-[1.01]"
                style={{ minHeight: "56px", letterSpacing: "-0.01em" }}
              >
                {status === "loading" ? "Joining…" : "Join the waitlist"}
              </button>
            </div>
            {errorMsg && (
              <p id="waitlist-error" role="alert" className="mt-2 text-sm text-[#B45309]">
                {errorMsg}
              </p>
            )}
            <p className="mt-3 text-xs text-white/30">
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
    <footer className="bg-[#080F1A] py-12 px-6" role="contentinfo">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-10 pb-8 border-b border-white/8">
          <div>
            <a href="/" aria-label="caniextend — home" className="inline-block mb-4">
              <Logo dark />
            </a>
            <p className="text-white/40 text-sm leading-relaxed max-w-[220px]">
              Making home extension planning accessible to every UK homeowner.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "#how-it-works", label: "How it works" },
                  { href: "#cost-estimate", label: "Cost estimate" },
                  { href: "#waitlist", label: "Join the waitlist" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-white/40 hover:text-white transition-colors duration-200"
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
                      className="text-white/40 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
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
        <CostEstimateFeature />
        <Testimonials />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Scroll-reveal hook ─────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Sticky nav scroll effect ───────────────────────────────────── */
function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scrolled;
}

/* ─── Nav ────────────────────────────────────────────────────────── */
function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm nav-scrolled" : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-lg text-[var(--fg)]" aria-label="Can I Extend — home">
          <span className="w-8 h-8 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white text-sm font-black">CI</span>
          <span>Can I Extend</span>
        </a>
        <div className="hidden sm:flex items-center gap-6 text-sm text-[var(--fg-muted)]">
          <a href="#how-it-works" className="hover:text-[var(--fg)] transition-colors">How it works</a>
          <a href="#what-you-get" className="hover:text-[var(--fg)] transition-colors">What you get</a>
          <a href="#for-who" className="hover:text-[var(--fg)] transition-colors">Who is it for</a>
        </div>
        <a
          href="#waitlist"
          className="inline-flex items-center gap-1.5 bg-[var(--brand)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--brand-dark)] transition-colors"
        >
          Join the waitlist
        </a>
      </div>
    </nav>
  );
}

/* ─── Section 1: Hero ────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-white pt-20 pb-16 px-4 overflow-hidden">
      {/* Soft gradient background blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2E61FF, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--brand-light)] text-[var(--brand)] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          Now accepting waitlist signups
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--fg)] leading-tight mb-6 animate-fade-up animate-fade-up-delay-1">
          Can I extend <br className="hidden sm:block" />
          <span className="text-gradient">my home?</span>
        </h1>

        <p className="text-lg sm:text-xl text-[var(--fg-muted)] max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up animate-fade-up-delay-2">
          Most homeowners don&apos;t know their home has more potential than they think.
          Find out in minutes — get a professionally designed extension with costs and
          planning compliance, powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animate-fade-up-delay-3">
          <a
            href="#samples"
            className="inline-flex items-center justify-center gap-2 bg-[var(--brand)] text-white font-semibold px-6 py-3.5 rounded-xl text-base hover:bg-[var(--brand-dark)] transition-colors shadow-lg shadow-blue-500/20"
          >
            See what&apos;s possible
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--fg)] font-semibold px-6 py-3.5 rounded-xl text-base hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
          >
            Join the waitlist
          </a>
        </div>

        {/* Before/after floorplan visual */}
        <div className="mt-14 relative mx-auto max-w-3xl animate-fade-up animate-fade-up-delay-4">
          <div className="rounded-2xl border border-[var(--border)] shadow-2xl shadow-black/8 overflow-hidden bg-[var(--bg-muted)]">
            <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
              <div className="p-6 sm:p-8">
                <div className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Before</div>
                {/* Placeholder floorplan SVG */}
                <div className="aspect-[4/3] bg-white rounded-lg border border-[var(--border)] flex items-center justify-center">
                  <FloorplanPlaceholder type="before" />
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-[var(--brand-light)]/40">
                <div className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-3">After — AI Extension</div>
                <div className="aspect-[4/3] bg-white rounded-lg border border-[var(--border)] flex items-center justify-center">
                  <FloorplanPlaceholder type="after" />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-[var(--border)] bg-white text-xs text-[var(--fg-muted)] text-center">
              Example: 3-bed semi-detached in South London — 4.5m rear extension, £68,000 estimated cost
            </div>
          </div>
        </div>

        {/* Social proof bar */}
        <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm text-[var(--fg-muted)] animate-fade-up">
          {[
            { icon: "🇬🇧", label: "UK homes only" },
            { icon: "⚡", label: "Results in minutes" },
            { icon: "📋", label: "Based on GPDO 2015" },
            { icon: "🔒", label: "GDPR compliant" },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span aria-hidden="true">{icon}</span> {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Floorplan placeholder SVG */
function FloorplanPlaceholder({ type }: { type: "before" | "after" }) {
  const isAfter = type === "after";
  return (
    <svg viewBox="0 0 160 120" className="w-full max-w-[200px] opacity-70" aria-hidden="true">
      {/* House outline */}
      <rect x="20" y="30" width="80" height="70" fill="none" stroke={isAfter ? "#2E61FF" : "#9CA3AF"} strokeWidth="1.5" />
      {/* Rooms */}
      <rect x="20" y="30" width="40" height="35" fill={isAfter ? "#EEF3FF" : "#F3F4F6"} stroke={isAfter ? "#2E61FF" : "#9CA3AF"} strokeWidth="1" />
      <rect x="60" y="30" width="40" height="35" fill={isAfter ? "#EEF3FF" : "#F3F4F6"} stroke={isAfter ? "#2E61FF" : "#9CA3AF"} strokeWidth="1" />
      <rect x="20" y="65" width="80" height="35" fill={isAfter ? "#EEF3FF" : "#F3F4F6"} stroke={isAfter ? "#2E61FF" : "#9CA3AF"} strokeWidth="1" />
      {/* Extension */}
      {isAfter && (
        <>
          <rect x="100" y="40" width="40" height="55" fill="#DBEAFE" stroke="#2E61FF" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="112" y="70" fontSize="7" fill="#2E61FF" fontWeight="600">New</text>
        </>
      )}
      {/* Labels */}
      <text x="35" y="52" fontSize="5" fill={isAfter ? "#2E61FF" : "#6B7280"} textAnchor="middle">Kitchen</text>
      <text x="75" y="52" fontSize="5" fill={isAfter ? "#2E61FF" : "#6B7280"} textAnchor="middle">Living</text>
      <text x="55" y="85" fontSize="5" fill={isAfter ? "#2E61FF" : "#6B7280"} textAnchor="middle">Bedroom</text>
    </svg>
  );
}

/* ─── Section 2: How it works ────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#2E61FF" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Upload your floorplan",
      body: "Take a photo of your property's floorplan — estate agent brochure, architect drawing, or even a hand sketch. We accept any format.",
    },
    {
      number: "02",
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#2E61FF" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Our AI analyses your property",
      body: "We cross-reference your floorplan with UK planning rules, your property boundaries, and local authority records to identify your extension options.",
    },
    {
      number: "03",
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#2E61FF" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Get your extension proposal",
      body: "In minutes you receive a complete extension design, cost estimate, planning compliance check, and comparison with similar properties nearby.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-[var(--bg-muted)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-3">Simple process</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--fg)] tracking-tight">
            How it works
          </h2>
          <p className="mt-4 text-[var(--fg-muted)] max-w-xl mx-auto">
            From floorplan to proposal in three steps. No architect needed, no waiting weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="reveal bg-white rounded-2xl border border-[var(--border)] p-7 relative"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-light)] flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <div className="absolute top-5 right-5 text-5xl font-black text-[var(--border)] select-none">
                {step.number}
              </div>
              <h3 className="text-base font-bold text-[var(--fg)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 3: What you get ────────────────────────────────────── */
function WhatYouGetSection() {
  const items = [
    {
      icon: "📐",
      title: "Extension design",
      body: "A scaled architectural drawing of your proposed extension, showing the new layout alongside your existing floorplan.",
    },
    {
      icon: "✅",
      title: "Planning compliance check",
      body: "We check your extension against Permitted Development rights and local planning rules — so you know before you build.",
    },
    {
      icon: "💷",
      title: "Cost estimate",
      body: "A realistic cost breakdown for your extension based on current UK build rates, your location, and extension type.",
    },
    {
      icon: "🏘️",
      title: "Neighbour comparison",
      body: "See what similar extensions nearby have been approved for, with actual costs and planning outcomes.",
    },
  ];

  return (
    <section id="what-you-get" className="py-20 sm:py-28 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-3">Your proposal includes</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--fg)] tracking-tight">
            Everything you need to decide
          </h2>
          <p className="mt-4 text-[var(--fg-muted)] max-w-xl mx-auto">
            No more paying thousands for a feasibility study. Get the same quality insight in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="reveal flex gap-5 p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--brand)] hover:shadow-lg hover:shadow-blue-50 transition-all"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="text-3xl flex-shrink-0 mt-0.5" aria-hidden="true">{item.icon}</div>
              <div>
                <h3 className="font-bold text-[var(--fg)] mb-1.5">{item.title}</h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 4: Sample results ──────────────────────────────────── */
function SampleResultsSection() {
  return (
    <section id="samples" className="py-20 sm:py-28 px-4 bg-[var(--bg-muted)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-3">Real output</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--fg)] tracking-tight">
            Sample results
          </h2>
          <p className="mt-4 text-[var(--fg-muted)] max-w-xl mx-auto">
            Here&apos;s what a typical Can I Extend report looks like.
          </p>
        </div>

        <div className="reveal bg-white rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
          {/* Mock report header */}
          <div className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between bg-[var(--brand-light)]/30">
            <div>
              <div className="text-xs text-[var(--fg-muted)] uppercase tracking-wider mb-0.5">Sample Report</div>
              <div className="font-bold text-[var(--fg)]">24 Clarence Street, SE15 — 3-bed terrace</div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Permitted Development
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
            {/* Floorplan comparison */}
            <div className="col-span-2 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-2">Existing</div>
                  <div className="aspect-[4/3] bg-[var(--bg-muted)] rounded-xl border border-[var(--border)] flex items-center justify-center">
                    <FloorplanPlaceholder type="before" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-2">With Extension</div>
                  <div className="aspect-[4/3] bg-[var(--brand-light)]/40 rounded-xl border border-[var(--brand)]/30 flex items-center justify-center">
                    <FloorplanPlaceholder type="after" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[var(--fg-muted)] mt-3">
                Proposed: 4.5m rear single-storey extension. Adds approx. 28m² to ground floor.
              </p>
            </div>

            {/* Stats panel */}
            <div className="p-6 space-y-5">
              {[
                { label: "Est. cost", value: "£62,000–£74,000", sub: "Based on SE London rates" },
                { label: "Planning route", value: "Permitted Development", sub: "No application required" },
                { label: "Build time", value: "10–14 weeks", sub: "Typical for this size" },
                { label: "Value added", value: "+£45,000–£60,000", sub: "Based on local comparables" },
              ].map(({ label, value, sub }) => (
                <div key={label}>
                  <div className="text-xs text-[var(--fg-muted)] mb-0.5">{label}</div>
                  <div className="font-bold text-[var(--fg)] text-sm">{value}</div>
                  <div className="text-xs text-[var(--fg-muted)]">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 text-[var(--brand)] font-semibold text-sm hover:underline"
          >
            Get your own report — join the waitlist
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Section 5: For who ─────────────────────────────────────────── */
function ForWhoSection() {
  const audiences = [
    {
      emoji: "🔍",
      title: "Homeowners curious about their options",
      body: "You live in a house and wonder — could I get more space? Could I extend into the garden? Is it even allowed? We give you a clear answer.",
    },
    {
      emoji: "🏡",
      title: "Buyers evaluating potential",
      body: "Viewing a house and wondering if the kitchen could be bigger? Check extension potential before you make an offer.",
    },
    {
      emoji: "📈",
      title: "Owners planning their next move",
      body: "Extend and stay, or sell and move? Understanding your extension options helps you make the right decision for your family.",
    },
  ];

  return (
    <section id="for-who" className="py-20 sm:py-28 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-3">Who is it for</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--fg)] tracking-tight">
            Made for UK homeowners
          </h2>
          <p className="mt-4 text-[var(--fg-muted)] max-w-xl mx-auto">
            Whether you&apos;re curious, planning, or buying — Can I Extend gives you the information you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {audiences.map((a, i) => (
            <div
              key={a.title}
              className="reveal text-center p-8 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border)]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4" aria-hidden="true">{a.emoji}</div>
              <h3 className="font-bold text-[var(--fg)] mb-3 text-base">{a.title}</h3>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 6: Trust signals ───────────────────────────────────── */
function TrustSection() {
  const signals = [
    {
      icon: "📋",
      title: "UK planning expertise",
      body: "Built on the General Permitted Development Order 2015 and updated for local planning authority variations across England.",
    },
    {
      icon: "🗺️",
      title: "Local data",
      body: "We cross-reference Land Registry data, planning applications, and property sold prices to give you local context.",
    },
    {
      icon: "🏗️",
      title: "Real build costs",
      body: "Cost estimates are based on current UK build rates from RICS data, updated quarterly, adjusted for your region.",
    },
    {
      icon: "🔒",
      title: "Privacy first",
      body: "Your floorplan and property data is processed securely and never shared. GDPR compliant, hosted in the UK.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 bg-[var(--brand)] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Why trust us</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Built on real data
          </h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            Not guesswork. Not generic estimates. Can I Extend is built on UK planning law, local authority data, and real build costs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {signals.map((s, i) => (
            <div
              key={s.title}
              className="reveal bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="text-3xl mb-3" aria-hidden="true">{s.icon}</div>
              <h3 className="font-bold text-white mb-2 text-sm">{s.title}</h3>
              <p className="text-xs text-white/70 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section 7: Waitlist signup ─────────────────────────────────── */
function WaitlistSection() {
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
    <section id="waitlist" className="py-20 sm:py-28 px-4 bg-white">
      <div className="max-w-xl mx-auto text-center">
        <div className="reveal">
          <p className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-3">Early access</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--fg)] tracking-tight mb-4">
            Your home has more potential<br className="hidden sm:block" /> than you think
          </h2>
          <p className="text-[var(--fg-muted)] mb-8 leading-relaxed">
            Join the waitlist and be among the first to find out if you can extend.
            We&apos;ll let you know as soon as early access opens.
          </p>
        </div>

        {status === "success" ? (
          <div className="reveal bg-green-50 border border-green-200 rounded-2xl p-8">
            <div className="text-4xl mb-3" aria-hidden="true">🎉</div>
            <h3 className="font-bold text-green-900 text-lg mb-1">You&apos;re on the list!</h3>
            <p className="text-green-700 text-sm">
              We&apos;ll be in touch as soon as early access is ready. Keep an eye on your inbox.
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
              <label htmlFor="waitlist-email" className="sr-only">Your email address</label>
              <input
                ref={inputRef}
                id="waitlist-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3.5 rounded-xl border border-[var(--border)] text-[var(--fg)] text-base placeholder:text-[var(--fg-muted)] bg-white"
                aria-describedby={errorMsg ? "waitlist-error" : undefined}
                aria-invalid={!!errorMsg}
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[var(--brand)] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[var(--brand-dark)] disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                {status === "loading" ? "Joining…" : "Join the waitlist"}
              </button>
            </div>
            {errorMsg && (
              <p id="waitlist-error" role="alert" className="mt-2 text-sm text-red-600">
                {errorMsg}
              </p>
            )}
            <p className="mt-3 text-xs text-[var(--fg-muted)]">
              No spam. One email when early access opens. Unsubscribe any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─── Section 8: Footer ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[var(--fg)] text-white/60 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-md bg-[var(--brand)] flex items-center justify-center text-white text-xs font-black">CI</span>
              <span className="font-bold text-white">Can I Extend</span>
            </div>
            <p className="text-sm leading-relaxed">
              Making home extension planning accessible to every UK homeowner.
            </p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#what-you-get" className="hover:text-white transition-colors">What you get</a></li>
              <li><a href="#samples" className="hover:text-white transition-colors">Sample results</a></li>
              <li><a href="#waitlist" className="hover:text-white transition-colors">Join the waitlist</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of service</a></li>
              <li><a href="/cookies" className="hover:text-white transition-colors">Cookie policy</a></li>
              <li><a href="mailto:hello@caniextend.com" className="hover:text-white transition-colors">Contact us</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Can I Extend Ltd. All rights reserved.</p>
          <p>Registered in England and Wales. Based on GPDO 2015.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function HomePage() {
  useReveal();
  const scrolled = useNavScroll();

  return (
    <>
      <Nav scrolled={scrolled} />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <WhatYouGetSection />
        <SampleResultsSection />
        <ForWhoSection />
        <TrustSection />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}

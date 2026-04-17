"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Hooks ─────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
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
    const h = () => setScrolled(window.scrollY > 60);
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

/* ── Arrow Icon ────────────────────────────────────────────────────── */
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Blueprint SVG ─────────────────────────────────────────────────── */
function BlueprintSVG() {
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    animated.current = true;

    const lines = [
      { id: "l1", delay: 200, dur: 700 },
      { id: "l2", delay: 700, dur: 400 },
      { id: "l5", delay: 900, dur: 700 },
      { id: "l4", delay: 1400, dur: 700 },
      { id: "l3", delay: 1900, dur: 300 },
      { id: "l6", delay: 2200, dur: 500 },
      { id: "l7", delay: 2400, dur: 400 },
      { id: "l8", delay: 2600, dur: 400 },
      { id: "l9", delay: 2700, dur: 400 },
      { id: "door1", delay: 3000, dur: 400 },
      { id: "door2", delay: 3100, dur: 400 },
      { id: "w1", delay: 3200, dur: 200 },
      { id: "w2", delay: 3300, dur: 200 },
      { id: "w3", delay: 3400, dur: 200 },
    ];
    const extLines = [
      { id: "e1", delay: 3800, dur: 500 },
      { id: "e2", delay: 4200, dur: 500 },
      { id: "e3", delay: 4600, dur: 500 },
      { id: "e4", delay: 5000, dur: 300 },
      { id: "e5", delay: 5200, dur: 400 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Scan line
    timers.push(setTimeout(() => {
      const scan = document.getElementById("scanLine");
      if (!scan) return;
      scan.style.cssText = "opacity:1; top:8%; transition:top 2s linear, opacity 0.3s";
      timers.push(setTimeout(() => { scan.style.top = "92%"; }, 100));
      timers.push(setTimeout(() => { scan.style.opacity = "0"; }, 2200));
    }, 100));

    // Draw house lines
    [...lines, ...extLines].forEach(({ id, delay, dur }) => {
      timers.push(setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          el.style.strokeDashoffset = "0";
        }
      }, delay));
    });

    // Fill house
    timers.push(setTimeout(() => {
      const el = document.getElementById("houseFill");
      if (el) el.style.opacity = "1";
    }, 3200));

    // Extension fill + labels + badge
    timers.push(setTimeout(() => {
      const el = document.getElementById("extFill");
      if (el) el.style.cssText = "opacity:1; transition:opacity 1s";
    }, 5400));

    timers.push(setTimeout(() => {
      ["dim1", "dim2", "dimv1", "dimv2"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.cssText = "opacity:1; transition:opacity 0.6s";
      });
      ["lbl1", "lbl2", "lbl3", "lbl4", "lbl5"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.cssText = "opacity:1; transition:opacity 0.6s";
      });
      ["badge1", "badge2"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.cssText = "opacity:1; transform:scale(1); transition:opacity 0.4s, transform 0.4s";
      });
    }, 5600));

    // Status pill
    timers.push(setTimeout(() => {
      const el = document.getElementById("statusPill");
      if (el) el.style.opacity = "1";
    }, 6200));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <svg id="blueprint-svg" viewBox="0 0 480 440" xmlns="http://www.w3.org/2000/svg">
      <polygon className="bp-fill" id="houseFill" points="60,80 320,80 320,320 60,320" />
      <rect className="bp-fill-ext" id="extFill" x="320" y="160" width="100" height="120" />

      <line className="bp-line" id="l1" x1="60" y1="80" x2="320" y2="80" />
      <line className="bp-line" id="l2" x1="320" y1="80" x2="320" y2="160" />
      <line className="bp-line" id="l3" x1="320" y1="280" x2="320" y2="320" />
      <line className="bp-line" id="l4" x1="320" y1="320" x2="60" y2="320" />
      <line className="bp-line" id="l5" x1="60" y1="320" x2="60" y2="80" />

      <line className="bp-line" id="l6" x1="60" y1="200" x2="220" y2="200" style={{ strokeDasharray: 800, strokeDashoffset: 800, opacity: 0.5 }} />
      <line className="bp-line" id="l7" x1="190" y1="80" x2="190" y2="200" style={{ strokeDasharray: 800, strokeDashoffset: 800, opacity: 0.5 }} />
      <line className="bp-line" id="l8" x1="190" y1="200" x2="190" y2="320" style={{ strokeDasharray: 800, strokeDashoffset: 800, opacity: 0.5 }} />
      <line className="bp-line" id="l9" x1="220" y1="200" x2="320" y2="200" style={{ strokeDasharray: 800, strokeDashoffset: 800, opacity: 0.5 }} />

      <path className="bp-line" id="door1" d="M190,200 Q165,180 140,200" style={{ strokeWidth: 1.5, strokeDasharray: 200, strokeDashoffset: 200, opacity: 0.6 }} />
      <path className="bp-line" id="door2" d="M190,200 Q210,225 190,250" style={{ strokeWidth: 1.5, strokeDasharray: 200, strokeDashoffset: 200, opacity: 0.6 }} />

      <line className="bp-line" id="w1" x1="90" y1="80" x2="90" y2="68" style={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0.5 }} />
      <line className="bp-line" id="w2" x1="150" y1="80" x2="150" y2="68" style={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0.5 }} />
      <line className="bp-line" id="w3" x1="240" y1="80" x2="240" y2="68" style={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0.5 }} />

      <line className="bp-line-ext" id="e1" x1="320" y1="160" x2="420" y2="160" />
      <line className="bp-line-ext" id="e2" x1="420" y1="160" x2="420" y2="280" />
      <line className="bp-line-ext" id="e3" x1="420" y1="280" x2="320" y2="280" />
      <line className="bp-line-ext" id="e4" x1="340" y1="280" x2="400" y2="280" style={{ strokeWidth: 3 }} />
      <path className="bp-line-ext" id="e5" d="M340,280 Q370,254 400,280" style={{ strokeWidth: 1.5, strokeDasharray: 200, strokeDashoffset: 200 }} />

      <line className="bp-dim-line" id="dim1" x1="60" y1="340" x2="320" y2="340" />
      <line className="bp-dim-line" id="dim2" x1="320" y1="340" x2="420" y2="340" />
      <line className="bp-dim-line" id="dimv1" x1="440" y1="80" x2="440" y2="320" />
      <line className="bp-dim-line" id="dimv2" x1="440" y1="160" x2="440" y2="280" />

      <text className="bp-label" id="lbl1" x="180" y="360" textAnchor="middle">8.0m</text>
      <text className="bp-label" id="lbl2" x="370" y="360" textAnchor="middle">3.0m</text>
      <text className="bp-label" id="lbl3" x="460" y="205" textAnchor="middle" transform="rotate(90, 460, 205)">7.2m</text>
      <text className="bp-label-ext" id="lbl4" x="370" y="228" textAnchor="middle">EXTENSION</text>
      <text className="bp-label-ext" id="lbl5" x="370" y="244" textAnchor="middle" style={{ fontSize: 9, opacity: 0.7 }}>+36m²</text>

      <rect className="bp-badge" id="badge1" x="338" y="175" width="64" height="22" rx="4" fill="rgba(200,155,60,0.15)" stroke="rgba(200,155,60,0.35)" strokeWidth="1" />
      <text className="bp-badge" id="badge2" x="370" y="190" textAnchor="middle" fill="var(--gold-light)" fontFamily="DM Sans" fontSize="9" fontWeight="600">AI DESIGNED</text>
    </svg>
  );
}

/* ── Planning Demo ─────────────────────────────────────────────────── */
function PlanningDemo() {
  const { ref, inView } = useInView(0.3);

  const checks = [
    { status: "pass" as const, title: "Height limit", desc: "3.0m extension ≤ 4.0m maximum single-storey", delay: 0 },
    { status: "pass" as const, title: "Rear setback", desc: "Does not project beyond rear of original dwelling", delay: 200 },
    { status: "pass" as const, title: "Side boundary", desc: "1.2m clear of boundary — minimum 1.0m required", delay: 400 },
    { status: "warn" as const, title: "Eaves height", desc: "Within 2m of boundary — materials must match", delay: 600 },
    { status: "pass" as const, title: "Conservation area", desc: "Not in designated conservation area", delay: 800 },
  ];

  return (
    <div className="planning-demo" ref={ref}>
      <div className="planning-title">Planning Assessment</div>
      <div className="planning-sub">14 Carlisle Road, SW11 6PD</div>
      {checks.map((c, i) => (
        <CheckItem key={i} {...c} inView={inView} />
      ))}
      <div className={`planning-result ${inView ? "visible" : ""}`} style={{ transitionDelay: inView ? "1.4s" : "0s" }}>
        <div className="planning-result-icon">📋</div>
        <div className="planning-result-text">
          <strong>Permitted Development — 4/5 passed</strong>
          <span>No planning application required. One advisory note.</span>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ status, title, desc, delay, inView }: { status: "pass" | "warn"; title: string; desc: string; delay: number; inView: boolean }) {
  return (
    <div className={`check-item ${inView ? "visible" : ""}`} style={{ transitionDelay: inView ? `${delay + 300}ms` : "0s" }}>
      <div className={`check-icon ${status}`}>{status === "pass" ? "✓" : "!"}</div>
      <div className="check-text">
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
      <span className={`check-badge ${status}`}>{status === "pass" ? "Pass" : "Note"}</span>
    </div>
  );
}

/* ── Cost Demo ─────────────────────────────────────────────────────── */
function CostDemo() {
  const { ref, inView } = useInView(0.3);
  const [counter, setCounter] = useState(0);
  const counterStarted = useRef(false);

  useEffect(() => {
    if (!inView || counterStarted.current) return;
    counterStarted.current = true;
    const target = 68400;
    const duration = 1800;
    const start = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.round(eased * target));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView]);

  const bars = [
    { name: "Structure & foundations", amount: "£22,400", width: "72%", color: "blue", delay: 0 },
    { name: "Roof & weatherproofing", amount: "£16,800", width: "58%", color: "blue", delay: 150 },
    { name: "Glazing & bi-folds", amount: "£12,600", width: "45%", color: "gold", delay: 300 },
    { name: "Electrics & plumbing", amount: "£9,800", width: "38%", color: "soft", delay: 450 },
    { name: "Finishes & fit-out", amount: "£6,800", width: "22%", color: "soft", delay: 600 },
  ];

  return (
    <div className="cost-demo" ref={ref}>
      <div className="cost-total">
        <div className="cost-total-label">Total Estimate</div>
        <div className="cost-total-value">
          <span className="currency">£</span>{counter.toLocaleString("en-GB")}
        </div>
        <div className="cost-range">Range: £61,500 — £75,200</div>
      </div>
      <div className="cost-bars">
        {bars.map((bar, i) => (
          <div key={i} className={`cost-bar-item ${inView ? "visible" : ""}`} style={{ transitionDelay: inView ? `${bar.delay + 200}ms` : "0s" }}>
            <div className="cost-bar-meta">
              <span className="cost-bar-name">{bar.name}</span>
              <span className="cost-bar-amount">{bar.amount}</span>
            </div>
            <div className="cost-bar-track">
              <div className={`cost-bar-fill ${bar.color}`} style={{ width: inView ? bar.width : "0" }} />
            </div>
          </div>
        ))}
      </div>
      <div className="cost-regional">
        <span>📍</span>
        Based on Q1 2026 BCIS rates for South West London. Updated quarterly.
      </div>
    </div>
  );
}

/* ── Neighbour Demo ────────────────────────────────────────────────── */
function NeighbourDemo() {
  const { ref, inView } = useInView(0.25);

  const houses = [
    { label: "No. 8", ext: "+18m²", height: 55, flex: 0.85, delay: 0, yours: false },
    { label: "No. 10", ext: "+52m²", height: 68, flex: 1.1, delay: 200, yours: false },
    { label: "No. 14 (You)", ext: "YOUR PLAN +36m²", height: 76, flex: 1.25, delay: 100, yours: true },
    { label: "No. 16", ext: "No ext.", height: 50, flex: 0.9, delay: 300, yours: false },
    { label: "No. 18", ext: "+12m²", height: 62, flex: 1.0, delay: 450, yours: false },
  ];

  const stats = [
    { value: "3/4", label: "neighbours have extended", color: "var(--blue)", delay: 0 },
    { value: "100%", label: "planning approval rate on this street", color: "#1a7f5a", delay: 150 },
    { value: "+36m²", label: "your proposed extension size", color: undefined, delay: 300 },
    { value: "+£68k", label: "estimated added property value", color: undefined, delay: 450 },
  ];

  return (
    <div className="neighbour-demo" ref={ref}>
      <div className="street-label">Carlisle Road, SW11</div>
      <div className="street-view">
        {houses.map((h, i) => (
          <div key={i} className={`house ${inView ? "visible" : ""}`} style={{ flex: h.flex, transitionDelay: inView ? `${h.delay + 300}ms` : "0s" }}>
            <div className={`house-body ${h.yours ? "yours" : "neighbour"}`} style={{ height: h.height }}>
              <div className="house-ext-tag" style={h.yours ? { color: "var(--blue)", borderColor: "var(--blue)" } : undefined}>{h.ext}</div>
              <div className="house-base" style={h.yours ? { background: "var(--blue)", opacity: 0.3 } : undefined} />
            </div>
            <span className={`house-label ${h.yours ? "yours-label" : ""}`}>{h.label}</span>
          </div>
        ))}
      </div>
      <div className="neighbour-stats">
        {stats.map((s, i) => (
          <div key={i} className={`n-stat ${inView ? "visible" : ""}`} style={{ transitionDelay: inView ? `${s.delay + 1000}ms` : "0s" }}>
            <div className="n-stat-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div>
            <div className="n-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function Home() {
  useReveal();
  const scrolled = useNavScroll();

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll(".hero .reveal").forEach((el, i) => {
        setTimeout(() => el.classList.add("visible"), 200 + i * 120);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <img src="/brand/mark.svg" alt="" width="32" height="32" />
          </div>
          <span className="nav-logo-text">Can I Extend</span>
        </a>
        <ul className="nav-links">
          <li><a href="#feat-planning">How it works</a></li>
          <li><a href="#feat-planning">Planning rules</a></li>
          <li><a href="#feat-cost">Pricing</a></li>
        </ul>
        <a href="/proposals" className="nav-cta">Get your report →</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label reveal">AI-Powered Extension Planning</div>
          <h1 className="hero-headline reveal reveal-delay-1">
            See what your<br />
            home could<br />
            <span className="accent">become.</span>
          </h1>
          <p className="hero-sub reveal reveal-delay-2">
            Upload a floorplan. Our AI designs your extension, checks planning permission, estimates costs, and compares your neighbours — in under ten minutes.
          </p>
          <div className="hero-actions reveal reveal-delay-3">
            <a href="/proposals" className="btn-gold">Upload your floorplan →</a>
            <a href="#feat-planning" className="btn-ghost">See how it works</a>
          </div>
          <div className="hero-social reveal reveal-delay-3">
            <div className="hero-social-faces">
              <div className="face">🏠</div>
              <div className="face">🏡</div>
              <div className="face">🏘</div>
              <div className="face">+</div>
            </div>
            <span className="hero-social-text">2,847 extensions designed this month</span>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="blueprint-frame">
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />
            <div className="scan-line" id="scanLine" />
            <div className="status-pill" id="statusPill">✓ Permitted Development</div>
            <BlueprintSVG />
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <div className="statement">
        <div className="statement-number">10</div>
        <p className="statement-text reveal">
          Ten minutes. <span className="soft">Not ten weeks.</span>
        </p>
      </div>

      {/* FEATURE 01: Planning Check */}
      <section className="feature dark" id="feat-planning">
        <div className="feature-copy">
          <div className="feature-index reveal">01 / Planning Rules</div>
          <h2 className="feature-headline reveal reveal-delay-1">Your extension, checked against every rule</h2>
          <p className="feature-body reveal reveal-delay-2">
            We run your design against UK Permitted Development rights, local Article 4 directions, and conservation area restrictions — in seconds. No solicitor required.
          </p>
          <a href="#" className="feature-link reveal reveal-delay-3">
            See how it works <ArrowIcon />
          </a>
        </div>
        <div className="feature-demo">
          <PlanningDemo />
        </div>
      </section>

      {/* FEATURE 02: Cost Estimate */}
      <section className="feature light reversed" id="feat-cost">
        <div className="feature-copy">
          <div className="feature-index reveal">02 / Cost Estimate</div>
          <h2 className="feature-headline reveal reveal-delay-1">Real costs, not rough guesses</h2>
          <p className="feature-body reveal reveal-delay-2">
            We calculate your estimate from live regional build-cost data, updated every quarter. See exactly where your money goes before you speak to a single builder.
          </p>
          <a href="#" className="feature-link reveal reveal-delay-3">
            See sample report <ArrowIcon />
          </a>
        </div>
        <div className="feature-demo" style={{ background: "var(--navy)" }}>
          <CostDemo />
        </div>
      </section>

      {/* FEATURE 03: Neighbour Comparison */}
      <section className="feature dark" id="feat-neighbour">
        <div className="feature-demo" style={{ background: "var(--stone)" }}>
          <NeighbourDemo />
        </div>
        <div className="feature-copy" style={{ background: "var(--navy-deep)" }}>
          <div className="feature-index reveal">03 / Neighbour Comparison</div>
          <h2 className="feature-headline reveal reveal-delay-1">See what your street has already built</h2>
          <p className="feature-body reveal reveal-delay-2">
            We pull planning application data for every house within 100m. You see what your neighbours approved, what they built, and what that means for your application.
          </p>
          <a href="#" className="feature-link reveal reveal-delay-3">
            See how we source data <ArrowIcon />
          </a>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div className="social-proof">
        <p className="quote-text reveal">
          &ldquo;I&rsquo;d been putting off the extension for two years because I didn&rsquo;t know where to start. Can I Extend gave me everything I needed in one afternoon. The planning check alone was worth it.&rdquo;
        </p>
        <div className="quote-attr reveal reveal-delay-1">
          <div className="quote-avatar">🏠</div>
          <div className="quote-name">
            <strong>Sarah Thornton</strong>
            <span>Homeowner, Clapham</span>
          </div>
        </div>
      </div>

      {/* COUNTER */}
      <div className="counter-section">
        <div className="counter-value reveal">2,847</div>
        <div className="counter-sub reveal reveal-delay-1">extensions designed and counting</div>
        <div className="counter-substats reveal reveal-delay-2">
          <div className="counter-substat">
            <div className="counter-substat-num">47</div>
            <div className="counter-substat-label">postcodes covered</div>
          </div>
          <div className="counter-substat">
            <div className="counter-substat-num">9 min</div>
            <div className="counter-substat-label">average to results</div>
          </div>
          <div className="counter-substat">
            <div className="counter-substat-num">100%</div>
            <div className="counter-substat-label">online — no calls</div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="cta-glow" />
        <h2 className="final-cta-headline reveal">
          Your home,<br />
          <em style={{ color: "var(--blue-light)" }}>extended.</em>
        </h2>
        <p className="final-cta-sub reveal reveal-delay-1">Upload a floorplan. Get your report in 10 minutes.</p>
        <div className="final-cta-actions reveal reveal-delay-2">
          <a href="/proposals" className="btn-gold" style={{ fontSize: 17, padding: "18px 48px" }}>
            Get started — it&rsquo;s free →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-logo">Can I Extend</div>
        <ul className="footer-links">
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="#feat-planning">Planning rules</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className="footer-copy">© 2026 Can I Extend Ltd</div>
      </footer>
    </>
  );
}

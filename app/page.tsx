"use client";

import { useState, useEffect, useRef } from "react";

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return scrolled;
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started.current) { started.current = true; setActive(true); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return { ref, count };
}

/* ── Blueprint hero animation ── */
function BlueprintHero() {
  const scanRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const getEl = (id: string) => svg.querySelector<SVGElement>(`#${id}`);

    const lines: { id: string; delay: number; dur: number }[] = [
      { id: "l1", delay: 120, dur: 400 },
      { id: "l2", delay: 400, dur: 250 },
      { id: "l5", delay: 550, dur: 400 },
      { id: "l4", delay: 850, dur: 400 },
      { id: "l3", delay: 1150, dur: 200 },
      { id: "l6", delay: 1300, dur: 300 },
      { id: "l7", delay: 1450, dur: 250 },
      { id: "l8", delay: 1600, dur: 250 },
      { id: "l9", delay: 1650, dur: 250 },
      { id: "door1", delay: 1800, dur: 250 },
      { id: "door2", delay: 1900, dur: 250 },
      { id: "w1", delay: 1950, dur: 150 },
      { id: "w2", delay: 2000, dur: 150 },
      { id: "w3", delay: 2100, dur: 150 },
    ];
    const extLines: { id: string; delay: number; dur: number }[] = [
      { id: "e1", delay: 2300, dur: 300 },
      { id: "e2", delay: 2550, dur: 300 },
      { id: "e3", delay: 2800, dur: 300 },
      { id: "e4", delay: 3000, dur: 200 },
      { id: "e5", delay: 3150, dur: 250 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Scan line
    timers.push(setTimeout(() => {
      const scan = scanRef.current;
      if (!scan) return;
      scan.style.opacity = "1";
      scan.style.top = "8%";
      scan.style.transition = "top 1.2s linear, opacity 0.3s";
      timers.push(setTimeout(() => { scan.style.top = "92%"; }, 80));
      timers.push(setTimeout(() => { scan.style.opacity = "0"; }, 1400));
    }, 100));

    lines.forEach(({ id, delay, dur }) => {
      timers.push(setTimeout(() => {
        const el = getEl(id);
        if (!el) return;
        el.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.4,0,0.2,1)`;
        el.style.strokeDashoffset = "0";
      }, delay));
    });

    timers.push(setTimeout(() => {
      const el = getEl("houseFill");
      if (el) el.style.opacity = "1";
    }, 1950));

    extLines.forEach(({ id, delay, dur }) => {
      timers.push(setTimeout(() => {
        const el = getEl(id);
        if (!el) return;
        el.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.4,0,0.2,1)`;
        el.style.strokeDashoffset = "0";
      }, delay));
    });

    timers.push(setTimeout(() => {
      const el = getEl("extFill");
      if (el) { el.style.opacity = "1"; el.style.transition = "opacity 0.5s"; }
    }, 3300));

    timers.push(setTimeout(() => {
      ["dim1", "dim2", "dimv1", "dimv2"].forEach(id => {
        const el = getEl(id);
        if (el) { el.style.opacity = "1"; el.style.transition = "opacity 0.4s"; }
      });
      ["lbl1", "lbl2", "lbl3", "lbl4", "lbl5"].forEach(id => {
        const el = getEl(id);
        if (el) { el.style.opacity = "1"; el.style.transition = "opacity 0.4s"; }
      });
      ["badge1", "badge2"].forEach(id => {
        const el = getEl(id);
        if (el) { el.style.opacity = "1"; el.style.transform = "scale(1)"; el.style.transition = "opacity 0.3s, transform 0.3s"; }
      });
    }, 3400));

    timers.push(setTimeout(() => {
      if (pillRef.current) pillRef.current.style.opacity = "1";
    }, 3800));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="hero-illustration" aria-hidden="true">
      <div className="blueprint-frame">
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
        <div ref={scanRef} className="scan-line" style={{ opacity: 0, top: "8%" }} />
        <div ref={pillRef} className="status-pill">✓ Permitted Development</div>
        <svg ref={svgRef} id="blueprint-svg" viewBox="0 0 480 440" xmlns="http://www.w3.org/2000/svg">
          <polygon className="bp-fill" id="houseFill" points="60,80 320,80 320,320 60,320" style={{ opacity: 0 }} />
          <rect className="bp-fill-ext" id="extFill" x="320" y="160" width="100" height="120" style={{ opacity: 0 }} />

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
          <text className="bp-label-ext" id="lbl5" x="370" y="244" textAnchor="middle" style={{ fontSize: "9px", opacity: 0.7 }}>+36m²</text>

          <rect className="bp-badge" id="badge1" x="338" y="175" width="64" height="22" rx="4" fill="rgba(200,155,60,0.15)" stroke="rgba(200,155,60,0.35)" strokeWidth="1" />
          <text className="bp-badge" id="badge2" x="370" y="190" textAnchor="middle" fill="var(--gold-light)" fontFamily="DM Sans" fontSize="9" fontWeight="600">AI DESIGNED</text>
        </svg>
      </div>
    </div>
  );
}

/* ── Feature 01: Planning Demo ── */
function PlanningDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const items = el.querySelectorAll<HTMLElement>(".check-item");
        items.forEach(item => {
          const delay = parseInt(item.dataset.delay ?? "0");
          setTimeout(() => item.classList.add("visible"), delay * 0.5 + 150);
        });
        setTimeout(() => resultRef.current?.classList.add("visible"), 700);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const checks = [
    { icon: "pass", title: "Height limit", desc: "3.0m extension ≤ 4.0m maximum single-storey", badge: "Pass", delay: 0 },
    { icon: "pass", title: "Rear setback", desc: "Does not project beyond rear of original dwelling", badge: "Pass", delay: 200 },
    { icon: "pass", title: "Side boundary", desc: "1.2m clear of boundary — minimum 1.0m required", badge: "Pass", delay: 400 },
    { icon: "warn", title: "Eaves height", desc: "Within 2m of boundary — materials must match", badge: "Note", delay: 600 },
    { icon: "pass", title: "Conservation area", desc: "Not in designated conservation area", badge: "Pass", delay: 800 },
  ];

  return (
    <div ref={ref} className="planning-demo" id="planningDemo">
      <div className="planning-title">Planning Assessment</div>
      <div className="planning-sub">14 Carlisle Road, SW11 6PD</div>

      {checks.map((c, i) => (
        <div key={i} className="check-item" data-delay={c.delay}>
          <div className={`check-icon ${c.icon}`}>{c.icon === "pass" ? "✓" : "!"}</div>
          <div className="check-text">
            <strong>{c.title}</strong>
            <span>{c.desc}</span>
          </div>
          <span className={`check-badge ${c.icon}`}>{c.badge}</span>
        </div>
      ))}

      <div ref={resultRef} className="planning-result">
        <div className="planning-result-icon">📋</div>
        <div className="planning-result-text">
          <strong>Permitted Development — 4/5 passed</strong>
          <span>No planning application required. One advisory note.</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature 02: Cost Demo ── */
function CostDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const bars = [
    { name: "Structure & foundations", amount: "£22,400", pct: "72%", type: "blue", delay: 0 },
    { name: "Roof & weatherproofing", amount: "£16,800", pct: "58%", type: "blue", delay: 150 },
    { name: "Glazing & bi-folds", amount: "£12,600", pct: "45%", type: "gold", delay: 300 },
    { name: "Electrics & plumbing", amount: "£9,800", pct: "38%", type: "soft", delay: 450 },
    { name: "Finishes & fit-out", amount: "£6,800", pct: "22%", type: "soft", delay: 600 },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        // Count-up
        const target = 68400;
        const dur = 900;
        const start = Date.now();
        const timer = setInterval(() => {
          const p = Math.min((Date.now() - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          if (numRef.current) numRef.current.textContent = Math.round(eased * target).toLocaleString("en-GB");
          if (p >= 1) clearInterval(timer);
        }, 16);

        // Bar items
        el.querySelectorAll<HTMLElement>(".cost-bar-item").forEach(item => {
          const delay = parseInt(item.dataset.delay ?? "0");
          const fill = item.querySelector<HTMLElement>(".cost-bar-fill");
          const width = fill?.dataset.width ?? "0";
          setTimeout(() => {
            item.classList.add("visible");
            if (fill) fill.style.width = width;
          }, delay * 0.5 + 100);
        });

        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="cost-demo" id="costDemo">
      <div className="cost-total">
        <div className="cost-total-label">Total Estimate</div>
        <div className="cost-total-value">
          <span className="currency">£</span><span ref={numRef}>0</span>
        </div>
        <div className="cost-range">Range: £61,500 — £75,200</div>
      </div>
      <div className="cost-bars">
        {bars.map((b, i) => (
          <div key={i} className="cost-bar-item" data-delay={b.delay}>
            <div className="cost-bar-meta">
              <span className="cost-bar-name">{b.name}</span>
              <span className="cost-bar-amount">{b.amount}</span>
            </div>
            <div className="cost-bar-track">
              <div className={`cost-bar-fill ${b.type}`} data-width={b.pct} style={{ width: 0 }} />
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

/* ── Feature 03: Neighbour Demo ── */
function NeighbourDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        el.querySelectorAll<HTMLElement>(".house").forEach(h => {
          const delay = parseInt(h.dataset.delay ?? "0");
          setTimeout(() => h.classList.add("visible"), delay * 0.5 + 100);
        });
        el.querySelectorAll<HTMLElement>(".n-stat").forEach(s => {
          const delay = parseInt(s.dataset.delay ?? "0");
          setTimeout(() => s.classList.add("visible"), delay + 500);
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="neighbour-demo" id="neighbourDemo">
      <div className="street-label">Carlisle Road, SW11</div>
      <div className="street-view">
        <div className="house" data-delay="0" style={{ flex: "0.85" }}>
          <div className="house-body neighbour" style={{ height: 55 }}>
            <div className="house-ext-tag">+18m²</div>
            <div className="house-base" />
          </div>
          <span className="house-label">No. 8</span>
        </div>
        <div className="house" data-delay="200" style={{ flex: "1.1" }}>
          <div className="house-body neighbour" style={{ height: 68 }}>
            <div className="house-ext-tag">+52m²</div>
            <div className="house-base" />
          </div>
          <span className="house-label">No. 10</span>
        </div>
        <div className="house" data-delay="100" style={{ flex: "1.25" }}>
          <div className="house-body yours" style={{ height: 76 }}>
            <div className="house-ext-tag" style={{ color: "var(--blue)", borderColor: "var(--blue)" }}>YOUR PLAN +36m²</div>
            <div className="house-base" style={{ background: "var(--blue)", opacity: 0.3 }} />
          </div>
          <span className="house-label yours-label">No. 14 (You)</span>
        </div>
        <div className="house" data-delay="300" style={{ flex: "0.9" }}>
          <div className="house-body neighbour" style={{ height: 50 }}>
            <div className="house-ext-tag">No ext.</div>
            <div className="house-base" />
          </div>
          <span className="house-label">No. 16</span>
        </div>
        <div className="house" data-delay="450" style={{ flex: "1.0" }}>
          <div className="house-body neighbour" style={{ height: 62 }}>
            <div className="house-ext-tag">+12m²</div>
            <div className="house-base" />
          </div>
          <span className="house-label">No. 18</span>
        </div>
      </div>
      <div className="neighbour-stats">
        <div className="n-stat" data-delay="0">
          <div className="n-stat-value" style={{ color: "var(--blue)" }}>3/4</div>
          <div className="n-stat-label">neighbours have extended</div>
        </div>
        <div className="n-stat" data-delay="150">
          <div className="n-stat-value" style={{ color: "#1a7f5a" }}>100%</div>
          <div className="n-stat-label">planning approval rate on this street</div>
        </div>
        <div className="n-stat" data-delay="300">
          <div className="n-stat-value">+36m²</div>
          <div className="n-stat-label">your proposed extension size</div>
        </div>
        <div className="n-stat" data-delay="450">
          <div className="n-stat-value">+£68k</div>
          <div className="n-stat-label">estimated added property value</div>
        </div>
      </div>
    </div>
  );
}

/* ── Counter section with count-up ── */
function TrustCounter() {
  const { ref, count } = useCountUp(2847, 1200);
  return (
    <div className="counter-section">
      <h2 className="counter-heading">Trusted by homeowners across the UK</h2>
      <div ref={ref} className="counter-value reveal">{count.toLocaleString("en-GB")}</div>
      <div className="counter-sub reveal">extensions designed and counting</div>
      <div className="counter-substats reveal">
        <div className="counter-substat">
          <div className="counter-substat-num">47</div>
          <div className="counter-substat-label">London postcodes covered</div>
        </div>
        <div className="counter-substat">
          <div className="counter-substat-num">9 min</div>
          <div className="counter-substat-label">average report time</div>
        </div>
        <div className="counter-substat">
          <div className="counter-substat-num">100%</div>
          <div className="counter-substat-label">online — no account needed</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const scrolled = useNavScroll();

  /* Hero reveal + scroll-triggered .reveal elements */
  useEffect(() => {
    const heroTimer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".hero-in").forEach((el, i) => {
        setTimeout(() => el.classList.add("visible"), 150 + i * 160);
      });
    }, 80);

    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

    return () => {
      clearTimeout(heroTimer);
      revealObs.disconnect();
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <img src="/brand/logo-preferred.png" alt="" width="42" height="42" />
          </div>
          <span className="nav-logo-text">Can I Extend</span>
        </a>
        <a href="https://app.caniextend.com/proposals" className="nav-cta">
          Upload your floorplan →
        </a>
      </nav>

      {/* ── HERO (split layout) ── */}
      <section className="hero" aria-label="Hero">
        <div className="hero-content">
          <div className="hero-label hero-in">AI-Powered Extension Planning</div>
          <h1 className="hero-headline hero-in">
            See what your<br />
            home could<br />
            <span className="accent">become.</span>
          </h1>
          <p className="hero-sub hero-in">
            Upload a floorplan. Our AI designs your extension, checks planning permission, estimates costs, and compares your neighbours — in under ten minutes.
          </p>
          <div className="hero-actions hero-in">
            <a href="https://app.caniextend.com/proposals" className="btn-primary">Upload your floorplan →</a>
            <a href="/features" className="btn-ghost">See how it works</a>
          </div>
          <div className="hero-social hero-in">
            <div className="hero-social-faces">
              <div className="face" aria-hidden="true">🏠</div>
              <div className="face" aria-hidden="true">🏡</div>
              <div className="face" aria-hidden="true">🏘</div>
              <div className="face" aria-hidden="true">+</div>
            </div>
            <span className="hero-social-text">2,847 extensions designed this month</span>
          </div>
        </div>
        <BlueprintHero />
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="s-trust" aria-label="Trust signals">
        <div className="s-trust-inner">
          <div className="s-trust-item">
            <svg className="s-trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 21h18M5 21V8l7-5 7 5v13" /><path d="M10 21v-5h4v5" />
            </svg>
            <span className="s-trust-label">RIBA-aligned guidance</span>
          </div>
          <div className="s-trust-item">
            <svg className="s-trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
            </svg>
            <span className="s-trust-label">UK planning regulations checked automatically</span>
          </div>
          <div className="s-trust-item">
            <svg className="s-trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
            </svg>
            <span className="s-trust-label">Results in under 5 minutes</span>
          </div>
        </div>
      </div>

      {/* ── STATEMENT DIVIDER ── */}
      <div className="statement">
        <div className="statement-number" aria-hidden="true">10</div>
        <p className="statement-text reveal">
          Ten minutes. <span className="soft">Not ten weeks.</span>
        </p>
      </div>

      {/* ── FEATURE 01: Planning Rules (dark) ── */}
      <section className="feature-section dark" id="feat-planning" aria-label="Planning Rules">
        <div className="feature">
          <div className="feature-copy">
            <div className="feature-index reveal">01 / Planning Rules</div>
            <h2 className="feature-headline reveal">Your extension, checked against every rule.</h2>
            <p className="feature-body reveal">
              We run your design against UK Permitted Development rights, local Article 4 directions, and conservation area restrictions — in seconds. No solicitor required.
            </p>
            <a href="/features" className="feature-link reveal">
              See how it works
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <ul className="proof-list reveal">
              <li>Checks 47 local authority rules automatically</li>
              <li>Covers PD + Article 4 directions</li>
              <li>Updated when guidance changes</li>
            </ul>
            <div className="stat-callout reveal">
              <div className="stat-callout-value">94%</div>
              <div className="stat-callout-label">confirm PD eligibility first time</div>
            </div>
          </div>
          <div className="feature-demo" aria-hidden="true">
            <PlanningDemo />
          </div>
        </div>
      </section>

      {/* ── FEATURE 02: Cost Estimate (light, reversed) ── */}
      <section className="feature-section light" id="feat-cost" aria-label="Cost Estimate">
        <div className="feature reversed">
          <div className="feature-copy">
            <div className="feature-index reveal">02 / Cost Estimate</div>
            <h2 className="feature-headline reveal">Real costs, not rough guesses.</h2>
            <p className="feature-body reveal">
              We calculate your estimate from live regional build-cost data, updated every quarter. See exactly where your money goes before you speak to a single builder.
            </p>
            <a href="/features" className="feature-link reveal">
              See sample report
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <ul className="proof-list reveal">
              <li>Live BCIS regional data</li>
              <li>Updated quarterly</li>
              <li>Itemised by trade</li>
            </ul>
            <div className="stat-callout reveal">
              <div className="stat-callout-value">±8%</div>
              <div className="stat-callout-label">accurate to within 8% of actual quotes</div>
            </div>
          </div>
          <div className="feature-demo" style={{ background: "var(--navy)" }} aria-hidden="true">
            <CostDemo />
          </div>
        </div>
      </section>

      {/* ── FEATURE 03: Neighbour Comparison (dark) ── */}
      <section className="feature-section dark" id="feat-neighbour" aria-label="Neighbour Comparison">
        <div className="feature reversed">
          <div className="feature-demo" style={{ background: "var(--stone)" }} aria-hidden="true">
            <NeighbourDemo />
          </div>
          <div className="feature-copy">
            <div className="feature-index reveal">03 / Neighbour Comparison</div>
            <h2 className="feature-headline reveal">See what your street has already built.</h2>
            <p className="feature-body reveal">
              We pull planning application data for every house within 100m. You see what your neighbours approved, what they built, and what that means for your application.
            </p>
            <a href="/features" className="feature-link reveal">
              See how we source data
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <ul className="proof-list reveal">
              <li>Land Registry data on every neighbour</li>
              <li>Compares extension size, status, materials</li>
              <li>Know what your street approved</li>
            </ul>
            <div className="stat-callout reveal">
              <div className="stat-callout-value">3×</div>
              <div className="stat-callout-label">more likely to succeed with precedent data</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="s-testimonials" aria-label="What homeowners say">
        <div className="s-testimonials-inner">
          <h2 className="s-testimonials-heading">What homeowners say</h2>
          <div className="s-testimonials-grid">
            <article className="s-testimonial-card">
              <p className="s-testimonial-quote">"caniextend gave us a clear answer in ten minutes — and the cost estimate was remarkably accurate."</p>
              <div className="s-testimonial-author">
                <p className="s-testimonial-name">Sarah M.</p>
                <p className="s-testimonial-location">Hackney, London</p>
              </div>
            </article>
            <article className="s-testimonial-card">
              <p className="s-testimonial-quote">"Checked extension potential without paying for a surveyor. Saved me from a costly mistake."</p>
              <div className="s-testimonial-author">
                <p className="s-testimonial-name">James K.</p>
                <p className="s-testimonial-location">Clifton, Bristol</p>
              </div>
            </article>
            <article className="s-testimonial-card">
              <p className="s-testimonial-quote">"The planning compliance check was worth it alone. Knowing our rear extension fell under Permitted Development gave us real confidence to proceed."</p>
              <div className="s-testimonial-author">
                <p className="s-testimonial-name">Priya T.</p>
                <p className="s-testimonial-location">Didsbury, Manchester</p>
              </div>
            </article>
          </div>
          <p className="s-credibility-line">No architect needed. No waiting weeks. Cost estimates based on RICS regional data, updated quarterly.</p>
        </div>
      </section>

      {/* ── COUNTER / TRUST ── */}
      <TrustCounter />

      {/* ── FINAL CTA ── */}
      <section className="final-cta" aria-label="Get started">
        <div className="cta-glow" aria-hidden="true" />
        <h2 className="final-cta-headline reveal">
          Your home,<br />
          <em style={{ color: "var(--blue-light)" }}>extended.</em>
        </h2>
        <p className="final-cta-sub reveal">Upload a floorplan. Get your report in 10 minutes.</p>
        <div className="final-cta-actions reveal">
          <a href="https://app.caniextend.com/proposals" className="btn-gold" style={{ fontSize: 17, padding: "18px 48px" }}>
            Check your extension potential — free →
          </a>
          <p style={{ marginTop: 18, fontSize: 14, color: "rgba(255,255,255,0.38)", letterSpacing: "0.02em", position: "relative", zIndex: 2 }}>
            No account required. Results in under 10 minutes.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-logo">Can I Extend</div>
        <ul className="footer-links" aria-label="Footer navigation">
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/features">Planning rules</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <div className="footer-copy">© 2026 Can I Extend Ltd</div>
      </footer>
    </>
  );
}

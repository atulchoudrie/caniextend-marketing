"use client";

import { useState, useEffect, useRef } from "react";

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


/* ── Screenshot Demo ─────────────────────────────────────────────── */
function ScreenshotDemo({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.classList.add("ss-visible");
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="ss-frame">
      <div className="ss-chrome">
        <div className="ss-dots"><span /><span /><span /></div>
        <div className="ss-bar" />
      </div>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

/* ── Planning Demo ─────────────────────────────────────────────────── */
function PlanningDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const items = el.querySelectorAll<HTMLElement>(".check-item");
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add("visible"), 300 + i * 250);
        });
        const result = el.querySelector<HTMLElement>(".planning-result");
        if (result) setTimeout(() => result.classList.add("visible"), 300 + items.length * 250 + 200);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="planning-demo" ref={ref}>
      <div className="planning-title">Planning Check</div>
      <div className="planning-sub">London Borough of Southwark · SE22</div>
      <div className="check-item">
        <div className="check-icon pass">✓</div>
        <div className="check-text">
          <strong>Permitted Development</strong>
          <span>Rear extension within 3m limit</span>
        </div>
        <span className="check-badge pass">Pass</span>
      </div>
      <div className="check-item">
        <div className="check-icon pass">✓</div>
        <div className="check-text">
          <strong>Height restriction</strong>
          <span>4.0m — within 4m eaves limit</span>
        </div>
        <span className="check-badge pass">Pass</span>
      </div>
      <div className="check-item">
        <div className="check-icon pass">✓</div>
        <div className="check-text">
          <strong>Conservation area</strong>
          <span>Property not in designated area</span>
        </div>
        <span className="check-badge pass">Pass</span>
      </div>
      <div className="check-item">
        <div className="check-icon warn">!</div>
        <div className="check-text">
          <strong>Article 4 direction</strong>
          <span>Check with local authority</span>
        </div>
        <span className="check-badge warn">Review</span>
      </div>
      <div className="planning-result">
        <div className="planning-result-icon">✓</div>
        <div className="planning-result-text">
          <strong>Likely permitted development</strong>
          <span>No full planning application required</span>
        </div>
      </div>
    </div>
  );
}

/* ── Cost Demo ─────────────────────────────────────────────────────── */
function CostDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const target = 68400;
        const dur = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const val = Math.round(p * target);
          if (totalRef.current) totalRef.current.textContent = val.toLocaleString("en-GB");
          if (p < 1) requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 300);

        const bars = el.querySelectorAll<HTMLElement>(".cost-bar-item");
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.classList.add("visible");
            const fill = bar.querySelector<HTMLElement>(".cost-bar-fill");
            if (fill) {
              const w = fill.dataset.width ?? "0";
              setTimeout(() => { fill.style.width = w + "%"; }, 50);
            }
          }, 400 + i * 150);
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="cost-demo" ref={ref}>
      <div className="cost-total">
        <div className="cost-total-label">Estimated build cost</div>
        <div className="cost-total-value">
          <em className="currency">£</em>
          <span ref={totalRef}>0</span>
        </div>
        <div className="cost-range">Typical range: £58k – £79k</div>
      </div>
      <div className="cost-bars">
        <div className="cost-bar-item">
          <div className="cost-bar-meta">
            <span className="cost-bar-name">Structure &amp; groundwork</span>
            <span className="cost-bar-amount">£21,200</span>
          </div>
          <div className="cost-bar-track">
            <div className="cost-bar-fill blue" data-width="72" />
          </div>
        </div>
        <div className="cost-bar-item">
          <div className="cost-bar-meta">
            <span className="cost-bar-name">Labour</span>
            <span className="cost-bar-amount">£18,600</span>
          </div>
          <div className="cost-bar-track">
            <div className="cost-bar-fill gold" data-width="60" />
          </div>
        </div>
        <div className="cost-bar-item">
          <div className="cost-bar-meta">
            <span className="cost-bar-name">Fixtures &amp; finish</span>
            <span className="cost-bar-amount">£14,800</span>
          </div>
          <div className="cost-bar-track">
            <div className="cost-bar-fill soft" data-width="48" />
          </div>
        </div>
        <div className="cost-bar-item">
          <div className="cost-bar-meta">
            <span className="cost-bar-name">Fees &amp; contingency</span>
            <span className="cost-bar-amount">£13,800</span>
          </div>
          <div className="cost-bar-track">
            <div className="cost-bar-fill soft" data-width="44" />
          </div>
        </div>
      </div>
      <div className="cost-regional">
        <span>📍</span>
        <span>London regional rates · Q1 2025 data</span>
      </div>
    </div>
  );
}

/* ── Design Demo ───────────────────────────────────────────────────── */
function DesignDemo() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const lines = el.querySelectorAll<SVGElement>(".d-line");
        const extLines = el.querySelectorAll<SVGElement>(".d-ext-line");
        const fills = el.querySelectorAll<SVGElement>(".d-fill");
        const extFill = el.querySelector<SVGElement>(".d-ext-fill");
        const labels = el.querySelectorAll<SVGElement>(".d-label");
        const badge = el.querySelector<SVGElement>(".d-badge");
        const pill = el.querySelector<HTMLElement>(".d-pill");

        lines.forEach((l, i) => {
          setTimeout(() => {
            l.style.transition = `stroke-dashoffset ${600}ms cubic-bezier(0.4,0,0.2,1)`;
            l.style.strokeDashoffset = "0";
          }, 200 + i * 120);
        });
        setTimeout(() => { fills.forEach(f => { f.style.transition = "opacity 0.8s"; f.style.opacity = "1"; }); }, 200 + lines.length * 120);
        extLines.forEach((l, i) => {
          setTimeout(() => {
            l.style.transition = `stroke-dashoffset 500ms cubic-bezier(0.4,0,0.2,1)`;
            l.style.strokeDashoffset = "0";
          }, 1200 + i * 200);
        });
        setTimeout(() => {
          if (extFill) { extFill.style.transition = "opacity 0.8s"; extFill.style.opacity = "1"; }
          labels.forEach(l => { l.style.transition = "opacity 0.5s"; l.style.opacity = "1"; });
          if (badge) { badge.style.transition = "opacity 0.4s, transform 0.4s"; badge.style.opacity = "1"; badge.style.transform = "scale(1)"; }
          if (pill) { pill.style.transition = "opacity 0.5s"; pill.style.opacity = "1"; }
        }, 1200 + extLines.length * 200 + 200);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
      <div
        className="d-pill"
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 10,
          background: "rgba(200,155,60,0.15)", border: "1px solid rgba(200,155,60,0.35)",
          color: "var(--gold-light)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
          textTransform: "uppercase", padding: "5px 12px", borderRadius: 20, opacity: 0,
        }}
      >
        AI Designed
      </div>
      <svg
        ref={ref}
        viewBox="0 0 480 440"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", background: "rgba(15,34,64,0.6)", borderRadius: 12, border: "1px solid rgba(74,127,165,0.2)" }}
      >
        <defs>
          <pattern id="dgrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(74,127,165,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="480" height="440" fill="url(#dgrid)" />

        <polygon className="d-fill" points="60,80 320,80 320,320 60,320" fill="rgba(74,127,165,0.08)" style={{ opacity: 0 }} />
        <rect className="d-ext-fill" x="320" y="160" width="100" height="120" fill="rgba(200,155,60,0.12)" style={{ opacity: 0 }} />

        <line className="d-line" x1="60" y1="80" x2="320" y2="80" stroke="rgba(122,180,212,0.75)" strokeWidth="2" strokeDasharray="1000" style={{ strokeDashoffset: 1000 }} />
        <line className="d-line" x1="320" y1="80" x2="320" y2="160" stroke="rgba(122,180,212,0.75)" strokeWidth="2" strokeDasharray="1000" style={{ strokeDashoffset: 1000 }} />
        <line className="d-line" x1="320" y1="280" x2="320" y2="320" stroke="rgba(122,180,212,0.75)" strokeWidth="2" strokeDasharray="1000" style={{ strokeDashoffset: 1000 }} />
        <line className="d-line" x1="320" y1="320" x2="60" y2="320" stroke="rgba(122,180,212,0.75)" strokeWidth="2" strokeDasharray="1000" style={{ strokeDashoffset: 1000 }} />
        <line className="d-line" x1="60" y1="320" x2="60" y2="80" stroke="rgba(122,180,212,0.75)" strokeWidth="2" strokeDasharray="1000" style={{ strokeDashoffset: 1000 }} />
        <line className="d-line" x1="60" y1="200" x2="320" y2="200" stroke="rgba(122,180,212,0.75)" strokeWidth="1.5" strokeDasharray="800" style={{ strokeDashoffset: 800, opacity: 0.5 }} />
        <line className="d-line" x1="190" y1="80" x2="190" y2="320" stroke="rgba(122,180,212,0.75)" strokeWidth="1.5" strokeDasharray="800" style={{ strokeDashoffset: 800, opacity: 0.5 }} />

        <line className="d-ext-line" x1="320" y1="160" x2="420" y2="160" stroke="var(--gold-light)" strokeWidth="2.5" strokeDasharray="600" style={{ strokeDashoffset: 600 }} />
        <line className="d-ext-line" x1="420" y1="160" x2="420" y2="280" stroke="var(--gold-light)" strokeWidth="2.5" strokeDasharray="600" style={{ strokeDashoffset: 600 }} />
        <line className="d-ext-line" x1="420" y1="280" x2="320" y2="280" stroke="var(--gold-light)" strokeWidth="2.5" strokeDasharray="600" style={{ strokeDashoffset: 600 }} />

        <text className="d-label" x="180" y="360" textAnchor="middle" fill="rgba(74,127,165,0.75)" fontFamily="DM Sans,sans-serif" fontSize="10" style={{ opacity: 0 }}>8.0m</text>
        <text className="d-label" x="370" y="360" textAnchor="middle" fill="rgba(74,127,165,0.75)" fontFamily="DM Sans,sans-serif" fontSize="10" style={{ opacity: 0 }}>3.0m ext</text>
        <text className="d-label" x="370" y="222" textAnchor="middle" fill="var(--gold-light)" fontFamily="DM Sans,sans-serif" fontSize="9" fontWeight="600" style={{ opacity: 0 }}>EXTENSION</text>
        <text className="d-label" x="370" y="236" textAnchor="middle" fill="var(--gold-light)" fontFamily="DM Sans,sans-serif" fontSize="9" style={{ opacity: 0 }}>+36m²</text>

        <g className="d-badge" style={{ opacity: 0, transformOrigin: "370px 190px", transform: "scale(0.8)" }}>
          <rect x="338" y="175" width="64" height="22" rx="4" fill="rgba(200,155,60,0.15)" stroke="rgba(200,155,60,0.35)" strokeWidth="1" />
          <text x="370" y="190" textAnchor="middle" fill="var(--gold-light)" fontFamily="DM Sans,sans-serif" fontSize="9" fontWeight="600">AI DESIGNED</text>
        </g>
      </svg>
    </div>
  );
}

/* ── Neighbour Demo ─────────────────────────────────────────────────── */
function NeighbourDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const houses = el.querySelectorAll<HTMLElement>(".house");
        houses.forEach((h, i) => {
          setTimeout(() => h.classList.add("visible"), 200 + i * 180);
        });
        const stats = el.querySelectorAll<HTMLElement>(".n-stat");
        stats.forEach((s, i) => {
          setTimeout(() => s.classList.add("visible"), 200 + houses.length * 180 + i * 120);
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="neighbour-demo" ref={ref}>
      <div className="street-label">Lordship Lane, SE22 · 100m radius</div>
      <div className="street-view">
        <div className="house">
          <div className="house-body neighbour" style={{ height: "72px" }}>
            <div className="house-ext-tag">+18m²</div>
          </div>
          <div className="house-base" />
          <div className="house-label">No. 14</div>
        </div>
        <div className="house">
          <div className="house-body neighbour" style={{ height: "58px" }} />
          <div className="house-base" />
          <div className="house-label">No. 16</div>
        </div>
        <div className="house">
          <div className="house-body yours" style={{ height: "80px" }}>
            <div className="house-ext-tag">+36m²</div>
          </div>
          <div className="house-base" />
          <div className="house-label yours-label">Yours</div>
        </div>
        <div className="house">
          <div className="house-body neighbour" style={{ height: "65px" }}>
            <div className="house-ext-tag">+22m²</div>
          </div>
          <div className="house-base" />
          <div className="house-label">No. 20</div>
        </div>
        <div className="house">
          <div className="house-body neighbour" style={{ height: "48px" }} />
          <div className="house-base" />
          <div className="house-label">No. 22</div>
        </div>
      </div>
      <div className="neighbour-stats">
        <div className="n-stat">
          <div className="n-stat-value">73%</div>
          <div className="n-stat-label">of nearby homes have extended</div>
        </div>
        <div className="n-stat">
          <div className="n-stat-value">3.1m</div>
          <div className="n-stat-label">average rear extension depth</div>
        </div>
        <div className="n-stat">
          <div className="n-stat-value">18</div>
          <div className="n-stat-label">approved applications nearby</div>
        </div>
        <div className="n-stat">
          <div className="n-stat-value">£0</div>
          <div className="n-stat-label">planning refusals on record</div>
        </div>
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

      {/* HERO PRODUCT SCENE */}
      <div style={{ background: "var(--navy-deep)", padding: "0 2rem 5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <img
            src="/brand/hero-product-scene.png"
            alt="Can I Extend — your extension report on screen"
            width={1400}
            height={900}
            loading="eager"
            style={{ width: "100%", borderRadius: "12px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}
          />
        </div>
      </div>

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
          <h2 className="feature-headline reveal">Your rules. Checked instantly.</h2>
          <p className="feature-body reveal reveal-delay-1">
            We run your design against UK Permitted Development rights, local Article 4 directions, and conservation area restrictions — in seconds. No solicitor required.
          </p>
          <a href="#" className="feature-link reveal reveal-delay-2">
            See how it works <ArrowIcon />
          </a>
        </div>
        <div className="feature-demo">
          <ScreenshotDemo src="/brand/screenshot-planning.png" alt="Planning check result — Permitted Development confirmed" />
        </div>
      </section>

      {/* FEATURE 02: Cost Estimate */}
      <section className="feature light reversed" id="feat-cost">
        <div className="feature-copy">
          <h2 className="feature-headline reveal">Know the number before you call anyone.</h2>
          <p className="feature-body reveal reveal-delay-1">
            We calculate your estimate from live regional build-cost data, updated every quarter. See exactly where your money goes before you speak to a single builder.
          </p>
          <a href="#" className="feature-link reveal reveal-delay-2">
            See sample report <ArrowIcon />
          </a>
        </div>
        <div className="feature-demo">
          <ScreenshotDemo src="/brand/screenshot-cost.png" alt="Cost estimate breakdown with itemised line items" />
        </div>
      </section>

      {/* FEATURE 03: AI Design */}
      <section className="feature dark" id="feat-ai-design">
        <div className="feature-copy">
          <h2 className="feature-headline reveal">Watch your extension take shape.</h2>
          <p className="feature-body reveal reveal-delay-1">
            Our AI analyses your floor plan and proposes the optimal extension layout — maximising usable space while staying within permitted development limits. Full architectural drawings included in every report.
          </p>
          <a href="#" className="feature-link reveal reveal-delay-2">
            See a sample design <ArrowIcon />
          </a>
        </div>
        <div className="feature-demo">
          <ScreenshotDemo src="/brand/screenshot-design.png" alt="AI-generated extension design on house floorplan" />
        </div>
      </section>

      {/* FEATURE 04: Neighbour Comparison */}
      <section className="feature light reversed" id="feat-neighbour">
        <div className="feature-demo">
          <ScreenshotDemo src="/brand/screenshot-neighbour.png" alt="Neighbour comparison — street silhouette with planning data" />
        </div>
        <div className="feature-copy">
          <h2 className="feature-headline reveal">See what your street already built.</h2>
          <p className="feature-body reveal reveal-delay-1">
            We pull planning application data for every house within 100m. You see what your neighbours approved, what they built, and what that means for your application.
          </p>
          <a href="#" className="feature-link reveal reveal-delay-2">
            See how we source data <ArrowIcon />
          </a>
        </div>
      </section>

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

      {/* TESTIMONIALS */}
      <section style={{ background: "#F5F4F1", padding: "6rem 2rem" }}>
        <h2 className="reveal" style={{ fontFamily: "var(--font-display)", color: "#0F2240", fontSize: "clamp(32px, 3.5vw, 48px)", textAlign: "center", marginBottom: "3.5rem", letterSpacing: "-0.02em" }}>
          What homeowners say
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
          {/* Card 1 */}
          <div className="reveal" style={{ background: "#fff", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 16px rgba(15,34,64,0.08)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#0F2240", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9rem", color: "#F5F4F1", letterSpacing: "0.02em" }}>ST</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#0F2240", marginBottom: "1rem", lineHeight: 1.5 }}>
              &ldquo;We found out in 4 minutes our rear extension would get planning. Saved us &pound;3,000 on a consultant.&rdquo;
            </p>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(15,34,64,0.6)" }}>Sarah T. &mdash; Hackney</span>
          </div>
          {/* Card 2 */}
          <div className="reveal reveal-delay-1" style={{ background: "#fff", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 16px rgba(15,34,64,0.08)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#2A5298", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9rem", color: "#F5F4F1", letterSpacing: "0.02em" }}>JM</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#0F2240", marginBottom: "1rem", lineHeight: 1.5 }}>
              &ldquo;The cost estimate was within 8% of our final build quote. Genuinely useful.&rdquo;
            </p>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(15,34,64,0.6)" }}>James M. &mdash; Bristol</span>
          </div>
          {/* Card 3 */}
          <div className="reveal reveal-delay-2" style={{ background: "#fff", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 16px rgba(15,34,64,0.08)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#1A6B4A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9rem", color: "#F5F4F1", letterSpacing: "0.02em" }}>PRK</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#0F2240", marginBottom: "1rem", lineHeight: 1.5 }}>
              &ldquo;I uploaded a floor plan photo on my phone and had a full report in under 10 minutes.&rdquo;
            </p>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(15,34,64,0.6)" }}>Priya &amp; Ravi K. &mdash; Leeds</span>
          </div>
        </div>
      </section>

      {/* SEE YOUR RESULT */}
      <section style={{ background: "#0F2240", padding: "6rem 2rem", textAlign: "center" }}>
        <h2 className="reveal" style={{ fontFamily: "var(--font-display)", color: "#F5F4F1", fontSize: "clamp(36px, 4vw, 56px)", marginBottom: "1rem", letterSpacing: "-0.025em" }}>
          This is what you will see
        </h2>
        <p className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-body)", color: "rgba(245,244,241,0.7)", maxWidth: "560px", margin: "0 auto 3rem", fontSize: "1.1rem", lineHeight: 1.6 }}>
          Your extension report — detailed, professional, ready to share with architects and planners.
        </p>
        <div className="reveal reveal-delay-2" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
          <img
            src="/brand/extension-render.png"
            alt="Before and after: UK terraced house with rear kitchen extension added"
            loading="lazy"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
        <div className="reveal reveal-delay-3">
          <a href="/proposals" className="btn-gold" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
            Get your free report
          </a>
        </div>
      </section>

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

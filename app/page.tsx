"use client";

import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useScrollProgress() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = -rect.height;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { ref, progress };
}

type UploadPhase = "idle" | "dragging" | "dropped" | "processing" | "scanning" | "detecting" | "complete";

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return scrolled;
}

function UploadDemo() {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [rooms, setRooms] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        const t = setTimeout(res, ms);
        if (cancelled) clearTimeout(t);
      });

    async function loop() {
      while (!cancelled) {
        setPhase("idle");
        setProgress(0);
        setRooms([]);
        await wait(1000);

        setPhase("dragging");
        await wait(600);

        setPhase("dropped");
        await wait(250);

        setPhase("processing");
        for (let p = 0; p <= 100 && !cancelled; p += 5) {
          setProgress(p);
          await wait(22);
        }
        setProgress(100);
        await wait(150);

        setPhase("scanning");
        await wait(1200);

        setPhase("detecting");
        for (let i = 0; i < 4 && !cancelled; i++) {
          setRooms((r) => [...r, i]);
          await wait(300);
        }

        setPhase("complete");
        await wait(2000);
      }
    }

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const showPlan = ["scanning", "detecting", "complete"].includes(phase);

  return (
    <div className="ud-wrap">
      {/* Browser chrome */}
      <div className="ud-chrome">
        <div className="ud-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ud-url">caniextend.com/upload</div>
      </div>

      {/* App body */}
      <div className="ud-body">
        <div
          className={[
            "ud-zone",
            phase === "dragging" ? "ud-zone--hover" : "",
            showPlan ? "ud-zone--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Idle */}
          {phase === "idle" && (
            <div className="ud-empty">
              <div className="ud-empty-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect
                    x="1"
                    y="1"
                    width="38"
                    height="38"
                    rx="10"
                    stroke="rgba(122,180,212,0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                  />
                  <path
                    d="M20 26V14M20 14L14 20M20 14L26 20"
                    stroke="rgba(122,180,212,0.55)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="ud-empty-label">Drop your floorplan here</p>
              <p className="ud-empty-sub">PDF · JPG · PNG</p>
            </div>
          )}

          {/* Dragging */}
          {phase === "dragging" && (
            <div className="ud-empty ud-empty--hover">
              <div className="ud-empty-icon ud-empty-icon--glow">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect
                    x="1"
                    y="1"
                    width="38"
                    height="38"
                    rx="10"
                    stroke="rgba(122,180,212,0.85)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M20 26V14M20 14L14 20M20 14L26 20"
                    stroke="rgba(122,180,212,0.9)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="ud-empty-label ud-empty-label--active">
                Release to upload
              </p>
            </div>
          )}

          {/* Uploading */}
          {(phase === "dropped" || phase === "processing") && (
            <div className="ud-progress">
              <p className="ud-progress-name">floorplan.pdf</p>
              <div className="ud-progress-track">
                <div
                  className="ud-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="ud-progress-pct">{progress}%</p>
            </div>
          )}

          {/* Plan view */}
          {showPlan && (
            <div className="ud-plan">
              {phase === "scanning" && <div className="ud-scan" />}

              <svg
                viewBox="0 0 240 196"
                className="ud-fp"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="fp-g"
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 12 0 L 0 0 0 12"
                      fill="none"
                      stroke="rgba(74,127,165,0.07)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="240" height="196" fill="url(#fp-g)" />

                {/* Base walls */}
                <rect
                  x="15"
                  y="15"
                  width="130"
                  height="90"
                  fill="rgba(74,127,165,0.05)"
                  stroke="rgba(122,180,212,0.55)"
                  strokeWidth="1.5"
                />
                <rect
                  x="145"
                  y="15"
                  width="80"
                  height="54"
                  fill="rgba(74,127,165,0.04)"
                  stroke="rgba(122,180,212,0.55)"
                  strokeWidth="1.5"
                />
                <rect
                  x="145"
                  y="69"
                  width="80"
                  height="54"
                  fill="rgba(74,127,165,0.04)"
                  stroke="rgba(122,180,212,0.55)"
                  strokeWidth="1.5"
                />
                <rect
                  x="15"
                  y="105"
                  width="130"
                  height="76"
                  fill="rgba(74,127,165,0.04)"
                  stroke="rgba(122,180,212,0.55)"
                  strokeWidth="1.5"
                />

                {/* Windows */}
                <line
                  x1="50"
                  y1="15"
                  x2="90"
                  y2="15"
                  stroke="rgba(200,155,60,0.55)"
                  strokeWidth="2.5"
                />
                <line
                  x1="155"
                  y1="15"
                  x2="215"
                  y2="15"
                  stroke="rgba(200,155,60,0.55)"
                  strokeWidth="2.5"
                />

                {/* Door swing */}
                <path
                  d="M145 42 Q130 42 130 57"
                  fill="none"
                  stroke="rgba(122,180,212,0.38)"
                  strokeWidth="1"
                />
                <line
                  x1="130"
                  y1="42"
                  x2="145"
                  y2="42"
                  stroke="rgba(122,180,212,0.38)"
                  strokeWidth="1"
                />

                {/* Detected highlights */}
                {rooms.includes(0) && (
                  <rect
                    x="15"
                    y="15"
                    width="130"
                    height="90"
                    fill="rgba(74,127,165,0.13)"
                    stroke="rgba(122,180,212,0.9)"
                    strokeWidth="2"
                    style={{ transition: "all 0.35s" }}
                  />
                )}
                {rooms.includes(1) && (
                  <rect
                    x="145"
                    y="15"
                    width="80"
                    height="54"
                    fill="rgba(74,127,165,0.13)"
                    stroke="rgba(122,180,212,0.9)"
                    strokeWidth="2"
                    style={{ transition: "all 0.35s" }}
                  />
                )}
                {rooms.includes(2) && (
                  <rect
                    x="145"
                    y="69"
                    width="80"
                    height="54"
                    fill="rgba(200,155,60,0.1)"
                    stroke="rgba(200,155,60,0.75)"
                    strokeWidth="2"
                    style={{ transition: "all 0.35s" }}
                  />
                )}
                {rooms.includes(3) && (
                  <rect
                    x="15"
                    y="105"
                    width="130"
                    height="76"
                    fill="rgba(74,127,165,0.13)"
                    stroke="rgba(122,180,212,0.9)"
                    strokeWidth="2"
                    style={{ transition: "all 0.35s" }}
                  />
                )}

                {/* Labels */}
                {rooms.includes(0) && (
                  <text
                    x="80"
                    y="62"
                    textAnchor="middle"
                    fill="rgba(122,180,212,0.85)"
                    fontFamily="DM Sans,sans-serif"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="0.06em"
                  >
                    LIVING ROOM
                  </text>
                )}
                {rooms.includes(1) && (
                  <text
                    x="185"
                    y="44"
                    textAnchor="middle"
                    fill="rgba(122,180,212,0.85)"
                    fontFamily="DM Sans,sans-serif"
                    fontSize="8"
                    fontWeight="600"
                    letterSpacing="0.06em"
                  >
                    KITCHEN
                  </text>
                )}
                {rooms.includes(2) && (
                  <text
                    x="185"
                    y="98"
                    textAnchor="middle"
                    fill="rgba(200,155,60,0.9)"
                    fontFamily="DM Sans,sans-serif"
                    fontSize="8"
                    fontWeight="600"
                    letterSpacing="0.06em"
                  >
                    BEDROOM
                  </text>
                )}
                {rooms.includes(3) && (
                  <text
                    x="80"
                    y="145"
                    textAnchor="middle"
                    fill="rgba(122,180,212,0.85)"
                    fontFamily="DM Sans,sans-serif"
                    fontSize="9"
                    fontWeight="600"
                    letterSpacing="0.06em"
                  >
                    HALLWAY
                  </text>
                )}

                {/* Dimensions on complete */}
                {phase === "complete" && (
                  <>
                    <text
                      x="80"
                      y="191"
                      textAnchor="middle"
                      fill="rgba(74,127,165,0.5)"
                      fontFamily="DM Sans,sans-serif"
                      fontSize="7"
                    >
                      6.5m
                    </text>
                    <text
                      x="235"
                      y="60"
                      textAnchor="middle"
                      fill="rgba(74,127,165,0.5)"
                      fontFamily="DM Sans,sans-serif"
                      fontSize="7"
                      transform="rotate(90,235,60)"
                    >
                      4.5m
                    </text>
                  </>
                )}
              </svg>

              {(phase === "detecting" || phase === "complete") && (
                <div className="ud-tags">
                  {rooms.includes(0) && (
                    <span className="ud-tag">Living room · 28m²</span>
                  )}
                  {rooms.includes(1) && (
                    <span className="ud-tag">Kitchen · 13m²</span>
                  )}
                  {rooms.includes(2) && (
                    <span className="ud-tag ud-tag--gold">Bedroom · 10m²</span>
                  )}
                  {rooms.includes(3) && (
                    <span className="ud-tag">Hallway · 5m²</span>
                  )}
                </div>
              )}

              {phase === "complete" && (
                <div className="ud-done">
                  <span className="ud-done-check">✓</span>
                  <span>4 rooms detected · Designing your extension</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating file */}
        {phase === "dragging" && (
          <div className="ud-file">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M5 2h12l5 5v19H5V2z"
                fill="rgba(74,127,165,0.2)"
                stroke="rgba(122,180,212,0.7)"
                strokeWidth="1.2"
              />
              <path
                d="M17 2v5h5"
                fill="none"
                stroke="rgba(122,180,212,0.5)"
                strokeWidth="1.2"
              />
              <line
                x1="8"
                y1="13"
                x2="20"
                y2="13"
                stroke="rgba(122,180,212,0.4)"
                strokeWidth="1"
              />
              <line
                x1="8"
                y1="16"
                x2="20"
                y2="16"
                stroke="rgba(122,180,212,0.4)"
                strokeWidth="1"
              />
              <line
                x1="8"
                y1="19"
                x2="15"
                y2="19"
                stroke="rgba(122,180,212,0.4)"
                strokeWidth="1"
              />
            </svg>
            <span>floorplan.pdf</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Postcode form (section 6) ─────────────────────────────────
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

function PostcodeForm() {
  const [value, setValue] = useState("");
  const valid = UK_POSTCODE.test(value.trim());
  return (
    <div className="s-postcode-stack">
      <div className="s-postcode-wrap">
        <input
          className={`s-postcode-input${valid ? " s-postcode-input--valid" : ""}`}
          type="text"
          placeholder="Enter your postcode"
          value={value}
          onChange={e => setValue(e.target.value.toUpperCase())}
          maxLength={8}
          aria-label="Enter your postcode"
          autoComplete="postal-code"
        />
        {valid && <span className="s-postcode-check" aria-hidden="true">✓</span>}
      </div>
      <a href={`/proposals${valid ? `?postcode=${encodeURIComponent(value.trim())}` : ""}`} className="s-cta-btn">
        Get started
      </a>
    </div>
  );
}

// ── Section 3: THE DESIGN ─────────────────────────────────────
function DesignSection() {
  const { ref, progress } = useScrollProgress();
  const p = Math.max(0, Math.min(1, (progress - 0.15) / 0.55));
  const active = p > 0;
  const wallOffset = Math.max(0, 364 - 364 * Math.min(1, Math.max(0, (p - 0.15) / 0.35)));
  const wallColor = p > 0.5 ? `rgba(245,245,245,${0.2 + 0.5 * Math.min(1, (p - 0.5) / 0.2)})` : "#E8FF47";

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={`s-design${active ? " s-design--active" : ""}`} aria-label="The Design">
      <div className="s-context">
        <p className="s-context-step">Step 1</p>
        <p className="s-context-text">Our AI designs your extension — optimised for your floorplan, within permitted development limits.</p>
      </div>
      <svg className="s-design-svg" viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="dg" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(232,255,71,0.04)" strokeWidth="0.5"/>
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="300" height="280" fill="url(#dg)"/>

        <rect x="20" y="20" width="140" height="96" fill="rgba(245,245,245,0.03)" stroke="rgba(245,245,245,0.2)" strokeWidth="1.5"/>
        <rect x="160" y="20" width="100" height="56" fill="rgba(245,245,245,0.02)" stroke="rgba(245,245,245,0.2)" strokeWidth="1.5"/>
        <rect x="160" y="76" width="100" height="60" fill="rgba(245,245,245,0.02)" stroke="rgba(245,245,245,0.2)" strokeWidth="1.5"/>
        <rect x="20" y="116" width="140" height="80" fill="rgba(245,245,245,0.02)" stroke="rgba(245,245,245,0.2)" strokeWidth="1.5"/>

        <rect className="des-candidate" x="30" y="196" width="120" height="58" fill="rgba(232,255,71,0.04)" stroke="rgba(232,255,71,0.15)" strokeWidth="1" strokeDasharray="5 4" style={{ opacity: p > 0.05 ? 1 : 0 }}/>

        <path d="M 30 196 L 30 254 L 150 254 L 150 196" fill="none" stroke={wallColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="364" strokeDashoffset={wallOffset} style={{ opacity: p > 0.15 ? 1 : 0, transition: "opacity 0.2s" }}/>

        <rect className="des-fill" x="31" y="197" width="118" height="56" fill="rgba(232,255,71,0.06)" style={{ opacity: p > 0.55 ? 1 : 0, transition: "opacity 0.3s" }}/>

        <text x="90" y="230" textAnchor="middle" fill="#8A8A8A" fontFamily="DM Sans,sans-serif" fontSize="9" letterSpacing="0.04em" style={{ opacity: p > 0.6 ? 1 : 0, transition: "opacity 0.3s" }}>Extension — 4.2m × 5.8m</text>
        <text x="90" y="248" textAnchor="middle" fill="#F5F5F5" fontFamily="DM Sans,sans-serif" fontSize="8" fontWeight="600" style={{ opacity: p > 0.65 ? 1 : 0, transition: "opacity 0.3s" }}>24.4 m²</text>

        <g style={{ opacity: p > 0.08 ? 1 : 0, transition: "opacity 0.3s" }}>
          <line x1="86" y1="196" x2="94" y2="196" stroke="#E8FF47" strokeWidth="1.5"/>
          <line x1="90" y1="192" x2="90" y2="200" stroke="#E8FF47" strokeWidth="1.5"/>
          <circle cx="90" cy="196" r="3" fill="none" stroke="#E8FF47" strokeWidth="1"/>
        </g>

        <text x="24" y="17" fill="#8A8A8A" fontFamily="DM Sans,sans-serif" fontSize="9" style={{ opacity: p > 0.1 && p < 0.75 ? 1 : 0, transition: "opacity 0.3s" }}>Generating extension…</text>

        <rect x="196" y="14" width="92" height="20" rx="10" fill="rgba(255,255,255,0.08)" style={{ opacity: p > 0.75 ? 1 : 0, transition: "opacity 0.3s" }}/>
        <text x="242" y="27" textAnchor="middle" fill="#F5F5F5" fontFamily="DM Sans,sans-serif" fontSize="9" fontWeight="500" style={{ opacity: p > 0.75 ? 1 : 0, transition: "opacity 0.3s" }}>Design complete</text>
      </svg>

      <p className="s-section-label s-section-label--bl">The Design</p>
    </section>
  );
}

// ── Section 4: THE STREET ─────────────────────────────────────
function StreetSection() {
  const { ref, progress } = useScrollProgress();
  const p = Math.max(0, Math.min(1, (progress - 0.15) / 0.55));

  const visibleCount = Math.min(9, Math.floor(p * 9 / 0.3));
  const visible = Array.from({ length: visibleCount }, (_, i) => i);
  const showDots = p > 0.35;
  const showStats = p > 0.55;
  const showFootnote = p > 0.7;

  const houses = [
    { h: 52, ext: false }, { h: 60, ext: true },  { h: 48, ext: false },
    { h: 58, ext: true },  { h: 72, ext: false, yours: true },
    { h: 55, ext: true },  { h: 50, ext: false }, { h: 62, ext: true },
    { h: 46, ext: false },
  ];

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="s-street" aria-label="The Street">
      <div className="s-context">
        <p className="s-context-step">Step 2</p>
        <p className="s-context-text">See which neighbours have extended, what they built, and whether they got approval.</p>
      </div>
      <div className="s-street-inner">
        <div className="s-street-scene" aria-hidden="true">
          <div className="st-ground"/>
          <div className="st-houses">
            {houses.map((h, i) => (
              <div key={i} className={`st-house${visible.includes(i) ? " st-house--vis" : ""}${h.yours ? " st-house--yours" : ""}`}
                   style={{ transitionDelay: `${i * 50}ms` }}>
                {h.ext && showDots && <span className="st-dot st-dot--ext"/>}
                {!h.ext && showDots && <span className="st-dot st-dot--none"/>}
                <div className="st-roof" style={{ borderBottomWidth: `${Math.round(h.h * 0.35)}px` }}/>
                <div className="st-body" style={{ height: `${h.h}px` }}>
                  {showDots && i === 1 && <span className="st-tooltip">Approved 2022</span>}
                  {showDots && i === 3 && <span className="st-tooltip">Single storey rear</span>}
                  {showDots && i === 5 && <span className="st-tooltip">Cost est. £38k</span>}
                </div>
              </div>
            ))}
          </div>
          {showStats && (
            <div className="st-stats">
              <div className="st-stat">
                <span className="st-stat-val">4</span>
                <span className="st-stat-lbl">neighbours extended within 100m</span>
              </div>
              <div className="st-stat">
                <span className="st-stat-val">100%</span>
                <span className="st-stat-lbl">approval rate</span>
              </div>
            </div>
          )}
          {showFootnote && <p className="st-footnote">Data from Land Registry · Updated monthly</p>}
        </div>
      </div>
      <p className="s-section-label s-section-label--bl">The Street</p>
    </section>
  );
}

// ── Section 5: THE RESULT ─────────────────────────────────────
function ResultSection() {
  const { ref, progress } = useScrollProgress();
  const p = Math.max(0, Math.min(1, (progress - 0.15) / 0.55));

  const showCard1 = p > 0.1;
  const checkCount = Math.min(3, Math.floor(Math.max(0, p - 0.12) / 0.06));
  const items = Array.from({ length: checkCount }, (_, i) => i);
  const showCard2 = p > 0.35;
  const costProgress = Math.max(0, Math.min(1, (p - 0.35) / 0.2));
  const count = Math.round(42500 * (1 - Math.pow(1 - costProgress, 3)));
  const showCard3 = p > 0.6;
  const showGlow = p > 0.75;

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="s-result" aria-label="The Result">
      <div className="s-context">
        <p className="s-context-step">Step 3</p>
        <p className="s-context-text">Get your planning check, cost estimate, and full extension design — all in one report.</p>
      </div>
      <div className="s-result-inner">
        <div className={`rc-card${showCard1 ? " rc-card--vis" : ""}${showGlow ? " rc-card--glow" : ""}`}>
          <p className="rc-header">Planning Check</p>
          <ul className="rc-checks">
            {[
              "Permitted Development ✓",
              "Rear extension — 4m permitted ✓",
              "No Article 4 restrictions ✓",
            ].map((txt, i) => (
              <li key={i} className={`rc-check${items.includes(i) ? " rc-check--vis" : ""}`} style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="rc-tick">✓</span> {txt.replace(" ✓", "")}
              </li>
            ))}
          </ul>
          {checkCount === 3 && (
            <span className="rc-badge">Permitted Development</span>
          )}
        </div>

        <div className={`rc-card${showCard2 ? " rc-card--vis" : ""}${showGlow ? " rc-card--glow" : ""}`} style={{ transitionDelay: "0.15s" }}>
          <p className="rc-header">Cost Estimate</p>
          <p className="rc-cost">£{count.toLocaleString("en-GB")}</p>
          <p className="rc-cost-sub">Typical build for 24.4 m² rear extension</p>
          <div className="rc-bar-track">
            <div className="rc-bar-fill" style={{ width: showCard2 ? "52%" : "0" }}/>
          </div>
        </div>

        <div className={`rc-card${showCard3 ? " rc-card--vis" : ""}${showGlow ? " rc-card--glow" : ""}`} style={{ transitionDelay: "0.3s" }}>
          <p className="rc-header">Your Design</p>
          <div className="rc-plan-thumb" aria-hidden="true">
            <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="120" fill="#111111"/>
              <rect x="10" y="10" width="90" height="60" fill="rgba(245,245,245,0.03)" stroke="rgba(245,245,245,0.2)" strokeWidth="1"/>
              <rect x="100" y="10" width="60" height="34" fill="rgba(245,245,245,0.02)" stroke="rgba(245,245,245,0.2)" strokeWidth="1"/>
              <rect x="100" y="44" width="60" height="36" fill="rgba(245,245,245,0.02)" stroke="rgba(245,245,245,0.2)" strokeWidth="1"/>
              <rect x="10" y="70" width="90" height="40" fill="rgba(245,245,245,0.02)" stroke="rgba(245,245,245,0.2)" strokeWidth="1"/>
              <rect x="18" y="110" width="74" height="8" fill="rgba(232,255,71,0.15)" stroke="rgba(232,255,71,0.6)" strokeWidth="1"/>
            </svg>
          </div>
          <p className="rc-spec">Rear extension — 4.2 × 5.8m</p>
          <p className="rc-spec">Single storey, flat roof</p>
        </div>
      </div>
      <p className="s-section-label s-section-label--bl">The Result</p>
    </section>
  );
}

export default function Home() {
  const scrolled = useNavScroll();

  useEffect(() => {
    const timer = setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(".hero-in")
        .forEach((el, i) => {
          setTimeout(() => el.classList.add("visible"), 150 + i * 160);
        });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* NAV — minimal */}
      <nav className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <img src="/brand/mark.svg" alt="" width="32" height="32" />
          </div>
          <span className="nav-logo-text">Can I Extend</span>
        </a>
        <a href="/proposals" className="nav-cta">
          Upload your floorplan →
        </a>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section className="s-hero" aria-label="Hero">
        <div className="s-hero-grid" aria-hidden="true" />
        <div className="s-hero-glow" aria-hidden="true" />
        <div className="s-hero-inner">
          <h1 className="s-statement hero-in">
            See what your
            <br />
            home could
            <br />
            <em>become.</em>
          </h1>
          <a href="/proposals" className="s-cta hero-in">
            Upload your floorplan →
          </a>
        </div>
      </section>

      {/* ── SECTION 2: THE UPLOAD ── */}
      <section className="s-upload" aria-label="Upload your floorplan">
        <div className="s-upload-inner">
          <p className="s-section-label">Upload your floorplan</p>
          <div className="s-upload-demo">
            <UploadDemo />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE DESIGN ── */}
      <DesignSection />

      {/* ── SECTION 4: THE STREET ── */}
      <StreetSection />

      {/* ── SECTION 5: THE RESULT ── */}
      <ResultSection />

      {/* ── SECTION 6: SINGLE CTA ── */}
      <section className="s-cta-section" aria-label="Get started">
        <div className="s-cta-inner">
          <h2 className="s-cta-headline">Find out about your home.</h2>
          <PostcodeForm />
        </div>
      </section>

      {/* ── SECTION 7: FOOTER ── */}
      <footer className="s-footer" role="contentinfo">
        <span className="s-footer-logo">caniextend</span>
        <nav className="s-footer-links" aria-label="Footer navigation">
          <a href="/privacy">Privacy</a>
          <span aria-hidden="true">·</span>
          <a href="/terms">Terms</a>
          <span aria-hidden="true">·</span>
          <a href="/contact">Contact</a>
        </nav>
      </footer>
    </>
  );
}

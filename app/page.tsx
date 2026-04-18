"use client";

import { useState, useEffect } from "react";

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
        await wait(1400);

        setPhase("dragging");
        await wait(900);

        setPhase("dropped");
        await wait(350);

        setPhase("processing");
        for (let p = 0; p <= 100 && !cancelled; p += 5) {
          setProgress(p);
          await wait(38);
        }
        setProgress(100);
        await wait(200);

        setPhase("scanning");
        await wait(2000);

        setPhase("detecting");
        for (let i = 0; i < 4 && !cancelled; i++) {
          setRooms((r) => [...r, i]);
          await wait(480);
        }

        setPhase("complete");
        await wait(2800);
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

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-logo">Can I Extend</div>
        <ul className="footer-links">
          <li>
            <a href="/privacy">Privacy</a>
          </li>
          <li>
            <a href="/terms">Terms</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
        <div className="footer-copy">© 2026 Can I Extend Ltd</div>
      </footer>
    </>
  );
}

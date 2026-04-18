"use client";

import { useState, useRef, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface NeighbourProperty {
  address: string;
  hasExtended: boolean;
  extensionType?: "rear" | "side" | "loft" | "other";
  extensionSizeSqm?: number;
  planningReference?: string;
  approvalStatus?: "approved" | "refused" | "pending";
}

interface StreetStats {
  totalProperties: number;
  propertiesWithExtensions: number;
  approvalRate: number;
  averageExtensionSizeSqm: number;
}

interface ValueUplift {
  propertyValueMin: number;
  propertyValueMax: number;
  estimatedUplift: number;
}

interface NeighboursResponse {
  postcode: string;
  subjectProperty?: NeighbourProperty;
  neighbours: NeighbourProperty[];
  streetStats: StreetStats;
  valueUplift?: ValueUplift;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const UK_POSTCODE_RE =
  /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-BD-HJLNP-UW-Z]{2}$/i;

function formatGBP(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalisePostcode(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, "");
  // Insert space before last 3 chars for display
  return cleaned.length > 3
    ? `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`
    : cleaned;
}

const EXTENSION_TYPE_LABEL: Record<string, string> = {
  rear: "Rear",
  side: "Side return",
  loft: "Loft",
  other: "Other",
};

const APPROVAL_COLOUR: Record<string, string> = {
  approved: "#1A7F5A",
  refused: "#B45309",
  pending: "#4A7FA5",
};

const APPROVAL_LABEL: Record<string, string> = {
  approved: "Approved",
  refused: "Refused",
  pending: "Pending",
};

// ── Client-side cache (module scope — survives re-renders, not page reloads) ──

const resultsCache = new Map<string, NeighboursResponse>();

// ── Sub-components ─────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: "inline-block",
        width: 18,
        height: 18,
        border: "2px solid rgba(255,255,255,0.25)",
        borderTopColor: "#ffffff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "20px 24px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: "clamp(22px, 4vw, 32px)",
          fontFamily: "var(--font-dm-serif, Georgia, serif)",
          color: "#7BAFD4",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.55)",
          marginTop: 4,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function NeighbourCard({ property }: { property: NeighbourProperty }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${
          property.hasExtended
            ? "rgba(26,127,90,0.35)"
            : "rgba(255,255,255,0.07)"
        }`,
        borderRadius: 8,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Address + extension badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.4,
          }}
        >
          {property.address}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: 4,
            background: property.hasExtended
              ? "rgba(26,127,90,0.2)"
              : "rgba(255,255,255,0.06)",
            color: property.hasExtended ? "#4ade80" : "rgba(255,255,255,0.35)",
            border: `1px solid ${
              property.hasExtended
                ? "rgba(26,127,90,0.4)"
                : "rgba(255,255,255,0.1)"
            }`,
            flexShrink: 0,
          }}
        >
          {property.hasExtended ? "Extended" : "No extension"}
        </span>
      </div>

      {/* Extension details */}
      {property.hasExtended && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 16px",
            fontSize: 13,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {property.extensionType && (
            <span>
              Type:{" "}
              <strong style={{ color: "rgba(255,255,255,0.75)" }}>
                {EXTENSION_TYPE_LABEL[property.extensionType] ??
                  property.extensionType}
              </strong>
            </span>
          )}
          {property.extensionSizeSqm && (
            <span>
              Size:{" "}
              <strong style={{ color: "rgba(255,255,255,0.75)" }}>
                {property.extensionSizeSqm} m²
              </strong>
            </span>
          )}
          {property.planningReference && (
            <span>
              Ref:{" "}
              <strong
                style={{
                  color: "#7BAFD4",
                  fontFamily: "monospace",
                  fontSize: 12,
                }}
              >
                {property.planningReference}
              </strong>
            </span>
          )}
          {property.approvalStatus && (
            <span
              style={{
                color:
                  APPROVAL_COLOUR[property.approvalStatus] ??
                  "rgba(255,255,255,0.55)",
                fontWeight: 600,
              }}
            >
              {APPROVAL_LABEL[property.approvalStatus] ??
                property.approvalStatus}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type PageState = "idle" | "loading" | "results" | "error";

export default function NeighboursPage() {
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [pageState, setPageState] = useState<PageState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<NeighboursResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const validate = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setPostcodeError("Please enter a postcode.");
      return false;
    }
    if (!UK_POSTCODE_RE.test(value.trim())) {
      setPostcodeError("Please enter a valid UK postcode (e.g. SW1A 2AA).");
      return false;
    }
    setPostcodeError("");
    return true;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate(postcode)) return;

      const normalised = normalisePostcode(postcode);
      const cacheKey = normalised.replace(/\s/g, "").toUpperCase();

      // Serve from cache if available
      if (resultsCache.has(cacheKey)) {
        setResults(resultsCache.get(cacheKey)!);
        setPageState("results");
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
        return;
      }

      setPageState("loading");
      setErrorMessage("");

      try {
        const res = await fetch(
          `/api/neighbours?postcode=${encodeURIComponent(normalised)}&radius=100`
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (res.status === 404) {
            setErrorMessage(
              "No planning data found for this postcode. Try a nearby postcode or check the spelling."
            );
          } else if (res.status === 422) {
            setErrorMessage(
              "That postcode doesn't look right. Please double-check and try again."
            );
          } else {
            setErrorMessage(
              (body as { message?: string }).message ||
                "Something went wrong. Please try again in a moment."
            );
          }
          setPageState("error");
          return;
        }

        const data: NeighboursResponse = await res.json();
        resultsCache.set(cacheKey, data);
        setResults(data);
        setPageState("results");
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
      } catch {
        setErrorMessage(
          "Could not reach the server. Please check your connection and try again."
        );
        setPageState("error");
      }
    },
    [postcode, validate]
  );

  const handleReset = useCallback(() => {
    setPageState("idle");
    setResults(null);
    setErrorMessage("");
    setPostcode("");
  }, []);

  const stats = results?.streetStats;
  const uplift = results?.valueUplift;

  return (
    <>
      {/* Inject keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#0F2240",
          fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
          color: "#ffffff",
        }}
      >
        {/* ── Header / Input section ── */}
        <section
          className="hero-bg"
          style={{
            padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 48px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <a
            href="/"
            style={{
              color: "#7BAFD4",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              marginBottom: "2rem",
              display: "inline-block",
            }}
          >
            ← caniextend
          </a>

          <h1
            className="animate-fade-up"
            style={{
              fontFamily: "var(--font-dm-serif, Georgia, serif)",
              fontSize: "clamp(32px, 5vw, 56px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "clamp(12px, 2vw, 20px)",
              maxWidth: 680,
            }}
          >
            See what your neighbours have built
          </h1>

          <p
            className="animate-fade-up animate-fade-up-1"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(15px, 2vw, 18px)",
              lineHeight: 1.7,
              maxWidth: 520,
              marginBottom: "clamp(32px, 5vw, 48px)",
            }}
          >
            Enter a UK postcode to check which properties on the street have
            extended, their planning approval status, and what it could mean for
            your own extension.
          </p>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="animate-fade-up animate-fade-up-2"
            style={{
              width: "100%",
              maxWidth: 520,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <label htmlFor="postcode-input" className="sr-only">
                  UK Postcode
                </label>
                <input
                  id="postcode-input"
                  type="text"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value);
                    if (postcodeError) setPostcodeError("");
                    if (pageState === "error") setPageState("idle");
                  }}
                  placeholder="e.g. SW1A 2AA"
                  autoComplete="postal-code"
                  aria-describedby={
                    postcodeError ? "postcode-error" : undefined
                  }
                  aria-invalid={!!postcodeError}
                  disabled={pageState === "loading"}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    fontSize: 16,
                    background: "rgba(255,255,255,0.07)",
                    border: `1.5px solid ${postcodeError ? "#B45309" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: 8,
                    color: "#ffffff",
                    fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
                    outline: "none",
                    transition: "border-color 0.15s ease",
                    letterSpacing: "0.04em",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4A7FA5";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = postcodeError
                      ? "#B45309"
                      : "rgba(255,255,255,0.15)";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={pageState === "loading"}
                className="hero-cta-primary"
                style={{
                  padding: "13px 24px",
                  borderRadius: 8,
                  border: "none",
                  fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: pageState === "loading" ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                  opacity: pageState === "loading" ? 0.75 : 1,
                }}
              >
                {pageState === "loading" ? (
                  <>
                    <Spinner />
                    Searching…
                  </>
                ) : (
                  "Check street"
                )}
              </button>
            </div>

            {/* Inline validation error */}
            {postcodeError && (
              <p
                id="postcode-error"
                role="alert"
                style={{
                  fontSize: 13,
                  color: "#F6AD55",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                {postcodeError}
              </p>
            )}

            {/* Fetch error */}
            {pageState === "error" && errorMessage && (
              <p
                role="alert"
                style={{
                  fontSize: 13,
                  color: "#F6AD55",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                {errorMessage}
              </p>
            )}
          </form>
        </section>

        {/* ── Results section ── */}
        {pageState === "results" && results && (
          <section
            ref={resultsRef}
            style={{
              padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px)",
              maxWidth: 960,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(32px, 5vw, 56px)",
            }}
          >
            {/* Results header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#7BAFD4",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Results for
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-dm-serif, Georgia, serif)",
                    fontSize: "clamp(24px, 4vw, 36px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {results.postcode}
                </h2>
              </div>
              <button
                onClick={handleReset}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 6,
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.06)";
                }}
              >
                New search
              </button>
            </div>

            {/* Subject property highlight */}
            {results.subjectProperty && (
              <div>
                <h3
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#7BAFD4",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Your property
                </h3>
                <div
                  style={{
                    background: "rgba(74,127,165,0.12)",
                    border: "1.5px solid rgba(74,127,165,0.4)",
                    borderRadius: 10,
                    padding: "20px 24px",
                  }}
                >
                  <NeighbourCard property={results.subjectProperty} />
                </div>
              </div>
            )}

            {/* Street statistics */}
            {stats && (
              <div>
                <h3
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#7BAFD4",
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  Street summary
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  <StatCard
                    label="Properties checked"
                    value={String(stats.totalProperties)}
                  />
                  <StatCard
                    label="Have extended"
                    value={String(stats.propertiesWithExtensions)}
                    sub={`${Math.round(
                      (stats.propertiesWithExtensions /
                        (stats.totalProperties || 1)) *
                        100
                    )}% of street`}
                  />
                  <StatCard
                    label="Approval rate"
                    value={`${Math.round(stats.approvalRate)}%`}
                    sub="of planning applications"
                  />
                  <StatCard
                    label="Avg. extension"
                    value={`${stats.averageExtensionSizeSqm} m²`}
                    sub="floor area added"
                  />
                </div>
              </div>
            )}

            {/* Neighbour cards */}
            {results.neighbours.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#7BAFD4",
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  Nearby properties ({results.neighbours.length})
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 10,
                  }}
                >
                  {results.neighbours.map((n, i) => (
                    <NeighbourCard key={`${n.address}-${i}`} property={n} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty neighbours state */}
            {results.neighbours.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 24px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 15,
                }}
              >
                No neighbour planning data found within 100 m of this postcode.
              </div>
            )}

            {/* Estimated value uplift */}
            {uplift && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(26,127,90,0.12) 0%, rgba(74,127,165,0.1) 100%)",
                  border: "1px solid rgba(26,127,90,0.3)",
                  borderRadius: 12,
                  padding: "clamp(24px, 4vw, 40px)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 24,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4ade80",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Estimated value uplift
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-dm-serif, Georgia, serif)",
                      fontSize: "clamp(28px, 5vw, 44px)",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.05,
                      color: "#ffffff",
                    }}
                  >
                    +{formatGBP(uplift.estimatedUplift)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      marginTop: 6,
                    }}
                  >
                    estimated added value from an extension
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: 14,
                  }}
                >
                  <div style={{ color: "rgba(255,255,255,0.55)" }}>
                    Current value range
                  </div>
                  <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                    {formatGBP(uplift.propertyValueMin)} –{" "}
                    {formatGBP(uplift.propertyValueMax)}
                  </div>
                </div>
                <div style={{ flex: "0 0 100%", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.5 }}>
                    Estimates are indicative only, based on local comparable data. They do not constitute a formal valuation.
                  </p>
                </div>
              </div>
            )}

            {/* CTA to get a full proposal */}
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 15,
                  marginBottom: 20,
                }}
              >
                Ready to see what you could build?
              </p>
              <a
                href="/#waitlist"
                className="hero-cta-primary"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 15,
                  fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
                }}
              >
                Get my extension proposal
              </a>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

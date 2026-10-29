/**
 * Mithran Labs logo. The mark is three columns forming an "M": the middle
 * column hangs from the top, and beneath it sits a cell in the accent
 * colour — the "lab" spark.
 * The wordmark is set in the display face; textLength pins its width so the
 * lockup keeps its proportions before and after the web font loads.
 */

type Tone = "brand" | "mono";

const columns = (tone: Tone) => (
  <>
    <rect x="2" y="4" width="7" height="24" rx="1.6" />
    <rect x="12.5" y="4" width="7" height="15" rx="1.6" />
    <rect x="23" y="4" width="7" height="24" rx="1.6" />
    <rect x="12.5" y="22" width="7" height="6" rx="1.6" fill={tone === "brand" ? "var(--accent)" : "currentColor"} />
  </>
);

export function LogoMark({ tone = "brand", className, title }: { tone?: Tone; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g fill="currentColor">{columns(tone)}</g>
    </svg>
  );
}

export function LogoFull({ tone = "brand", className, title = "Mithran Labs" }: { tone?: Tone; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 236 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title || undefined}
    >
      <g fill="currentColor">{columns(tone)}</g>
      <text
        x="43"
        y="25.5"
        textLength="191"
        lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 600, letterSpacing: "-0.03em" }}
      >
        Mithran<tspan fillOpacity="0.5"> Labs</tspan>
      </text>
    </svg>
  );
}

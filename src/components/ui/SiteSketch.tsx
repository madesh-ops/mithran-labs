import styles from "./SiteSketch.module.css";

export type SketchKind =
  | "design"
  | "business"
  | "landing"
  | "portfolio"
  | "store"
  | "redesign"
  | "performance"
  | "maintenance"
  | "studio"
  | "agency";

/**
 * Abstract website wireframes drawn in CSS. They stand in for photography so
 * the site never shows imagery that isn't ours — decorative only, so they are
 * hidden from assistive tech and carry no text a reader would miss.
 */
export function SiteSketch({
  kind,
  device = "desktop",
  animate = false,
  className = "",
  label,
}: {
  kind: SketchKind;
  device?: "desktop" | "phone";
  animate?: boolean;
  className?: string;
  /** Optional caption shown in the address bar, e.g. "yourbusiness.com". */
  label?: string;
}) {
  return (
    <div
      className={`${styles.frame} ${device === "phone" ? styles.phone : ""} ${className}`}
      data-animate={animate || undefined}
      data-kind={kind}
      aria-hidden="true"
    >
      {device === "desktop" && (
        <div className={styles.chrome}>
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.url}>{label}</span>
        </div>
      )}
      <div className={`${styles.canvas} ${styles[kind]}`}>{layouts[kind]}</div>
    </div>
  );
}

const B = ({ c = "", w }: { c?: string; w?: string }) => (
  <span className={`${styles.bar} ${c}`} style={w ? ({ "--w": w } as React.CSSProperties) : undefined} />
);
const Img = ({ c = "" }: { c?: string }) => <span className={`${styles.img} ${c}`} />;
const Btn = ({ ghost }: { ghost?: boolean }) => <span className={`${styles.btn} ${ghost ? styles.ghost : ""}`} />;
const Nav = () => (
  <span className={styles.nav}>
    <span className={styles.logo} />
    <span className={styles.navLinks}>
      <B w="6cqi" />
      <B w="7cqi" />
      <B w="5cqi" />
    </span>
    <span className={styles.navCta} />
  </span>
);

const layouts: Record<SketchKind, React.ReactNode> = {
  business: (
    <>
      <Nav />
      <span className={styles.heroText}>
        <B c={styles.title} w="88%" />
        <B c={styles.title} w="62%" />
        <B w="70%" />
        <span className={styles.row}>
          <Btn />
          <Btn ghost />
        </span>
      </span>
      <Img c={styles.heroImg} />
      <span className={styles.cards}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={styles.card}>
            <span className={styles.icon} />
            <B w="70%" />
            <B w="90%" />
          </span>
        ))}
      </span>
    </>
  ),
  landing: (
    <>
      <Nav />
      <span className={styles.centerHero}>
        <span className={styles.pill} />
        <B c={styles.title} w="80%" />
        <B c={styles.title} w="56%" />
        <B w="64%" />
        <span className={styles.form}>
          <span className={styles.input} />
          <Btn />
        </span>
      </span>
      <span className={styles.logosRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <B key={i} w="100%" />
        ))}
      </span>
    </>
  ),
  design: (
    <>
      <span className={styles.gridOverlay}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <i key={i} />
        ))}
      </span>
      <span className={styles.specimen}>Aa</span>
      <span className={styles.typeScale}>
        <B c={styles.title} w="90%" />
        <B w="70%" />
        <B w="80%" />
        <B w="50%" />
      </span>
      <span className={styles.swatches}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={styles.components}>
        <Btn />
        <Btn ghost />
        <span className={styles.input} />
      </span>
    </>
  ),
  portfolio: (
    <>
      <Nav />
      <B c={styles.title} w="46%" />
      <span className={styles.masonry}>
        <Img c={styles.tall} />
        <Img />
        <Img c={styles.accentImg} />
        <Img />
        <Img c={styles.tall} />
        <Img />
      </span>
    </>
  ),
  store: (
    <>
      <Nav />
      <span className={styles.storeHead}>
        <B c={styles.title} w="40%" />
        <span className={styles.chips}>
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className={styles.products}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={styles.product}>
            <Img c={i === 1 ? styles.accentImg : ""} />
            <B w="80%" />
            <B c={styles.price} w="36%" />
          </span>
        ))}
      </span>
    </>
  ),
  redesign: (
    <>
      <span className={styles.before}>
        <span className={styles.tag} />
        <B w="90%" />
        <Img />
        <B w="60%" />
        <B w="75%" />
        <B w="40%" />
        <Img />
        <B w="85%" />
      </span>
      <span className={styles.after}>
        <span className={`${styles.tag} ${styles.tagOn}`} />
        <B c={styles.title} w="80%" />
        <B w="60%" />
        <Btn />
        <Img c={styles.heroImg} />
      </span>
    </>
  ),
  performance: (
    <>
      <span className={styles.gauges}>
        {[0.94, 0.98, 0.9].map((v, i) => (
          <span key={i} className={styles.gauge}>
            <svg viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" className={styles.track} />
              <circle cx="20" cy="20" r="16" className={styles.arc} style={{ strokeDasharray: `${v * 100.5} 100.5` }} />
            </svg>
            <B w="70%" />
          </span>
        ))}
      </span>
      <span className={styles.waterfall}>
        {["18%", "34%", "26%", "12%", "22%"].map((w, i) => (
          <span key={i} className={styles.wfRow} style={{ "--o": `${i * 9}%`, "--w": w } as React.CSSProperties}>
            <B w="12cqi" />
            <i />
          </span>
        ))}
      </span>
    </>
  ),
  maintenance: (
    <>
      <span className={styles.statusHead}>
        <span className={styles.liveDot} />
        <B c={styles.title} w="44%" />
      </span>
      <span className={styles.checklist}>
        {["72%", "56%", "64%", "48%", "60%"].map((w, i) => (
          <span key={i} className={styles.check}>
            <svg viewBox="0 0 16 16">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
            <B w={w} />
            <B c={styles.when} w="9cqi" />
          </span>
        ))}
      </span>
    </>
  ),
  studio: (
    <>
      <Nav />
      <span className={styles.heroText}>
        <B c={styles.title} w="92%" />
        <B c={`${styles.title} ${styles.serif}`} w="58%" />
        <B w="66%" />
        <span className={styles.row}>
          <Btn />
          <Btn ghost />
        </span>
      </span>
      <span className={styles.miniFrame} />
      <span className={styles.list}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.listRow}>
            <B w="4cqi" />
            <B w="50%" />
          </span>
        ))}
      </span>
    </>
  ),
  agency: (
    <>
      <Nav />
      <span className={styles.mega}>
        <B c={styles.title} w="100%" />
      </span>
      <span className={styles.editorial}>
        <Img c={styles.wide} />
        <Img />
        <Img />
        <Img c={styles.wide} />
      </span>
    </>
  ),
};

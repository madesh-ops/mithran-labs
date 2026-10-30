import { LogoMark } from "@/components/brand/Logo";
import { Split } from "@/components/motion/Split";
import { Button } from "@/components/ui/Button";
import { HeroBuild } from "./HeroBuild";
import styles from "./Hero.module.css";

const strip = ["Custom design", "Development", "E-commerce", "Redesigns", "Performance", "Maintenance"];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>
            <LogoMark className={styles.kickerMark} />
            Website design &amp; development studio
          </p>
          <Split as="h1" variant="hero" id="hero-title" className={styles.headline}>
            Websites, designed and built <span className="swash">to do their job.</span>
          </Split>
          <p className={`lead ${styles.lead}`}>
            Mithran Labs plans, designs, builds and looks after websites for businesses and independents — from a
            single landing page to a full online store.
          </p>
          <div className={styles.actions}>
            <Button href="/contact" size="lg">
              Start a project
            </Button>
            <Button href="/services" variant="glass" size="lg" icon="none">
              See services
            </Button>
          </div>
        </div>

        <div className={styles.visual}>
          <HeroBuild desktopClass={styles.desktop} phoneClass={styles.phone} phoneWrapClass={styles.phoneWrap} />
        </div>
      </div>

      <div className={`container ${styles.stripWrap}`}>
        <ul className={styles.strip} role="list" aria-label="What we do">
          {strip.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

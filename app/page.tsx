import styles from './page.module.css';
import { WizardShell } from '@/components/wizard/WizardShell';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* ── Decorative blobs ── */}
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      {/* ── Nav bar ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.navLogoMark}>
            <span>💙</span>
          </div>
          <span className={styles.navBrand}>BlueTax</span>
        </div>
        <div className={styles.navBadge}>
          <span className={styles.navBadgeDot} />
          2026 Tax Year
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className={`${styles.hero} animate-in`}>
        <div className={styles.heroTag}>
          <span>🔒</span> No data stored · 100% private · Free forever
        </div>

        <h1 className={styles.headline}>
          Keep more of your<br />
          <span className={`${styles.highlightWord} gradient-text`}>paycheck</span>
        </h1>

        <p className={styles.subheadline}>
          Enter your salary or take-home pay → get a full 2026 tax breakdown
          + personalized tips to save more money. No sign-up needed.
        </p>

        <div className={styles.statRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>2026</span>
            <span className={styles.statLabel}>IRS brackets</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>5+</span>
            <span className={styles.statLabel}>Savings strategies</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>0s</span>
            <span className={styles.statLabel}>Data stored</span>
          </div>
        </div>
      </header>

      {/* ── Wizard ── */}
      <section className={styles.wizardSection}>
        <WizardShell />
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p>
          Built for U.S. W2 employees · California MVP · 2026 IRS data ·{' '}
          <a href="https://github.com/Smart123-12/bluetax" target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
          {' '}· Estimation only — not tax advice
        </p>
      </footer>
    </main>
  );
}

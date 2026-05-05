import styles from './page.module.css';
import { WizardShell } from '@/components/wizard/WizardShell';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* ── Hero Header ─────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.logoRow}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💙</span>
            <span className={styles.logoText}>BlueTax</span>
          </div>
          <div className={styles.taxYear}>
            <span className={styles.taxYearBadge}>2026 Tax Year</span>
          </div>
        </div>
        <h1 className={styles.headline}>
          Keep more of your <span className={styles.highlight}>paycheck</span>
        </h1>
        <p className={styles.subheadline}>
          Enter your salary or take-home → get your full tax breakdown + personalized tips to save money.
          <br />Privacy-first. 100% free. No sign-up.
        </p>
        <div className={styles.trustBadges}>
          <span className={styles.trustBadge}>🔒 No data stored</span>
          <span className={styles.trustBadge}>⚡ Instant results</span>
          <span className={styles.trustBadge}>📊 2026 IRS brackets</span>
        </div>
      </header>

      {/* ── Wizard ────────────────────────────────────── */}
      <div className={styles.wizardSection}>
        <WizardShell />
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>
          Built with ❤️ for US W2 employees · California MVP ·{' '}
          <a href="https://github.com/smitparmar" target="_blank" rel="noopener noreferrer">GitHub</a>
          {' '}· Estimation only, not tax advice
        </p>
      </footer>
    </main>
  );
}

'use client';
import styles from './ResultsDashboard.module.css';
import { TaxBreakdown, OptimizationResult, TaxInputs } from '@/types/tax';
import { TaxBreakdownCard } from './TaxBreakdownCard';
import { EffectiveRateGauge } from './EffectiveRateGauge';
import { OptimizationPanel } from './OptimizationPanel';

interface Props {
  result: TaxBreakdown;
  optimization: OptimizationResult;
  inputs: TaxInputs;
  onBack: () => void;
  onReset: () => void;
}

export function ResultsDashboard({ result, optimization, inputs, onBack, onReset }: Props) {
  const fmt  = (n: number) => '$' + Math.abs(Math.round(n)).toLocaleString();
  const pct  = (n: number) => result.grossAnnual > 0
    ? ((n / result.grossAnnual) * 100).toFixed(1) + '%' : '—';

  return (
    <div className={styles.dashboard}>

      {/* ── Hero header card ── */}
      <div className={`${styles.header} animate-in`}>
        <div className={styles.headerBg} />
        <div className={styles.headerBgOverlay} />
        <div className={styles.headerContent}>
          <div className={styles.headerNav}>
            <button className={styles.headerNavBtn} onClick={onBack} id="btn-results-back">
              ← Edit answers
            </button>
            <button className={styles.headerNavBtn} onClick={onReset} id="btn-start-over">
              ↺ Start over
            </button>
          </div>
          <div className={styles.headerHero}>
            <p className={styles.heroLabel}>Your monthly take-home</p>
            <p className={styles.heroAmount}>
              {fmt(result.netMonthly)}
              <span className={styles.heroAmountSub}>/mo</span>
            </p>
            <p className={styles.heroAnnual}>{fmt(result.netAnnual)} per year</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.hStat}>
              <span className={styles.hStatNum}>{pct(result.federalTax)}</span>
              <span className={styles.hStatLabel}>Federal</span>
            </div>
            <div className={styles.hStatDivider} />
            <div className={styles.hStat}>
              <span className={styles.hStatNum}>{pct(result.stateTax)}</span>
              <span className={styles.hStatLabel}>{inputs.state === 'CA' ? 'CA + SDI' : 'State'}</span>
            </div>
            <div className={styles.hStatDivider} />
            <div className={styles.hStat}>
              <span className={styles.hStatNum}>{pct(result.ficaTotal)}</span>
              <span className={styles.hStatLabel}>FICA</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Savings banner ── */}
      {optimization.totalPotentialSavings > 0 && (
        <div className={`${styles.savingsBanner} animate-in delay-1`}>
          <div className={styles.savingsIconWrap}>💡</div>
          <div className={styles.savingsText}>
            <p className={styles.savingsTitle}>
              Save up to <strong>{fmt(optimization.totalPotentialSavings)}/year</strong> with smart moves ↓
            </p>
            <p className={styles.savingsSubtitle}>Personalized recommendations based on your profile</p>
          </div>
        </div>
      )}

      {/* ── Gauge ── */}
      <div className="animate-in delay-2">
        <EffectiveRateGauge rate={result.effectiveRate} gross={result.grossAnnual} />
      </div>

      {/* ── Breakdown ── */}
      <div className="animate-in delay-3">
        <TaxBreakdownCard result={result} inputs={inputs} />
      </div>

      {/* ── Optimization ── */}
      <div className="animate-in delay-4">
        <OptimizationPanel optimization={optimization} />
      </div>

      {/* ── Disclaimer ── */}
      <div className={`${styles.disclaimer} animate-in delay-5`}>
        <p>
          🔒 All calculations run in your browser — nothing is stored or transmitted. This tool uses
          official <strong>2026 IRS brackets</strong> and <strong>CA FTB rates</strong> for estimation.
        </p>
      </div>
    </div>
  );
}

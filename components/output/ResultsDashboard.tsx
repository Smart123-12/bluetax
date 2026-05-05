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
  const fmt = (n: number) => '$' + Math.abs(n).toLocaleString();

  return (
    <div className={styles.dashboard}>
      {/* ── Header ── */}
      <div className={`${styles.header} animate-in`}>
        <div className={styles.headerTop}>
          <button className="btn btn--back" onClick={onBack} id="btn-results-back">← Edit</button>
          <button className="btn btn--ghost" onClick={onReset} id="btn-start-over"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
            Start Over
          </button>
        </div>
        <div className={styles.headerContent}>
          <p className={styles.headerLabel}>Your estimated take-home</p>
          <h1 className={styles.netIncome}>{fmt(result.netMonthly)}<span>/mo</span></h1>
          <p className={styles.netAnnual}>{fmt(result.netAnnual)} per year</p>
        </div>
      </div>

      {/* ── Savings Banner (if any) ── */}
      {optimization.totalPotentialSavings > 0 && (
        <div className={`${styles.savingsBanner} animate-in delay-1`}>
          <span className={styles.savingsEmoji}>💡</span>
          <div>
            <p className={styles.savingsTitle}>You could save <strong>{fmt(optimization.totalPotentialSavings)}/year</strong></p>
            <p className={styles.savingsSubtitle}>See personalized recommendations below</p>
          </div>
        </div>
      )}

      {/* ── Gauge ── */}
      <div className={`animate-in delay-2`}>
        <EffectiveRateGauge rate={result.effectiveRate} gross={result.grossAnnual} />
      </div>

      {/* ── Tax Breakdown ── */}
      <div className={`animate-in delay-3`}>
        <TaxBreakdownCard result={result} inputs={inputs} />
      </div>

      {/* ── Optimization ── */}
      <div className={`animate-in delay-4`}>
        <OptimizationPanel optimization={optimization} />
      </div>

      {/* ── Disclaimer ── */}
      <div className={`${styles.disclaimer} animate-in delay-5`}>
        <p>
          🔒 <strong>100% private</strong> — all calculations happen in your browser. No data is stored or transmitted.
          This is an <strong>estimation tool</strong> using 2026 IRS brackets and CA FTB rates. Not tax advice.
          Consult a CPA for filing decisions.
        </p>
      </div>
    </div>
  );
}

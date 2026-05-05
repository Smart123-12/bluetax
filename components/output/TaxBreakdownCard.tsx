'use client';
import styles from './TaxBreakdownCard.module.css';
import { TaxBreakdown, TaxInputs } from '@/types/tax';

interface Props {
  result: TaxBreakdown;
  inputs: TaxInputs;
}

const ROWS = [
  { key: 'federalTax',     label: 'Federal Income Tax',       color: 'var(--blue-500)',          gradStart: 'hsl(213,85%,52%)', gradEnd: 'hsl(213,78%,60%)' },
  { key: 'stateTax',       label: 'CA State Tax + SDI',       color: 'var(--teal-400)',           gradStart: 'hsl(195,85%,52%)', gradEnd: 'hsl(185,85%,58%)' },
  { key: 'socialSecurity', label: 'Social Security',          color: 'var(--indigo-400)',         gradStart: 'hsl(230,80%,65%)', gradEnd: 'hsl(230,75%,72%)' },
  { key: 'medicare',       label: 'Medicare',                 color: 'hsl(260,70%,65%)',          gradStart: 'hsl(260,70%,65%)', gradEnd: 'hsl(260,65%,72%)' },
] as const;

export function TaxBreakdownCard({ result, inputs }: Props) {
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();
  const pct = (n: number) =>
    result.grossAnnual > 0 ? ((n / result.grossAnnual) * 100).toFixed(1) + '%' : '—';

  const hints: Record<string, string> = {
    federalTax:     `Taxable income ${fmt(result.taxableIncome)} after $${result.standardDeduction.toLocaleString()} std. deduction`,
    stateTax:       inputs.state === 'CA' ? 'CA income tax + 1.1% SDI (no wage cap)' : 'Federal only — state coming soon',
    socialSecurity: `6.2% up to $184,500 wage base (2026)`,
    medicare:       '1.45% on all wages + 0.9% over $200k',
  };

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>📊 Tax Breakdown</h3>
        <div className={styles.grossBadge}>
          <span className={styles.grossLabel}>Gross income</span>
          <span className={styles.grossAmount}>{fmt(result.grossAnnual)}</span>
        </div>
      </div>

      {result.agi < result.grossAnnual && (
        <div className={styles.agiRow}>
          <span>After pre-tax deductions (AGI)</span>
          <span>{fmt(result.agi)}</span>
        </div>
      )}

      <div className={styles.rows}>
        {ROWS.map((row, i) => {
          const amount = result[row.key];
          const barPct = result.grossAnnual > 0 ? (amount / result.grossAnnual) * 100 : 0;
          const label  = row.key === 'stateTax' && inputs.state !== 'CA' ? 'State Tax' : row.label;
          return (
            <div key={row.key} className={styles.row} style={{ animationDelay: `${i * 80}ms` }}>
              <div className={styles.rowTop}>
                <div className={styles.dot} style={{ background: row.color, boxShadow: `0 0 0 3px ${row.color}22` }} />
                <div className={styles.rowInfo}>
                  <div className={styles.rowLabel}>{label}</div>
                  <div className={styles.rowHint}>{hints[row.key]}</div>
                </div>
                <div className={styles.rowAmounts}>
                  <span className={styles.rowAmount}>{fmt(amount)}</span>
                  <span className={styles.rowPct}>{pct(amount)}</span>
                </div>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(barPct * 2.5, 100)}%`,
                    background: `linear-gradient(90deg, ${row.gradStart}, ${row.gradEnd})`,
                    animationDelay: `${i * 100 + 200}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.divider} />
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total Tax</span>
        <div className={styles.totalRight}>
          <span className={styles.totalAmount}>{fmt(result.totalTax)}</span>
          <span className={styles.totalPct}>{result.effectiveRate}% effective rate</span>
        </div>
      </div>
    </div>
  );
}

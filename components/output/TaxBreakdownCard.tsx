'use client';
import styles from './TaxBreakdownCard.module.css';
import { TaxBreakdown, TaxInputs } from '@/types/tax';

interface Props {
  result: TaxBreakdown;
  inputs: TaxInputs;
}

interface Row {
  label: string;
  amount: number;
  pct: number;
  color: string;
  hint?: string;
}

export function TaxBreakdownCard({ result, inputs }: Props) {
  const fmt = (n: number) => '$' + n.toLocaleString();
  const pct = (n: number) => result.grossAnnual > 0
    ? ((n / result.grossAnnual) * 100).toFixed(1) + '%'
    : '0%';

  const rows: Row[] = [
    {
      label: 'Federal Income Tax',
      amount: result.federalTax,
      pct: result.grossAnnual > 0 ? (result.federalTax / result.grossAnnual) * 100 : 0,
      color: 'var(--blue-500)',
      hint: `Taxable income: ${fmt(result.taxableIncome)} (after $${result.standardDeduction.toLocaleString()} std. deduction)`,
    },
    {
      label: inputs.state === 'CA' ? 'CA State Tax + SDI' : 'State Tax',
      amount: result.stateTax,
      pct: result.grossAnnual > 0 ? (result.stateTax / result.grossAnnual) * 100 : 0,
      color: 'var(--teal-400)',
      hint: inputs.state === 'CA' ? 'CA income tax + 1.1% SDI' : 'Federal only (state coming soon)',
    },
    {
      label: 'Social Security',
      amount: result.socialSecurity,
      pct: result.grossAnnual > 0 ? (result.socialSecurity / result.grossAnnual) * 100 : 0,
      color: 'var(--blue-300)',
      hint: '6.2% up to $184,500 wage base (2026)',
    },
    {
      label: 'Medicare',
      amount: result.medicare,
      pct: result.grossAnnual > 0 ? (result.medicare / result.grossAnnual) * 100 : 0,
      color: 'hsl(195, 75%, 55%)',
      hint: '1.45% + 0.9% on income over $200k',
    },
  ];

  return (
    <div className={`card ${styles.card}`}>
      <h3 className={styles.title}>📊 Tax Breakdown</h3>
      <div className={styles.grossRow}>
        <span className={styles.grossLabel}>Gross Income</span>
        <span className={styles.grossAmount}>{fmt(result.grossAnnual)}</span>
      </div>
      {result.agi < result.grossAnnual && (
        <div className={styles.agiRow}>
          <span>After 401k/HSA deductions (AGI)</span>
          <span>{fmt(result.agi)}</span>
        </div>
      )}
      <div className={styles.divider} />

      {rows.map(row => (
        <div key={row.label} className={styles.row}>
          <div className={styles.rowLeft}>
            <div className={styles.rowDot} style={{ background: row.color }} />
            <div>
              <div className={styles.rowLabel}>{row.label}</div>
              {row.hint && <div className={styles.rowHint}>{row.hint}</div>}
            </div>
          </div>
          <div className={styles.rowRight}>
            <span className={styles.rowAmount}>{fmt(row.amount)}</span>
            <span className={styles.rowPct}>{pct(row.amount)}</span>
          </div>
          <div className={styles.rowBar}>
            <div className={styles.rowBarFill}
              style={{ width: `${Math.min(row.pct, 100)}%`, background: row.color }} />
          </div>
        </div>
      ))}

      <div className={styles.divider} />
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total Tax</span>
        <div className={styles.totalRight}>
          <span className={styles.totalAmount}>{fmt(result.totalTax)}</span>
          <span className={styles.totalPct}>{pct(result.totalTax)} effective rate</span>
        </div>
      </div>
    </div>
  );
}

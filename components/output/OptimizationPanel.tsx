'use client';
import styles from './OptimizationPanel.module.css';
import { OptimizationResult, Suggestion } from '@/types/tax';

interface Props {
  optimization: OptimizationResult;
}

const categoryIcon: Record<string, string> = {
  retirement: '🏦',
  health:     '🏥',
  credit:     '✅',
  deduction:  '📋',
};

const priorityLabel: Record<string, string> = {
  high:   'High Impact',
  medium: 'Medium Impact',
  low:    'Good to Know',
};

const priorityClass: Record<string, string> = {
  high:   'badgeHigh',
  medium: 'badgeMedium',
  low:    'badgeLow',
};

function SuggestionCard({ s }: { s: Suggestion }) {
  const savings = s.annualSavings > 0
    ? `Save ~$${s.annualSavings.toLocaleString()}/year`
    : 'Potential savings — varies';

  return (
    <div className={styles.suggCard}>
      <div className={styles.suggHeader}>
        <span className={styles.suggIcon}>{categoryIcon[s.category]}</span>
        <div className={styles.suggMeta}>
          <h4 className={styles.suggTitle}>{s.title}</h4>
          <span className={`${styles.badge} ${styles[priorityClass[s.priority]]}`}>
            {priorityLabel[s.priority]}
          </span>
        </div>
        {s.annualSavings > 0 && (
          <div className={styles.savingsChip}>
            <span className={styles.savingsAmt}>${s.annualSavings.toLocaleString()}</span>
            <span className={styles.savingsPer}>/yr</span>
          </div>
        )}
      </div>
      <p className={styles.suggDesc}>{s.description}</p>
      <div className={styles.suggAction}>
        <span className={styles.actionArrow}>→</span>
        <span>{s.action}</span>
      </div>
    </div>
  );
}

export function OptimizationPanel({ optimization }: Props) {
  const { suggestions, totalPotentialSavings } = optimization;

  if (suggestions.length === 0) {
    return (
      <div className={`card ${styles.panel}`}>
        <h3 className={styles.panelTitle}>✨ Optimization</h3>
        <div className={styles.allGood}>
          <span className={styles.allGoodIcon}>🎉</span>
          <p>You're already well-optimized! Keep contributing to your retirement accounts.</p>
        </div>
      </div>
    );
  }

  const sorted = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className={`card ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>✨ Save More Money</h3>
        {totalPotentialSavings > 0 && (
          <div className={styles.totalSavings}>
            <span className={styles.totalSavingsLabel}>Total potential savings</span>
            <span className={styles.totalSavingsAmt}>${totalPotentialSavings.toLocaleString()}/yr</span>
          </div>
        )}
      </div>
      <div className={styles.suggList}>
        {sorted.map(s => <SuggestionCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}

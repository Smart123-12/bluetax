'use client';
import styles from './OptimizationPanel.module.css';
import { OptimizationResult, Suggestion } from '@/types/tax';

interface Props {
  optimization: OptimizationResult;
}

const categoryStyle: Record<string, { bg: string; icon: string }> = {
  retirement: { bg: 'linear-gradient(135deg, hsl(213,85%,92%), hsl(213,80%,87%))', icon: '🏦' },
  health:     { bg: 'linear-gradient(135deg, hsl(152,65%,92%), hsl(152,60%,88%))', icon: '🏥' },
  credit:     { bg: 'linear-gradient(135deg, hsl(38,95%,92%),  hsl(38,90%,88%))',  icon: '✅' },
  deduction:  { bg: 'linear-gradient(135deg, hsl(260,65%,93%), hsl(260,60%,88%))', icon: '📋' },
};

const priorityLabel: Record<string, string> = {
  high:   '🔥 High Impact',
  medium: '⚡ Medium Impact',
  low:    '💡 Good to Know',
};
const priorityClass: Record<string, string> = {
  high: 'badgeHigh', medium: 'badgeMedium', low: 'badgeLow',
};

function SuggCard({ s, index }: { s: Suggestion; index: number }) {
  const cat = categoryStyle[s.category];
  return (
    <div
      className={`${styles.suggCard} animate-in`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className={styles.suggTop}>
        <div className={styles.suggIconBox} style={{ background: cat.bg }}>
          {cat.icon}
        </div>
        <div className={styles.suggMeta}>
          <h4 className={styles.suggTitle}>{s.title}</h4>
          <span className={`${styles.badge} ${styles[priorityClass[s.priority]]}`}>
            {priorityLabel[s.priority]}
          </span>
        </div>
        {s.annualSavings > 0 && (
          <div className={styles.savingsChip}>
            <span className={styles.chipAmt}>${s.annualSavings.toLocaleString()}</span>
            <span className={styles.chipPer}>saved/yr</span>
          </div>
        )}
      </div>

      <div className={styles.suggBody}>
        <p className={styles.suggDesc}>{s.description}</p>
      </div>

      <div className={styles.suggAction}>
        <span className={styles.actionIcon}>→</span>
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
          <span className={styles.allGoodEmoji}>🎉</span>
          <p>You&apos;re already well-optimized! Keep maxing out your retirement accounts.</p>
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
          <div className={styles.totalBox}>
            <span className={styles.totalBoxLabel}>Total potential savings</span>
            <span className={styles.totalBoxAmt}>${totalPotentialSavings.toLocaleString()}/yr</span>
          </div>
        )}
      </div>

      <div className={styles.suggList}>
        {sorted.map((s, i) => <SuggCard key={s.id} s={s} index={i} />)}
      </div>
    </div>
  );
}

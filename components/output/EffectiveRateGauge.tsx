'use client';
import styles from './EffectiveRateGauge.module.css';

interface Props {
  rate: number;  // 0–100 effective tax rate
  gross: number;
}

export function EffectiveRateGauge({ rate, gross }: Props) {
  // SVG arc gauge: semicircle from 180° to 0°
  const RADIUS = 70;
  const CIRCUMFERENCE = Math.PI * RADIUS; // semicircle
  const clampedRate = Math.min(rate, 50); // cap at 50% for display
  const fillPct = clampedRate / 50; // 0→1
  const dashOffset = CIRCUMFERENCE * (1 - fillPct);

  const getRateColor = () => {
    if (rate < 20) return 'var(--green-400)';
    if (rate < 30) return 'var(--amber-400)';
    return 'var(--rose-400)';
  };

  const getRateLabel = () => {
    if (rate < 18) return 'Great rate!';
    if (rate < 25) return 'Pretty typical';
    if (rate < 32) return 'Getting high';
    return 'Lots of room to optimize!';
  };

  return (
    <div className={`card ${styles.card}`}>
      <h3 className={styles.title}>📈 Effective Tax Rate</h3>
      <div className={styles.gaugeWrapper}>
        <svg viewBox="0 0 180 100" className={styles.svg}>
          {/* Background arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="var(--blue-100)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke={getRateColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={`${dashOffset}`}
            style={{
              transition: 'stroke-dashoffset 1200ms var(--ease-spring)',
              filter: `drop-shadow(0 2px 8px ${getRateColor()}60)`,
            }}
          />
          {/* Center text */}
          <text x="90" y="78" textAnchor="middle" className={styles.rateText}
            style={{ fill: getRateColor() }}>
            {rate.toFixed(1)}%
          </text>
        </svg>
        <p className={styles.rateLabel} style={{ color: getRateColor() }}>{getRateLabel()}</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Gross</span>
          <span className={styles.statValue}>${gross.toLocaleString()}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Avg effective rate (CA W2)</span>
          <span className={styles.statValue}>~26%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Your rate</span>
          <span className={styles.statValue} style={{ color: getRateColor() }}>{rate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

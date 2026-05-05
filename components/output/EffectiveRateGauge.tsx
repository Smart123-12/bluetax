'use client';
import styles from './EffectiveRateGauge.module.css';

interface Props {
  rate: number;
  gross: number;
}

export function EffectiveRateGauge({ rate, gross }: Props) {
  /* SVG arc gauge — semicircle, stroke-dasharray trick */
  const R   = 72;
  const CX  = 110;
  const CY  = 100;
  const ARC_LEN = Math.PI * R;               // half circumference
  const clamp   = Math.min(rate, 50);        // cap display at 50%
  const filled  = (clamp / 50) * ARC_LEN;
  const empty   = ARC_LEN - filled;

  const color = rate < 20 ? 'var(--green-400)' : rate < 30 ? 'var(--amber-400)' : 'var(--rose-400)';
  const label = rate < 18 ? '🎉 Excellent' : rate < 24 ? '👍 Pretty normal' : rate < 32 ? '⚠️ Getting high' : '🔴 Optimize now';
  const avgCA = 26; // approximate CA W2 effective rate benchmark

  return (
    <div className={`card ${styles.card}`}>
      <h3 className={styles.title}>📈 Effective Tax Rate</h3>

      <div className={styles.gaugeArea}>
        <svg viewBox="0 0 220 120" className={styles.svg} aria-label={`Effective tax rate: ${rate}%`}>
          {/* Track */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="hsla(213,60%,90%,0.8)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${empty}`}
            style={{
              filter: `drop-shadow(0 2px 10px ${color}80)`,
              transition: 'stroke-dasharray 1.4s var(--ease-spring)',
            }}
          />
          {/* Glow dot at end of arc */}
          {filled > 4 && (
            <circle
              cx={CX + R * Math.cos(Math.PI - (filled / ARC_LEN) * Math.PI)}
              cy={CY - R * Math.sin(Math.PI - (filled / ARC_LEN) * Math.PI) + (CY - CY)}
              r="6"
              fill="white"
              stroke={color}
              strokeWidth="3"
            />
          )}
          {/* Center rate text */}
          <text x={CX} y={CY - 4} textAnchor="middle" className={styles.rateNum} style={{ fill: color }}>
            {rate.toFixed(1)}%
          </text>
          <text x={CX} y={CY + 14} textAnchor="middle" className={styles.rateUnit}>
            effective rate
          </text>
        </svg>

        <div className={styles.rateLabel} style={{ color }}>
          {label}
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>${Math.round(gross / 1000)}k</span>
          <span className={styles.statLabel}>Gross income</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: rate < avgCA ? 'var(--green-500)' : 'var(--rose-400)' }}>
            {rate < avgCA ? `${(avgCA - rate).toFixed(1)}% below` : `${(rate - avgCA).toFixed(1)}% above`}
          </span>
          <span className={styles.statLabel}>vs CA avg (~{avgCA}%)</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{rate.toFixed(1)}%</span>
          <span className={styles.statLabel}>Your rate</span>
        </div>
      </div>
    </div>
  );
}

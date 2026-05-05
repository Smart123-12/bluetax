import styles from './ProgressBar.module.css';

interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = ((current - 1) / (total - 1)) * 100;
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.label}>Step {current} of {total}</span>
    </div>
  );
}

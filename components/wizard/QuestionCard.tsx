import styles from './QuestionCard.module.css';

interface Props {
  emoji?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export function QuestionCard({ emoji, title, subtitle, children, onBack, showBack = true }: Props) {
  return (
    <div className={`card ${styles.card}`}>
      {showBack && onBack && (
        <button className={`btn btn--back ${styles.back}`} onClick={onBack} id="btn-back">
          ← Back
        </button>
      )}
      <div className={styles.header}>
        {emoji && <div className={styles.emoji}>{emoji}</div>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

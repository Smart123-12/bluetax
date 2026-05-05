'use client';
import styles from './Steps.module.css';
import { QuestionCard } from '../QuestionCard';
import { TaxInputs } from '@/types/tax';

interface Props {
  inputs: TaxInputs;
  updateInput: <K extends keyof TaxInputs>(key: K, value: TaxInputs[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step1InputMode({ inputs, updateInput, onNext }: Props) {
  const select = (mode: 'salary' | 'takehome') => {
    updateInput('inputMode', mode);
    onNext();
  };

  return (
    <QuestionCard
      emoji="💰"
      title="How would you like to start?"
      subtitle="We'll figure out the rest — no judgment, no jargon."
      showBack={false}
    >
      <div className={styles.optionGrid}>
        <button
          id="btn-mode-salary"
          className={`${styles.optionCard} ${inputs.inputMode === 'salary' ? styles.selected : ''}`}
          onClick={() => select('salary')}
        >
          <div className={styles.optionIcon}>💼</div>
          <div className={styles.optionLabel}>I know my salary</div>
          <div className={styles.optionHint}>Annual or monthly gross income</div>
        </button>
        <button
          id="btn-mode-takehome"
          className={`${styles.optionCard} ${inputs.inputMode === 'takehome' ? styles.selected : ''}`}
          onClick={() => select('takehome')}
        >
          <div className={styles.optionIcon}>🏦</div>
          <div className={styles.optionLabel}>I know my take-home</div>
          <div className={styles.optionHint}>What hits your bank account monthly</div>
        </button>
      </div>
    </QuestionCard>
  );
}

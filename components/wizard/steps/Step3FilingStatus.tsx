'use client';
import styles from './Steps.module.css';
import { QuestionCard } from '../QuestionCard';
import { TaxInputs, FilingStatus } from '@/types/tax';

interface Props {
  inputs: TaxInputs;
  updateInput: <K extends keyof TaxInputs>(key: K, value: TaxInputs[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

const statuses: { value: FilingStatus; label: string; icon: string; hint: string }[] = [
  { value: 'single',             label: 'Single',                  icon: '🧍', hint: 'Not married' },
  { value: 'married',            label: 'Married Filing Jointly',  icon: '💑', hint: 'Combined return with spouse' },
  { value: 'hoh',                label: 'Head of Household',       icon: '🏠', hint: 'Unmarried with dependents' },
  { value: 'married_separately', label: 'Married Filing Separately', icon: '📋', hint: 'Separate returns' },
];

export function Step3FilingStatus({ inputs, updateInput, onNext, onBack }: Props) {
  const select = (val: FilingStatus) => {
    updateInput('filingStatus', val);
    setTimeout(onNext, 200);
  };

  return (
    <QuestionCard
      emoji="📋"
      title="What's your filing status?"
      subtitle="This affects your tax brackets and standard deduction."
      onBack={onBack}
    >
      <div className={styles.optionList}>
        {statuses.map(s => (
          <button
            key={s.value}
            id={`btn-status-${s.value}`}
            className={`${styles.listOption} ${inputs.filingStatus === s.value ? styles.selected : ''}`}
            onClick={() => select(s.value)}
          >
            <span className={styles.listIcon}>{s.icon}</span>
            <div className={styles.listText}>
              <span className={styles.listLabel}>{s.label}</span>
              <span className={styles.listHint}>{s.hint}</span>
            </div>
            {inputs.filingStatus === s.value && <span className={styles.checkmark}>✓</span>}
          </button>
        ))}
      </div>
    </QuestionCard>
  );
}

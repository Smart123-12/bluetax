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

const states = [
  { value: 'CA', label: 'California', flag: '🌴', supported: true },
  { value: 'TX', label: 'Texas', flag: '⭐', supported: false },
  { value: 'NY', label: 'New York', flag: '🗽', supported: false },
  { value: 'WA', label: 'Washington', flag: '🌲', supported: false },
  { value: 'FL', label: 'Florida', flag: '☀️', supported: false },
  { value: 'other', label: 'Other State', flag: '🗺️', supported: false },
];

export function Step4State({ inputs, updateInput, onNext, onBack }: Props) {
  const select = (val: string, supported: boolean) => {
    updateInput('state', val);
    if (supported) setTimeout(onNext, 200);
    else onNext(); // still proceed, federal calc works for all
  };

  return (
    <QuestionCard
      emoji="📍"
      title="Which state do you work in?"
      subtitle="State taxes vary significantly. California is fully supported in MVP."
      onBack={onBack}
    >
      <div className={styles.stateGrid}>
        {states.map(s => (
          <button
            key={s.value}
            id={`btn-state-${s.value}`}
            className={`${styles.stateOption} ${inputs.state === s.value ? styles.selected : ''} ${!s.supported ? styles.comingSoon : ''}`}
            onClick={() => select(s.value, s.supported)}
          >
            <span className={styles.stateFlag}>{s.flag}</span>
            <span className={styles.stateName}>{s.label}</span>
            {!s.supported && <span className={styles.soonBadge}>Soon</span>}
          </button>
        ))}
      </div>
      {inputs.state !== 'CA' && inputs.state !== '' && (
        <p className={styles.stateNote}>
          ⚡ We'll calculate your federal + FICA taxes accurately. State tax coming soon for your state.
        </p>
      )}
    </QuestionCard>
  );
}

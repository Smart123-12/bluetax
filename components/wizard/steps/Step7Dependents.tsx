'use client';
import styles from './Steps.module.css';
import { QuestionCard } from '../QuestionCard';
import { TaxInputs } from '@/types/tax';

interface Props {
  inputs: TaxInputs;
  updateInput: <K extends keyof TaxInputs>(key: K, value: TaxInputs[K]) => void;
  onNext: () => void;
  onBack: () => void;
  onCompute: () => void;
}

export function Step7Dependents({ inputs, updateInput, onBack, onCompute }: Props) {
  const change = (delta: number) => {
    updateInput('dependents', Math.max(0, inputs.dependents + delta));
  };

  return (
    <QuestionCard
      emoji="👨‍👩‍👧"
      title="Any dependents?"
      subtitle="Children under 17 may qualify for the Child Tax Credit — up to $2,000 each."
      onBack={onBack}
    >
      <div className={styles.stepperWrapper}>
        <button
          id="btn-dependents-minus"
          className={styles.stepperBtn}
          onClick={() => change(-1)}
          disabled={inputs.dependents === 0}
        >
          −
        </button>
        <div className={styles.stepperValue}>
          <span className={styles.stepperNum}>{inputs.dependents}</span>
          <span className={styles.stepperUnit}>
            {inputs.dependents === 0 ? 'none' : inputs.dependents === 1 ? 'child' : 'children'}
          </span>
        </div>
        <button
          id="btn-dependents-plus"
          className={styles.stepperBtn}
          onClick={() => change(1)}
        >
          +
        </button>
      </div>

      {inputs.dependents > 0 && (
        <div className={`${styles.creditNote} animate-in`}>
          <span className={styles.creditIcon}>💡</span>
          <p>Potential Child Tax Credit: <strong>${(inputs.dependents * 2000).toLocaleString()}</strong></p>
        </div>
      )}

      <button
        id="btn-calculate"
        className={`btn btn--primary ${styles.calculateBtn}`}
        onClick={onCompute}
      >
        ✨ Calculate My Taxes
      </button>

      <p className={styles.disclaimer}>
        100% private — no data leaves your browser
      </p>
    </QuestionCard>
  );
}

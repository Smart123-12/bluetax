'use client';
import styles from './Steps.module.css';
import { useState } from 'react';
import { QuestionCard } from '../QuestionCard';
import { TaxInputs } from '@/types/tax';

interface Props {
  inputs: TaxInputs;
  updateInput: <K extends keyof TaxInputs>(key: K, value: TaxInputs[K]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step6HSA({ inputs, updateInput, onNext, onBack }: Props) {
  const [hasHSA, setHasHSA] = useState<boolean | null>(
    inputs.hsaContribution > 0 ? true : null
  );
  const [raw, setRaw] = useState(inputs.hsaContribution > 0 ? String(inputs.hsaContribution) : '');

  const maxHSA = inputs.filingStatus === 'married' ? 8750 : 4400;

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setRaw(digits);
    updateInput('hsaContribution', Math.min(Number(digits), maxHSA));
  };

  const handleNo = () => {
    updateInput('hsaContribution', 0);
    setHasHSA(false);
    onNext();
  };

  return (
    <QuestionCard
      emoji="🏥"
      title="Do you have an HSA?"
      subtitle="A Health Savings Account lets you pay for medical costs tax-free. You need an HDHP health plan to qualify."
      onBack={onBack}
    >
      {hasHSA === null && (
        <div className={styles.yesNoGrid}>
          <button id="btn-hsa-yes" className={`${styles.yesNoBtn} ${styles.yes}`} onClick={() => setHasHSA(true)}>
            ✅ Yes, I have one
          </button>
          <button id="btn-hsa-no" className={`${styles.yesNoBtn} ${styles.no}`} onClick={handleNo}>
            ❌ No / Not sure
          </button>
        </div>
      )}

      {hasHSA && (
        <div className={styles.inputGroup}>
          <label className={styles.fieldLabel}>Annual HSA contribution</label>
          <div className={styles.currencyInput}>
            <span className={styles.currencySymbol}>$</span>
            <input
              id="input-hsa"
              className={`input-field ${styles.incomeInput}`}
              type="text"
              inputMode="numeric"
              placeholder="2,000"
              value={raw ? Number(raw).toLocaleString() : ''}
              onChange={handleAmount}
              autoFocus
            />
            <span className={styles.perYear}>/yr</span>
          </div>
          <p className={styles.hint}>
            2026 limit: ${maxHSA.toLocaleString()}/year ({inputs.filingStatus === 'married' ? 'family' : 'self-only'} coverage)
          </p>
          <button id="btn-hsa-next" className="btn btn--primary" onClick={onNext} style={{ width: '100%' }}>
            Continue →
          </button>
        </div>
      )}
    </QuestionCard>
  );
}

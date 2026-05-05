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

const MAX_401K = 24500;

export function Step5Retirement({ inputs, updateInput, onNext, onBack }: Props) {
  const [contributes, setContributes] = useState<boolean | null>(
    inputs.traditional401k > 0 ? true : null
  );
  const [raw, setRaw] = useState(inputs.traditional401k > 0 ? String(inputs.traditional401k) : '');

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setRaw(digits);
    const num = Math.min(Number(digits), MAX_401K);
    updateInput('traditional401k', num);
  };

  const handleNo = () => {
    updateInput('traditional401k', 0);
    setContributes(false);
    onNext();
  };

  const handleYes = () => setContributes(true);

  return (
    <QuestionCard
      emoji="🏦"
      title="Do you have a 401(k) at work?"
      subtitle="Pre-tax 401(k) contributions lower your taxable income — this is one of the best tax-saving tools available."
      onBack={onBack}
    >
      {contributes === null && (
        <div className={styles.yesNoGrid}>
          <button id="btn-401k-yes" className={`${styles.yesNoBtn} ${styles.yes}`} onClick={handleYes}>
            ✅ Yes, I contribute
          </button>
          <button id="btn-401k-no" className={`${styles.yesNoBtn} ${styles.no}`} onClick={handleNo}>
            ❌ No / Not sure
          </button>
        </div>
      )}

      {contributes && (
        <div className={styles.inputGroup}>
          <label className={styles.fieldLabel}>Annual 401(k) contribution</label>
          <div className={styles.currencyInput}>
            <span className={styles.currencySymbol}>$</span>
            <input
              id="input-401k"
              className={`input-field ${styles.incomeInput}`}
              type="text"
              inputMode="numeric"
              placeholder="6,000"
              value={raw ? Number(raw).toLocaleString() : ''}
              onChange={handleAmount}
              autoFocus
            />
            <span className={styles.perYear}>/yr</span>
          </div>
          <div className={styles.sliderRow}>
            <input
              type="range" min={0} max={MAX_401K} step={500}
              value={inputs.traditional401k}
              className={styles.slider}
              onChange={e => {
                const v = Number(e.target.value);
                setRaw(String(v));
                updateInput('traditional401k', v);
              }}
            />
            <span className={styles.sliderMax}>Max: ${MAX_401K.toLocaleString()}</span>
          </div>
          <p className={styles.hint}>2026 IRS limit: ${MAX_401K.toLocaleString()}/year</p>
          <button id="btn-401k-next" className="btn btn--primary" onClick={onNext} style={{ width: '100%' }}>
            Continue →
          </button>
        </div>
      )}
    </QuestionCard>
  );
}

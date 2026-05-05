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

function formatCurrency(val: string): string {
  const num = val.replace(/[^0-9]/g, '');
  if (!num) return '';
  return Number(num).toLocaleString('en-US');
}

export function Step2Income({ inputs, updateInput, onNext, onBack }: Props) {
  const isTakeHome = inputs.inputMode === 'takehome';
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setRaw(digits);
    setError('');
    const num = Number(digits);
    if (isTakeHome) {
      updateInput('monthlyTakeHome', num);
    } else {
      updateInput('annualSalary', num);
    }
  };

  const handleNext = () => {
    const val = isTakeHome ? inputs.monthlyTakeHome : inputs.annualSalary;
    if (!val || val <= 0) {
      setError('Please enter a valid amount greater than $0');
      return;
    }
    if (val > 10000000) {
      setError('Amount seems too high — please double-check');
      return;
    }
    onNext();
  };

  const displayValue = raw ? formatCurrency(raw) : '';
  const currentVal = isTakeHome ? inputs.monthlyTakeHome : inputs.annualSalary;
  const hint = isTakeHome
    ? currentVal > 0 ? `≈ $${(currentVal * 12).toLocaleString()} per year take-home` : ''
    : currentVal > 0 ? `≈ $${Math.round(currentVal / 12).toLocaleString()} per month` : '';

  return (
    <QuestionCard
      emoji={isTakeHome ? '🏦' : '💼'}
      title={isTakeHome ? "What's your monthly take-home?" : "What's your annual salary?"}
      subtitle={isTakeHome
        ? "The amount deposited to your bank after all deductions."
        : "Your gross salary before taxes, as listed in your offer letter."}
      onBack={onBack}
    >
      <div className={styles.inputGroup}>
        <div className={styles.currencyInput}>
          <span className={styles.currencySymbol}>$</span>
          <input
            id="input-income"
            className={`input-field ${styles.incomeInput} ${error ? styles.inputError : ''}`}
            type="text"
            inputMode="numeric"
            placeholder={isTakeHome ? '5,000' : '95,000'}
            value={displayValue}
            onChange={handleChange}
            onKeyDown={e => e.key === 'Enter' && handleNext()}
            autoFocus
          />
          {!isTakeHome && <span className={styles.perYear}>/yr</span>}
          {isTakeHome && <span className={styles.perYear}>/mo</span>}
        </div>
        {hint && <p className={styles.hint}>{hint}</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>
      <button id="btn-income-next" className="btn btn--primary" onClick={handleNext} style={{ width: '100%' }}>
        Continue →
      </button>
    </QuestionCard>
  );
}

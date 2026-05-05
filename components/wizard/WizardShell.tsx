'use client';
import styles from './WizardShell.module.css';
import { useState, useCallback } from 'react';
import { TaxInputs, TaxBreakdown, OptimizationResult } from '@/types/tax';
import { calculateTax } from '@/lib/tax/engine';
import { estimateGrossFromTakeHome } from '@/lib/reverseEstimator';
import { generateSuggestions } from '@/lib/optimizer/suggestions';
import { ResultsDashboard } from '../output/ResultsDashboard';

import { Step1InputMode } from './steps/Step1InputMode';
import { Step2Income } from './steps/Step2Income';
import { Step3FilingStatus } from './steps/Step3FilingStatus';
import { Step4State } from './steps/Step4State';
import { Step5Retirement } from './steps/Step5Retirement';
import { Step6HSA } from './steps/Step6HSA';
import { Step7Dependents } from './steps/Step7Dependents';
import { ProgressBar } from './ProgressBar';

const TOTAL_STEPS = 7;

const defaultInputs: TaxInputs = {
  inputMode: 'salary',
  annualSalary: 0,
  monthlyTakeHome: 0,
  filingStatus: 'single',
  state: 'CA',
  traditional401k: 0,
  hsaContribution: 0,
  dependents: 0,
};

export function WizardShell() {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<TaxInputs>(defaultInputs);
  const [result, setResult] = useState<TaxBreakdown | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const updateInput = useCallback(<K extends keyof TaxInputs>(key: K, value: TaxInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const next = useCallback(() => setStep(s => Math.min(s + 1, TOTAL_STEPS)), []);
  const back = useCallback(() => {
    if (showResults) { setShowResults(false); setStep(TOTAL_STEPS); }
    else setStep(s => Math.max(s - 1, 1));
  }, [showResults]);

  const compute = useCallback(() => {
    let gross = inputs.annualSalary;
    if (inputs.inputMode === 'takehome') {
      gross = estimateGrossFromTakeHome(inputs);
    }
    const taxResult = calculateTax({ ...inputs, annualSalary: gross }, gross);
    const opt = generateSuggestions({ ...inputs, annualSalary: gross }, taxResult);
    setResult(taxResult);
    setOptimization(opt);
    setShowResults(true);
  }, [inputs]);

  const reset = useCallback(() => {
    setStep(1);
    setInputs(defaultInputs);
    setResult(null);
    setOptimization(null);
    setShowResults(false);
  }, []);

  if (showResults && result && optimization) {
    return (
      <ResultsDashboard
        result={result}
        optimization={optimization}
        inputs={inputs}
        onBack={back}
        onReset={reset}
      />
    );
  }

  const stepProps = { inputs, updateInput, onNext: next, onBack: back };

  const steps: Record<number, React.ReactNode> = {
    1: <Step1InputMode {...stepProps} />,
    2: <Step2Income {...stepProps} />,
    3: <Step3FilingStatus {...stepProps} />,
    4: <Step4State {...stepProps} />,
    5: <Step5Retirement {...stepProps} />,
    6: <Step6HSA {...stepProps} />,
    7: <Step7Dependents {...stepProps} onCompute={compute} />,
  };

  return (
    <div className={styles.shell}>
      <ProgressBar current={step} total={TOTAL_STEPS} />
      <div key={step} className={`${styles.stepWrapper} animate-in`}>
        {steps[step]}
      </div>
    </div>
  );
}

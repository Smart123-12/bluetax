import { FilingStatus } from '@/types/tax';

// ─── 2026 FICA (Federal Insurance Contributions Act) ─────────────────────────
// Social Security wage base: $184,500 (2026)
// Source: SSA.gov / IRS

export const SS_RATE = 0.062;                  // 6.2%
export const SS_WAGE_BASE_2026 = 184500;       // max earnings subject to SS
export const MEDICARE_RATE = 0.0145;           // 1.45% (no cap)
export const ADDITIONAL_MEDICARE_RATE = 0.009; // 0.9% additional Medicare

// Additional Medicare Tax thresholds by filing status
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single:             200000,
  married:            250000,
  hoh:                200000,
  married_separately: 125000,
};

/** Calculate Social Security tax */
export function calculateSocialSecurity(grossIncome: number): number {
  const taxableWages = Math.min(grossIncome, SS_WAGE_BASE_2026);
  return Math.round(taxableWages * SS_RATE);
}

/** Calculate Medicare tax (base + additional if over threshold) */
export function calculateMedicare(grossIncome: number, status: FilingStatus): number {
  const baseMedicare = grossIncome * MEDICARE_RATE;
  const threshold = ADDITIONAL_MEDICARE_THRESHOLD[status];
  const additionalMedicare = grossIncome > threshold
    ? (grossIncome - threshold) * ADDITIONAL_MEDICARE_RATE
    : 0;
  return Math.round(baseMedicare + additionalMedicare);
}

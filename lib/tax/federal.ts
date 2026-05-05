import { FilingStatus } from '@/types/tax';

// ─── 2026 IRS Official Federal Tax Brackets ───────────────────────────────────
// Source: IRS Rev. Proc. 2025-xx (published October 2025)

export const STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 16100,
  married: 32200,
  hoh: 24150,
  married_separately: 16100,
};

interface Bracket {
  min: number;
  max: number;
  rate: number;
}

const SINGLE_BRACKETS_2026: Bracket[] = [
  { min: 0,       max: 12400,   rate: 0.10 },
  { min: 12400,   max: 50400,   rate: 0.12 },
  { min: 50400,   max: 105700,  rate: 0.22 },
  { min: 105700,  max: 201775,  rate: 0.24 },
  { min: 201775,  max: 256225,  rate: 0.32 },
  { min: 256225,  max: 640600,  rate: 0.35 },
  { min: 640600,  max: Infinity, rate: 0.37 },
];

const MARRIED_BRACKETS_2026: Bracket[] = [
  { min: 0,       max: 24800,   rate: 0.10 },
  { min: 24800,   max: 100800,  rate: 0.12 },
  { min: 100800,  max: 211400,  rate: 0.22 },
  { min: 211400,  max: 403550,  rate: 0.24 },
  { min: 403550,  max: 512450,  rate: 0.32 },
  { min: 512450,  max: 768700,  rate: 0.35 },
  { min: 768700,  max: Infinity, rate: 0.37 },
];

// Head of Household — using 2025 HOH brackets (2026 not yet published separately)
const HOH_BRACKETS_2026: Bracket[] = [
  { min: 0,       max: 17850,   rate: 0.10 },
  { min: 17850,   max: 66200,   rate: 0.12 },
  { min: 66200,   max: 105700,  rate: 0.22 },
  { min: 105700,  max: 201775,  rate: 0.24 },
  { min: 201775,  max: 256225,  rate: 0.32 },
  { min: 256225,  max: 640600,  rate: 0.35 },
  { min: 640600,  max: Infinity, rate: 0.37 },
];

const MARRIED_SEPARATELY_BRACKETS_2026: Bracket[] = SINGLE_BRACKETS_2026;

const BRACKETS_BY_STATUS: Record<FilingStatus, Bracket[]> = {
  single:             SINGLE_BRACKETS_2026,
  married:            MARRIED_BRACKETS_2026,
  hoh:                HOH_BRACKETS_2026,
  married_separately: MARRIED_SEPARATELY_BRACKETS_2026,
};

/** Calculate federal income tax using 2026 progressive brackets */
export function calculateFederalTax(taxableIncome: number, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  const brackets = BRACKETS_BY_STATUS[status];
  let tax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return Math.round(tax);
}

export const TAX_YEAR = 2026;

import { FilingStatus } from '@/types/tax';

// ─── 2025/2026 California FTB Tax Brackets ────────────────────────────────────
// CA brackets for 2026 not yet published; using 2025 CA FTB brackets
// Source: California Franchise Tax Board (ftb.ca.gov)

// CA SDI (State Disability Insurance): 1.1% (no wage cap) — 2025/2026
export const CA_SDI_RATE = 0.011;

export const CA_STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single:             5706,
  married:            11412,
  hoh:                11412,
  married_separately: 5706,
};

interface Bracket {
  min: number;
  max: number;
  rate: number;
}

// Single / Married Filing Separately brackets (2025 CA)
const CA_SINGLE_BRACKETS: Bracket[] = [
  { min: 0,       max: 11079,   rate: 0.010 },
  { min: 11079,   max: 26264,   rate: 0.020 },
  { min: 26264,   max: 41452,   rate: 0.040 },
  { min: 41452,   max: 57542,   rate: 0.060 },
  { min: 57542,   max: 72724,   rate: 0.080 },
  { min: 72724,   max: 371479,  rate: 0.093 },
  { min: 371479,  max: 445771,  rate: 0.103 },
  { min: 445771,  max: 742953,  rate: 0.113 },
  { min: 742953,  max: 1000000, rate: 0.123 },
  { min: 1000000, max: Infinity, rate: 0.133 }, // +1% Mental Health surcharge
];

// Married Filing Jointly (MFJ) — approximately 2x single brackets
const CA_MARRIED_BRACKETS: Bracket[] = [
  { min: 0,       max: 22158,   rate: 0.010 },
  { min: 22158,   max: 52528,   rate: 0.020 },
  { min: 52528,   max: 82904,   rate: 0.040 },
  { min: 82904,   max: 115086,  rate: 0.060 },
  { min: 115086,  max: 145446,  rate: 0.080 },
  { min: 145446,  max: 742958,  rate: 0.093 },
  { min: 742958,  max: 891544,  rate: 0.103 },
  { min: 891544,  max: 1000000, rate: 0.113 },
  { min: 1000000, max: 1485906, rate: 0.123 },
  { min: 1485906, max: Infinity, rate: 0.133 },
];

// Head of Household (same as single for CA)
const CA_HOH_BRACKETS: Bracket[] = CA_SINGLE_BRACKETS;

const CA_BRACKETS_BY_STATUS: Record<FilingStatus, Bracket[]> = {
  single:             CA_SINGLE_BRACKETS,
  married:            CA_MARRIED_BRACKETS,
  hoh:                CA_HOH_BRACKETS,
  married_separately: CA_SINGLE_BRACKETS,
};

/** Calculate California state income tax */
export function calculateCaliforniaTax(taxableIncome: number, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  const brackets = CA_BRACKETS_BY_STATUS[status];
  let tax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return Math.round(tax);
}

/** California SDI (State Disability Insurance) */
export function calculateCaSDI(grossIncome: number): number {
  return Math.round(grossIncome * CA_SDI_RATE);
}

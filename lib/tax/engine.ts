import { TaxInputs, TaxBreakdown } from '@/types/tax';
import { calculateFederalTax, STANDARD_DEDUCTION_2026 } from './federal';
import { calculateCaliforniaTax, calculateCaSDI, CA_STANDARD_DEDUCTION } from './california';
import { calculateSocialSecurity, calculateMedicare } from './fica';

/**
 * Main tax calculation engine using 2026 tax year rules.
 * All logic is client-side and privacy-first.
 */
export function calculateTax(inputs: TaxInputs, grossOverride?: number): TaxBreakdown {
  const grossAnnual = grossOverride ?? inputs.annualSalary;

  if (grossAnnual <= 0) {
    return {
      grossAnnual: 0, federalTax: 0, stateTax: 0,
      socialSecurity: 0, medicare: 0, ficaTotal: 0, totalTax: 0,
      effectiveRate: 0, netAnnual: 0, netMonthly: 0,
      taxableIncome: 0, agi: 0, standardDeduction: 0,
    };
  }

  // Step 1: Calculate AGI — subtract pre-tax deductions from gross
  const pretaxDeductions = Math.min(inputs.traditional401k, 24500) // 2026 401k limit
                         + Math.min(inputs.hsaContribution, inputs.filingStatus === 'married' ? 8750 : 4400);
  const agi = Math.max(0, grossAnnual - pretaxDeductions);

  // Step 2: Federal taxable income = AGI − standard deduction
  const federalStandardDeduction = STANDARD_DEDUCTION_2026[inputs.filingStatus];
  const federalTaxableIncome = Math.max(0, agi - federalStandardDeduction);

  // Step 3: Federal income tax
  const federalTax = calculateFederalTax(federalTaxableIncome, inputs.filingStatus);

  // Step 4: State tax (California)
  let stateTax = 0;
  if (inputs.state === 'CA') {
    const caStandardDeduction = CA_STANDARD_DEDUCTION[inputs.filingStatus];
    const caTaxableIncome = Math.max(0, agi - caStandardDeduction);
    stateTax = calculateCaliforniaTax(caTaxableIncome, inputs.filingStatus);
    // Add CA SDI
    stateTax += calculateCaSDI(grossAnnual);
  }

  // Step 5: FICA (applied on gross wages, not reduced by 401k/HSA for SS/Medicare)
  const socialSecurity = calculateSocialSecurity(grossAnnual);
  const medicare = calculateMedicare(grossAnnual, inputs.filingStatus);
  const ficaTotal = socialSecurity + medicare;

  // Step 6: Totals
  const totalTax = federalTax + stateTax + ficaTotal;
  const netAnnual = grossAnnual - totalTax;
  const effectiveRate = grossAnnual > 0 ? (totalTax / grossAnnual) * 100 : 0;

  return {
    grossAnnual,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    ficaTotal,
    totalTax,
    effectiveRate: Math.round(effectiveRate * 10) / 10,
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netAnnual / 12),
    taxableIncome: federalTaxableIncome,
    agi: Math.round(agi),
    standardDeduction: federalStandardDeduction,
  };
}

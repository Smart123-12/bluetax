import { TaxInputs, TaxBreakdown, Suggestion, OptimizationResult } from '@/types/tax';
import { calculateTax } from '../tax/engine';

// 2026 contribution limits
const MAX_401K = 24500;
const MAX_HSA_SINGLE = 4400;
const MAX_HSA_FAMILY = 8750;

/**
 * Generates personalized tax optimization suggestions.
 * Each suggestion shows the estimated annual tax savings.
 */
export function generateSuggestions(
  inputs: TaxInputs,
  currentResult: TaxBreakdown
): OptimizationResult {
  const suggestions: Suggestion[] = [];
  let optimizedInputs = { ...inputs };

  // ── Rule 1: Maximize 401(k) contributions ──────────────────────────────────
  const current401k = inputs.traditional401k ?? 0;
  const remaining401k = MAX_401K - current401k;

  if (remaining401k > 500) {
    const maxedInputs = { ...optimizedInputs, traditional401k: MAX_401K };
    const maxedResult = calculateTax(maxedInputs, currentResult.grossAnnual);
    const savings401k = currentResult.totalTax - maxedResult.totalTax;

    if (savings401k > 0) {
      suggestions.push({
        id: 'max-401k',
        title: 'Maximize Your 401(k)',
        description: `You're contributing $${current401k.toLocaleString()}/year. The 2026 max is $${MAX_401K.toLocaleString()}. Every dollar you contribute reduces your taxable income.`,
        action: `Increase your 401(k) contribution by $${remaining401k.toLocaleString()}/year ($${Math.round(remaining401k/12).toLocaleString()}/month)`,
        annualSavings: Math.round(savings401k),
        category: 'retirement',
        priority: savings401k > 1000 ? 'high' : 'medium',
      });
      optimizedInputs = maxedInputs;
    }
  }

  // ── Rule 2: Open / Maximize HSA ────────────────────────────────────────────
  const currentHSA = inputs.hsaContribution ?? 0;
  const maxHSA = inputs.filingStatus === 'married' ? MAX_HSA_FAMILY : MAX_HSA_SINGLE;
  const remainingHSA = maxHSA - currentHSA;

  if (remainingHSA > 100) {
    const maxedHSAInputs = { ...optimizedInputs, hsaContribution: maxHSA };
    const maxedHSAResult = calculateTax(maxedHSAInputs, currentResult.grossAnnual);
    const savingsHSA = calculateTax(optimizedInputs, currentResult.grossAnnual).totalTax
                     - maxedHSAResult.totalTax;

    if (savingsHSA > 0) {
      suggestions.push({
        id: 'max-hsa',
        title: currentHSA === 0 ? 'Open a Health Savings Account (HSA)' : 'Maximize Your HSA',
        description: currentHSA === 0
          ? `An HSA lets you save money tax-free for medical expenses. You must have a High Deductible Health Plan (HDHP). The 2026 limit is $${maxHSA.toLocaleString()}.`
          : `You're contributing $${currentHSA.toLocaleString()}/year. The 2026 max is $${maxHSA.toLocaleString()}.`,
        action: `Contribute $${remainingHSA.toLocaleString()} more to your HSA this year`,
        annualSavings: Math.round(savingsHSA),
        category: 'health',
        priority: currentHSA === 0 ? 'high' : 'medium',
      });
      optimizedInputs = maxedHSAInputs;
    }
  }

  // ── Rule 3: Child Tax Credit ────────────────────────────────────────────────
  if (inputs.dependents > 0 && currentResult.grossAnnual < 400000) {
    // $2,000 per qualifying child under 17, phaseout at $400k MFJ / $200k single
    const phaseoutThreshold = inputs.filingStatus === 'married' ? 400000 : 200000;
    const creditPerChild = 2000;
    const potentialCredit = inputs.dependents * creditPerChild;

    if (currentResult.grossAnnual < phaseoutThreshold) {
      const actualCredit = Math.min(
        potentialCredit,
        Math.max(0, potentialCredit - Math.floor((currentResult.grossAnnual - phaseoutThreshold + 1) / 1000) * 50)
      );

      if (actualCredit > 0) {
        suggestions.push({
          id: 'child-tax-credit',
          title: 'Claim the Child Tax Credit',
          description: `You have ${inputs.dependents} qualifying ${inputs.dependents === 1 ? 'child' : 'children'} under 17. Each child qualifies for up to $2,000 in tax credits (not a deduction — this directly reduces your tax bill).`,
          action: `Make sure you claim the Child Tax Credit on your W-4 and tax return`,
          annualSavings: actualCredit,
          category: 'credit',
          priority: 'high',
        });
      }
    }
  }

  // ── Rule 4: FSDC / Dependent Care (if dependents and under income limit) ──
  if (inputs.dependents > 0 && currentResult.grossAnnual < 150000) {
    suggestions.push({
      id: 'dependent-care-fsa',
      title: 'Use a Dependent Care FSA',
      description: `If your employer offers a Dependent Care FSA, you can set aside up to $5,000 pre-tax for child care expenses, reducing your taxable income.`,
      action: `Enroll in your employer's Dependent Care FSA during open enrollment`,
      annualSavings: Math.round(5000 * (currentResult.federalTax / currentResult.grossAnnual)),
      category: 'health',
      priority: 'medium',
    });
  }

  // ── Rule 5: Itemized deductions hint (high state tax payers) ───────────────
  const stateAndLocalTaxes = currentResult.stateTax;
  const saltCap = 10000; // SALT deduction cap
  if (stateAndLocalTaxes > saltCap * 0.7 && currentResult.grossAnnual > 200000) {
    suggestions.push({
      id: 'itemize-deductions',
      title: 'Consider Itemizing Deductions',
      description: `At your income level, itemized deductions (mortgage interest, charitable contributions, etc.) may exceed your $${currentResult.standardDeduction.toLocaleString()} standard deduction.`,
      action: `Track deductible expenses through the year — consult a CPA for itemization analysis`,
      annualSavings: 0,
      category: 'deduction',
      priority: 'low',
    });
  }

  // ── Compute fully optimized result ─────────────────────────────────────────
  const optimizedBreakdown = calculateTax(optimizedInputs, currentResult.grossAnnual);
  const totalPotentialSavings = suggestions
    .filter(s => s.id !== 'itemize-deductions' && s.id !== 'dependent-care-fsa')
    .reduce((sum, s) => sum + s.annualSavings, 0);

  return {
    suggestions,
    totalPotentialSavings: Math.round(totalPotentialSavings),
    optimizedBreakdown,
  };
}

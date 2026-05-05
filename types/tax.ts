export type FilingStatus = 'single' | 'married' | 'hoh' | 'married_separately';

export type InputMode = 'salary' | 'takehome';

export interface TaxInputs {
  inputMode: InputMode;
  annualSalary: number;       // gross annual (if salary mode)
  monthlyTakeHome: number;    // net monthly (if takehome mode)
  filingStatus: FilingStatus;
  state: string;              // 'CA' or 'other'
  traditional401k: number;    // annual pre-tax 401k contribution
  hsaContribution: number;    // annual HSA contribution
  dependents: number;         // number of qualifying children under 17
}

export interface TaxBreakdown {
  grossAnnual: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  ficaTotal: number;
  totalTax: number;
  effectiveRate: number;      // total tax / gross (%)
  netAnnual: number;
  netMonthly: number;
  taxableIncome: number;
  agi: number;                // after 401k/HSA deductions
  standardDeduction: number;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  annualSavings: number;
  category: 'retirement' | 'health' | 'credit' | 'deduction';
  priority: 'high' | 'medium' | 'low';
}

export interface OptimizationResult {
  suggestions: Suggestion[];
  totalPotentialSavings: number;
  optimizedBreakdown: TaxBreakdown;
}

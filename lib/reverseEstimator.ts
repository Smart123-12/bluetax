import { TaxInputs } from '@/types/tax';
import { calculateTax } from './tax/engine';

/**
 * Estimates gross annual salary from monthly take-home pay
 * using binary search (iterative approximation).
 * 
 * Converges when estimated net is within $10/year of target.
 * Max 60 iterations.
 */
export function estimateGrossFromTakeHome(inputs: TaxInputs): number {
  const targetNetAnnual = inputs.monthlyTakeHome * 12;

  if (targetNetAnnual <= 0) return 0;

  // Initial bounds — gross must be higher than take-home, cap at 10x
  let low = targetNetAnnual;
  let high = targetNetAnnual * 4; // generous upper bound

  // Extend upper bound if needed (very high earners)
  for (let extend = 0; extend < 5; extend++) {
    const testResult = calculateTax(inputs, high);
    if (testResult.netAnnual >= targetNetAnnual) break;
    high *= 2;
  }

  const TOLERANCE = 10; // within $10/year
  let gross = (low + high) / 2;

  for (let i = 0; i < 60; i++) {
    const result = calculateTax(inputs, gross);
    const diff = result.netAnnual - targetNetAnnual;

    if (Math.abs(diff) <= TOLERANCE) break;

    if (diff > 0) {
      // Net is too high → gross is too high
      high = gross;
    } else {
      // Net is too low → gross is too low
      low = gross;
    }

    gross = (low + high) / 2;
  }

  return Math.round(gross);
}

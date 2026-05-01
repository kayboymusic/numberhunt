import { evaluate } from './evaluator';

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

const ALLOWED = /^[0-9+\-*/=]+$/;

function hasLeadingZero(expr: string): boolean {
  // Match a number with leading zero: e.g. "01", "007"
  return /(?<![0-9])0[0-9]/.test(expr);
}

export function validateGuess(guess: string, length: number = 8): ValidationResult {
  if (guess.length !== length) {
    return { valid: false, reason: `Equation must be exactly ${length} characters` };
  }

  if (!ALLOWED.test(guess)) {
    return { valid: false, reason: 'Invalid characters in equation' };
  }

  const eqCount = (guess.match(/=/g) || []).length;
  if (eqCount !== 1) {
    return { valid: false, reason: 'Equation must contain exactly one =' };
  }

  const eqIdx = guess.indexOf('=');
  if (eqIdx === 0 || eqIdx === guess.length - 1) {
    return { valid: false, reason: 'Invalid equation format' };
  }

  const lhs = guess.slice(0, eqIdx);
  const rhs = guess.slice(eqIdx + 1);

  if (hasLeadingZero(lhs) || hasLeadingZero(rhs)) {
    return { valid: false, reason: 'No leading zeros allowed' };
  }

  let lval: number, rval: number;
  try {
    lval = evaluate(lhs);
    rval = evaluate(rhs);
  } catch (e) {
    return { valid: false, reason: 'Invalid math expression' };
  }

  // Handle floating point: require exact integer equality or within epsilon
  if (Math.abs(lval - rval) > 1e-9) {
    return { valid: false, reason: `${lhs} ≠ ${rhs}` };
  }

  return { valid: true };
}

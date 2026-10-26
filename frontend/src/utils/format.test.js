import { describe, expect, it } from 'vitest';
import { discountPercent, formatOrderWhen, formatPrice } from './format';

// Intl uses a narrow no-break space between "$" and the amount; normalize it for readable asserts
const plain = (s) => s.replace(/\s/g, ' ');

describe('formatPrice', () => {
  it('formats COP cents as whole pesos with dot thousands separators', () => {
    expect(plain(formatPrice(129990000, 'cop'))).toBe('$ 1.299.900');
  });

  it('defaults to COP when no currency is given', () => {
    expect(plain(formatPrice(4990000))).toBe('$ 49.900');
  });

  it('keeps cents for other currencies', () => {
    expect(plain(formatPrice(3900, 'usd'))).toContain('39,00');
  });
});

describe('discountPercent', () => {
  it('rounds the percentage off the previous price', () => {
    expect(discountPercent(399990000, 649990000)).toBe(38);
  });

  it('returns 0 without a valid previous price', () => {
    expect(discountPercent(100, null)).toBe(0);
    expect(discountPercent(100, 90)).toBe(0);
  });
});

describe('formatOrderWhen', () => {
  it('returns an empty string for missing or invalid dates', () => {
    expect(formatOrderWhen(undefined)).toBe('');
    expect(formatOrderWhen('not-a-date')).toBe('');
  });

  it('formats a valid ISO date', () => {
    expect(formatOrderWhen('2026-10-25T15:30:00Z')).not.toBe('');
  });
});

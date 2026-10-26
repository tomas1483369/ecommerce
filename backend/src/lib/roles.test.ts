import { describe, expect, it } from 'vitest';
import { isAdmin, isStaff, parseRole } from './roles';

describe('parseRole', () => {
  it('accepts known roles', () => {
    expect(parseRole('admin')).toBe('admin');
    expect(parseRole('support')).toBe('support');
  });

  it('falls back to customer for unknown values', () => {
    expect(parseRole('superuser')).toBe('customer');
    expect(parseRole(undefined)).toBe('customer');
    expect(parseRole(42)).toBe('customer');
  });
});

describe('role checks', () => {
  it('only admin is admin', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('support')).toBe(false);
  });

  it('support and admin are staff', () => {
    expect(isStaff('support')).toBe(true);
    expect(isStaff('admin')).toBe(true);
    expect(isStaff('customer')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { buttonClass, linkClass } from './ui';

describe('linkClass', () => {
  it('keeps the text color of the surface and marks the link with a red underline', () => {
    expect(linkClass).toContain('border-brand');
    expect(linkClass).not.toMatch(/\btext-/);
  });
});

describe('buttonClass', () => {
  it('defaults to the primary medium button', () => {
    const cls = buttonClass();
    expect(cls).toContain('bg-brand');
    expect(cls).toContain('px-6');
  });

  it('applies the requested variant, size and extra classes', () => {
    const cls = buttonClass({ variant: 'outline', size: 'sm', className: 'w-full' });
    expect(cls).toContain('border-ink');
    expect(cls).toContain('px-4');
    expect(cls).toContain('w-full');
    expect(cls).not.toContain('bg-brand');
  });
});

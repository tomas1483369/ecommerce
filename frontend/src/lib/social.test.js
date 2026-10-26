import { describe, expect, it } from 'vitest';
import { socialLinks } from './social';

describe('socialLinks', () => {
  it('always lists the four networks in display order', () => {
    expect(socialLinks({}).map((l) => l.id)).toEqual([
      'instagram',
      'whatsapp',
      'facebook',
      'tiktok',
    ]);
  });

  it('adds a link only to configured networks', () => {
    const links = socialLinks({
      VITE_INSTAGRAM_URL: 'https://instagram.com/tienda',
      VITE_WHATSAPP_NUMBER: '+57 300 123 4567',
    });
    expect(links[0].href).toBe('https://instagram.com/tienda');
    expect(links[1].href).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/);
    expect(links[2].href).toBeNull();
    expect(links[3].href).toBeNull();
  });

  it('ignores empty values and non-https URLs', () => {
    const links = socialLinks({
      VITE_INSTAGRAM_URL: '',
      VITE_FACEBOOK_URL: 'javascript:alert(1)',
      VITE_TIKTOK_URL: 'http://x.co',
    });
    expect(links.every((l) => l.href === null)).toBe(true);
  });
});

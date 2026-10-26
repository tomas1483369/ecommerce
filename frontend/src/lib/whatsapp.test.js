import { describe, expect, it } from 'vitest';
import { whatsappUrl } from './whatsapp';

describe('whatsappUrl', () => {
  it('builds a wa.me link with only the digits of the number', () => {
    expect(whatsappUrl('+57 300 123 4567', 'Hola')).toBe('https://wa.me/573001234567?text=Hola');
  });

  it('url-encodes the message', () => {
    expect(whatsappUrl('573001234567', 'Pedido #ab12 ¿listo?')).toBe(
      'https://wa.me/573001234567?text=Pedido%20%23ab12%20%C2%BFlisto%3F',
    );
  });

  it('returns null when no number is configured', () => {
    expect(whatsappUrl('', 'Hola')).toBeNull();
    expect(whatsappUrl(undefined, 'Hola')).toBeNull();
  });
});

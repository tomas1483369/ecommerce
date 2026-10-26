import { describe, expect, it } from 'vitest';
import { normalize, searchProducts } from './search';

const products = [
  { slug: 'a', name: 'Cámara réflex', category: 'Cámaras', description: 'Lente intercambiable' },
  {
    slug: 'b',
    name: 'Audífonos inalámbricos',
    category: 'Sonido',
    description: 'Cancelación de ruido',
  },
  { slug: 'c', name: 'Celular Pro 5G', category: 'Celulares', description: 'Más cámara y batería' },
];

describe('normalize', () => {
  it('removes accents and lowercases', () => {
    expect(normalize('  Cámara RÉFLEX ')).toBe('camara reflex');
  });
});

describe('searchProducts', () => {
  it('matches without accents and in any field', () => {
    expect(searchProducts(products, 'camara').map((p) => p.slug)).toEqual(['a', 'c']);
    expect(searchProducts(products, 'sonido').map((p) => p.slug)).toEqual(['b']);
  });

  it('ranks products whose name matches before description-only matches', () => {
    const list = [products[2], products[0]]; // the phone (description match) comes first in the catalog
    expect(searchProducts(list, 'camara').map((p) => p.slug)).toEqual(['a', 'c']);
  });

  it('requires every term to match', () => {
    expect(searchProducts(products, 'camara reflex').map((p) => p.slug)).toEqual(['a']);
  });

  it('returns nothing for an empty query and respects the limit', () => {
    expect(searchProducts(products, '   ')).toEqual([]);
    expect(searchProducts(products, 'a', 1)).toHaveLength(1);
  });
});

import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  categoryPath,
  filterBySubcategory,
  findCategory,
  findInfoPage,
  stockedSubcategories,
  subcategoryPath,
} from './categories';

const sonido = findCategory('sonido');
const products = [
  { slug: 'audifonos-retro' },
  { slug: 'parlante-bluetooth-go' },
  { slug: 'sin-subcategoria' },
];

describe('filterBySubcategory', () => {
  it('builds encoded subcategory links', () => {
    expect(subcategoryPath('sonido', 'Barras de sonido')).toBe(
      '/categoria/sonido?sub=Barras%20de%20sonido',
    );
  });

  it('keeps only the products of the chosen subcategory', () => {
    expect(filterBySubcategory(products, sonido, 'Parlantes')).toEqual([
      { slug: 'parlante-bluetooth-go' },
    ]);
    expect(filterBySubcategory(products, sonido, 'Barras de sonido')).toEqual([]);
  });

  it('only offers subcategories that have products', () => {
    const names = stockedSubcategories(sonido).map((s) => s.name);
    expect(names).toContain('Parlantes');
    expect(names).not.toContain('Barras de sonido');
  });

  it('shows the whole category without a sub or with one from another category', () => {
    expect(filterBySubcategory(products, sonido, null)).toBe(products);
    expect(filterBySubcategory(products, sonido, 'Gama alta')).toBe(products);
  });
});

describe('categories', () => {
  it('has the six store categories in navigation order', () => {
    expect(CATEGORIES.map((c) => c.slug)).toEqual([
      'celulares',
      'accesorios',
      'wearables',
      'televisores',
      'sonido',
      'camaras',
    ]);
  });

  it('builds category paths and finds categories by slug', () => {
    expect(categoryPath('sonido')).toBe('/categoria/sonido');
    expect(findCategory('camaras')?.name).toBe('Cámaras');
    expect(findCategory('plegables')).toBeNull();
  });

  it('finds informational pages by slug', () => {
    expect(findInfoPage('garantia')?.name).toBe('Garantía');
    expect(findInfoPage('nope')).toBeNull();
  });
});

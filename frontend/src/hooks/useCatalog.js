import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api.js';

// Full active catalog; shared cache key with the cart page.
export function useCatalog() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch('/api/products'),
  });

  const products = useMemo(() => data?.products ?? [], [data]);
  const bySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);

  return { products, bySlug, isLoading, error, refetch };
}

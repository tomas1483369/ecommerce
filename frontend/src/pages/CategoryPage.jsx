import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Container } from '../components/Container';
import { PageError } from '../components/PageError';
import { ProductCard } from '../components/ProductCard';
import { PRODUCT_TAGLINES } from '../content/home';
import { apiFetch } from '../lib/api';
import { buttonClass } from '../lib/ui';
import {
  categoryPath,
  filterBySubcategory,
  findCategory,
  stockedSubcategories,
  subcategoryPath,
} from '../lib/categories';
import PlaceholderPage from './PlaceholderPage';

const SORTS = {
  destacados: { label: 'Destacados', fn: null },
  menor: { label: 'Menor precio', fn: (a, b) => a.priceCents - b.priceCents },
  mayor: { label: 'Mayor precio', fn: (a, b) => b.priceCents - a.priceCents },
};

// One template for the 6 categories (docs/diseno.md); each category only brings its data.
// Subcategory pills filter with `?sub=` (provisional map until F4); "only available" needs stock (F4).
function CategoryPage() {
  const { slug } = useParams();
  const category = findCategory(slug);
  const [sort, setSort] = useState('destacados');
  const [searchParams] = useSearchParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', category?.name],
    queryFn: () => apiFetch(`/api/products?category=${encodeURIComponent(category.name)}`),
    enabled: Boolean(category),
  });

  if (!category) return <PlaceholderPage kind="notFound" />;

  const dark = category.banner.theme === 'dark';
  const sub = category.subcategories.some((s) => s.name === searchParams.get('sub'))
    ? searchParams.get('sub')
    : null;
  const products = [...filterBySubcategory(data?.products ?? [], category, sub)];
  if (SORTS[sort].fn) products.sort(SORTS[sort].fn);
  const pillClass = (active) =>
    `block shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
      active ? 'border-ink bg-ink text-white' : 'border-line bg-paper hover:border-ink'
    }`;

  return (
    <>
      <section
        className={`group/banner relative overflow-hidden ${dark ? 'bg-ink text-white' : 'bg-paper text-ink'}`}
      >
        {/* borderless photo fused into the banner background, slow zoom on hover */}
        <div className="relative h-[220px] overflow-hidden md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[55%]">
          <img
            src={category.banner.image}
            alt={category.banner.alt}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out-soft group-hover/banner:scale-[1.03]"
          />
          <div
            className={`absolute inset-0 bg-linear-to-t via-transparent to-transparent md:bg-linear-to-r md:via-40% ${
              dark ? 'from-ink md:via-ink/0' : 'from-paper md:via-paper/0'
            }`}
          />
        </div>
        <Container className="relative flex flex-col gap-3 pt-6 pb-10 md:h-[420px] md:justify-center md:py-0">
          <nav aria-label="Ruta" className={`text-sm ${dark ? 'text-white/65' : 'text-muted'}`}>
            <Link to="/" className="hover:text-brand">
              Inicio
            </Link>{' '}
            / <span aria-current="page">{category.name}</span>
          </nav>
          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">{category.name}</h1>
          <p
            className={`max-w-[460px] text-lg leading-relaxed md:text-xl ${dark ? 'text-white/85' : 'text-body'}`}
          >
            {category.description}
          </p>
        </Container>
      </section>

      <Container className="border-b border-line pt-8 pb-6">
        <nav aria-label={`Subcategorías de ${category.name}`}>
          <ul className="no-scrollbar fade-right -mx-4 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0 md:[mask-image:none]">
            <li>
              <Link
                to={categoryPath(category.slug)}
                className={pillClass(!sub)}
                aria-current={!sub ? 'page' : undefined}
              >
                Todos
              </Link>
            </li>
            {stockedSubcategories(category).map((s) => (
              <li key={s.name}>
                <Link
                  to={subcategoryPath(category.slug, s.name)}
                  className={pillClass(sub === s.name)}
                  aria-current={sub === s.name ? 'page' : undefined}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-normal text-muted" aria-live="polite">
            {isLoading
              ? 'Cargando productos…'
              : `${products.length} ${products.length === 1 ? 'producto' : 'productos'}${sub ? ` en ${sub}` : ''}`}
          </h2>
          <label className="flex items-center gap-2 text-sm">
            Ordenar por
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
            >
              {Object.entries(SORTS).map(([value, s]) => (
                <option key={value} value={value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Container>

      <Container className="py-8 md:py-10">
        {isLoading ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="skeleton h-[480px] rounded-3xl" />
            ))}
          </ul>
        ) : error ? (
          <PageError
            message="No pudimos cargar los productos de esta categoría. Revisa tu conexión e intenta de nuevo."
            onRetry={refetch}
          />
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-paper px-6 py-14 text-center">
            <p className="text-body">
              {sub
                ? `Aún no tenemos productos en ${sub}.`
                : 'Pronto tendremos productos en esta categoría.'}
            </p>
            <Link
              to={sub ? categoryPath(category.slug) : '/'}
              className={buttonClass({ variant: 'dark', size: 'sm', className: 'mt-5' })}
            >
              {sub ? `Ver todo en ${category.name}` : 'Volver al inicio'}
            </Link>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} tagline={PRODUCT_TAGLINES[p.slug]} showCategory={false} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}

export default CategoryPage;

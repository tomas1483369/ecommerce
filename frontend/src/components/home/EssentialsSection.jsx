import { useState } from 'react';
import { StarIcon } from 'lucide-react';
import { Container } from '../Container';
import { ProductCard } from '../ProductCard';
import { ProductRail, RailItem } from '../ProductRail';
import { FEATURED_SLUGS, PRODUCT_TAGLINES } from '../../content/home';
import { CATEGORIES } from '../../lib/categories';

const TILES = [{ slug: 'destacados', name: 'Destacados', icon: StarIcon }, ...CATEGORIES];

function pickProducts(products, slug) {
  if (slug === 'destacados') {
    const chosen = FEATURED_SLUGS.map((s) => products.find((p) => p.slug === s)).filter(Boolean);
    // until the editors pick them (F7), fall back to one product per category
    if (chosen.length > 0) return chosen;
    const seen = new Set();
    return products.filter((p) => !seen.has(p.category) && seen.add(p.category));
  }
  const category = CATEGORIES.find((c) => c.slug === slug);
  return products.filter((p) => p.category === category?.name);
}

// "Lo esencial": category shortcuts (Samsung style) that switch the product rail below, which
// bleeds to the screen edge.
export function EssentialsSection({ products, isLoading }) {
  const [selected, setSelected] = useState('destacados');
  const visible = pickProducts(products, selected);

  return (
    <section className="pt-20 pb-14 md:pt-28 md:pb-20">
      <Container>
        <h2 className="mb-8 text-[32px] leading-tight font-extrabold tracking-tight md:mb-10 md:text-5xl">
          Lo esencial
        </h2>

        <div
          className="no-scrollbar fade-right -mx-4 mb-8 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 md:mx-0 md:mb-10 md:grid md:grid-cols-7 md:gap-3.5 md:overflow-visible md:px-0 md:[mask-image:none]"
          role="group"
          aria-label="Filtrar por categoría"
        >
          {TILES.map((t) => {
            const Icon = t.icon;
            const active = selected === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(t.slug)}
                className={`flex size-[92px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-xl border bg-paper text-xs font-medium transition md:h-[120px] md:w-auto md:gap-3 md:text-sm ${
                  active ? 'border-[1.5px] border-ink' : 'border-line hover:border-muted'
                }`}
              >
                <Icon className="size-7 md:size-10" strokeWidth={1.2} aria-hidden />
                {t.name}
              </button>
            );
          })}
        </div>
      </Container>

      {isLoading ? (
        <Container className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton h-[460px] w-[280px] shrink-0 rounded-3xl md:w-[295px]"
            />
          ))}
        </Container>
      ) : visible.length === 0 ? (
        <Container>
          <p className="rounded-2xl bg-paper py-14 text-center text-body">
            Pronto tendremos productos en esta categoría.
          </p>
        </Container>
      ) : (
        <ProductRail label="Productos de lo esencial">
          {visible.map((p) => (
            <RailItem key={p.id}>
              <ProductCard
                product={p}
                tagline={PRODUCT_TAGLINES[p.slug]}
                showCategory={selected === 'destacados'}
              />
            </RailItem>
          ))}
        </ProductRail>
      )}
    </section>
  );
}

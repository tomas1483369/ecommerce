import { useState } from 'react';
import { Link } from 'react-router';
import { OFFERS, OFFER_TABS } from '../../content/home';
import { discountPercent, formatPrice } from '../../utils/format';
import { Container } from '../Container';

// Offers: the home's one red band (color budget in docs/diseno.md: one black, one red, the rest
// light). White single-surface cards; the discount only shows when the live price is lower.
export function OffersSection({ bySlug }) {
  const [tab, setTab] = useState(OFFER_TABS[0].id);
  const offers = (OFFERS[tab] ?? [])
    .map((o) => ({ ...o, product: bySlug.get(o.slug) }))
    .filter((o) => o.product);

  return (
    <section className="bg-brand text-white">
      <Container className="py-16 md:py-24">
        <div className="flex flex-col gap-6 md:gap-8">
          <h2 className="text-[32px] leading-tight font-extrabold tracking-tight md:text-5xl">
            Ofertas por tiempo limitado
          </h2>
          <div
            className="no-scrollbar fade-right -mx-4 flex gap-6 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:gap-x-8 md:gap-y-1 md:overflow-visible md:px-0 md:[mask-image:none]"
            role="group"
            aria-label="Ofertas por categoría"
          >
            {OFFER_TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 border-b-2 py-2 text-base whitespace-nowrap transition-colors ${
                    active
                      ? 'border-white font-bold text-white'
                      : 'border-transparent text-white hover:border-white/50'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="no-scrollbar -mx-4 mt-10 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pt-2 pb-4 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {offers.map(({ slug, beforeCents, note, product: p }) => {
            const percent = discountPercent(p.priceCents, beforeCents);
            return (
              <li key={slug} className="w-[260px] shrink-0 snap-start md:w-auto">
                <Link
                  to={`/product/${p.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-paper text-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)] transition duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_26px_50px_-20px_rgba(0,0,0,0.55)]"
                >
                  <span className="relative block aspect-square overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                    {percent > 0 ? (
                      <span className="absolute top-4 left-4 rounded-full bg-ink px-3 py-1 text-sm font-extrabold text-white tabular-nums">
                        -{percent}%
                      </span>
                    ) : null}
                  </span>
                  <span className="flex flex-1 flex-col px-5 pt-4 pb-5">
                    <span className="text-lg leading-snug font-bold group-hover:text-brand">
                      {p.name}
                    </span>
                    <span className="mt-2 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-xl font-extrabold tabular-nums">
                        {formatPrice(p.priceCents, p.currency)}
                      </span>
                      {percent > 0 ? (
                        <span className="text-sm text-muted tabular-nums line-through">
                          <span className="sr-only">Antes </span>
                          {formatPrice(beforeCents, p.currency)}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 text-sm text-body">{note}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

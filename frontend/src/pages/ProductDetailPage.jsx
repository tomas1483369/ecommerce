import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  CheckIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  MessageCircleIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
} from 'lucide-react';
import { Container } from '../components/Container';
import { ProductPageSkeleton } from '../components/LoadingSkeletons';
import { PageError } from '../components/PageError';
import { ProductCard } from '../components/ProductCard';
import { ProductRail, RailItem } from '../components/ProductRail';
import { PRODUCT_TAGLINES } from '../content/home';
import { useCatalog } from '../hooks/useCatalog';
import { useProductPage } from '../hooks/useProductPage';
import { CATEGORIES, categoryPath } from '../lib/categories';
import { IK_PRESETS, imageKitOptimizedUrl, imageKitWatermarkedUrl } from '../lib/imagekitUrl';
import { buttonClass, linkClass } from '../lib/ui';
import { useCart } from '../store/cart';
import { formatPrice } from '../utils/format';

const HIGHLIGHTS = [
  { icon: CreditCardIcon, text: 'Pago seguro' },
  { icon: MessageCircleIcon, text: 'Soporte por WhatsApp después de tu compra' },
  { icon: ShieldCheckIcon, text: 'Garantía del fabricante' },
];
const ADDED_FEEDBACK_MS = 2000;
const RELATED_MAX = 8;

// Mobile buy bar: appears once the main "Agregar al carrito" scrolls out of view, so the
// action stays within thumb reach. `data-buybar` on <html> lifts the WhatsApp button above it.
function MobileBuyBar({ product, visible, added, onAdd }) {
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.buybar = 'on';
    else delete root.dataset.buybar;
    return () => delete root.dataset.buybar;
  }, [visible]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 ease-out-soft lg:hidden ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{product.name}</p>
          <p className="text-[15px] font-extrabold tabular-nums">
            {formatPrice(product.priceCents, product.currency)}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          tabIndex={visible ? 0 : -1}
          className={buttonClass({ variant: 'primary' })}
        >
          {added ? <CheckIcon className="size-4" aria-hidden /> : null}
          {added ? 'Agregado' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}

function ProductDetailPage() {
  const addItem = useCart((s) => s.addItem);
  const { product, isLoading, error } = useProductPage();
  const { products: catalog } = useCatalog();
  const [added, setAdded] = useState(false);
  const [ctaOutOfView, setCtaOutOfView] = useState(false);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [added]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return undefined;
    // visible whenever the main button is off screen: scrolled past it, or not reached yet on short phones
    const observer = new IntersectionObserver(([entry]) => setCtaOutOfView(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

  if (isLoading) {
    return (
      <Container className="py-10">
        <ProductPageSkeleton />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-10">
        <PageError
          message="No encontramos este producto. Puede que ya no esté disponible."
          action={{ to: '/', label: 'Volver a la tienda' }}
        />
      </Container>
    );
  }

  const p = product;
  const category = CATEGORIES.find((c) => c.name === p.category);
  const related = catalog
    .filter((x) => x.category === p.category && x.id !== p.id)
    .slice(0, RELATED_MAX);
  const watermarkedFullUrl = p.imageUrl
    ? imageKitWatermarkedUrl(p.imageUrl, IK_PRESETS.productHero)
    : null;
  const add = () => {
    addItem(p.id);
    setAdded(true);
  };

  return (
    <>
      <Container className="pt-6 pb-16 md:pt-8 md:pb-24">
        <nav aria-label="Ruta" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-brand">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            {category ? (
              <>
                <li>
                  <Link to={categoryPath(category.slug)} className="hover:text-brand">
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden>/</li>
              </>
            ) : null}
            <li className="text-ink" aria-current="page">
              {p.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16">
          <div>
            {/* catalog photos are cut out on white, so the frame disappears into the white panel */}
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-paper lg:aspect-square">
              {p.imageUrl ? (
                <img
                  src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.productHero)}
                  alt={p.name}
                  className="h-full w-full object-contain"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center">
                  <PackageIcon className="size-16 text-line" aria-hidden />
                </span>
              )}
            </div>
            {watermarkedFullUrl ? (
              <a
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
                href={watermarkedFullUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="size-4" aria-hidden />
                Ver imagen en tamaño completo
              </a>
            ) : null}
          </div>

          {/* buy box: name, price and action stay together; reassurance follows, quieter */}
          <div className="flex flex-col">
            <h1 className="text-[34px] leading-[1.05] font-extrabold tracking-[-0.03em] md:text-5xl">
              {p.name}
            </h1>
            <p className="mt-4 text-[28px] font-extrabold tabular-nums md:text-[32px]">
              {formatPrice(p.priceCents, p.currency)}
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-body">
              {p.description}
            </p>

            <div
              ref={ctaRef}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7"
            >
              <button
                type="button"
                onClick={add}
                className={buttonClass({
                  variant: 'primary',
                  size: 'lg',
                  className: 'w-full sm:w-auto',
                })}
              >
                {added ? (
                  <CheckIcon className="size-5" aria-hidden />
                ) : (
                  <ShoppingCartIcon className="size-5" aria-hidden />
                )}
                {added ? 'Agregado al carrito' : 'Agregar al carrito'}
              </button>
              {category ? (
                <Link
                  to={categoryPath(category.slug)}
                  className={`self-center text-[15px] sm:self-auto ${linkClass}`}
                >
                  Ver más en {category.name} ›
                </Link>
              ) : null}
            </div>
            <span className="sr-only" aria-live="polite">
              {added ? `${p.name} agregado al carrito` : ''}
            </span>

            <ul className="mt-10 flex flex-col gap-3 border-t border-line pt-6">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[15px] text-body">
                  <Icon className="size-5 shrink-0 text-ink" strokeWidth={1.6} aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <section className="border-t border-line pt-16 pb-6 md:pt-20">
          <Container className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-[28px] leading-tight font-extrabold tracking-tight md:text-4xl">
              Más en {p.category}
            </h2>
            {category ? (
              <Link
                to={categoryPath(category.slug)}
                className={`shrink-0 text-[15px] ${linkClass}`}
              >
                Ver todo ›
              </Link>
            ) : null}
          </Container>
          <ProductRail label={`Más productos de ${p.category}`}>
            {related.map((r) => (
              <RailItem key={r.id}>
                <ProductCard product={r} tagline={PRODUCT_TAGLINES[r.slug]} showCategory={false} />
              </RailItem>
            ))}
          </ProductRail>
        </section>
      ) : null}

      <MobileBuyBar product={p} visible={ctaOutOfView} added={added} onAdd={add} />
    </>
  );
}

export default ProductDetailPage;

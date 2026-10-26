import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CheckIcon, PackageIcon } from 'lucide-react';
import { formatPrice } from '../utils/format.js';
import { IK_PRESETS, imageKitOptimizedUrl } from '../lib/imagekitUrl.js';
import { buttonClass } from '../lib/ui.js';
import { useCart } from '../store/cart.js';

const ADDED_FEEDBACK_MS = 1500;

// Minimal centered card (docs/diseno.md, "Tarjeta de producto"): the whole card opens the product
// (stretched link on the name) and "Agregar" is the only visible action. Lifts softly on hover.
export function ProductCard({ product, tagline, showCategory = true }) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const href = `/product/${product.slug}`;

  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-paper text-center shadow-card transition duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand">
      <div className="aspect-[4/3] overflow-hidden bg-paper">
        {product.imageUrl ? (
          <img
            src={imageKitOptimizedUrl(product.imageUrl, IK_PRESETS.catalogCard)}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            <PackageIcon className="size-12 text-line" aria-hidden />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-6 pb-7">
        {showCategory ? <p className="text-xs font-bold text-brand">{product.category}</p> : null}
        <h3 className="mt-1.5 line-clamp-2 text-[22px] leading-tight font-bold">
          <Link
            to={href}
            className="after:absolute after:inset-0 focus-visible:outline-none group-hover:text-brand"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[15px] leading-[22px] text-body">
          {tagline ?? product.description}
        </p>
        <p className="mt-3.5 text-[17px] font-bold tabular-nums">
          {formatPrice(product.priceCents, product.currency)}
        </p>
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => {
              addItem(product.id);
              setAdded(true);
            }}
            className={buttonClass({ variant: 'dark', size: 'sm', className: 'relative z-10' })}
            aria-label={added ? `${product.name} agregado` : `Agregar ${product.name} al carrito`}
          >
            {added ? <CheckIcon className="size-4" aria-hidden /> : null}
            {added ? 'Agregado' : 'Agregar'}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {added ? `${product.name} agregado al carrito` : ''}
        </span>
      </div>
    </article>
  );
}

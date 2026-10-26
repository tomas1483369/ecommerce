import { PackageIcon } from 'lucide-react';
import { Link, useOutletContext } from 'react-router';
import { IK_PRESETS, imageKitOptimizedUrl } from '../lib/imagekitUrl';
import { formatPrice } from '../utils/format';

function OrderSummaryPage() {
  const { order, items } = useOutletContext();

  return (
    <section className="overflow-hidden rounded-3xl bg-paper shadow-card">
      <div className="border-b border-line px-6 py-5">
        <h2 className="text-xl font-bold">Productos</h2>
        <p className="mt-1 text-sm text-muted">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} en este pedido
        </p>
      </div>

      <ul className="divide-y divide-line">
        {items.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 gap-4">
              <Link
                to={`/product/${row.product.slug}`}
                className="size-24 shrink-0 overflow-hidden rounded-2xl bg-paper"
                tabIndex={-1}
                aria-hidden
              >
                {row.product.imageUrl ? (
                  <img
                    src={imageKitOptimizedUrl(row.product.imageUrl, IK_PRESETS.orderLineThumb)}
                    alt=""
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    <PackageIcon className="size-8 text-line" aria-hidden />
                  </span>
                )}
              </Link>
              <div className="min-w-0">
                <Link
                  to={`/product/${row.product.slug}`}
                  className="text-lg font-bold hover:text-brand"
                >
                  {row.product.name}
                </Link>
                {row.product.category ? (
                  <p className="mt-1 text-sm text-muted">{row.product.category}</p>
                ) : null}
                <p className="mt-1.5 text-sm text-body">
                  Cantidad: {row.quantity} · {formatPrice(row.unitPriceCents, row.product.currency)}{' '}
                  c/u
                </p>
              </div>
            </div>
            <p className="text-lg font-bold tabular-nums sm:text-right">
              {formatPrice(row.unitPriceCents * row.quantity, row.product.currency)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-line bg-paper-soft px-6 py-5">
        <span className="text-lg font-bold">Total</span>
        <span className="text-2xl font-extrabold tabular-nums">
          {formatPrice(order.totalCents)}
        </span>
      </div>
    </section>
  );
}
export default OrderSummaryPage;

import {
  LoaderIcon,
  MessageCircleIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { Link } from 'react-router';
import { Show, SignInButton } from '@clerk/react';
import useCartPage from '../hooks/useCartPage';
import { Container } from '../components/Container';
import EmptyCart from '../components/EmptyCart';
import { CartSkeleton } from '../components/LoadingSkeletons';
import { PageError } from '../components/PageError';
import { IK_PRESETS, imageKitOptimizedUrl } from '../lib/imagekitUrl';
import { buttonClass } from '../lib/ui';
import { formatPrice } from '../utils/format';

const MAX_QTY = 99;

function CartPage() {
  const {
    checkout,
    checkoutLoading,
    items,
    lines,
    productsError,
    productsLoading,
    removeItem,
    setQty,
    subtotal,
  } = useCartPage();

  return (
    <Container className="py-10 md:py-14">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Carrito</h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : productsLoading ? (
        <CartSkeleton lines={items.length} />
      ) : productsError ? (
        <PageError message="No pudimos cargar los productos del carrito. Recarga la página o intenta más tarde." />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="flex h-fit flex-col divide-y divide-line rounded-3xl bg-paper px-5 shadow-card md:px-6">
            {lines.map(({ line, product: p }) => (
              <li key={line.productId} className="flex gap-4 py-6 sm:gap-6">
                <div className="size-24 shrink-0 overflow-hidden rounded-2xl bg-paper sm:size-28">
                  {p?.imageUrl ? (
                    <img
                      src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.cartThumb)}
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
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    {p ? (
                      <Link
                        to={`/product/${p.slug}`}
                        className="text-lg font-bold hover:text-brand"
                      >
                        {p.name}
                      </Link>
                    ) : (
                      <p className="text-lg font-bold">Producto no disponible</p>
                    )}
                    {p ? (
                      <p className="mt-1 text-sm text-muted">
                        {formatPrice(p.priceCents, p.currency)} c/u
                      </p>
                    ) : null}

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          className="flex size-9 items-center justify-center rounded-full hover:bg-paper-soft"
                          onClick={() => setQty(line.productId, line.quantity - 1)}
                          aria-label={
                            line.quantity <= 1 ? 'Quitar del carrito' : 'Disminuir cantidad'
                          }
                        >
                          <MinusIcon className="size-4" aria-hidden />
                        </button>
                        <span
                          className="min-w-8 text-center text-sm font-bold tabular-nums"
                          aria-live="polite"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex size-9 items-center justify-center rounded-full hover:bg-paper-soft disabled:opacity-40"
                          onClick={() =>
                            setQty(line.productId, Math.min(MAX_QTY, line.quantity + 1))
                          }
                          disabled={line.quantity >= MAX_QTY}
                          aria-label="Aumentar cantidad"
                        >
                          <PlusIcon className="size-4" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="flex size-9 items-center justify-center rounded-full text-brand hover:bg-brand-soft"
                        aria-label="Quitar del carrito"
                        title="Quitar del carrito"
                      >
                        <Trash2Icon className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>

                  <p className="text-lg font-bold tabular-nums sm:text-right">
                    {p ? formatPrice(p.priceCents * line.quantity, p.currency) : '-'}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-3xl bg-paper p-6 shadow-card md:p-8">
            <h2 className="text-xl font-bold">Resumen</h2>
            <div className="mt-5 flex justify-between text-[15px]">
              <span className="text-body">Subtotal</span>
              <span className="font-bold tabular-nums">
                {formatPrice(subtotal, lines[0]?.product?.currency ?? 'cop')}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">El envío se confirma al finalizar la compra.</p>

            <Show when="signed-in">
              <button
                type="button"
                onClick={checkout}
                disabled={checkoutLoading}
                aria-busy={checkoutLoading}
                className={buttonClass({
                  variant: 'primary',
                  size: 'lg',
                  className: 'mt-6 w-full',
                })}
              >
                {checkoutLoading ? (
                  <LoaderIcon className="size-5 animate-spin" aria-hidden />
                ) : null}
                {checkoutLoading ? 'Abriendo el pago…' : 'Ir a pagar'}
              </button>
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className={buttonClass({ variant: 'dark', size: 'lg', className: 'mt-6 w-full' })}
                >
                  Inicia sesión para pagar
                </button>
              </SignInButton>
            </Show>

            <p className="mt-5 flex items-start gap-2 text-sm text-body">
              <MessageCircleIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <span>Después del pago te atendemos por WhatsApp desde el detalle de tu pedido.</span>
            </p>
          </aside>
        </div>
      )}
    </Container>
  );
}
export default CartPage;

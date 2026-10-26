import { Link, Outlet } from 'react-router';
import { ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
import { Container } from '../components/Container';
import { OrderDetailSkeleton } from '../components/LoadingSkeletons';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { PageError } from '../components/PageError';
import { useOrderDetailPage } from '../hooks/useOrderDetailPage';
import { buttonClass } from '../lib/ui';
import { orderSupportUrl } from '../lib/whatsapp';
import { formatOrderWhen, formatPrice } from '../utils/format';

function OrderDetailPage() {
  const { order, items, paid, isLoading, error } = useOrderDetailPage();

  if (isLoading) {
    return (
      <Container className="py-10">
        <OrderDetailSkeleton />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-10">
        <PageError
          message="No encontramos este pedido."
          action={{ to: '/orders', label: 'Volver a mis pedidos' }}
        />
      </Container>
    );
  }

  const supportUrl = orderSupportUrl(order.id);

  return (
    <Container className="flex flex-col gap-8 py-10 md:py-14">
      <Link
        to="/orders"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Volver a mis pedidos
      </Link>

      <section className="overflow-hidden rounded-3xl bg-paper shadow-card">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between md:p-8">
          <div>
            <h1 className="text-3xl font-extrabold">
              Pedido <span className="font-mono">#{order.id.slice(0, 8)}</span>
            </h1>
            <p className="mt-2 text-body">
              {formatOrderWhen(order.createdAt, { dateStyle: 'full' })}
            </p>
            <p className="mt-1 font-mono text-xs break-all text-muted">{order.id}</p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <OrderStatusBadge status={order.status} />
            <div className="md:text-right">
              <p className="text-sm text-muted">Total</p>
              <p className="text-3xl font-extrabold tabular-nums">
                {formatPrice(order.totalCents)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line bg-paper-soft px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-2xl text-[15px] text-body">
            ¿Dudas sobre el envío o una devolución? Escríbenos por WhatsApp con el número de tu
            pedido.
          </p>
          {supportUrl ? (
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass({ variant: 'dark', size: 'sm', className: 'w-fit shrink-0' })}
            >
              <MessageCircleIcon className="size-4" aria-hidden />
              Escríbenos por WhatsApp
            </a>
          ) : null}
        </div>
      </section>

      <Outlet context={{ order, items, paid }} />
    </Container>
  );
}
export default OrderDetailPage;

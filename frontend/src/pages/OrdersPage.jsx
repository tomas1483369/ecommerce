import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Container } from '../components/Container';
import { OrdersListSkeleton } from '../components/LoadingSkeletons';
import { OrderPreview } from '../components/OrderPreview';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { PageError } from '../components/PageError';
import useOrdersPage from '../hooks/useOrdersPage';
import { buttonClass } from '../lib/ui';
import { formatOrderWhen, formatPrice } from '../utils/format';

function itemsSummary(previewItems) {
  const units = previewItems.reduce((sum, row) => sum + row.quantity, 0);
  if (previewItems.length === 0) return 'Sin productos';
  if (previewItems.length === 1) return `${units} ${units === 1 ? 'unidad' : 'unidades'}`;
  return `${previewItems.length} productos · ${units} unidades`;
}

function OrdersPage() {
  const { isLoading, error, orders, staff } = useOrdersPage();

  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-4xl font-extrabold tracking-tight">
        {staff ? 'Pedidos' : 'Mis pedidos'}
      </h1>
      <p className="mt-2 mb-8 text-body">
        {staff
          ? 'Todos los pedidos de la tienda.'
          : 'Abre un pedido para ver su detalle o escribirnos por WhatsApp.'}
      </p>

      {isLoading ? (
        <OrdersListSkeleton />
      ) : error ? (
        <PageError
          message="No pudimos cargar tus pedidos."
          action={{ to: '/', label: 'Volver a la tienda' }}
        />
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-paper px-6 py-14 text-center shadow-card">
          <p className="text-lg font-bold">Todavía no tienes pedidos</p>
          <Link to="/" className={buttonClass({ variant: 'primary', className: 'mt-6' })}>
            Ver productos
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => {
            const previewItems = o.previewItems ?? [];
            return (
              <li key={o.id}>
                <Link
                  to={`/orders/${o.id}`}
                  className="group flex flex-wrap items-center gap-5 rounded-3xl bg-paper p-5 shadow-card transition duration-500 ease-out-soft hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <OrderPreview items={previewItems} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold">#{o.id.slice(0, 8)}</span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="mt-1.5 text-sm text-muted">{formatOrderWhen(o.createdAt)}</p>
                    <p className="mt-1.5 text-sm text-body">{itemsSummary(previewItems)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted">Total</p>
                      <p className="text-xl font-extrabold tabular-nums">
                        {formatPrice(o.totalCents)}
                      </p>
                    </div>
                    <ChevronRightIcon
                      className="size-5 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
export default OrdersPage;

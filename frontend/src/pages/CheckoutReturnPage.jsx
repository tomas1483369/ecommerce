import { Link, useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { CheckIcon } from 'lucide-react';
import { Container } from '../components/Container';
import { buttonClass } from '../lib/ui';
import { useCart } from '../store/cart';

function CheckoutReturnPage() {
  const clearCart = useCart((s) => s.clear);
  const [params] = useSearchParams();
  const checkoutId = params.get('checkout_id');
  const queryClient = useQueryClient();

  useEffect(() => {
    clearCart();
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  }, [queryClient, clearCart]);

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-success-soft">
          <CheckIcon className="size-8 text-success" aria-hidden />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">¡Gracias por tu compra!</h1>
        <p className="mt-4 text-body">
          Tu pedido se crea cuando el pago se confirma. Desde tu lista de pedidos puedes abrirlo y
          escribirnos por WhatsApp si tienes dudas.
        </p>
        {checkoutId ? (
          <p className="mt-3 font-mono text-xs text-muted">Referencia: {checkoutId}</p>
        ) : null}
        <Link to="/orders" className={buttonClass({ variant: 'dark', className: 'mt-8' })}>
          Ver mis pedidos
        </Link>
      </div>
    </Container>
  );
}

export default CheckoutReturnPage;

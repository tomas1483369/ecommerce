import { ShoppingCartIcon } from 'lucide-react';
import { Link } from 'react-router';
import { buttonClass } from '../lib/ui';

export default function EmptyCart() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-paper px-6 py-14 text-center shadow-card sm:px-10">
      <span className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-paper-soft">
        <ShoppingCartIcon className="size-9 text-muted" strokeWidth={1.5} aria-hidden />
      </span>
      <h2 className="text-2xl font-extrabold tracking-tight">Tu carrito está vacío</h2>
      <p className="mt-2 text-body">Cuando agregues productos los verás aquí.</p>
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Link to="/#catalogo" className={buttonClass({ variant: 'primary' })}>
          Ver productos
        </Link>
        <Link to="/orders" className={buttonClass({ variant: 'outline' })}>
          Mis pedidos
        </Link>
      </div>
    </div>
  );
}

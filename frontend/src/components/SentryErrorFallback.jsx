import { buttonClass } from '../lib/ui';

// Rendered by Sentry's ErrorBoundary, which sits inside the router but outside the layout.
export function SentryErrorFallback() {
  return (
    <div className="mx-auto mt-24 max-w-md rounded-2xl border border-line bg-paper p-10 text-center">
      <p className="text-lg font-bold text-ink">Algo salió mal</p>
      <p className="mt-2 text-body">Ya registramos el error. Intenta de nuevo en un momento.</p>
      <a href="/" className={buttonClass({ variant: 'dark', size: 'sm', className: 'mt-6' })}>
        Volver al inicio
      </a>
    </div>
  );
}

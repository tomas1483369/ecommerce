import { Link } from 'react-router';
import { buttonClass } from '../lib/ui';

// Error block with a way out: `onRetry` repeats the request, `action` links elsewhere.
export function PageError({ message, action, onRetry }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-10 text-center" role="alert">
      <p className="text-body">{message}</p>
      {onRetry || action ? (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className={buttonClass({ variant: 'dark', size: 'sm' })}
            >
              Reintentar
            </button>
          ) : null}
          {action ? (
            <Link to={action.to} className={buttonClass({ variant: 'outline', size: 'sm' })}>
              {action.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { PackageIcon, SearchIcon, XIcon } from 'lucide-react';
import { useCatalog } from '../hooks/useCatalog';
import { CATEGORIES, categoryPath } from '../lib/categories';
import { searchProducts } from '../lib/search';
import { formatPrice } from '../utils/format';

// Product search over the loaded catalog. Visual treatment is provisional (to be designed).
export function SearchDialog({ onClose }) {
  const titleId = useId();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { products, isLoading } = useCatalog();
  const results = searchProducts(products, query);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Cerrar búsqueda"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[85svh] overflow-y-auto overscroll-contain bg-paper motion-safe:animate-[panel-in_200ms_ease-out]"
      >
        <div className="mx-auto max-w-3xl px-4 pt-5 pb-8 md:px-6">
          <h2 id={titleId} className="sr-only">
            Buscar productos
          </h2>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (results[0]) navigate(`/product/${results[0].slug}`);
            }}
            className="flex items-center gap-3 border-b-2 border-ink pb-3"
          >
            <SearchIcon className="size-6 shrink-0" strokeWidth={1.8} aria-hidden />
            <input
              ref={inputRef}
              type="text"
              enterKeyHint="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
              aria-label="Buscar productos"
              className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted md:text-xl"
            />
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-paper-soft"
              aria-label="Cerrar búsqueda"
            >
              <XIcon className="size-5" aria-hidden />
            </button>
          </form>

          {query.trim() === '' ? (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-bold">Categorías</h2>
              <ul className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={categoryPath(c.slug)}
                      className="block rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-ink"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : isLoading ? (
            <p className="mt-6 text-body">Buscando…</p>
          ) : results.length === 0 ? (
            <p className="mt-6 text-body" aria-live="polite">
              No encontramos productos para «{query.trim()}».
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line" aria-live="polite">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/product/${p.slug}`}
                    className="flex items-center gap-4 py-3 hover:text-brand"
                  >
                    <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-paper">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <PackageIcon className="m-auto mt-4 size-6 text-line" aria-hidden />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{p.name}</span>
                      <span className="block text-sm text-muted">{p.category}</span>
                    </span>
                    <span className="font-bold tabular-nums">
                      {formatPrice(p.priceCents, p.currency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

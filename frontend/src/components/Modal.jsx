import { useEffect, useId, useRef } from 'react';
import { XIcon } from 'lucide-react';

// Accessible dialog: Esc and backdrop close it, background scroll is locked and focus moves inside.
export function Modal({ open, title, onClose, children }) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('input:not([disabled]), textarea, select, button')?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper p-6 motion-safe:animate-[panel-in_200ms_ease-out] sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-2xl font-extrabold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-2 flex size-10 items-center justify-center rounded-full hover:bg-paper-soft"
            aria-label="Cerrar"
          >
            <XIcon className="size-5" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

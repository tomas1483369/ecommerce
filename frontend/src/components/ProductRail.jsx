import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Container } from './Container';

const GAP_PX = 20;

// Horizontal, swipeable row with scroll-snap; arrows move one card at a time. Render it OUTSIDE a
// Container: the row bleeds to both screen edges while its first card lines up with the page
// content (`rail-gutter`), and the arrows sit inside a Container.
export function ProductRail({ label, children }) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  function scrollByCard(direction) {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector('[data-rail-item]');
    const step = card ? card.getBoundingClientRect().width + GAP_PX : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // fires once on observe and again whenever the rail or its content resizes
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const controlClass =
    'flex size-11 items-center justify-center rounded-full border border-ink text-ink transition hover:bg-ink hover:text-white active:scale-95 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink';

  return (
    <div>
      <div
        ref={ref}
        onScroll={updateEdges}
        role="region"
        aria-label={label}
        className="no-scrollbar rail-gutter relative flex snap-x snap-mandatory gap-5 overflow-x-auto pt-3 pb-14"
      >
        {children}
      </div>
      <Container className="-mt-6 hidden justify-end gap-2.5 md:flex">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={edges.atStart}
          className={controlClass}
          aria-label="Anterior"
        >
          <ChevronLeftIcon className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={edges.atEnd}
          className={controlClass}
          aria-label="Siguiente"
        >
          <ChevronRightIcon className="size-5" aria-hidden />
        </button>
      </Container>
    </div>
  );
}

export function RailItem({ className = 'w-[280px] md:w-[295px]', children }) {
  return (
    <div data-rail-item className={`shrink-0 snap-start ${className}`}>
      {children}
    </div>
  );
}

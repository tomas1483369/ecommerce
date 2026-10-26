import { useSyncExternalStore } from 'react';

function subscribe(onChange) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

// True once the page has scrolled past `threshold` px (re-renders only when the boolean flips).
export function useScrolled(threshold = 8) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}

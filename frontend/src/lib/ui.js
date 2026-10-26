// Shared class builders for the few repeated UI pieces (ADR 0005: Tailwind only, no DaisyUI).

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';

const BUTTON_VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  dark: 'bg-ink text-white hover:bg-ink-soft',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  ghost: 'text-ink hover:bg-paper-soft',
  danger: 'text-brand hover:bg-brand-soft',
};

const BUTTON_SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export function buttonClass({ variant = 'primary', size = 'md', className = '' } = {}) {
  return [BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className]
    .filter(Boolean)
    .join(' ');
}

// The one secondary link style ("Ver todo ›", "Descubre más ›"): bold text in the surface's own
// color with a red underline, so it passes contrast on white, gray, red-free photos and black.
export const linkClass =
  'w-fit border-b-2 border-brand pb-0.5 font-bold transition-colors hover:border-current';

export const inputClass =
  'w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none disabled:bg-paper-soft disabled:text-muted';

export const labelClass = 'flex flex-col gap-1.5 text-sm font-medium text-ink';

import { useReducer, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { carouselReducer, progressPercent } from '../../lib/carousel';
import { buttonClass, linkClass } from '../../lib/ui';

const DURATION_MS = 6000;
const TICK_MS = 100;
const SWIPE_PX = 50;

const THEMES = {
  light: {
    section: 'bg-paper text-ink',
    fade: 'from-paper lg:from-paper lg:via-paper/0',
    promo: 'text-body',
    arrow: 'bg-paper/90 text-ink shadow-card hover:bg-paper',
    track: 'bg-ink/15',
    pause: 'border-ink/20 bg-paper/90 text-ink hover:border-ink',
  },
  dark: {
    section: 'bg-ink-soft text-white',
    fade: 'from-ink-soft lg:from-ink-soft lg:via-ink-soft/0',
    promo: 'text-white/80',
    arrow: 'bg-white/10 text-white hover:bg-white/20',
    track: 'bg-white/25',
    pause: 'border-white/30 bg-ink-soft/60 text-white hover:border-white',
  },
};

// Hero stage (docs/diseno.md, "Inicio"): almost a full screen, display-size product name, side
// arrows, auto-advance with progress lines. Each slide takes the color of its photo's background.
export function HeroCarousel({ slides }) {
  const count = slides.length;
  const opts = { count, duration: DURATION_MS };
  const [state, dispatch] = useReducer((s, a) => carouselReducer(s, a, opts), {
    index: 0,
    elapsed: 0,
  });
  const [paused, setPaused] = useState(false);
  // keyboard users exploring the slide get a still carousel
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  // the slide never changes under a pointer that is about to click "Ver producto"
  const [onCta, setOnCta] = useState(false);
  const pointerStart = useRef(null);

  // Auto-advances everywhere else, even with the mouse over the photo (decision in docs/diseno.md);
  // reduced motion only removes the fade. WCAG 2.2.2 is met by the visible pause button.
  const running = !paused && !keyboardFocus && !onCta && count > 1;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => dispatch({ type: 'tick', ms: TICK_MS }), TICK_MS);
    return () => clearInterval(timer);
  }, [running]);

  if (count === 0) return null;
  const slide = slides[state.index];
  const theme = THEMES[slide.theme ?? 'light'];
  const progress = progressPercent(state, opts);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
      className={`group/hero relative overflow-hidden transition-colors duration-500 ${theme.section}`}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setKeyboardFocus(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setKeyboardFocus(false);
      }}
      onPointerDown={(e) => {
        pointerStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (pointerStart.current === null) return;
        const dx = e.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(dx) > SWIPE_PX) dispatch({ type: dx < 0 ? 'next' : 'prev' });
      }}
    >
      <div
        key={slide.id}
        role="group"
        aria-roledescription="diapositiva"
        aria-label={`${state.index + 1} de ${count}: ${slide.titleMain} ${slide.titleAccent}`}
        className="flex flex-col motion-safe:animate-[hero-fade_500ms_ease] lg:relative lg:h-[clamp(600px,calc(100svh-72px),820px)]"
      >
        {/* borderless photo: on top on mobile (keeps the buttons in thumb reach), full-bleed right
            half on desktop, faded into the slide color, with a slow zoom on hover */}
        <div className="relative h-[300px] overflow-hidden sm:h-[380px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%]">
          <img
            src={slide.image}
            alt={slide.alt}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out-soft group-hover/hero:scale-[1.03]"
            fetchPriority={state.index === 0 ? 'high' : 'auto'}
          />
          <div
            className={`absolute inset-0 bg-linear-to-t via-transparent via-30% to-transparent lg:bg-linear-to-r lg:via-40% ${theme.fade}`}
          />
        </div>

        <div className="relative z-10 px-5 pt-6 pb-20 sm:px-8 lg:flex lg:h-full lg:items-center lg:py-0 lg:pr-0 lg:pl-[max(6rem,calc((100%-1240px)/2+1.5rem))]">
          <div className="max-w-[620px]">
            <h2 className="text-[44px] leading-[0.95] font-extrabold tracking-[-0.035em] sm:text-6xl lg:text-[80px] xl:text-[96px]">
              {slide.titleMain} <span className="text-brand">{slide.titleAccent}</span>
            </h2>
            <p className="mt-5 text-xl font-bold lg:mt-7 lg:text-[26px]">{slide.subtitle}</p>
            <p className={`mt-2 max-w-[440px] text-base leading-relaxed lg:text-lg ${theme.promo}`}>
              {slide.promo}
            </p>
            <div
              className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 lg:mt-10"
              onPointerEnter={() => setOnCta(true)}
              onPointerLeave={() => setOnCta(false)}
            >
              <Link to={slide.to} className={buttonClass({ variant: 'primary', size: 'lg' })}>
                Ver producto
              </Link>
              {slide.more ? (
                <Link to={slide.more.to} className={`text-base ${linkClass}`}>
                  {slide.more.label} ›
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {[
        { dir: 'prev', side: 'left-6', label: 'Diapositiva anterior', Icon: ChevronLeftIcon },
        { dir: 'next', side: 'right-6', label: 'Diapositiva siguiente', Icon: ChevronRightIcon },
      ].map(({ dir, side, label, Icon }) => (
        <button
          key={dir}
          type="button"
          onClick={() => dispatch({ type: dir })}
          className={`absolute top-1/2 ${side} z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition active:scale-95 lg:flex ${theme.arrow}`}
          aria-label={label}
        >
          <Icon className="size-5" aria-hidden />
        </button>
      ))}

      {/* progress lines: the active one fills up until the next change */}
      <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3 lg:bottom-8 lg:gap-4">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => dispatch({ type: 'go', index: i })}
            aria-label={`Ir a la diapositiva ${i + 1}: ${s.titleMain} ${s.titleAccent}`}
            aria-current={i === state.index ? 'true' : undefined}
            className="flex h-11 w-12 items-center lg:w-[88px]"
          >
            <span
              className={`relative block h-[3px] w-full overflow-hidden rounded-full ${theme.track}`}
            >
              <span
                className="absolute inset-y-0 left-0 bg-brand"
                style={{ width: i === state.index ? `${progress}%` : '0%' }}
              />
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className={`ml-1 flex size-11 items-center justify-center rounded-full border backdrop-blur-sm transition ${theme.pause}`}
          aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}
        >
          {paused ? (
            <PlayIcon className="size-4" aria-hidden />
          ) : (
            <PauseIcon className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </section>
  );
}

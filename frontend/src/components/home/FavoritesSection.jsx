import { Link } from 'react-router';
import { FAVORITES } from '../../content/home';
import { linkClass } from '../../lib/ui';
import { Container } from '../Container';

function FavoriteTile({ item, large = false }) {
  return (
    <Link
      to={`/product/${item.slug}`}
      className={`group relative block overflow-hidden rounded-3xl bg-ink-soft text-white transition duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] ${
        large ? 'h-[440px] md:h-[520px] lg:row-span-2 lg:h-auto' : 'h-[300px] lg:h-auto'
      }`}
    >
      <img
        src={item.image}
        alt={item.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-linear-to-b from-ink/90 via-ink/60 via-35% to-transparent to-70%" />
      <span
        className={`absolute inset-x-6 top-6 flex flex-col gap-2 md:inset-x-8 md:top-8 ${large ? 'lg:inset-x-10 lg:top-10' : ''}`}
      >
        <span
          className={`font-extrabold tracking-tight ${large ? 'text-[32px] leading-[1.05] md:text-[44px]' : 'text-2xl md:text-[28px]'}`}
        >
          {item.title}
        </span>
        <span
          className={`max-w-[420px] text-white/85 ${large ? 'text-base md:text-lg' : 'text-[15px]'}`}
        >
          {item.tagline}
        </span>
        <span className={`mt-1 ${linkClass} group-hover:border-white`}>
          Ver producto ›
        </span>
      </span>
    </Link>
  );
}

// "Nuestros favoritos": the home's only black band, a stage for products lit on black
// (docs/diseno.md). One large tile and two smaller ones; the whole tile opens the product.
export function FavoritesSection() {
  const [main, ...rest] = FAVORITES;
  return (
    <section className="bg-ink text-white">
      <Container className="py-20 md:py-32">
        <h2 className="text-[32px] leading-tight font-extrabold tracking-tight md:text-5xl">
          Nuestros favoritos
        </h2>
        <p className="mt-3 mb-10 text-lg text-white/80 md:mb-14">Elegidos por nuestro equipo.</p>
        <div className="grid gap-4 md:gap-5 lg:h-[720px] lg:grid-cols-[1.4fr_1fr] lg:grid-rows-2">
          <FavoriteTile item={main} large />
          {rest.map((item) => (
            <FavoriteTile key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

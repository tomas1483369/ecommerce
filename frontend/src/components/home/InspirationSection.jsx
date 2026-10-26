import { Link } from 'react-router';
import { INSPIRATION } from '../../content/home';
import { linkClass } from '../../lib/ui';
import { Container } from '../Container';

function StoryCard({ story, large = false }) {
  return (
    <Link
      to={story.to}
      className={`group flex flex-col lg:min-h-0 ${large ? 'lg:row-span-2' : 'sm:grid sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-6 lg:flex lg:items-stretch lg:gap-0'}`}
    >
      <span
        className={`block overflow-hidden rounded-3xl shadow-card transition duration-500 ease-out-soft group-hover:-translate-y-1 group-hover:shadow-card-hover lg:aspect-auto lg:min-h-0 lg:flex-1 ${
          large ? 'aspect-[4/3]' : 'aspect-[16/10]'
        }`}
      >
        <img
          src={story.image}
          alt={story.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </span>
      <span className={`flex flex-col gap-2 ${large ? 'pt-6' : 'pt-4 sm:pt-0 lg:pt-4'}`}>
        <span
          className={`font-extrabold tracking-tight group-hover:text-brand ${large ? 'text-[28px] leading-tight md:text-[34px]' : 'text-xl md:text-[22px]'}`}
        >
          {story.title}
        </span>
        <span
          className={`text-body ${large ? 'max-w-[520px] text-base md:text-lg' : 'text-[15px]'}`}
        >
          {story.text}
        </span>
        <span className={`mt-1 ${linkClass} group-hover:border-ink`}>Descubre más ›</span>
      </span>
    </Link>
  );
}

// Inspírate: light editorial section (the only black band is "Nuestros favoritos"). One large
// story and two smaller ones, photos never repeated from other home sections. No prices.
export function InspirationSection() {
  const [main, ...rest] = INSPIRATION;
  return (
    <Container as="section" className="py-20 md:py-28">
      <h2 className="text-[32px] leading-tight font-extrabold tracking-tight md:text-5xl">
        Inspírate
      </h2>
      <p className="mt-3 mb-10 text-lg text-body md:mb-14">
        Ideas para sacarle más a tu tecnología.
      </p>
      <div className="grid gap-10 lg:h-[680px] lg:grid-cols-[3fr_2fr] lg:grid-rows-2 lg:gap-x-8 lg:gap-y-10">
        <StoryCard story={main} large />
        {rest.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </Container>
  );
}

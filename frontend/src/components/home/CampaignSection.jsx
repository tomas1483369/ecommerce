import { Link } from 'react-router';
import { CAMPAIGN } from '../../content/home';
import { buttonClass } from '../../lib/ui';

// Campaign: half full-bleed lifestyle photo fused into the white section, half text with
// subcategory shortcuts (they filter the category page).
export function CampaignSection() {
  const c = CAMPAIGN;
  return (
    <section className="group/campaign bg-paper lg:grid lg:min-h-[620px] lg:grid-cols-2">
      <div className="relative h-[300px] overflow-hidden sm:h-[380px] lg:h-full">
        <img
          src={c.image}
          alt={c.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out-soft group-hover/campaign:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-paper via-transparent via-30% to-transparent lg:bg-linear-to-l lg:from-paper lg:via-paper/0 lg:via-35%" />
      </div>
      <div className="flex max-w-[620px] flex-col justify-center px-5 pt-6 pb-16 sm:px-8 lg:px-16 lg:py-20 xl:px-24">
        <h2 className="text-[36px] leading-[1.02] font-extrabold tracking-[-0.03em] lg:text-[60px]">
          {c.title}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-body lg:text-[19px]">{c.text}</p>
        <Link
          to={c.cta.to}
          className={buttonClass({ variant: 'primary', size: 'lg', className: 'mt-8 w-fit' })}
        >
          {c.cta.label}
        </Link>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {c.links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="block rounded-full border border-line px-4 py-2.5 text-sm font-medium transition hover:border-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { Link } from 'react-router';
import { CreditCardIcon, MessageCircleIcon, ShieldCheckIcon, TruckIcon } from 'lucide-react';
import { BENEFITS } from '../../content/home';
import { STORE_WHATSAPP_NUMBER, whatsappUrl } from '../../lib/whatsapp';
import { linkClass } from '../../lib/ui';
import { Container } from '../Container';

const ICONS = {
  pago: CreditCardIcon,
  envios: TruckIcon,
  garantia: ShieldCheckIcon,
  soporte: MessageCircleIcon,
};
const supportUrl = whatsappUrl(STORE_WHATSAPP_NUMBER, 'Hola, tengo una pregunta sobre una compra');

function BenefitLink({ benefit }) {
  const className = `mt-1 ${linkClass}`;
  if (benefit.to) {
    return (
      <Link to={benefit.to} className={className}>
        {benefit.linkLabel} ›
      </Link>
    );
  }
  if (benefit.id === 'soporte') {
    return (
      <a href={supportUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {benefit.linkLabel} ›
      </a>
    );
  }
  return null;
}

// Trust strip closing the home, right above the footer: reassurance at the end of the visit.
// A plain row (no icon tiles); WhatsApp support only appears once there is a number.
export function BenefitsSection() {
  const benefits = BENEFITS.filter((b) => b.id !== 'soporte' || supportUrl);
  return (
    <section className="border-t border-line bg-paper">
      <Container className="py-14 md:py-16">
        <h2 className="text-2xl font-extrabold tracking-tight md:text-[28px]">
          Compra con confianza
        </h2>
        <ul
          className={`mt-8 grid gap-8 sm:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-line ${
            benefits.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          }`}
        >
          {benefits.map((b) => {
            const Icon = ICONS[b.id];
            return (
              <li key={b.id} className="flex gap-4 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <Icon className="mt-0.5 size-7 shrink-0 text-brand" strokeWidth={1.6} aria-hidden />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[17px] font-bold">{b.title}</h3>
                  {b.description ? (
                    <p className="text-[15px] leading-relaxed text-body">{b.description}</p>
                  ) : null}
                  <BenefitLink benefit={b} />
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

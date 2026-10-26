import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDownIcon } from 'lucide-react';
import { CATEGORIES, INFO_PAGES, categoryPath } from '../lib/categories';
import { socialLinks } from '../lib/social';
import { STORE_WHATSAPP_NUMBER, whatsappUrl } from '../lib/whatsapp';
import { PaymentMethods } from './PaymentMethods';
import { SocialIcon } from './SocialIcon';

const SOCIAL = socialLinks();

const supportUrl = whatsappUrl(
  STORE_WHATSAPP_NUMBER,
  'Hola, necesito ayuda con una compra en TecnoSoftware',
);

// Shipping and warranty are what customers look for under "Soporte".
const SUPPORT_PAGES = ['envios-y-devoluciones', 'garantia'];
const infoLink = (p) => ({ label: p.name, to: `/informacion/${p.slug}` });

const COLUMNS = [
  {
    id: 'tienda',
    title: 'Tienda',
    links: CATEGORIES.map((c) => ({ label: c.name, to: categoryPath(c.slug) })),
  },
  {
    id: 'soporte',
    title: 'Soporte',
    links: [
      { label: 'Mis pedidos', to: '/orders' },
      { label: 'Carrito', to: '/cart' },
      ...INFO_PAGES.filter((p) => SUPPORT_PAGES.includes(p.slug)).map(infoLink),
      ...(supportUrl ? [{ label: 'WhatsApp ↗', href: supportUrl }] : []),
    ],
  },
  {
    id: 'informacion',
    title: 'TecnoSoftware',
    links: INFO_PAGES.filter((p) => !SUPPORT_PAGES.includes(p.slug)).map(infoLink),
  },
];

function FooterLink({ link }) {
  if (link.href) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm hover:text-brand"
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.to} className="text-sm hover:text-brand">
      {link.label}
    </Link>
  );
}

export default function Footer() {
  // mobile accordion: one column open at a time
  const [openId, setOpenId] = useState(null);

  return (
    <footer className="border-t border-line bg-paper">
      {/* desktop: 3 columns separated by vertical lines */}
      <div className="mx-auto hidden max-w-[1240px] grid-cols-3 px-6 pt-16 lg:grid">
        {COLUMNS.map((col, i) => (
          <div key={col.id} className={`px-8 ${i > 0 ? 'border-l border-line' : ''}`}>
            <h2 className="mb-5 text-base font-bold">{col.title}</h2>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* mobile: each column is an accordion */}
      <div className="lg:hidden">
        {COLUMNS.map((col) => {
          const expanded = openId === col.id;
          const panelId = `footer-${col.id}`;
          return (
            <div key={col.id} className="border-b border-line">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpenId(expanded ? null : col.id)}
                className="flex min-h-14 w-full items-center justify-between px-5 text-left text-base font-bold"
              >
                {col.title}
                <ChevronDownIcon
                  className={`size-[18px] transition-transform ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {expanded ? (
                <ul id={panelId} className="flex flex-col gap-4 px-5 pb-5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* payment methods on the left, social networks on the right (stacked on mobile) */}
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 pt-8 lg:mt-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-sm font-bold whitespace-nowrap">Medios de pago</span>
          <PaymentMethods />
        </div>

        <div className="flex items-center gap-3">
          <span className="mr-1 text-sm font-bold">Síguenos</span>
          <ul className="flex gap-2">
            {SOCIAL.map((s) => (
              <li key={s.id}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} de TecnoSoftware (abre en una pestaña nueva)`}
                    className="flex size-11 items-center justify-center rounded-full transition hover:-translate-y-0.5 hover:bg-paper-soft"
                  >
                    <SocialIcon name={s.id} />
                  </a>
                ) : (
                  // no URL configured yet: same look, but not a (dead) link
                  <span
                    role="img"
                    aria-label={`${s.label} (próximamente)`}
                    title={`${s.label}: próximamente`}
                    className="flex size-11 items-center justify-center"
                  >
                    <SocialIcon name={s.id} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-[13px] text-muted lg:mt-6 lg:flex-row lg:justify-between lg:border-t lg:border-line lg:px-6">
        <span>© {new Date().getFullYear()} TecnoSoftware. Todos los derechos reservados.</span>
        <span>Precios en pesos colombianos (COP), IVA incluido.</span>
      </div>
    </footer>
  );
}

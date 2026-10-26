import { BRAND_ICONS } from '../lib/brandIcons';

// Payment methods offered through Wompi (ADR 0003); confirm the final list in F6.
// Visa uses its official mark (Simple Icons, CC0) and Mastercard its two-circle symbol.
// Nequi and Bancolombia use their official logos (frontend/public/payments, see its README).
// PSE has no free vector mark: provisional badge until Wompi's brand kit logo is added as `logo`.
const METHODS = [
  { id: 'visa', name: 'Visa' },
  { id: 'mastercard', name: 'Mastercard' },
  { id: 'pse', name: 'PSE', logo: null, badge: 'text-[#004a9a]', text: 'PSE' },
  { id: 'nequi', name: 'Nequi', logo: '/payments/nequi.svg' },
  { id: 'bancolombia', name: 'Botón Bancolombia', logo: '/payments/bancolombia.svg' },
];

function Mark({ method }) {
  if (method.id === 'visa') {
    const { path, color } = BRAND_ICONS.visa;
    return (
      <svg viewBox="0 0 24 24" fill={color} className="h-7 w-10" role="img" aria-label="Visa">
        <path d={path} />
      </svg>
    );
  }
  if (method.id === 'mastercard') {
    return (
      <svg viewBox="0 0 42 26" className="h-6 w-10" role="img" aria-label="Mastercard">
        <circle cx="13" cy="13" r="11.5" fill="#EB001B" />
        <circle cx="29" cy="13" r="11.5" fill="#F79E1B" />
        <path d="M21 4.74A11.5 11.5 0 0 1 21 21.26A11.5 11.5 0 0 1 21 4.74Z" fill="#FF5F00" />
      </svg>
    );
  }
  if (method.logo) {
    return <img src={method.logo} alt={method.name} className="h-5 w-auto max-w-[110px]" />;
  }
  return (
    <span role="img" aria-label={method.name} className="text-[13px] font-extrabold tracking-tight">
      {method.text}
    </span>
  );
}

export function PaymentMethods() {
  return (
    <ul
      className="flex flex-wrap items-center gap-x-5 gap-y-2"
      aria-label="Medios de pago aceptados"
    >
      {METHODS.map((m) => (
        // logos stand on their own, without a frame (user decision)
        <li key={m.id} title={m.name} className={`flex h-10 items-center ${m.badge ?? ''}`}>
          <Mark method={m} />
        </li>
      ))}
    </ul>
  );
}

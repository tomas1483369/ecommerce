// Amounts are stored as integer cents (ADR 0006); COP is shown as whole pesos: "$ 1.299.900".
export function formatPrice(cents, currency = 'cop') {
  const code = (currency || 'cop').toUpperCase();
  const wholeUnits = code === 'COP';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: wholeUnits ? 0 : 2,
    maximumFractionDigits: wholeUnits ? 0 : 2,
  }).format(cents / 100);
}

export function discountPercent(priceCents, beforeCents) {
  if (!beforeCents || beforeCents <= priceCents) return 0;
  return Math.round((1 - priceCents / beforeCents) * 100);
}

export function formatOrderWhen(iso, opts = {}) {
  const { dateStyle = 'medium' } = opts;
  if (!iso) return '';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle,
    timeStyle: 'short',
  }).format(date);
}

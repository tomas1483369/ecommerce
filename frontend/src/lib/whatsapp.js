// Support channel (ADR 0008): a wa.me link with the message pre-filled, no API involved.
export const STORE_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function whatsappUrl(number, message) {
  const digits = String(number ?? '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function orderSupportUrl(orderId) {
  return whatsappUrl(
    STORE_WHATSAPP_NUMBER,
    `Hola, tengo una pregunta sobre mi pedido #${orderId.slice(0, 8)}`,
  );
}

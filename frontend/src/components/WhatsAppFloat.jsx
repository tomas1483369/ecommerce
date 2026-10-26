import { BRAND_ICONS } from '../lib/brandIcons';
import { STORE_WHATSAPP_NUMBER, whatsappUrl } from '../lib/whatsapp';
import { SocialIcon } from './SocialIcon';

const href = whatsappUrl(STORE_WHATSAPP_NUMBER, 'Hola TecnoSoftware, necesito ayuda');

// Floating WhatsApp button (bottom-right). Sits under the header (z-50) and dialogs (z-60/70).
// Hidden until VITE_WHATSAPP_NUMBER is set: a big button that does nothing erodes trust.
export function WhatsAppFloat() {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp (abre en una pestaña nueva)"
      className="whatsapp-float fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex size-12 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.28)] active:scale-95 md:right-7 md:bottom-7 md:size-14"
      style={{ backgroundColor: BRAND_ICONS.whatsapp.color }}
    >
      <SocialIcon name="whatsapp" color="#FFFFFF" className="size-6 md:size-7" />
    </a>
  );
}

import { whatsappUrl } from './whatsapp';

// Social profiles come from public env vars. Every network is listed; those without a
// configured URL have `href: null` and render as a non-link icon ("próximamente").
function httpsOrNull(url) {
  return typeof url === 'string' && url.startsWith('https://') ? url : null;
}

export function socialLinks(env = import.meta.env) {
  return [
    { id: 'instagram', label: 'Instagram', href: httpsOrNull(env.VITE_INSTAGRAM_URL) },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: whatsappUrl(env.VITE_WHATSAPP_NUMBER, 'Hola, TecnoSoftware'),
    },
    { id: 'facebook', label: 'Facebook', href: httpsOrNull(env.VITE_FACEBOOK_URL) },
    { id: 'tiktok', label: 'TikTok', href: httpsOrNull(env.VITE_TIKTOK_URL) },
  ];
}

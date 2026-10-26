// Home page content (docs/diseno.md, "Inicio"). Provisional: in F4/F7 banners, offers and campaigns
// become editable data from the admin (ADR 0011). Products are referenced by slug and joined with
// GET /api/products, so names and prices always come from the catalog.
// Images under /demo are development-only (frontend/public/demo/README.md). Art direction rule:
// an editorial photo (hero, favorites, campaign, inspiration) is used once per page; a product
// photo may repeat only where that same product appears.

import { subcategoryPath } from '../lib/categories';

// Hero slides: the title is the catalog name (the red part is its last words). `theme: 'dark'`
// is for photos shot on a dark background, so the slide takes their color instead of a white fade.
export const HERO_SLIDES = [
  {
    id: 'celular-pro',
    titleMain: 'Celular Pro',
    titleAccent: '5G',
    subtitle: 'Más cámara. Más batería.',
    promo: 'Pantalla brillante, 256 GB de almacenamiento y carga rápida para todo el día.',
    image: '/demo/products/phone-android.jpg',
    alt: 'Celular con la pantalla encendida sobre fondo blanco',
    to: '/product/celular-pro-5g',
    more: { label: 'Ver todos los celulares', to: '/categoria/celulares' },
  },
  {
    id: 'audifonos',
    titleMain: 'Audífonos de',
    titleAccent: 'diadema',
    subtitle: 'Escucha cada detalle.',
    promo: 'Cómodos para escuchar durante horas, con sonido equilibrado.',
    image: '/demo/headphones-white.jpg',
    alt: 'Audífonos de diadema negros sobre fondo blanco',
    to: '/product/audifonos-de-diadema',
    more: { label: 'Ver todo en sonido', to: '/categoria/sonido' },
  },
  {
    id: 'reloj',
    titleMain: 'Reloj inteligente',
    titleAccent: 'S',
    subtitle: 'Tu salud, en tu muñeca.',
    promo: 'Ritmo cardiaco, sueño y GPS siempre contigo, con batería para varios días.',
    image: '/demo/watch-white.jpg',
    alt: 'Reloj inteligente negro sobre fondo blanco',
    to: '/product/reloj-inteligente-s',
    more: { label: 'Ver todos los wearables', to: '/categoria/wearables' },
  },
  {
    id: 'camara',
    titleMain: 'Cámara',
    titleAccent: 'exterior',
    subtitle: 'Tu casa, siempre a la vista.',
    promo: 'Resistente a la lluvia y al polvo para vigilar entradas, garajes y patios.',
    image: '/demo/products/security-bullet.jpg',
    alt: 'Cámara de seguridad exterior sobre fondo blanco',
    to: '/product/camara-exterior-bullet',
    more: { label: 'Ver todas las cámaras', to: '/categoria/camaras' },
  },
];

// "Lo esencial" → "Destacados": one chosen product per category, in this order.
export const FEATURED_SLUGS = [
  'celular-pro-5g',
  'audifonos-inalambricos',
  'reloj-inteligente-sport',
  'televisor-55-4k',
  'camara-wifi-interior',
  'tv-box-4k',
];

// Short selling line per product for the cards (falls back to the description).
export const PRODUCT_TAGLINES = {
  'celular-pro-5g': 'Más cámara, más batería y pantalla brillante.',
  'celular-ultra': 'Pantalla enorme y zoom de largo alcance.',
  'celular-lite': 'Todo lo esencial a un gran precio.',
  'celular-max': 'Nuestro celular más potente.',
  'celular-a': 'Simple, resistente y con batería de sobra.',
  'reloj-inteligente-s': 'Salud, sueño y GPS siempre contigo.',
  'reloj-inteligente-sport': 'Hecho para entrenar todos los días.',
  'audifonos-inalambricos': 'Cancelación de ruido de bolsillo.',
  'parlante-bluetooth-go': 'Resistente al agua, listo para salir.',
  'televisor-65-oled': 'Negros perfectos y colores reales.',
  'televisor-55-4k': 'Imagen 4K y tus aplicaciones favoritas.',
  'televisor-43-qled': 'Colores intensos para cualquier espacio.',
  'tv-box-4k': 'Tu televisor, ahora smart.',
  'cable-hdmi-2m': 'Imagen 4K del equipo al televisor.',
  'cable-usb-c-2m': 'Trenzado, resistente y con carga rápida.',
  'cargador-rapido-45w': 'Carga tu celular en minutos.',
  'memoria-usb-128gb': 'USB-C y USB-A en una sola memoria.',
  'camara-exterior-bullet': 'Resiste lluvia y polvo, de día y de noche.',
  'camara-domo': 'Discreta, con visión nocturna.',
  'memoria-microsd-128gb': 'Más espacio para fotos y grabaciones.',
  'disco-duro-externo-1tb': 'Respaldo para todo lo importante.',
  'camara-wifi-interior': 'Tu casa en el celular, de día y de noche.',
  'camara-exterior-wifi': 'Gira 360° y te avisa si hay movimiento.',
  'kit-vigilancia-4-camaras': 'Cuatro cámaras y grabador, listos para instalar.',
};

// Offers: the previous price is not in the catalog yet (compare_at_price arrives with variants, F4).
// The card only shows the discount when the live price is really lower than `beforeCents`.
export const OFFER_TABS = [
  { id: 'destacados', label: 'Destacados' },
  { id: 'celulares', label: 'Celulares' },
  { id: 'tv-sonido', label: 'Televisores y sonido' },
  { id: 'wearables', label: 'Wearables' },
  { id: 'camaras', label: 'Cámaras' },
];

export const OFFERS = {
  destacados: [
    { slug: 'celular-ultra', beforeCents: 532_990_000, note: 'Hasta agotar existencias.' },
    {
      slug: 'camara-exterior-wifi',
      beforeCents: 37_990_000,
      note: 'Precio especial por tiempo limitado.',
    },
    { slug: 'parlante-bluetooth-go', beforeCents: 69_990_000, note: 'Hasta agotar existencias.' },
    {
      slug: 'reloj-inteligente-sport',
      beforeCents: 119_990_000,
      note: 'Precio especial por tiempo limitado.',
    },
  ],
  celulares: [
    { slug: 'celular-ultra', beforeCents: 532_990_000, note: 'Hasta agotar existencias.' },
    { slug: 'celular-max', beforeCents: 604_990_000, note: 'Precio especial por tiempo limitado.' },
    { slug: 'celular-lite', beforeCents: 149_990_000, note: 'Hasta agotar existencias.' },
    { slug: 'celular-a', beforeCents: 69_990_000, note: 'Precio especial por tiempo limitado.' },
  ],
  'tv-sonido': [
    {
      slug: 'televisor-65-oled',
      beforeCents: 556_990_000,
      note: 'Precio especial por tiempo limitado.',
    },
    { slug: 'audifonos-inalambricos', beforeCents: 62_990_000, note: 'Hasta agotar existencias.' },
    {
      slug: 'parlante-de-estanteria',
      beforeCents: 119_990_000,
      note: 'Precio especial por tiempo limitado.',
    },
    { slug: 'audifonos-retro', beforeCents: 42_990_000, note: 'Hasta agotar existencias.' },
  ],
  wearables: [
    {
      slug: 'reloj-inteligente-sport',
      beforeCents: 119_990_000,
      note: 'Precio especial por tiempo limitado.',
    },
    { slug: 'reloj-inteligente-s', beforeCents: 139_990_000, note: 'Hasta agotar existencias.' },
    {
      slug: 'reloj-classic',
      beforeCents: 154_990_000,
      note: 'Precio especial por tiempo limitado.',
    },
    { slug: 'base-de-carga-reloj', beforeCents: 12_990_000, note: 'Hasta agotar existencias.' },
  ],
  camaras: [
    {
      slug: 'kit-vigilancia-4-camaras',
      beforeCents: 104_990_000,
      note: 'Precio especial por tiempo limitado.',
    },
    { slug: 'camara-exterior-wifi', beforeCents: 37_990_000, note: 'Hasta agotar existencias.' },
    { slug: 'camara-domo', beforeCents: 21_990_000, note: 'Precio especial por tiempo limitado.' },
    { slug: 'camara-wifi-interior', beforeCents: 16_990_000, note: 'Hasta agotar existencias.' },
  ],
};

// "Nuestros favoritos": the only black band of the home, a stage for products lit on black.
// The first one is the large tile. No prices.
export const FAVORITES = [
  {
    slug: 'televisor-65-oled',
    title: 'Televisor 65" OLED',
    tagline: 'Negros perfectos y colores reales para ver películas como en el cine.',
    image: '/demo/tv-dark.jpg',
    alt: 'Televisor encendido en una sala oscura',
  },
  {
    slug: 'audifonos-inalambricos',
    title: 'Audífonos inalámbricos',
    tagline: 'Cancelación de ruido todo el día.',
    image: '/demo/earbuds-red.jpg',
    alt: 'Audífonos inalámbricos negros junto a su estuche',
  },
  {
    slug: 'camara-domo',
    title: 'Cámara domo',
    tagline: 'Visión nocturna para tu casa o tu negocio.',
    image: '/demo/security-dome-dark.jpg',
    alt: 'Cámara de seguridad tipo domo con luces infrarrojas',
  },
];

// Shipping and warranty terms live on their info pages (pending, docs/progreso.md); the home only
// links to them, so no placeholder text reaches the customer.
export const BENEFITS = [
  {
    id: 'pago',
    title: 'Paga como prefieras',
    description: 'Tarjeta, PSE, Nequi o Botón Bancolombia, con pago seguro a través de Wompi.',
  },
  {
    id: 'envios',
    title: 'Envíos a toda Colombia',
    to: '/informacion/envios-y-devoluciones',
    linkLabel: 'Ver condiciones de envío',
  },
  {
    id: 'garantia',
    title: 'Garantía',
    to: '/informacion/garantia',
    linkLabel: 'Ver condiciones de garantía',
  },
  {
    id: 'soporte',
    title: 'Soporte por WhatsApp',
    description: 'Escríbenos con el número de tu pedido y te ayudamos.',
    linkLabel: 'Escribir por WhatsApp',
  },
];

export const CAMPAIGN = {
  title: 'Entrena con todo lo que necesitas.',
  text: 'Relojes que miden tu ritmo y tu sueño, con correas para cada actividad.',
  image: '/demo/gym.jpg',
  alt: 'Persona haciendo abdominales en casa',
  cta: { label: 'Explorar wearables', to: '/categoria/wearables' },
  links: [
    { label: 'Relojes', to: subcategoryPath('wearables', 'Relojes') },
    { label: 'Deporte', to: subcategoryPath('wearables', 'Deporte') },
  ],
};

export const INSPIRATION = [
  {
    id: 'musica',
    title: 'Música para cada momento',
    text: 'Audífonos de diadema para la casa, inalámbricos para la calle y parlantes para compartir.',
    image: '/demo/headphones-warm.jpg',
    alt: 'Audífonos de diadema plateados sobre una mesa',
    to: '/categoria/sonido',
  },
  {
    id: 'seguridad',
    title: 'Tu casa, siempre a la vista',
    text: 'Cámaras de seguridad que te avisan al celular, de día y de noche.',
    image: '/demo/security-pole.jpg',
    alt: 'Cámara de seguridad en lo alto de un muro bajo el cielo azul',
    to: '/categoria/camaras',
  },
  {
    id: 'carga',
    title: 'Carga sin enredos',
    text: 'Cargadores rápidos y cables resistentes para todos tus equipos.',
    image: '/demo/charger.jpg',
    alt: 'Cargador blanco con su cable',
    to: '/categoria/accesorios',
  },
];

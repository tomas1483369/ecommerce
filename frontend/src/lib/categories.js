import {
  ActivityIcon,
  AudioLinesIcon,
  BatteryChargingIcon,
  CableIcon,
  CctvIcon,
  FlameIcon,
  Grid2x2Icon,
  HardDriveIcon,
  HeadphonesIcon,
  HouseIcon,
  LinkIcon,
  Maximize2Icon,
  MemoryStickIcon,
  MonitorIcon,
  MonitorPlayIcon,
  PhoneIcon,
  PlugZapIcon,
  SmartphoneIcon,
  SmartphoneNfcIcon,
  SpeakerIcon,
  TabletSmartphoneIcon,
  TreesIcon,
  TvIcon,
  WatchIcon,
  WifiIcon,
} from 'lucide-react';

// Provisional navigation data. ADR 0011: in F4 categories and subcategories come from
// GET /api/categories (editable from the admin) and this list stays only as a fallback.
export const CATEGORIES = [
  {
    slug: 'celulares',
    name: 'Celulares',
    description: 'Gama alta, media y básicos, con garantía y envío a todo Colombia.',
    banner: {
      image: '/demo/phone-android.jpg',
      alt: 'Celular con la pantalla encendida sobre fondo oscuro',
      theme: 'dark',
    },
    icon: SmartphoneIcon,
    subcategories: [
      { name: 'Gama alta', icon: SmartphoneNfcIcon },
      { name: 'Gama media', icon: SmartphoneIcon },
      { name: 'Básicos', icon: PhoneIcon },
      { name: 'Más vendidos', icon: FlameIcon },
    ],
  },
  {
    slug: 'accesorios',
    name: 'Accesorios',
    description: 'Cargadores, cables, TV box, memorias, discos duros y más para sacarle provecho a tus equipos.',
    banner: { image: '/demo/tv-box.jpg', alt: 'TV box negro sobre fondo blanco', theme: 'light' },
    icon: PlugZapIcon,
    subcategories: [
      { name: 'Cargadores', icon: PlugZapIcon },
      { name: 'Cables', icon: CableIcon },
      { name: 'TV box', icon: MonitorPlayIcon },
      { name: 'Memorias', icon: MemoryStickIcon },
      { name: 'Discos duros', icon: HardDriveIcon },
      { name: 'Estuches y soportes', icon: TabletSmartphoneIcon },
      { name: 'Power banks', icon: BatteryChargingIcon },
    ],
  },
  {
    slug: 'wearables',
    name: 'Wearables',
    description: 'Relojes inteligentes para medir tu salud, tu sueño y tus entrenamientos.',
    banner: {
      image: '/demo/watch-white.jpg',
      alt: 'Reloj inteligente sobre fondo blanco',
      theme: 'light',
    },
    icon: WatchIcon,
    subcategories: [
      { name: 'Relojes', icon: WatchIcon },
      { name: 'Deporte', icon: ActivityIcon },
      { name: 'Correas', icon: LinkIcon },
    ],
  },
  {
    slug: 'televisores',
    name: 'Televisores',
    description: 'Pantallas 4K y OLED para tus series, películas y partidos.',
    banner: {
      image: '/demo/tv-dark.jpg',
      alt: 'Televisor encendido en una sala oscura',
      theme: 'dark',
    },
    icon: TvIcon,
    subcategories: [
      { name: '4K', icon: TvIcon },
      { name: 'OLED', icon: MonitorIcon },
      { name: '65" o más', icon: Maximize2Icon },
    ],
  },
  {
    slug: 'sonido',
    name: 'Sonido',
    description: 'Audífonos, parlantes y barras de sonido para la casa, el carro o el gimnasio.',
    banner: {
      image: '/demo/headphones-warm.jpg',
      alt: 'Audífonos de diadema plateados sobre una mesa',
      theme: 'light',
    },
    icon: HeadphonesIcon,
    subcategories: [
      { name: 'Audífonos', icon: HeadphonesIcon },
      { name: 'Parlantes', icon: SpeakerIcon },
      { name: 'Barras de sonido', icon: AudioLinesIcon },
    ],
  },
  {
    slug: 'camaras',
    name: 'Cámaras',
    // Security cameras only (user decision, 2026-10-25).
    description: 'Cámaras de seguridad para tu casa o tu negocio: interior, exterior y kits de vigilancia.',
    banner: {
      image: '/demo/security-dome-dark.jpg',
      alt: 'Cámara de seguridad tipo domo con luces infrarrojas',
      theme: 'dark',
    },
    icon: CctvIcon,
    subcategories: [
      { name: 'Interior', icon: HouseIcon },
      { name: 'Exterior', icon: TreesIcon },
      { name: 'Wi-Fi', icon: WifiIcon },
      { name: 'Kits de vigilancia', icon: Grid2x2Icon },
    ],
  },
];

export function categoryPath(slug) {
  return `/categoria/${slug}`;
}

export function findCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function subcategoryPath(slug, name) {
  return `${categoryPath(slug)}?sub=${encodeURIComponent(name)}`;
}

// Provisional product → subcategories map so `?sub=` links really filter. F4 moves this to the
// database (ADR 0011); a product can sit in several subcategories ("Gama alta" and "Más vendidos").
export const PRODUCT_SUBCATEGORIES = {
  'celular-pro-5g': ['Gama alta', 'Más vendidos'],
  'celular-ultra': ['Gama alta'],
  'celular-max': ['Gama alta', 'Más vendidos'],
  'celular-lite': ['Gama media'],
  'celular-a': ['Básicos'],
  'cargador-rapido-45w': ['Cargadores'],
  'base-de-carga-reloj': ['Cargadores'],
  'cable-usb-c-2m': ['Cables'],
  'cable-hdmi-2m': ['Cables'],
  'tv-box-4k': ['TV box'],
  'memoria-microsd-128gb': ['Memorias'],
  'memoria-usb-128gb': ['Memorias'],
  'disco-duro-externo-1tb': ['Discos duros'],
  'estuches-de-carga': ['Estuches y soportes'],
  'reloj-inteligente-s': ['Relojes'],
  'reloj-inteligente-sport': ['Relojes', 'Deporte'],
  'reloj-classic': ['Relojes'],
  'televisor-55-4k': ['4K'],
  'televisor-43-qled': ['4K'],
  'televisor-65-oled': ['OLED', '65" o más'],
  'audifonos-inalambricos': ['Audífonos'],
  'audifonos-de-diadema': ['Audífonos'],
  'audifonos-retro': ['Audífonos'],
  'parlante-bluetooth-go': ['Parlantes'],
  'parlante-de-estanteria': ['Parlantes'],
  'camara-wifi-interior': ['Interior', 'Wi-Fi'],
  'camara-domo': ['Interior'],
  'camara-exterior-bullet': ['Exterior'],
  'camara-exterior-wifi': ['Exterior', 'Wi-Fi'],
  'kit-vigilancia-4-camaras': ['Kits de vigilancia', 'Exterior'],
};

// Subcategories that have at least one product. Navigation only offers these, so nobody lands
// on an empty list (F4 replaces the map with real counts from the database).
export function stockedSubcategories(category) {
  const used = new Set(Object.values(PRODUCT_SUBCATEGORIES).flat());
  return category.subcategories.filter((s) => used.has(s.name));
}

// `sub` must be one of the category's subcategories; anything else shows the whole category.
export function filterBySubcategory(products, category, sub) {
  if (!sub || !category?.subcategories.some((s) => s.name === sub)) return products;
  return products.filter((p) => PRODUCT_SUBCATEGORIES[p.slug]?.includes(sub));
}

// Informational pages linked from the footer; their content is pending (docs/roadmap.md, F7).
export const INFO_PAGES = [
  { slug: 'garantia', name: 'Garantía' },
  { slug: 'envios-y-devoluciones', name: 'Envíos y devoluciones' },
  { slug: 'terminos-y-condiciones', name: 'Términos y condiciones' },
  { slug: 'tratamiento-de-datos', name: 'Política de tratamiento de datos' },
];

export function findInfoPage(slug) {
  return INFO_PAGES.find((p) => p.slug === slug) ?? null;
}

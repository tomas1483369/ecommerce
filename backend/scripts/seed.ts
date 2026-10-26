import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { notInArray } from 'drizzle-orm';
import pg from 'pg';
import { products } from '../src/db/schema.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Provisional catalog for the 6 store categories (docs/vision.md). Prices in COP pesos, stored
// as cents (ADR 0006). Images are development-only Unsplash photos in frontend/public/demo.
// Run it only against the local database: it hides (active = false) products not listed here.
const img = (file: string) => `/demo/${file}.jpg`;
// Catalog photos: product cut out on white (frontend/public/demo/products), so it blends into the white card.
const cut = (file: string) => `/demo/products/${file}.jpg`;

const CATALOG = [
  // Celulares
  {
    slug: 'celular-pro-5g',
    name: 'Celular Pro 5G',
    category: 'Celulares',
    pesos: 3_999_900,
    image: cut('phone-android'),
    description:
      'Más cámara, más batería y una pantalla brillante para todo el día. 256 GB de almacenamiento y carga rápida.',
  },
  {
    slug: 'celular-ultra',
    name: 'Celular Ultra',
    category: 'Celulares',
    pesos: 4_799_900,
    image: cut('galaxy-dark'),
    description: 'Pantalla enorme y zoom de largo alcance para fotos nítidas a la distancia.',
  },
  {
    slug: 'celular-lite',
    name: 'Celular Lite',
    category: 'Celulares',
    pesos: 1_299_900,
    image: cut('phone-light'),
    description:
      'Todo lo esencial a un gran precio: buena cámara, batería de dos días y pantalla amplia.',
  },
  {
    slug: 'celular-max',
    name: 'Celular Max',
    category: 'Celulares',
    pesos: 5_699_900,
    image: cut('iphone-back'),
    description:
      'Nuestro celular más potente, con triple cámara y procesador de última generación.',
  },
  {
    slug: 'celular-a',
    name: 'Celular A',
    category: 'Celulares',
    pesos: 599_900,
    image: cut('phone-black'),
    description: 'Simple, resistente y con batería de sobra. Ideal como primer smartphone.',
  },

  // Accesorios
  {
    slug: 'cargador-rapido-45w',
    name: 'Cargador rápido 45 W',
    category: 'Accesorios',
    pesos: 129_900,
    image: cut('charger'),
    description: 'Carga tu celular en minutos. Puerto USB-C compatible con la mayoría de equipos.',
  },
  {
    slug: 'estuches-de-carga',
    name: 'Estuches de carga',
    category: 'Accesorios',
    pesos: 89_900,
    image: cut('earbuds-lavender'),
    description: 'Protege y carga tus audífonos inalámbricos con estilo.',
  },
  {
    slug: 'base-de-carga-reloj',
    name: 'Base de carga para reloj',
    category: 'Accesorios',
    pesos: 99_900,
    image: cut('watch-white2'),
    description: 'Deja tu reloj inteligente listo cada mañana con carga magnética.',
  },
  {
    slug: 'cable-usb-c-2m',
    name: 'Cable USB-C 2 m',
    category: 'Accesorios',
    pesos: 49_900,
    image: cut('charger'),
    description: 'Cable trenzado resistente con carga rápida y transferencia de datos.',
  },
  {
    slug: 'cable-hdmi-2m',
    name: 'Cable HDMI 2 m',
    category: 'Accesorios',
    pesos: 34_900,
    image: cut('hdmi-cable'),
    description: 'Conecta tu TV box, consola o portátil al televisor con imagen 4K.',
  },
  {
    slug: 'tv-box-4k',
    name: 'TV box 4K',
    category: 'Accesorios',
    pesos: 249_900,
    image: cut('tv-box'),
    description: 'Convierte tu televisor en smart TV con tus aplicaciones de video y música en 4K.',
  },
  {
    slug: 'memoria-microsd-128gb',
    name: 'Memoria microSD 128 GB',
    category: 'Accesorios',
    pesos: 59_900,
    image: img('microsd'),
    description: 'Más espacio para tu celular o para grabar con tu cámara de seguridad.',
  },
  {
    slug: 'memoria-usb-128gb',
    name: 'Memoria USB 128 GB',
    category: 'Accesorios',
    pesos: 69_900,
    image: cut('usb-drive'),
    description: 'Conector USB-C y USB-A para pasar archivos entre el celular y el computador.',
  },
  {
    slug: 'disco-duro-externo-1tb',
    name: 'Disco duro externo 1 TB',
    category: 'Accesorios',
    pesos: 279_900,
    image: cut('hdd-external'),
    description: 'Copias de seguridad de tus fotos, videos y documentos con conexión USB.',
  },

  // Wearables
  {
    slug: 'reloj-inteligente-s',
    name: 'Reloj inteligente S',
    category: 'Wearables',
    pesos: 1_199_900,
    image: cut('watch-white'),
    description: 'Ritmo cardiaco, sueño y GPS siempre contigo, con batería para varios días.',
  },
  {
    slug: 'reloj-inteligente-sport',
    name: 'Reloj inteligente Sport',
    category: 'Wearables',
    pesos: 999_900,
    image: cut('watch-gray'),
    description:
      'Hecho para entrenar todos los días: resistente al agua y con más de 100 modos deportivos.',
  },
  {
    slug: 'reloj-classic',
    name: 'Reloj Classic',
    category: 'Wearables',
    pesos: 1_399_900,
    image: cut('watch-white2'),
    description: 'Diseño elegante con funciones inteligentes para el día a día.',
  },

  // Televisores
  {
    slug: 'televisor-55-4k',
    name: 'Televisor 55" 4K',
    category: 'Televisores',
    pesos: 2_149_900,
    image: cut('tv-black'),
    description: 'Imagen nítida en 4K con tus aplicaciones de streaming favoritas.',
  },
  {
    slug: 'televisor-65-oled',
    name: 'Televisor 65" OLED',
    category: 'Televisores',
    pesos: 4_899_900,
    image: cut('tv-wall'),
    description: 'Negros perfectos y colores reales para ver películas como en el cine.',
  },
  {
    slug: 'televisor-43-qled',
    name: 'Televisor 43" QLED',
    category: 'Televisores',
    pesos: 1_599_900,
    image: cut('tv-dark'),
    description: 'Colores intensos en un tamaño ideal para habitaciones y espacios pequeños.',
  },

  // Sonido
  {
    slug: 'audifonos-inalambricos',
    name: 'Audífonos inalámbricos',
    category: 'Sonido',
    pesos: 499_900,
    image: cut('earbuds-white'),
    description: 'Cancelación de ruido en un estuche de bolsillo, con batería para todo el día.',
  },
  {
    slug: 'audifonos-de-diadema',
    name: 'Audífonos de diadema',
    category: 'Sonido',
    pesos: 399_900,
    image: cut('headphones-white'),
    description: 'Cómodos para escuchar durante horas, con sonido equilibrado.',
  },
  {
    slug: 'parlante-bluetooth-go',
    name: 'Parlante Bluetooth Go',
    category: 'Sonido',
    pesos: 599_900,
    image: cut('speaker-jbl'),
    description: 'Resistente al agua y listo para salir, con 12 horas de música.',
  },
  {
    slug: 'audifonos-retro',
    name: 'Audífonos retro',
    category: 'Sonido',
    pesos: 349_900,
    image: cut('headphones-warm'),
    description: 'Estilo clásico con sonido actual y almohadillas suaves.',
  },
  {
    slug: 'parlante-de-estanteria',
    name: 'Parlante de estantería',
    category: 'Sonido',
    pesos: 899_900,
    image: cut('speaker-dark'),
    description: 'Sonido cálido y potente para tu música favorita en casa.',
  },

  // Cámaras: only security cameras (user decision, 2026-10-25)
  {
    slug: 'camara-wifi-interior',
    name: 'Cámara Wi-Fi interior',
    category: 'Cámaras',
    pesos: 139_900,
    image: cut('security-wifi'),
    description: 'Mira tu casa desde el celular, con visión nocturna y audio de dos vías.',
  },
  {
    slug: 'camara-domo',
    name: 'Cámara domo',
    category: 'Cámaras',
    pesos: 189_900,
    image: cut('security-dome-dark'),
    description: 'Discreta y resistente para techos de casas, oficinas y locales, con visión nocturna.',
  },
  {
    slug: 'camara-exterior-bullet',
    name: 'Cámara exterior',
    category: 'Cámaras',
    pesos: 229_900,
    image: cut('security-bullet'),
    description: 'Resistente a la lluvia y al polvo para vigilar entradas, garajes y patios.',
  },
  {
    slug: 'camara-exterior-wifi',
    name: 'Cámara exterior Wi-Fi 360°',
    category: 'Cámaras',
    pesos: 329_900,
    image: cut('security-ptz'),
    description: 'Gira para cubrir todo tu patio o tu negocio y te avisa al celular si detecta movimiento.',
  },
  {
    slug: 'kit-vigilancia-4-camaras',
    name: 'Kit de vigilancia 4 cámaras',
    category: 'Cámaras',
    pesos: 899_900,
    image: cut('security-outdoor'),
    description: 'Cuatro cámaras y un grabador para vigilar tu casa o tu negocio todo el día.',
  },
];

async function main() {
  for (const p of CATALOG) {
    const row = {
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      priceCents: p.pesos * 100,
      currency: 'cop',
      imageUrl: p.image,
      active: true,
    };
    await db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: row.name,
          category: row.category,
          description: row.description,
          priceCents: row.priceCents,
          currency: row.currency,
          imageUrl: row.imageUrl,
          active: row.active,
        },
      });
  }

  // hide (not delete: orders may reference them) products from the previous template catalog
  const hidden = await db
    .update(products)
    .set({ active: false })
    .where(
      notInArray(
        products.slug,
        CATALOG.map((p) => p.slug),
      ),
    )
    .returning({ slug: products.slug });

  console.log(
    `Seed complete: ${CATALOG.length} products upserted, ${hidden.length} old products hidden.`,
  );
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

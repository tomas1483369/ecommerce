# Sistema de diseño

**Diseño visual de F2 (Claude Design)**: https://claude.ai/artifact/34qMf4PcpuV9k72TBfmz8M. Tres mesas interactivas: inicio en escritorio, página de categoría y móvil con acordeón. Si el diseño y este documento no coinciden, manda lo que el usuario apruebe en el lienzo; luego se actualiza este archivo.

Referencias: tienda de Samsung Colombia (navbar con megamenú y accesos por categoría), apple.com (secciones de ancho completo que alternan fondo claro y negro) y Xiaomi. Sin DaisyUI: Tailwind 4 con tokens propios (ADR 0005).

## Reglas de calidad de interfaz

La marca rojo/negro/blanco con Inter está decidida; ninguna skill la cambia sin aprobación del usuario. Para revisar y pulir pantallas se usa **Impeccable** (`/impeccable audit`, `critique`, `polish`; ADR 0012). Reglas vigentes (la lista previa a la entrega está en CHECKPOINTS.md):

- Nada importante depende solo del hover: el megamenú se abre con hover o foco de teclado, y el clic en la categoría siempre navega.
- Cursor de mano y transición de 150 ms en todo lo clicable (`index.css`).
- `prefers-reduced-motion` desactiva animaciones y transiciones en todo el sitio.
- Paneles con scroll propio usan `overscroll-contain`.
- Navbar de escritorio compacta entre `lg` y `xl` (1024–1279 px) para que quepan las 7 entradas.
- `heading-line-balance`: `text-wrap: balance` en h1–h3.
- `press-feedback`: los botones se encogen a 98 % al presionarlos.
- `modal-motion`: menú móvil, búsqueda, modales y megamenú entran con un desvanecimiento de 180–200 ms (la salida es inmediata).
- `whitespace-balance`: la tarjeta de producto no repite la categoría dentro de una lista de una sola categoría.
- Carruseles: solo el hero avanza solo; la fila de productos ("Lo esencial") es manual y "Nuestros favoritos" es un escenario fijo.

Para tienda en línea y carruseles la base de datos de la skill no tuvo coincidencias; se aplicaron sus reglas generales.

## Colores (tokens)

Se definen una sola vez en `frontend/src/index.css` con `@theme` y se usan como clases (`bg-brand`, `text-ink`…). No escribas colores hex sueltos en los componentes.

| Token | Valor | Uso |
| --- | --- | --- |
| `brand` | `#E30613` | Botón principal, precio en oferta, subrayado del menú activo, acentos |
| `brand-hover` | `#B8050F` | Hover/active del botón principal |
| `ink` | `#000000` | Texto principal, fondo de secciones negras, navbar en secciones oscuras |
| `ink-soft` | `#1D1D1F` | Tarjetas sobre fondo negro |
| `graphite` | `#1C1C1E` | Fondo de la zona de ofertas (oscuro, distinto del negro) |
| `graphite-card` | `#2C2C2E` | Tarjetas sobre `graphite` |
| `paper` | `#FFFFFF` | Fondo principal de la página |
| `paper-soft` | `#F5F5F7` | **Fondo general de la página** (gris claro) y franjas claras alternas |
| `line` | `#E5E5E5` | Bordes y divisores |
| `muted` | `#6E6E73` | Texto secundario |

Contraste: `brand` sobre blanco y blanco sobre `brand` dan ≈4.8:1 (cumple WCAG AA para texto normal). No uses rojo para texto pequeño sobre negro.

## Tipografía

- Una sola familia sans (propuesta: Inter, de Google Fonts), pesos 400/500/700.
- Títulos de sección grandes y en negrita (`text-4xl md:text-6xl`), subtítulo corto debajo, como "iPhone 18 Pro / Pro further."
- Precios con `tabular-nums`.

## Componentes base

- **Botones**: forma de píldora (`rounded-full`). Principal: fondo `brand`, texto blanco ("Ver producto", "Explorar…"). **Un solo estilo de enlace secundario** (`linkClass` en `lib/ui.js`): texto en negrita del color de la superficie con subrayado rojo de 2 px y "›" ("Ver todos los celulares ›", "Descubre más ›"); pasa contraste sobre blanco, gris y negro. "Comprar" se reserva para acciones que de verdad compran.
- **Tarjeta de producto** (referencia: tarjetas de Apple y Xiaomi; mínima y centrada):
  - Tarjeta blanca, esquinas de 24 px, `shadow-card`; se levanta 4 px al pasar el cursor.
  - Foto arriba (4:3) a todo el ancho de la tarjeta.
  - Texto centrado: categoría opcional en rojo (solo en listas mezcladas), nombre (22 px, negrita, sin alto mínimo), frase corta de 1–2 líneas y precio.
  - **Toda la tarjeta abre el producto** (enlace estirado sobre el nombre) y la única acción visible es "Agregar" (píldora negra). Sin "Más información" aparte.
  - **No lleva** selector de color o capacidad, insignia de descuento ni precio tachado: los colores y capacidades se eligen en la página del producto (ADR 0010) y los descuentos viven en la sección de ofertas.
  - "Agotado" en lugar de "Agregar" si ninguna variante tiene stock (F4).
- **Accesos por categoría** (como la fila de Samsung "Lo esencial"): grilla de 7 tiles que ocupa **todo el ancho** del contenedor (~136px de alto), borde `line`, esquinas redondeadas, ícono lineal (lucide-react) arriba y nombre debajo; el seleccionado lleva borde `ink`. Tiles: Destacados (los elegidos en `FEATURED_SLUGS`), Celulares, Accesorios, Wearables, Televisores, Sonido, Cámaras. Al hacer clic filtran el carrusel de debajo (en inicio) o llevan a la página de la categoría. En móvil la fila se desplaza horizontalmente.
- **Carruseles**, sin librería (CSS `scroll-snap` + un hook pequeño):
  - *Banner principal*: ver Hero en "Inicio".
  - *Fila de productos* (Apple "Explora la línea"): **sale hasta los bordes de la pantalla** mientras la primera tarjeta queda alineada con el título (utilidad `rail-gutter`); la siguiente asoma en el borde, flechas en escritorio y deslizamiento con el dedo en móvil. Se renderiza fuera de `Container`.

## Navbar

### Escritorio (≥ `lg`)

```text
                                                   Soporte   Rastrear pedido
TECNOSOFTWARE   Tienda  Celulares  Accesorios  Wearables  Televisores  Sonido  Cámaras      🔍  🛒  👤
```

- Barra superior delgada con enlaces secundarios a la derecha.
- Logo a la izquierda, categorías al centro, íconos (buscar, carrito con contador, cuenta) a la derecha.
- Al pasar el mouse **o** enfocar con teclado una categoría se abre un **megamenú** de ancho completo:
  - Izquierda: tiles con imagen + nombre de cada subcategoría o producto destacado.
  - Derecha, separada por una línea vertical: columna "Ayuda para comprar" con enlaces a páginas reales (Garantía, Envíos y devoluciones) y "Ver todo en {categoría} ›". Nada de enlaces de relleno que abran todos la misma página.
  - Solo se muestran las subcategorías que tienen productos (`stockedSubcategories`); lo mismo en el acordeón móvil y en las píldoras de la página de categoría.
- El megamenú se despliega **al pasar el cursor**, sin clic, con un retardo de cierre de ~150 ms para que no parpadee al mover el mouse hacia el panel. Clic o Enter sobre la categoría lleva a su página.
- La categoría activa se subraya en `brand`.
- **Al hacer scroll** (estilo Huawei) la barra pasa de blanco sólido a blanco translúcido (85 %, para que las fotos de debajo no manchen la barra) con desenfoque del fondo; vuelve a sólida mientras el megamenú está abierto. Sin soporte de `backdrop-filter` queda al 95 % para no perder contraste.
- Navbar fija (`sticky`), fondo blanco con borde inferior `line`.

### Móvil y tablet (< `lg`)

- Una sola fila, como en samsung.com: **logo a la izquierda**; a la derecha buscar, carrito (con contador), cuenta y **el botón de menú (hamburguesa) en el extremo derecho**. Logo a 15 px con espaciado 0.12em para que todo quepa en 360 px sin recortes.
- La hamburguesa abre un panel a pantalla completa con un **acordeón**: cada categoría es un encabezado que se expande para mostrar sus subcategorías; al final, enlaces de soporte y de cuenta.
- Solo un ítem del acordeón abierto a la vez.

### Accesibilidad

- `aria-expanded` y `aria-controls` en los disparadores del megamenú y del acordeón.
- `Esc` cierra megamenú y panel móvil; el foco vuelve al botón que lo abrió.
- El panel móvil bloquea el scroll del fondo y atrapa el foco mientras está abierto.

## Páginas

El catálogo **no** va completo en la página de inicio: cada categoría tiene su propia página.

### Inicio (`/`)

**Principio** (crítica de Impeccable, 2026-10-25): la página se veía como un bloque plano porque las 7 secciones repetían la misma plantilla. Ahora **cada sección tiene su propia composición y escala**, y el color sigue un **presupuesto: un negro, un rojo, el resto claro**. Cortes nítidos entre secciones, sin degradados (como apple.com).

Jerarquía tipográfica: hero 80–96 px · títulos de sección 48 px (32 en móvil) · tarjetas 22 px. Sin etiquetas pequeñas sobre los títulos (prohibido por Impeccable): el título se sostiene solo.

| # | Sección | Fondo | Composición |
| --- | --- | --- | --- |
| 01 | Hero (4 productos) | el de la foto: blanco o `ink-soft` | **Escenario casi a pantalla completa** (600–820 px de alto). Nombre del producto en 80–96 px con la última parte en rojo, subtítulo en negrita, una línea de texto, "Ver producto" (rojo) + enlace secundario a la categoría. Foto sin bordes en la mitad derecha fundida con el color de la diapositiva (`theme: 'dark'` para fotos tomadas sobre oscuro). En móvil la foto va arriba y los botones quedan al alcance del pulgar. Flechas redondas iguales a los lados; líneas de progreso y botón de pausa de 44 px abajo. **Avanza solo** (decisión del usuario), también con el mouse sobre la foto; se detiene con la pausa, con el teclado dentro y **mientras el puntero está sobre los botones** (para no cambiar la diapositiva justo antes del clic). |
| 02 | Lo esencial | `paper-soft` | 7 accesos a todo el ancho + fila de tarjetas que sale hasta el borde de la pantalla. |
| 03 | Ofertas por tiempo limitado | **rojo** (`brand`) | La única banda roja. Título blanco a la izquierda, pestañas a la derecha. Tarjetas blancas de **una sola superficie** (foto, insignia negra "-X%", nombre, precio, precio anterior tachado, condición). El descuento solo se muestra si el precio real es menor que el anterior. |
| 04 | Campaña (hoy Wearables) | blanco | Mitad foto de estilo de vida sin bordes, mitad texto (título 60 px) + botón + accesos a subcategorías que **sí filtran**. |
| 05 | Nuestros favoritos | **negro** | La única banda negra: **escenario de productos iluminados sobre negro**, una tarjeta grande y dos pequeñas; toda la tarjeta abre el producto. Sin precio, sin carrusel. |
| 06 | Inspírate | `paper-soft` | Editorial claro y asimétrico: una historia grande y dos pequeñas, foto arriba y texto debajo (sin texto sobre la foto). Sin precio. |
| 07 | Compra con confianza | blanco | **Franja compacta al final**, justo antes del footer (tranquilidad al cerrar la visita): fila con ícono rojo sin caja, título, texto corto y enlace a las condiciones. Sin textos pendientes a la vista; "Soporte por WhatsApp" solo aparece cuando hay número. |
| 08 | Footer | blanco | 3 columnas (Soporte incluye envíos y garantía). |

Espaciado vertical variado a propósito: escenarios generosos (favoritos 128 px, ofertas 96 px), franja de confianza compacta (56–64 px).

**Fotografías (dirección de arte)**: nunca placeholders grises en producción. Tres tipos: producto sobre fondo neutro (catálogo), estilo de vida (campaña e Inspírate) y producto iluminado sobre oscuro (banda negra). **Catálogo: producto recortado sobre blanco** (decisión del usuario: "que la foto tenga el mismo color del fondo"), así se funde con la tarjeta blanca como en Apple y Samsung; las fotos del catálogo viven en `frontend/public/demo/products/` (recortadas con rembg, ver su README). Donde el marco no es 4:3 (ofertas, página de producto, carrito, búsqueda, pedidos) la foto se muestra con `object-contain` sobre blanco para no cortar el producto. **Hero**: fotos cuyo fondo es del mismo color que la diapositiva (producto sobre blanco). **Una foto editorial (hero, favoritos, campaña, Inspírate) se usa una sola vez por página**; la foto de un producto solo se repite donde aparece ese mismo producto. Nada de logos de marca ni pantallas en otro idioma o país. Hoy se usan fotos provisionales de Unsplash (`frontend/public/demo/README.md`); varias tienen marcas y deben reemplazarse por fotos propias vía ImageKit antes de producción (F8). Las fotos oficiales de marcas no se asumen libres de uso.

Regla de precios: solo en "Lo esencial", "Ofertas" y en las páginas de categoría y producto.

Banners, ofertas, destacados y campañas se administran como datos (título, texto, imagen, enlace, fechas), no con texto fijo en el componente.

### Inicio en móvil (< `lg`)

Mismo orden que en escritorio, adaptado a una columna (mesa "Inicio · móvil (página completa)" en el lienzo):

- Hero: foto arriba y texto abajo (botones al alcance del pulgar); líneas de progreso y pausa abajo; sin flechas (se desliza con el dedo).
- Accesos por categoría, tarjetas y pestañas de ofertas en filas con desplazamiento horizontal y `scroll-snap`; un desvanecido en el borde derecho (`fade-right`) indica que hay más.
- Favoritos: tarjetas apiladas (la grande primero). Inspírate: historias apiladas.
- Confianza: lista vertical (ícono a la izquierda, texto a la derecha).
- Footer: cada columna es un acordeón.

### Página de categoría (`/categoria/:slug`) — una sola plantilla

Las 6 categorías usan **la misma plantilla**; cada una solo aporta sus datos. Así se personaliza una categoría sin tocar el diseño de las demás. Slugs: `celulares`, `accesorios`, `wearables`, `televisores`, `sonido`, `camaras`.

Datos que define cada categoría:

| Dato | Ejemplo (Celulares) |
| --- | --- |
| Título y frase del banner | "Celulares" · "Gama alta, media y básicos…" |
| Foto del banner | celular sobre fondo negro |
| Tema del banner | `dark` (negro) o `light` (`paper-soft`); hoy: Celulares, Televisores y Cámaras oscuros; Accesorios, Wearables y Sonido claros |
| Subcategorías | Gama alta, Gama media, Básicos |

Estructura:

1. Banner: migas de pan, título grande y frase a la izquierda; foto a sangre en la mitad derecha fundida con el fondo del tema.
2. Barra: subcategorías en píldoras ("Todos" + las de la categoría) que filtran con `?sub=` (mapa provisional `PRODUCT_SUBCATEGORIES` en `lib/categories.js` hasta F4), contador como `h2` ("2 productos en Parlantes") y orden (destacados, menor precio, mayor precio). "Solo disponibles" llega con el stock (F4).
3. Grilla de tarjetas de producto mínimas (1 columna en móvil, 2 en tablet, 4 en escritorio). Agotados atenuados con "Agotado". Si no hay productos, mensaje en español con salida ("Ver todo en Sonido" o "Volver al inicio"); si falla la carga, botón "Reintentar".
4. Footer.

La navbar, el megamenú, los accesos por categoría y el footer enlazan aquí.

### Página de producto (`/product/:slug`)

Rehecha con `/impeccable layout` + `adapt` (segunda crítica, 2026-10-25). Recorrido principal: producto → precio → "Agregar al carrito"; después tranquilidad; después seguir explorando.

1. Migas de pan: Inicio / Categoría / Producto (sin etiqueta roja sobre el título).
2. Escritorio: foto grande a la izquierda (7/12, cuadrada, producto recortado sobre blanco con `object-contain`) y bloque de compra a la derecha, centrado en vertical: nombre (48 px), precio (32 px), descripción (máx. 52 caracteres por línea), "Agregar al carrito" (rojo) + enlace "Ver más en {categoría} ›". Debajo, separada por una línea, la lista tranquila de garantías (ícono negro lineal, texto 15 px): pago seguro, soporte por WhatsApp, garantía del fabricante. "Seguir comprando" dejó de ser un botón que competía con la compra.
3. "Más en {categoría}": fila a sangre con los demás productos de la categoría (hasta 8) + "Ver todo ›".
4. Móvil: foto 4:3 para que el botón quede dentro de la primera pantalla (en 390 × 844 queda a ~700 px; antes a ~1040) y botón a todo el ancho. **Barra fija de compra** abajo (nombre, precio, "Agregar") que aparece cuando el botón principal sale de la pantalla y se oculta cuando vuelve; mientras está visible sube el botón de WhatsApp y reserva espacio al final del footer (`data-buybar` en `<html>`). Oculta, no recibe foco.
5. Sin especificaciones, tiempos de entrega ni stock inventados: llegan con los datos de F4 (variantes y stock) y las condiciones de envío del usuario.

## Profundidad: fondo gris y tarjetas blancas

A pedido del usuario (la página se sentía plana): el fondo general es `paper-soft` (gris claro) y las superficies (tarjetas de producto y de ofertas, resumen del carrito, pedidos, tabla del admin, imagen del producto) son blancas con una sola escala de sombras: `shadow-card` en reposo y `shadow-card-hover` al pasar el cursor (tokens en `index.css`). Franjas blancas para variar el tono: hero, campaña y "Compra con confianza". Los skeletons usan `#e8e8ed` para verse sobre el gris. Los carriles dejan margen vertical para que la sombra y el levantamiento no se recorten.

## Movimiento al pasar el cursor

Curva compartida `ease-out-soft` (`cubic-bezier(0.22, 1, 0.36, 1)`: arranca rápido y se asienta despacio).

- **Tarjetas** (producto, ofertas, favoritos, Inspírate, pedidos): **se levantan 4 px** con una sombra más amplia, en 500 ms; la foto de la tarjeta no hace zoom (decisión del usuario).
- **Hero, campaña y banner de categoría**: foto **sin bordes** (decisión del usuario): de borde a borde, fundida con el fondo de su propia sección; al pasar el cursor la foto se acerca lentamente (3 %, 1,4 s). Como no tiene marco, no se ve un recuadro rígido.
- Las fotos dentro de tarjetas (producto, ofertas, favoritos, Inspírate) sí van en tarjetas redondeadas.

## Cambio entre secciones claras y oscuras

Como apple.com: **cortes nítidos** entre bandas blancas/grises y negras, sin degradados entre secciones (el usuario probó y descartó la transición en degradado). El ritmo lo da el orden de las secciones (nunca dos negras seguidas), no la mezcla de colores.
- Botones: se encogen a 98 % al presionarlos.
- Con `prefers-reduced-motion`, todas estas transiciones se desactivan.

## Botón flotante de WhatsApp

Botón redondo verde WhatsApp con el logo en blanco, fijo en la esquina inferior derecha (respeta el área segura del iPhone), por encima del contenido y por debajo de navbar, menús y modales. Abre el chat con un mensaje escrito; sin `VITE_WHATSAPP_NUMBER` se muestra sin enlace ("próximamente").

## Búsqueda

Lupa en la navbar (escritorio y móvil) que abre un panel con un campo de búsqueda. Filtra el catálogo cargado sin tildes ni mayúsculas y muestra primero los productos cuyo nombre coincide. Sin texto escrito, muestra accesos a las 6 categorías. **El aspecto es provisional**: el usuario lo diseñará después.

## Footer

Referencia: footer de samsung.com/co, reducido a **3 columnas** separadas por líneas verticales `line`, sobre fondo blanco:

| Tienda | Soporte | TecnoSoftware |
| --- | --- | --- |
| Celulares, Accesorios, Wearables, Televisores, Sonido, Cámaras, Ofertas | Mis pedidos, WhatsApp, Preguntas frecuentes, Garantía, Envíos y devoluciones | Mi cuenta, Sobre nosotros, Contacto, Términos y condiciones, Política de tratamiento de datos (Ley 1581) |

- Títulos de columna en negrita, enlaces en texto pequeño `ink`; los externos llevan ↗.
- Fila bajo las columnas: **medios de pago a la izquierda** y **redes a la derecha**, con **logos a color** (en móvil, uno debajo del otro). Visa e íconos de redes: marcas oficiales de Simple Icons (CC0) en `frontend/src/lib/brandIcons.js`, sin recolorear; Mastercard: su símbolo de dos círculos. Nequi y Bancolombia: logos reales de Wikimedia Commons en `frontend/public/payments/` (licencias en su README). PSE: texto provisional (no hay vector libre). **Sin contorno ni caja**: los logos van sueltos, separados por espacio (decisión del usuario). En F6 todo se reemplaza por el kit oficial de Wompi.
- "Síguenos": íconos de redes **sin contorno** (al pasar el cursor, fondo gris suave) (Instagram, WhatsApp, Facebook, TikTok; trazos de Tabler Icons, MIT). Los cuatro íconos se ven siempre; los que tienen URL configurada (`VITE_INSTAGRAM_URL`, `VITE_WHATSAPP_NUMBER`, `VITE_FACEBOOK_URL`, `VITE_TIKTOK_URL`, https completa) son enlaces, los demás se muestran sin enlace y se anuncian como "próximamente".
- Franja inferior: © año TecnoSoftware y nota de precios en COP.
- En móvil cada columna es un acordeón, igual que la navbar.

## Marca

- Nombre visible: **TecnoSoftware** (logo en texto, mayúsculas y tracking amplio como "SAMSUNG", hasta tener un logo gráfico).
- Reemplaza todas las apariciones de "Ecommerce" / "Ecommerce Supply", el título del HTML y el favicon.

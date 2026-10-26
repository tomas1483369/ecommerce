# Progreso

## Estado actual

- **Fase**: F2 verificada. Inicio, plantilla de categoría y búsqueda adelantados de F7 con contenido provisional. Precios en COP (parte de F3). Siguiente: F4 (categorías editables, variantes y stock).
- **Decisiones esperando al usuario**: condiciones de envío y garantía (hoy entre corchetes en Beneficios); número de WhatsApp y URLs de Instagram/Facebook/TikTok; si habrá cupones o fechas de vencimiento en las ofertas.
- **Pendiente del usuario**: `gh auth login`; claves de desarrollo de Clerk en `backend/.env` y `frontend/.env.local` para ver la tienda en el navegador.
- **Bloqueos**: ninguno. Claves de desarrollo en `backend/.env` y `frontend/.env.local` (no van a git). El backend local usa la BD de Docker; la URL de Neon queda comentada.
- **Comprobar al retomar**: `./init.sh` en verde; `docker compose up -d db`.

## Bitácora (lo más reciente arriba)

### 2026-10-25 · Tercera crítica, PRODUCT.md y decisión de mantener el inicio actual

- Tercera crítica (dos evaluaciones independientes): **23/40** (tendencia 23 → 24 → 23). Veredicto: "competente pero genérica". El detector solo marca Inter (fuente de marca) y la fila a sangre cerca de 1280 px (por diseño). Hallazgo real corregido: en móvil, el foco del teclado podía quedar oculto bajo la barra de compra del producto → `scroll-padding-bottom` mientras la barra está visible (WCAG 2.4.11).
- Pedido del usuario: priorizar la experiencia visual y que la página sobresalga; envíos, entregas y demás datos después.
- `PRODUCT.md` creado (flujo `init` de Impeccable) con las respuestas del usuario: cliente principal **hogares**; diferencia **asesoría cercana por WhatsApp** y **precio y facilidad de pago**; fotos propias en camino, sin reseñas ni logo gráfico (no inventarlos).
- Ronda de estructura del inicio (`new-work`, alcance de superficie): se propusieron "La casa por espacios", "Cinta en movimiento" y "Te ayudamos a elegir" (bocetos en `.impeccable/mocks/decision/`). **El usuario decidió mantener el inicio actual por ahora.** Las tres quedan como opciones para retomar.
- Pendiente para la próxima sesión: decidir si se ocultan los descuentos sin precio anterior real; condiciones de envío y garantía; idioma y marca del modal de inicio de sesión (Clerk en inglés, "Development mode") hasta F5; fotos propias; decidir si `.impeccable/` va a git.

### 2026-10-25 · Página de producto con `/impeccable layout` + `adapt`

- Siguiente paso de la segunda crítica (P1: "página de producto muy delgada y botón de compra bajo el pliegue en móvil"). Escaneo de layout limpio antes y después; el problema era de estructura.
- Hecho: foto más grande (7/12) y bloque de compra compacto (nombre, precio, descripción y botón juntos); garantías como lista tranquila bajo una línea (antes una caja que pesaba más que el precio); "Seguir comprando" pasa a enlace "Ver más en {categoría} ›"; fila "Más en {categoría}" con productos reales; en móvil foto 4:3 (botón a ~700 px en vez de ~1040) y **barra fija de compra** que aparece al salir el botón de pantalla, sube el WhatsApp y no tapa el footer; skeleton alineado con el nuevo layout.
- No se inventaron especificaciones, entregas ni stock (llegan con F4 y las condiciones del usuario).
- Verificado en navegador a 360/390/1024/1440 px: sin desbordes ni errores, barra aparece/desaparece, oculta no recibe foco, footer visible al final. Detector sin hallazgos en la página. Check, tests (6 + 33) y build en verde.

### 2026-10-25 · Cámaras de seguridad, más accesorios, catálogo recortado y segunda fase de Impeccable

- **Cámaras = solo cámaras de seguridad** (decisión del usuario): subcategorías Interior, Exterior, Wi-Fi y Kits de vigilancia; 5 productos nuevos en el seed (Wi-Fi interior, domo, exterior, exterior Wi-Fi 360°, kit de 4 cámaras); fuera réflex, instantánea y kit de lentes (ocultos por el seed) y sus fotos (`canon`, `polaroid`, `camera-dark`). Hero, favoritos, Inspírate y ofertas usan ahora cámaras de seguridad.
- **Accesorios** suma cables, TV box, memorias y discos duros: subcategorías Cargadores, Cables, TV box, Memorias, Discos duros, Estuches y soportes, Power banks; 5 productos nuevos (cable HDMI, TV box 4K, microSD 128 GB, memoria USB 128 GB, disco duro 1 TB). Seed: 30 productos.
- Fotos nuevas de **Wikimedia Commons** (CC0, dominio público, CC BY y CC BY-SA, con atribución en `frontend/public/demo/README.md`), porque Unsplash bloquea el acceso automático.
- **Medios de pago y redes sin contorno** (pedido del usuario).
- **Catálogo recortado sobre blanco** (pedido del usuario: "imágenes con el mismo color del fondo, como las diademas y el reloj del hero"): 29 fotos de producto con el fondo quitado (rembg, en un entorno aislado fuera del proyecto) en `frontend/public/demo/products/`; el seed apunta ahí. El hero cambia el celular y la cámara por sus versiones sobre blanco (la diapositiva oscura ya no se usa). Marcos no 4:3 (ofertas, producto, carrito, búsqueda, pedidos) con `object-contain` sobre blanco. Pendiente: la microSD sigue con su foto original.
- **Pulido (`/impeccable polish`)** del recorrido completo: el megamenú cambia "Descubre" (enlaces de relleno que abrían todos la categoría) por "Ayuda para comprar" con páginas reales; migas de pan del producto con la categoría y sin la etiqueta roja sobre el título; fuera las etiquetas en mayúsculas ("ERROR 404", "DETALLE DEL PEDIDO", "TOTAL", "CATEGORÍAS"); frases cortas para que ninguna tarjeta corte el texto con "…"; foto del hero en alta resolución.
- **Segunda crítica** (dos evaluaciones independientes): **24/40** (antes 23/40, pero ahora incluye producto y carrito). Corregido enseguida: subcategorías vacías ocultas en menú, acordeón, píldoras y campaña (`stockedSubcategories`); producto inexistente avisa en ~1 s (antes ~10 s por reintentos); sombra de las filas ya no se recorta; pestañas de ofertas bajo el título.
- **Pendientes de la crítica que dependen del usuario**: precios tachados y "-X%" sin precio anterior real en el catálogo (riesgo ante la SIC); páginas de envíos y garantía (hoy "en preparación"); página de producto más completa (galería, especificaciones, entrega, barra fija de compra en móvil); precio o cuotas en el hero.
- Verificado en navegador a 390/1280/1440 px sin desbordes ni errores; check, tests (6 + 33) y build en verde.

### 2026-10-25 · Crítica con Impeccable y rediseño del inicio

- Crítica `/impeccable critique` (dos evaluaciones independientes: revisión de diseño + detector en código y en vivo): **23/40**. Causa del "bloque plano": la misma plantilla en 7 secciones, blanco y gris casi iguales, poca escala, fotos repetidas y de otro mercado. Informe en `.impeccable/critique/`.
- Pedido del usuario: aplicar todas las mejoras. Hecho:
  - **Presupuesto de color**: una banda roja (Ofertas), una negra (Nuestros favoritos), el resto claro; cortes nítidos.
  - **Hero escenario** (600–820 px, nombre en 80–96 px, diapositiva oscura para la foto del celular), "Ver producto" + enlace a la categoría, pausa mientras el puntero está sobre los botones, flechas iguales y pausa de 44 px.
  - **Filas de productos a sangre** (`rail-gutter`): salen hasta el borde y la primera tarjeta queda alineada con el título; ya no se recorta la sombra.
  - **Tarjeta de producto**: toda la tarjeta abre el producto, una sola acción "Agregar", nombre de 22 px sin alto mínimo.
  - **Ofertas** en banda roja con tarjetas de una sola superficie (sin el triple marco), sin la "a" colgando, y el descuento solo si el precio real es menor.
  - **"Lo mejor" → "Nuestros favoritos"**: escenario fijo de 3 productos sobre negro (sin carrusel automático).
  - **Inspírate** pasa a claro, texto debajo de la foto (sin problemas de contraste), en tipo oración.
  - **Compra con confianza**: franja compacta al final, sin textos entre corchetes (enlaza a las páginas de condiciones); WhatsApp solo si hay número.
  - **Botón flotante de WhatsApp** oculto hasta tener número.
  - **Página de categoría**: píldoras de subcategoría que filtran con `?sub=` (mapa provisional `PRODUCT_SUBCATEGORIES` hasta F4; los enlaces del megamenú y la campaña ahora sí filtran), contador como `h2`, estados vacíos con salida y "Reintentar" en errores.
  - Sin etiquetas sobre los títulos ("NUEVO", "SONIDO"), un solo estilo de enlace secundario (`linkClass`), `text-wrap: pretty` en párrafos, selección de texto en rojo, navbar translúcida al 85 %, footer con envíos y garantía en Soporte.
  - **Fotos**: regla de dirección de arte (una foto editorial por página); fuera la foto con apps de India del hero, la del "Gandhi Jayanti" del banner de Celulares y el JBL del banner de Sonido; en el seed, Celular Pro 5G y Celular Lite intercambian foto. Siguen fotos con marcas (Canon, Apple, Samsung, Sony…): se reemplazan por fotos propias en F8.
- Borrado: `components/home/BestOfSection.jsx` y el modo autoplay de `ProductRail` (ya no lo usa nadie).
- Detector de Impeccable al final: solo queda `overused-font` (Inter es la fuente de marca). Verificado en navegador a 390/1024/1440 px sin desbordes ni errores; check, tests (6 + 32) y build en verde.
- Pendiente: "Solo disponibles" (stock, F4); decidir si `.impeccable/` va a git.

### 2026-10-25 · Impeccable reemplaza a UI UX Pro Max

- Pedido del usuario: desinstalado el plugin UI UX Pro Max (alcance de proyecto), quitado su marketplace y borrada su caché local (24 MB). Instalado **Impeccable 4.7.1** con alcance de proyecto (`.claude/settings.json`). Se activa al reiniciar la sesión de Claude Code.
- ADR 0012 aceptado: Impeccable en lugar de UI UX Pro Max (0009 queda reemplazado en esa parte). CHECKPOINTS.md pide `/impeccable audit` en las pantallas tocadas; las reglas de calidad de docs/diseno.md se mantienen. Las entradas anteriores de esta bitácora quedan como historial.

### 2026-10-25 · Cortes nítidos como iPhone y tarjetas como antes

- Se probó (a pedido del usuario) fundir las fotos con el fondo en todas las secciones y un degradado entre las bandas blancas y negras; el usuario lo descartó. Se volvió a cortes nítidos entre secciones como apple.com y a las tarjetas redondeadas anteriores (producto, ofertas, Lo mejor, Inspírate). Hero, campaña y banner de categoría siguen sin bordes, fundidos con su sección.
- Borrado lo que ya no se usa: `useImageEdgeColor`, `lib/edgeColor` (y su test), las utilidades `fade-edges`/`band-dark` y la variante de botón `light`. Check, tests (6 + 28) y build en verde; sin desbordes a 360–1440 px.

### 2026-10-25 · Hero sin bordes otra vez

- El usuario prefirió el hero anterior sin bordes: se restauró la foto de borde a borde fundida con el fondo, con acercamiento lento de la foto al pasar el cursor. Campaña y banner de categoría siguen como paneles que crecen completos. Verificado a 390/1024/1440 px sin desbordes.

### 2026-10-25 · Imágenes fijas: crece el panel completo, no solo la foto

- Pedido del usuario: la animación debía mover el marco junto con la foto. Hero, campaña y banner de categoría pasaron a paneles redondeados con margen; al pasar el cursor crece el panel entero (2 %, con sombra). Verificado en navegador: escala 1.02 en el panel, sin choques con texto/flechas/líneas a 768–1440 px, sin desbordes (también en móvil).

### 2026-10-25 · Animaciones más suaves y zoom lento en imágenes fijas

- Pedido del usuario: animación de tarjetas más suave (4 px en vez de 6, 500 ms, curva `ease-out-soft`); imágenes fijas (hero, campaña, banner de categoría) con acercamiento lento del 3 % en 1,4 s al pasar el cursor. Verificado en navegador.
- Pregunta del usuario sobre poner todas las categorías dentro del inicio: se recomendó **mantener las páginas de categoría** (catálogos grandes con filtros, posicionamiento en buscadores y enlaces desde anuncios, navegación y botón atrás) y, si se quiere más presencia en el inicio, agregar una franja corta por categoría (3–4 productos + "Ver todo"). **Pendiente de decisión del usuario.**
- Fondo: se confirmó que el fondo general es gris claro `#F5F5F7`; se ofreció `#EEEEF1` si lo quiere más marcado.

### 2026-10-25 · Más profundidad: fondo gris claro y tarjetas blancas

- Pedido del usuario ("la página se ve plana"): fondo general gris claro, tarjetas blancas con escala de sombras única (`shadow-card`, `shadow-card-hover`), franjas blancas en hero y beneficios, aplicado también a categoría, producto, carrito, pedidos, admin y skeletons. Carriles con margen vertical para no recortar la sombra. Verificado en navegador sin desbordes ni errores.

### 2026-10-25 · Tarjetas con movimiento, ofertas estilo Samsung, ritmo de colores y WhatsApp flotante

Hecho (pedidos del usuario):

- Tarjetas: se levantan con sombra al pasar el cursor en lugar de hacer zoom a la foto (producto, ofertas, Lo mejor, Inspírate).
- Logos de Nequi y Bancolombia corregidos: ahora son los reales (Wikimedia Commons; Bancolombia actual en dominio público, Nequi CC BY-SA 4.0 con atribución en `frontend/public/payments/README.md`). SVG revisados: sin scripts ni recursos externos.
- Ofertas rehechas al estilo de la referencia de Samsung (claro, pestañas centradas, tarjeta gris con panel interior, texto debajo).
- Ritmo de colores: "Lo mejor" (negro) sube antes de Ofertas, Beneficios pasa a gris claro con tarjetas blancas y la Campaña a blanco, para que las dos bandas oscuras nunca queden juntas.
- Botón flotante de WhatsApp abajo a la derecha (`WhatsAppFloat`), "próximamente" mientras no haya número. Nueva feature `whatsapp-flotante` (pendiente del número para pasar).
- Verificado en navegador: la tarjeta sube 6 px al pasar el cursor, botón flotante en su lugar (56 px, a 28 px de los bordes), sin desbordes ni errores. Tests y lint en verde.

### 2026-10-25 · Logos a color en el footer y navbar translúcida

- Footer: medios de pago y redes con **logos a color** (pedido del usuario). Visa, Instagram, WhatsApp, Facebook y TikTok con marcas oficiales de Simple Icons (CC0, solo los trazos necesarios en `lib/brandIcons.js`, sin instalar la librería); Mastercard con su símbolo. **PSE, Nequi y Bancolombia: insignias provisionales** (no hay vector libre); reemplazar por los logos oficiales del kit de Wompi en F6. El hover de redes ya no pinta de rojo (escondía el logo de Instagram).
- Navbar translúcida al hacer scroll como Huawei (`hooks/useScrolled.js`): sólida arriba, blanca 75 % con desenfoque al bajar, sólida con el megamenú abierto. Verificado en navegador (escritorio y móvil) y sin desbordes a 390/1024/1440 px.

### 2026-10-25 · Footer: medios de pago y redes

- A pedido del usuario: fila con medios de pago a la izquierda (etiquetas de texto, sin logos de marcas hasta tener los recursos oficiales de Wompi; lista por confirmar en F6) y redes a la derecha; apilados en móvil. Verificado a 390/1024/1440 px sin desbordes.

### 2026-10-25 · Íconos de redes, carruseles automáticos y pulido con UI UX Pro Max

Hecho:

- Footer: los 4 íconos de redes (Instagram, WhatsApp, Facebook, TikTok) se ven siempre, a pedido del usuario. Sin URL configurada se muestran sin enlace y se anuncian como "próximamente" (sin enlaces muertos); con URL pasan a ser enlaces solos.
- Carruseles (pedido del usuario: "deben moverse solos y con botones"): el hero ya no se pausa con el mouse encima (por eso el usuario no lo veía moverse) y sigue avanzando con "reducir movimiento" (solo pierde la animación); se pausa con su botón o al navegar con teclado. "Lo mejor de cada categoría" ahora también avanza solo (`ProductRail` con `autoPlay`: cada 5 s, vuelve al inicio, espera tras una interacción manual, botón de pausa). "Lo esencial" queda manual. Cambio de requisito reflejado en `carrusel-banner` y `carrusel-oscuro` de feature_list.json.
- UI UX Pro Max (sin coincidencias en su base para tienda/carrusel; se usaron sus reglas generales): títulos balanceados, botones con respuesta al presionar, entrada suave de menús/búsqueda/modales, sin categoría repetida en las tarjetas de una misma categoría.
- Verificado en navegador: hero avanza con el mouse encima y con reducir movimiento, flechas en ambos sentidos, "Lo mejor" avanza y se pausa, íconos visibles, sin desbordes (360/1024/1440) ni errores. 34 tests, lint en verde.

### 2026-10-25 · Secciones del inicio, plantilla de categoría, búsqueda y redes

Hecho:

- **Inicio como se acordó en el lienzo**: hero carrusel estilo Xiaomi (flechas, avance cada 6 s, líneas de progreso, pausa, se detiene con el mouse y con reducir movimiento, deslizable en móvil; lógica en `lib/carousel.js` con tests), Lo esencial (7 accesos + carril de tarjetas), Ofertas en grafito con pestañas, Lo mejor de cada categoría (carril oscuro con fotos a sangre), Compra con confianza, campaña de Sonido e Inspírate. Componentes en `frontend/src/components/home/`.
- **Plantilla de categoría** `/categoria/:slug` para las 6 categorías: banner claro u oscuro con foto, migas de pan, orden por precio y grilla. Subcategorías y "solo disponibles" esperan F4.
- **Búsqueda (lupa)** en la navbar: panel accesible, sin tildes, nombre primero (`lib/search.js` con tests). Aspecto provisional.
- **Redes en el footer** (pedido del usuario): fila "Síguenos" con Instagram, WhatsApp, Facebook y TikTok; solo se muestran las configuradas (`lib/social.js` con tests; variables nuevas en `.env.example`, `Dockerfile` y `docker-compose.yml`). Verificado con URLs de ejemplo en una instancia temporal.
- **Datos**: seed nuevo con 23 productos de las 6 categorías en español y en COP; los 18 productos de la plantilla quedaron ocultos (no borrados). Fotos de desarrollo de Unsplash en `frontend/public/demo/` con README de licencia: **reemplazar antes de producción**.
- **COP**: `formatPrice` en `es-CO` sin decimales y `discountPercent`, con tests; admin y pedidos sin `usd` fijo.
- **Bug encontrado al verificar**: las tarjetas tenían un texto para lectores de pantalla con posición absoluta que escapaba de los carriles y agrandaba la página (1847 px de ancho a 1440). Se corrigió con `relative` en la tarjeta y el carril. También se ajustó la navbar móvil a 360 px tras agregar la lupa.
- Verificado en navegador: sin desbordes a 360–1440 px, sin errores de consola, carrusel, carriles, pestañas, orden y búsqueda. Pasan en feature_list.json: `carrusel-banner`, `accesos-categoria`, `carrusel-productos`, `seccion-inspirate`, `beneficios`.
- 31 tests, lint y build en verde.

Pendiente / notas:

- El texto entre corchetes de Envíos y Garantía es visible en la tienda: hay que reemplazarlo con las condiciones reales antes de publicar.

### 2026-10-25 · F2 verificada en navegador + revisión UI UX Pro Max

Hecho:

- El usuario entregó las claves de desarrollo; se guardaron en `backend/.env` y `frontend/.env.local` (ignorados por git). La BD activa es la de Docker; Neon queda comentada para no tocarla con cambios de esquema. No se copiaron las claves de Stream (ya eliminado).
- Verificación en navegador con `playwright-core` + Edge (script en el scratchpad de la sesión, no en el repo): megamenú (hover, foco, Esc), menú móvil (acordeón, bloqueo de scroll, Esc), footer en acordeón, sin desbordes a 360–1440 px, sin errores de consola.
- UI UX Pro Max (leída desde el plugin instalado): se descartó su paleta y tipografía automáticas por chocar con la marca decidida; se aplicaron su lista previa a la entrega y sus reglas de UX. Correcciones: navbar se desbordaba 5 px a 1024 px; barra superior vacía sin sesión; íconos repetidos en el megamenú; accesos en móvil en grilla en vez de fila deslizable; precios desalineados con nombres de 2 líneas; cursor de mano y `prefers-reduced-motion` globales; `overscroll-contain` en el panel móvil.
- `colores-sin-daisyui` pasa en feature_list.json. El resto de features de F2 esperan búsqueda, número de WhatsApp y prueba de marca de agua.
- CHECKPOINTS.md incluye ahora la lista de UI UX Pro Max y los anchos 375/768/1024/1440.

Notas:

- Las claves se compartieron por chat: conviene rotar la contraseña de Neon y el secreto de Clerk antes de producción (F8).

### 2026-10-25 · F2 programada

Hecho:

- DaisyUI desinstalado; tokens en `frontend/src/index.css` (incluye `graphite`, `brand-soft`, `success`/`warning`), utilidad `skeleton` y fuente Inter. CSS final: 26 KB.
- Nuevos: `lib/ui.js` (clases de botón/inputs, con test), `lib/categories.js` (6 categorías provisionales + páginas informativas, con test; se reemplaza por la API en F4), `Container`, `Modal` accesible, `OrderStatusBadge` (Pagado/Pendiente/Fallido), `ProductCard` mínima, `PlaceholderPage` (categoría provisional, información y 404).
- Navbar y Footer reescritos según docs/diseno.md (megamenú con hover y teclado; móvil estilo Samsung con acordeón; footer de 3 columnas con acordeón móvil).
- Todas las pantallas reescritas en tema claro y en español (se adelantó la parte de textos de F3). Fechas con `es-CO`.
- Eliminados: `HomeHero`, `TrustStrip`, `CatalogProductCard`, `public/icons.svg` (resto de Vite). Favicon nuevo. Carrito guardado como `tecnosoftware-cart` (se pierde el carrito local anterior).
- Lint: se evitó `setState` dentro de `useEffect` en la navbar (regla `react-hooks/set-state-in-effect`).
- Verificado: `npm run check`, `npm test` (16 tests) y build. **No verificado en navegador** (Clerk sin claves).

### 2026-10-25 · ADR 0011 y arranque de F2

- ADR 0011 aceptado: categorías y subcategorías en tablas editables desde el admin (banner, textos, tema), para cambiar imágenes sin desplegar.
- El usuario seguirá ajustando el diseño más adelante; por ahora se programa F2 con lo decidido.
- F2 incluye pasar a tema claro todas las pantallas que hoy están en tema oscuro (DaisyUI `forest`).

### 2026-10-25 · Diseño de F2 completo en el lienzo

Hecho:

- El usuario aprobó la tarjeta de producto mínima y pidió seguir.
- A pedido del usuario: **sin celulares plegables** (se quitaron del megamenú, menú móvil, filtros, productos, ofertas y "Lo mejor"; reemplazados por "Celular Ultra"), y navbar móvil estilo Samsung con el menú en el extremo derecho.
- La pantalla de categoría pasó a ser **una plantilla única para las 6 categorías** (los enlaces de la navbar cambian de categoría en el lienzo): cada una aporta banner, tema claro/oscuro, subcategorías y productos. Pendiente para F4: ADR sobre dónde guardar esos datos (constantes o tabla `categories`).
- Página de categoría rehecha con el estilo nuevo: banner negro con foto a sangre, subcategorías, orden y "solo disponibles", grilla de tarjetas mínimas con fotos (los agotados se ven atenuados con "Agotado") y footer completo.
- Nueva mesa "Inicio · móvil (página completa)" (390 px): hero con foto y líneas de progreso, filas deslizables, ofertas en grafito, beneficios en lista, campaña, Inspírate apilado y footer en acordeón. Reglas del móvil en docs/diseno.md.
- Las 5 mesas del lienzo quedan como referencia visual de F2: inicio escritorio, categoría, menú móvil, inicio móvil (más la mesa vacía que creó el editor en "Page 2").

Siguiente:

- Programar F2 en el código: quitar DaisyUI, tokens de color, marca, navbar con megamenú y acordeón móvil, footer. Las secciones del inicio y la página de categoría son F7 (necesitan datos de F4).

### 2026-10-25 · Diseño de inicio v4 (crítica de diseño aplicada)

Hecho:

- El usuario compartió una crítica de diseño: demasiado blanco seguido, secciones con la misma estructura y placeholders que hacen ver la tienda como maqueta. Se aplicó completa.
- 22 fotos provisionales de Unsplash (licencia Unsplash, revisadas una por una; se descartaron 4) subidas al lienzo: producto en fondo claro, producto en fondo oscuro y estilo de vida.
- Nueva distribución con una función por sección (tabla en docs/diseno.md): hero claro dividido con foto; tarjetas de "Lo esencial" alineadas y con foto; **ofertas en grafito** (`#1C1C1E`); "Lo mejor" con fotos a sangre; beneficios más legibles ("Compra con confianza"); campaña de Sonido a media pantalla con foto; "Inspírate" asimétrico con fotos. Menos espacio vertical. Megamenú con fotos.
- Nuevos tokens `graphite` y `graphite-card` en docs/diseno.md.
- Hero rehecho al estilo Xiaomi a pedido del usuario: flechas laterales discretas, avance automático y líneas de progreso que se llenan en rojo; se quitaron las pestañas con texto. Se conservó un botón de pausa pequeño por accesibilidad.
- Tarjeta de producto simplificada (referencias Apple y Xiaomi que mandó el usuario): foto, etiqueta, nombre, frase, "Desde $", "Comprar" + "Más información ›". Sin colores, capacidades ni descuentos (van en la página de producto y en ofertas). Actualizadas `tarjeta-producto` y `variantes-producto` en feature_list.json.

Pendiente / notas:

- Las fotos de Unsplash son solo para el diseño; en la tienda van las del catálogo propio. Algunas muestran marcas (Apple, Samsung, Canon, JBL): no usarlas en producción.
- Categoría y móvil aún sin fotos (siguiente iteración si el usuario aprueba el inicio).

### 2026-10-25 · Diseño de inicio v3

Hecho:

- A pedido del usuario: "Explora por categoría" → **"Ofertas por tiempo limitado"** (referencia Samsung: pestañas + 4 tarjetas); bloque negro de Televisores → **"Inspírate"**, sección editorial oscura de 3 tarjetas sin precios (referencia Logitech); sin precios en el carrusel oscuro; **Beneficios** sube a la mitad de la página (antes quedaba pegado al footer).
- El hero sí era un carrusel, pero no se notaba: ahora avanza solo cada 6 s y tiene pestañas con el nombre de cada producto, pausa al pasar el mouse y botón de pausa/reanudar.
- feature_list.json: `seccion-categorias` reemplazada por `ofertas-tiempo-limitado` (cambio de requisito del usuario); actualizadas `carrusel-banner` y `carrusel-oscuro`; nueva `seccion-inspirate`.

### 2026-10-25 · Diseño de inicio v2 + categoría Sonido

Hecho:

- El usuario aprobó la dirección del inicio en escritorio y pidió: categoría **Sonido** (audífonos, parlantes, barras de sonido), página más larga, accesos por categoría más anchos, sección de categorías, carrusel oscuro con un producto por categoría y sección de Beneficios (referencia: Samsung).
- Lienzo actualizado: 7 accesos a todo el ancho; nuevas secciones "Explora por categoría", "Lo mejor de cada categoría" (carrusel oscuro) y "Beneficios"; Sonido en navbar, megamenú, móvil, categoría y footer. Los audífonos salieron de Accesorios y Wearables y ahora están en Sonido.
- Por cambio de requisito del usuario se actualizaron en feature_list.json las features que listaban 5 categorías (`categorias-fijas`, `navbar-escritorio`, `navbar-movil-acordeon`, `accesos-categoria`, `pagina-categoria`) y se agregaron `seccion-categorias`, `carrusel-oscuro` y `beneficios`.

Pendiente / notas:

- Beneficios: las condiciones de envío y garantía quedaron como marcadores; el usuario debe definirlas antes de publicarlas.

### 2026-10-25 · Harness completo + diseño de F2

Hecho:

- Plugins instalados con alcance de proyecto (`.claude/settings.json` → `enabledPlugins` + `extraKnownMarketplaces`): Superpowers y UI UX Pro Max. Revisados: UI UX Pro Max solo trae 7 skills (sin hooks, MCP ni comandos); Superpowers trae un hook SessionStart propio.
- Playwright MCP en `.mcp.json` (paso 9 de la guía); se activa al reiniciar la sesión.
- Skill `registrar-decision` en `.claude/skills/` y subagente `code-reviewer` (solo lectura) en `.claude/agents/` (pasos 7 y 8).
- Servidores de desarrollo: backend en :3001 y Vite en :5173, abiertos en el navegador. El contenedor `app` se detuvo para liberar el puerto; `db` sigue en Docker.
- Diseño de F2 en Claude Design con 3 mesas interactivas: inicio en escritorio (megamenú al pasar el cursor, carrusel principal, accesos por categoría que cambian el carrusel de productos, tarjetas estilo Samsung, bloque negro, footer de 3 columnas), página de categoría (subcategorías, orden, "solo disponibles", "Agotado") y móvil (navbar comprimida y acordeón).

Pendiente / notas:

- Estado de la guía: falta `gh auth login` (interactivo, lo hace el usuario). El sandbox no existe en Windows nativo (solo macOS, Linux o WSL2). El plugin de code intelligence para TypeScript queda opcional.
- La tienda en :5173 no carga sin claves reales de Clerk.

### 2026-10-25 · F1 Limpieza

Hecho:

- Cierre de F1: el usuario delegó la elección de auth e imágenes → ADR 0004 aceptado con Better Auth y 0007 con ImageKit; 0009 aceptado (Superpowers + UI UX Pro Max, sin OpenSpec).

- ADR 0010 aceptado: variantes de color y capacidad con precio y stock por variante (tabla `product_variants` en F4).
- **Stream eliminado** (ADR 0008). Borrados: `lib/stream.ts`, `streamController.ts`, `streamRouter.ts`, los handlers `createStreamChannel` y `createVideoInvite`, `OrderChatPage`, `OrderVideoPage`, sus hooks y skeletons, y las variables `STREAM_*`. Desinstalados `stream-chat`, `stream-chat-react` y `@stream-io/video-react-sdk` (219 paquetes menos).
- Detalle del pedido sin pestañas: botón "Escríbenos por WhatsApp" (`frontend/src/lib/whatsapp.js`, con test) que usa `VITE_WHATSAPP_NUMBER`. Los textos que prometían chat y video ahora hablan de WhatsApp (ya en español).
- Borrados `SentryDemoPage` (`/demo-sentry`) y el cron de keep-alive (dependencia `cron` desinstalada).
- Sentry: 10% de trazas en producción, `sendDefaultPii: false`, replay solo en sesiones con error y con el enmascarado por defecto (antes grababa todo lo que se escribía, incluidas futuras contraseñas). Quitado `@sentry/profiling-node`.
- **Bug**: el `Dockerfile` arrancaba sin `--import ./dist/instrument.js`, así que Sentry nunca se iniciaba en producción. Corregido también el script `start`.
- **Bug**: el build de Docker solo recibía la clave de Clerk; `VITE_IMAGEKIT_URL_ENDPOINT` y `VITE_SENTRY_DSN` llegaban vacías. Ahora el `Dockerfile` declara todos los `ARG` públicos y docker-compose los pasa desde `backend/.env`. Nuevo `frontend/.env.example`.
- `OrdersPage.tsx` → `.jsx`. Rutas con `lazy()`: carga inicial 2.6 MB → 628 KB (195 KB comprimido).
- Verificado: `npm run check`, `npm test` (11 tests), `npm run build` y contenedor con `/health` OK.

Pendiente / notas:

- El README todavía menciona Stream; se reescribe en F8.
- La carga inicial sigue siendo pesada por Clerk y Sentry; Clerk sale en F5.

### 2026-10-25 · F0 Docker verificado + nuevos requisitos de diseño

Hecho:

- Docker Desktop encendido; `db` (PostgreSQL 16) arriba y sano; esquema creado con `drizzle-kit push` y seed cargado (18 productos, categorías viejas).
- La imagen de producción construye bien. Se creó `backend/.env` desde la plantilla, con valores de relleno.
- **Bug**: `SENTRY_DSN=` vacío hacía fallar la validación de `env.ts` y el servidor no arrancaba. Ahora vacío = desactivado (test en `env.test.ts`).
- `/health` se movió antes de `clerkMiddleware` para que el healthcheck de Railway no dependa de Clerk. Responde `{"ok":true}` en el contenedor.
- ADR 0008 aceptado: soporte por WhatsApp; se quitan Stream Chat y Video en F1.
- Nuevos requisitos registrados en docs/diseno.md, roadmap y feature_list.json: accesos por categoría estilo Samsung, megamenú al pasar el cursor, footer de 3 columnas, carruseles estilo Apple/Samsung, tarjeta de producto estilo Samsung (precio anterior, % OFF) y una página por categoría (`/categoria/:slug`) en lugar de todo el catálogo en el inicio.

Pendiente / notas:

- Las demás rutas responden 500 porque las claves de Clerk son de relleno (esperado).
- Decidir si habrá variantes (color/capacidad) con stock por variante: cambia el modelo de datos de F4.

### 2026-10-25 · F0 Harness y base técnica

Hecho:

- Adaptada la guía de harness (docs/referencias/guia-harness.md) al proyecto: CLAUDE.md, docs/ (visión, arquitectura, diseño, roadmap, testing, ADRs 0001–0009), feature_list.json y CHECKPOINTS.md.
- `.claude/settings.json`: permisos allow/ask/deny y 4 hooks en `.claude/hooks/` (bloqueo de comandos destructivos, Prettier al editar, tests en Stop, contexto en SessionStart). Adaptados a Windows con Git Bash: se invocan con `bash`, limpian `\r` de jq y convierten rutas con `\`.
- Vitest 5 en backend y frontend con primeros tests (`roles.test.ts`, `format.test.js`). El build del backend usa `tsconfig.build.json` para no meter tests en `dist/`.
- `package.json` raíz con `check`, `test`, `build`, `dev:*`, `db:*`; `init.sh`; CI en `.github/workflows/ci.yml`.
- `docker-compose.yml`: PostgreSQL 16 local + app con la imagen de producción. `backend/.env.example` actualizado para que coincida con `env.ts` y apunte a la BD local.
- Lint del frontend en verde: imports sin usar en `App.jsx`, asignación inútil en `imagekitUrl.js` y **bug**: `AdminProductsPage` usaba `<Navigate>` sin importarlo (fallaba al entrar a `/admin` sin ser admin).
- Marca de agua de ImageKit cambiada de "Northwind" a "TecnoSoftware" (`frontend/src/lib/imagekitUrl.js`).

Pendiente / notas:

- No se pudo probar `docker compose up` porque Docker Desktop estaba apagado.
- El footer aún dice "Northwind Supply" y la navbar "Ecommerce": se cambian en F2.
- El bundle del frontend pesa ~2.6 MB (Stream + Sentry + Clerk); se revisa en F1.

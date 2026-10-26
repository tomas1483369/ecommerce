# Roadmap

Migración gradual. Cada fase termina con la tienda funcionando, `npm run check` y `npm test` en verde, y con commit propio. El detalle verificable de cada feature está en `feature_list.json`.

Estado: ⬜ pendiente · 🟨 en curso · ✅ hecha

## F0 · Harness y base técnica ✅

- [x] CLAUDE.md, docs/, ADRs, feature_list.json, CHECKPOINTS.md
- [x] `.claude/settings.json` con permisos y hooks (bloqueo, formato, tests en Stop, contexto en SessionStart)
- [x] Vitest en backend y frontend, scripts raíz (`check`, `test`, `build`), `init.sh`, CI en GitHub Actions
- [x] `docker-compose.yml` con PostgreSQL local y la app completa
- [x] Lint del frontend en verde (incluye el bug de `Navigate` sin importar en `/admin`)
- [x] Imagen Docker construye, BD local con esquema y seed, `/health` responde en el contenedor
- [ ] La tienda carga en http://localhost:3001 (requiere claves reales de Clerk hasta F5)

**Hecho cuando**: `./init.sh` termina en "OK" y la app arranca con Docker.

## F1 · Limpieza y decisiones pendientes ✅

- [x] ADR 0004 (Better Auth), 0007 (ImageKit), 0008 (WhatsApp), 0009 (Superpowers + UI UX Pro Max) y 0010 (variantes) aceptados.
- [x] Eliminar `SentryDemoPage` y su ruta `/demo-sentry`.
- [x] Eliminar el cron de keep-alive (`backend/src/lib/cron.ts`).
- [x] Sentry: muestreo bajo, sin datos personales, replay enmascarado y solo con error; `instrument.js` ahora sí se carga en producción.
- [x] Pasar `OrdersPage.tsx` a `.jsx`.
- [x] Quitar Stream Chat y Video; botón de WhatsApp en el detalle del pedido.
- [x] Partir el bundle con `lazy()` por ruta (2.6 MB → 628 KB la carga inicial).
**Hecho cuando**: no queda código muerto conocido y las decisiones están en estado Aceptada o Rechazada.

## F2 · Sistema de diseño y navbar 🟨

- [x] DaisyUI eliminado; tokens de color y tipografía (Inter) en `index.css`; helpers `buttonClass`, `inputClass`, `labelClass` en `src/lib/ui.js`.
- [x] Marca TecnoSoftware: logo de texto, título y descripción del HTML, favicon, footer, nombre del carrito guardado.
- [x] Navbar: barra superior, categorías y megamenú al pasar el cursor (cierre con retardo de 150 ms, teclado y Esc).
- [x] Navbar móvil estilo Samsung (logo a la izquierda, menú al extremo derecho) con panel en acordeón, bloqueo de scroll, foco atrapado y Esc.
- [x] Footer de 3 columnas con acordeón en móvil.
- [x] Todas las pantallas pasadas a tema claro y textos en español: inicio provisional, producto, carrito, carrito vacío, retorno del pago, pedidos, detalle y resumen de pedido, admin (con `Modal` propio), skeletons, errores.
- [x] Rutas `/categoria/:slug` y `/informacion/:slug` provisionales y página 404 en español.
- [x] Verificado en navegador (Edge sin interfaz, 360/375/768/1024/1280/1440 px): megamenú con hover, teclado y Esc; menú móvil con acordeón, bloqueo de scroll y Esc; footer en acordeón; sin scroll horizontal; sin errores en consola.
- [x] Revisión con UI UX Pro Max: cursor de mano, `prefers-reduced-motion`, `overscroll-contain` en el panel móvil, navbar compacta entre 1024 y 1279 px (antes se desbordaba 5 px), un ícono por subcategoría en el megamenú, accesos de categoría en fila deslizable en móvil, nombres de producto con alto fijo de 2 líneas.
- [ ] Pendiente para cerrar sus features: ícono de **búsqueda** (requiere la búsqueda, F7), número de **WhatsApp** de la tienda (`VITE_WHATSAPP_NUMBER`) y comprobar la **marca de agua** con una imagen subida a ImageKit.

Notas: el ícono de búsqueda no se puso porque la tienda aún no tiene búsqueda (se agrega con la búsqueda, F7). El megamenú usa íconos; las fotos llegan con las categorías editables (F4, ADR 0011). Precios aún en el formato anterior (COP en F3).

**Hecho cuando**: no hay clases de DaisyUI (✅) y navbar, footer y marca pasan sus pasos de feature_list.json en el navegador.

## F3 · Español y pesos colombianos 🟨

- ~~Todos los textos de la interfaz en español~~ (adelantado en F2; revisar textos que vengan del backend, p. ej. mensajes de error de la API).
- [x] `formatPrice` con `es-CO` y COP sin decimales (con test); seed y admin en `cop`.
- [ ] Valor por defecto `cop` en el esquema de BD (con los cambios de tablas de F4) y en el checkout (F6, Wompi).
- `<html lang="es">`.

**Hecho cuando**: no hay textos en inglés visibles y todos los precios se ven como `$ 1.299.900`.

## F4 · Catálogo: categorías y stock ⬜

- Categorías fijas: Celulares, Accesorios, Wearables, Televisores, Sonido, Cámaras (solo de seguridad) (constante compartida + validación zod). Las subcategorías y el mapa provisional `PRODUCT_SUBCATEGORIES` pasan a la BD.
- Tablas `categories` y `subcategories` editables desde el admin (banner: foto, título, frase, tema claro/oscuro) y `products.category_id` / `subcategory_id` (ADR 0011). API `GET /api/categories`.
- Variantes de color y capacidad con precio, precio anterior y stock propios (ADR 0010); tabla `product_variants`.
- Admin: lista de variantes editable por producto; "Agotado" en tienda; no se puede añadir al carrito más de lo disponible.
- Validar stock al crear el checkout y descontarlo al confirmar el pago (de forma atómica, por variante).
- Etiqueta opcional del producto ("Nuevo", "Descuento especial") y marca de "destacado".
- Nuevo seed con productos de las 6 categorías.

## F5 · Autenticación propia ⬜

- Registro, inicio y cierre de sesión con email y contraseña (ADR 0004).
- Sesiones en PostgreSQL con cookie httpOnly; roles `customer`, `support`, `admin`.
- Rutas protegidas en API y frontend; script para crear el primer admin.
- Eliminar Clerk: SDKs, webhook, `clerk_user_id`, variables de entorno.

## F6 · Pagos con Wompi ⬜

- Checkout con Web Checkout de Wompi y firma de integridad (ADR 0003).
- Webhook de eventos con verificación de checksum; idempotente.
- Página de retorno que consulta el estado real de la transacción.
- Descuento de stock al aprobarse el pago.
- Eliminar Polar.

## F7 · Inicio, carruseles y páginas por categoría 🟨

- Página por categoría en `/categoria/:slug` con banner, orden y grilla; el catálogo completo sale de la página de inicio.
- Inicio (orden en docs/diseno.md): hero escenario → "Lo esencial" → "Ofertas por tiempo limitado" (banda roja) → campaña → "Nuestros favoritos" (banda negra) → "Inspírate" (editorial claro) → "Compra con confianza" → footer.
- Tarjeta de producto mínima (toda la tarjeta abre el producto, una sola acción "Agregar"); descuentos solo en Ofertas.
- Carruseles sin librería, accesibles y respetando `prefers-reduced-motion`.

**Adelantado (2026-10-25)**, con contenido provisional en `frontend/src/content/home.js` y fotos de desarrollo en `frontend/public/demo/`: hero carrusel estilo Xiaomi, Lo esencial, Ofertas (grafito), Lo mejor de cada categoría, Compra con confianza, campaña de Sonido, Inspírate, plantilla `/categoria/:slug` (banner, orden por precio) y búsqueda (lupa) sobre el catálogo cargado.

**Rediseño tras la crítica de Impeccable (2026-10-25, 23/40)**: composición y escala propias por sección, presupuesto de color (un negro, un rojo), hero escenario, filas a sangre, ofertas en banda roja, favoritos como escenario negro, Inspírate claro, confianza al final; píldoras de subcategoría que filtran con un mapa provisional; regla de dirección de arte para fotos.

**Falta**: que banners, ofertas y destacados se editen desde el admin; pasar las subcategorías a la BD y agregar "solo disponibles" (F4); diseño visual de la búsqueda; reemplazar las fotos de desarrollo (varias con marcas, F8).

## F8 · Despliegue en Railway ⬜

- Migraciones versionadas con Drizzle y migración al arrancar.
- Servicio en Railway desde el Dockerfile + PostgreSQL de Railway; healthcheck `/health`.
- Webhooks de Wompi apuntando al dominio de Railway.
- Retirar Render y Neon; actualizar README.

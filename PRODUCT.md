# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hogares en Colombia (respuesta del usuario, 2026-10-25): personas que compran tecnología para su casa desde el celular o el computador: celular, televisor, audífonos y parlantes, reloj inteligente, accesorios y cámaras de seguridad para el hogar. Pagan con los medios habituales en Colombia y consultan sus pedidos. Pequeños negocios compran también (cámaras, accesorios), pero no son el foco.

Otras audiencias confirmadas (docs/vision.md): el administrador de la tienda (productos, imágenes, precios, stock) y soporte por WhatsApp.

## Product Purpose

TecnoSoftware es una tienda online de tecnología para Colombia en seis categorías: Celulares, Accesorios (cargadores, cables, TV box, memorias, discos duros, estuches, soportes, power banks), Wearables, Televisores, Sonido y Cámaras (solo cámaras de seguridad). Éxito: que un hogar encuentre el equipo que necesita, entienda el precio y compre sin dudas.

## Positioning

Lo que el usuario confirmó como diferencia frente a Alkosto, Falabella o la tienda oficial de una marca:

- **Asesoría cercana**: ayudan a elegir y responden por WhatsApp antes y después de la compra (ADR 0008).
- **Precio y facilidad de pago**: buenos precios y medios de pago colombianos (tarjeta, PSE, Nequi, Botón Bancolombia, vía Wompi, ADR 0003).

Pendiente de confirmar (no afirmar en la interfaz hasta entonces): cuotas, pago contraentrega, tiempos y costos de envío por ciudad, garantía en meses.

## Operating Context

Compra en línea en español de Colombia, precios en COP (ADR 0006). El cliente llega desde el celular la mayoría de las veces. Soporte humano por WhatsApp con el número del pedido. Pagos con Wompi (F6) y autenticación propia (F5); hoy la autenticación es Clerk de forma provisional.

## Capabilities and Constraints

- Catálogo de unos 30 productos de prueba; categorías y subcategorías pasan a datos editables en F4 (ADR 0011), con variantes (color/capacidad) y stock por variante (ADR 0010).
- Monolito React + Express + PostgreSQL en un contenedor (ADR 0001), despliegue en Railway (ADR 0002). Bajo costo y pocas APIs de terceros.
- Sin datos aún de: especificaciones técnicas, precio anterior real de las ofertas, fechas de vigencia, stock, condiciones de envío y garantía.

## Brand Commitments

- Nombre: TecnoSoftware (hoy como logotipo de texto; no hay logo gráfico).
- Colores fijados por el usuario: rojo `#E30613`, negro y blanco. Tipografía: Inter.
- Referencias que el usuario eligió: tienda de Samsung Colombia, apple.com, Xiaomi y Huawei.
- Fotos de catálogo con el producto sobre el mismo color de fondo que la tarjeta (recortadas sobre blanco); el usuario lo pidió expresamente.
- Todo texto en español de Colombia; sin etiquetas pequeñas sobre los títulos.

## Evidence on Hand

- Fotos: hoy solo de prueba (Unsplash y Wikimedia Commons, `frontend/public/demo/README.md`); el usuario va a tener fotos propias de los productos.
- No hay reseñas, testimonios, cifras de clientes, premios ni prensa: **no inventarlos**.
- No hay logo gráfico.

## Product Principles

1. Que el cliente entienda qué compra y cuánto paga sin buscar: precio claro y una acción visible.
2. Cercanía antes que catálogo infinito: la asesoría por WhatsApp es parte de la propuesta, no un pie de página.
3. Medios de pago colombianos a la vista donde se decide la compra.
4. Ninguna promesa sin respaldo: nada de descuentos, plazos o garantías que la tienda no pueda sostener.
5. Primero el celular: la mayoría compra desde el teléfono.

## Accessibility & Inclusion

WCAG 2.2 AA como piso (contraste, foco visible, teclado, `prefers-reduced-motion`), ya aplicado en CHECKPOINTS.md.

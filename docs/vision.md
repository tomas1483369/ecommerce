# Visión

## Qué es

**TecnoSoftware** es una tienda online de tecnología para clientes en Colombia. Vende seis categorías:

1. Celulares
2. Accesorios (cargadores, cables, TV box, memorias, discos duros, estuches, soportes, power banks)
3. Wearables
4. Televisores
5. Sonido (audífonos, parlantes, barras de sonido)
6. Cámaras: **solo cámaras de seguridad** (interior, exterior, Wi-Fi y kits de vigilancia)

Precios en pesos colombianos (COP), pagos con Wompi y toda la interfaz en español.

## Para quién

- **Clientes**: compran desde el celular o el computador, pagan con los medios habituales en Colombia (tarjeta, PSE, Nequi, Bancolombia) y consultan el estado de sus pedidos.
- **Administrador**: gestiona productos, imágenes, precios y stock desde un panel propio.
- **Soporte**: atiende dudas sobre pedidos por WhatsApp (ADR 0008).

## Apariencia

Inspirada en las tiendas de Samsung, Apple y Xiaomi: fondo principal blanco, secciones de ancho completo que alternan blanco y negro, fotografía de producto grande y mucho espacio. Colores de marca: **rojo, negro y blanco**. Detalle en docs/diseno.md.

## Principios

- **Barato de operar**: un solo contenedor en Railway con su PostgreSQL. Cada servicio externo debe justificar su costo.
- **Pocas dependencias de APIs de terceros**: la autenticación es propia; solo se usan servicios externos donde no tiene sentido hacerlo en casa (pagos, imágenes).
- **Cambio gradual**: cada fase deja la tienda funcionando.

## Qué NO es (por ahora)

- No es un marketplace con varios vendedores.
- No maneja envíos ni cálculo de fletes automático.
- No tiene app móvil nativa.
- No factura electrónicamente ante la DIAN (se evaluará más adelante).

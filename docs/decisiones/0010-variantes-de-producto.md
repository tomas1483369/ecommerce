# 0010. Variantes de producto (color y capacidad) con precio y stock propios
Estado: Aceptada (2026-10-25)

## Contexto
Las tarjetas de referencia (samsung.com/co) permiten elegir color y capacidad, y cada combinación tiene su precio y su disponibilidad. Hoy `products` tiene un solo precio y no tiene stock.

## Decisión
Nueva tabla `product_variants`; el producto queda como "ficha" y lo que se vende es la variante.

- `products`: `id`, `slug`, `name`, `category`, `description`, `image_url` (imagen por defecto), `label` ("Nuevo", "Descuento especial"), `featured`, `active`.
- `product_variants`: `id`, `product_id`, `sku` (único), `color_name`, `color_hex`, `storage` (texto, p. ej. "256 GB", opcional), `price_cents`, `compare_at_price_cents` (opcional, para "% OFF"), `stock` (entero ≥ 0), `image_url` (opcional, foto de ese color), `active`.
- Un producto sin opciones (un cable) tiene **una** variante por defecto, sin color ni capacidad. Así el carrito, el checkout y el stock siempre trabajan con variantes, sin casos especiales.
- Carrito, `checkout_sessions.lines` y `order_items` guardan `variant_id`. `order_items` guarda además una copia del nombre y la etiqueta de la variante ("Galaxy S26 · Negro · 256 GB") para que el pedido no cambie si luego se edita el producto.
- La tarjeta muestra el precio de la variante elegida (por defecto, la primera con stock). El producto está "Agotado" cuando ninguna de sus variantes tiene stock.

## Alternativas descartadas
- Un producto por combinación: duplica fichas, descripciones e imágenes, y la tarjeta no puede mostrar el selector.
- Variantes en JSON dentro de `products`: no se puede descontar stock de forma atómica ni referenciarlas desde los pedidos.

## Consecuencias
- F4 incluye migrar `price_cents` a las variantes y reescribir el formulario del admin (lista de variantes editable).
- El descuento de stock (F6) se hace por variante: `UPDATE product_variants SET stock = stock - q WHERE id = ? AND stock >= q`.

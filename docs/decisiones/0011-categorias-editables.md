# 0011. Categorías editables desde el admin
Estado: Aceptada (2026-10-25)

## Contexto
Cada una de las 6 categorías tiene su página con la misma plantilla (docs/diseno.md), pero con datos propios: banner (foto, título, frase, tema claro u oscuro) y subcategorías. El usuario quiere poder cambiar imágenes y banners sin tocar código.

## Decisión
Tabla `categories` en PostgreSQL, editable desde el panel de admin:

- `categories`: `id`, `slug` (único: `celulares`, `accesorios`, `wearables`, `televisores`, `sonido`, `camaras`), `name`, `description`, `banner_image_url`, `banner_image_file_id` (ImageKit, para borrar), `banner_theme` (`dark` | `light`), `sort_order`, `active`.
- `subcategories`: `id`, `category_id`, `slug`, `name`, `sort_order`.
- `products.category` pasa a `products.category_id` (FK) y se agrega `products.subcategory_id` (FK, opcional).
- El seed crea las 6 categorías con sus subcategorías iniciales. El admin edita textos, banner y subcategorías; crear o borrar categorías queda fuera por ahora (el conjunto de 6 es fijo, ver docs/vision.md).
- La API pública expone `GET /api/categories` y `GET /api/categories/:slug` (con subcategorías); el frontend no tiene la lista de categorías fija en el código salvo como respaldo de navegación.

## Alternativas descartadas
- Constantes en el código: más simple, pero cada cambio de imagen o texto requiere un despliegue.
- Un JSON de configuración en la BD: no permite claves foráneas desde productos ni validar subcategorías.

## Consecuencias
- Se implementa en F4 junto con variantes (ADR 0010) y stock.
- La navbar, el megamenú y el footer leen las categorías de la API (con caché de TanStack Query); en F2 usan una lista provisional en el frontend que se reemplaza en F4.
- Las imágenes de banner se suben con el mismo flujo de ImageKit que las de productos (ADR 0007).

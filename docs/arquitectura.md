# Arquitectura

## Vista general

Un solo proceso Node sirve la API y la SPA ya compilada:

```text
Navegador ──► Express (backend/dist/index.js, puerto $PORT)
               ├── /api/*        API JSON (routes → controllers → Drizzle → PostgreSQL)
               ├── /webhooks/*   Webhooks con cuerpo crudo (sin express.json)
               ├── /health       Healthcheck
               └── /*            Archivos de ./public (build de Vite) con fallback a index.html
```

El `Dockerfile` de la raíz tiene tres etapas: build del frontend → build del backend → imagen final solo con dependencias de producción. `VITE_API_URL` va vacío para que el navegador llame a `/api` en el mismo dominio.

## Estado actual → estado objetivo

| Pieza | Hoy | Objetivo | Fase (roadmap) |
| --- | --- | --- | --- |
| Hosting | Render (el cron de keep-alive ya se quitó en F1) | Railway | F8 |
| Base de datos | Neon | PostgreSQL de Railway (red privada) | F8 |
| Esquema de BD | `drizzle-kit push` | Migraciones versionadas (`drizzle-kit generate` + migrar al arrancar) | F8 |
| Autenticación | Clerk (SDK + webhook que sincroniza usuarios) | Propia, sesiones en PostgreSQL con cookie httpOnly (ADR 0004) | F5 |
| Pagos | Polar (USD, un producto con precio dinámico) | Wompi (COP, Web Checkout + eventos firmados) (ADR 0003) | F6 |
| Estilos | Tailwind 4 + DaisyUI (tema `forest`) | Tailwind 4 con tokens propios rojo/negro/blanco (ADR 0005) | F2 |
| Idioma / moneda | Inglés / USD | Español / COP (ADR 0006) | F3 |
| Imágenes | ImageKit | ImageKit (ADR 0007) | — |
| Soporte | ✅ Enlace de WhatsApp en el detalle del pedido (ADR 0008); Stream eliminado | — | F1 |
| Monitoreo | ✅ Sentry opcional: 10% de trazas en producción, replay solo con error y con enmascarado | — | F1 |
| Catálogo | Categorías libres (Audio, Workspace…), sin stock | 6 categorías en tabla editable (ADR 0011) + variantes con stock (ADR 0010) | F4 |

## Backend (`backend/src`)

- `index.ts`: arma Express. Los webhooks se registran **antes** de `express.json()` porque necesitan el cuerpo crudo para verificar la firma.
- `routes/*Router.ts`: solo asocian rutas con controladores.
- `controllers/*Controller.ts`: validación zod, autorización y acceso a datos.
- `db/schema.ts`: tablas `users`, `products`, `checkout_sessions`, `orders`, `order_items`. Montos en enteros (`*_cents`).
- `lib/env.ts`: valida todas las variables de entorno con zod al arrancar; si falta una, el proceso no inicia.
- `lib/roles.ts`: roles `customer`, `support`, `admin`.

**Flujo de compra actual**: el carrito (Zustand, en el navegador) se envía a `POST /api/checkout` → se recalculan precios en servidor → se guarda un `checkout_session` → se crea el checkout en Polar → el webhook `order.paid` convierte la sesión en `order` + `order_items` dentro de una transacción. Este patrón (sesión → webhook → orden) se conserva con Wompi.

## Frontend (`frontend/src`)

- `main.jsx`: providers (Clerk, TanStack Query, Router, Sentry).
- `App.jsx`: rutas. Las rutas protegidas redirigen a `/` si no hay sesión.
- `pages/*` + `hooks/use<Page>.js`: la página solo pinta; el hook trae y muta datos.
- `lib/api.js`: `apiFetch`, que añade el token y reporta errores a Sentry.
- `store/cart.js`: carrito persistido en el navegador.

## Entorno local

- `docker-compose.yml`: servicio `db` (PostgreSQL 16) y servicio `app` (la misma imagen que producción).
- Desarrollo diario: solo `db` en Docker y backend/frontend con recarga en caliente (`npm run dev:*`).

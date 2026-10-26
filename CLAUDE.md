# TecnoSoftware (ecommerce)

Tienda online de tecnología para Colombia: celulares, accesorios, wearables, televisores, sonido y cámaras de seguridad.
Monolito: SPA React (Vite) servida por una API Express + PostgreSQL, en un solo contenedor Docker.
El proyecto está en **migración gradual** desde una plantilla en inglés (Clerk, Polar, DaisyUI, USD).
El estado de cada pieza está en docs/roadmap.md; no asumas que algo ya migró.

## Comandos (desde la raíz)

- Preparar y verificar todo: `./init.sh` (instala dependencias, typecheck, lint y tests)
- Verificación rápida: `npm run check` (typecheck backend + lint frontend)
- Tests: `npm test` (Vitest en backend y frontend, modo `run`)
- Build completo: `npm run build`
- Desarrollo: `docker compose up -d db` y luego `npm run dev:backend` / `npm run dev:frontend`
- App completa en Docker: `docker compose up --build` → http://localhost:3001
- Esquema de BD: `npm --prefix backend run db:push` (Drizzle; aún sin migraciones versionadas)

## Estructura

- `backend/src/` → `routes/` (solo enrutan) → `controllers/` (lógica + validación zod) → `db/schema.ts` (Drizzle)
- `backend/src/lib/` integraciones (env, imagekit, polar) · `webhooks/` (clerk, polar)
- Variables públicas del frontend (`VITE_*`): `frontend/.env.example`; en Docker/Railway entran como `ARG` del `Dockerfile`.
- `frontend/src/` → `pages/` usan un hook `hooks/use<Page>.js` para datos (TanStack Query); `components/`, `store/` (Zustand)
- `frontend/src/content/home.js`: contenido provisional del inicio (banners, ofertas, campañas); `frontend/src/lib/categories.js`: las 6 categorías. Ambos pasan a datos editables desde el admin en F4/F7 (ADR 0011).
- Un archivo `*.test.ts|js` junto al código que prueba.

## Reglas

- Todo texto visible para el usuario va en **español** (Colombia). Código, nombres de variables y commits: inglés.
- Moneda: **COP**. Los montos se guardan como enteros en centavos (`*_cents`), igual que `amount_in_cents` de Wompi. Formatear siempre con `formatPrice` de `frontend/src/utils/format.js`.
- Variables de entorno: toda variable nueva se valida en `backend/src/lib/env.ts` y se documenta en `backend/.env.example`. Nunca pongas secretos en variables `VITE_*`.
- Valida la entrada con zod en los controladores. Las rutas no tienen lógica.
- Estilos: Tailwind con los tokens de docs/diseno.md. **No uses clases de DaisyUI en código nuevo** (`btn`, `card`, `badge`…); se están eliminando.
- Antes de agregar una dependencia o un servicio externo, revisa docs/decisiones/. El objetivo es bajo costo y pocas APIs de terceros.
- Se permite borrar código y archivos obsoletos; menciónalo en docs/progreso.md.
- No toques `package-lock.json` a mano; usa `npm install` dentro de `backend/` o `frontend/`.

## Terminado = `npm run check` y `npm test` en verde, más `npm run build` si cambiaste dependencias o configuración. Si hay UI, verifícala en el navegador.

## Documentación (obligatorio)

- Al iniciar una sesión, lee docs/progreso.md y docs/roadmap.md.
- Antes de proponer cambios de arquitectura o de servicios, revisa docs/decisiones/.
- Decisión técnica importante → ADR nuevo en docs/decisiones/ (formato de 0001). Los ADR no se borran: se reemplazan por uno nuevo.
- Al terminar una tarea: entrada nueva en docs/progreso.md, actualiza docs/roadmap.md y cambia solo `passes` en feature_list.json (nunca borres ni edites features).
- Antes de dar algo por terminado, compáralo con CHECKPOINTS.md.
- Tests: sigue docs/testing.md. UI: sigue docs/diseno.md.

## Más contexto (léelo cuando lo necesites)

- Visión del producto: docs/vision.md
- Arquitectura actual y objetivo: docs/arquitectura.md
- Sistema de diseño (colores, navbar, secciones): docs/diseno.md
- Guía de harness original: docs/referencias/guia-harness.md

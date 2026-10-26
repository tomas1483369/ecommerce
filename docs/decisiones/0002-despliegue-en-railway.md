# 0002. Despliegue en Railway con su PostgreSQL
Estado: Aceptada (2026-10-25). Reemplaza el despliegue en Render + Neon.

## Contexto
Hoy la app corre en Render (plan gratuito que se duerme; por eso existe el cron de keep-alive en `backend/src/lib/cron.ts`) y la base de datos en Neon. Se busca un despliegue económico y simple.

## Decisión
Desplegar el `Dockerfile` en Railway y usar el PostgreSQL de Railway en el mismo proyecto (red privada, sin latencia entre proveedores). Railway inyecta `PORT`, que `env.ts` ya lee. Healthcheck en `/health`.

## Alternativas descartadas
- Seguir en Render gratis: se duerme, el primer request es lento y hace falta el cron.
- Railway + Neon gratis: posible para ahorrar, pero son dos proveedores y la BD queda fuera de la red privada. Se puede retomar si el costo de la BD en Railway molesta.

## Consecuencias
- El plan Hobby de Railway tiene una cuota mensual con uso incluido (verificar el precio vigente en railway.com/pricing); el costo real depende de la RAM y CPU consumidas.
- Se elimina el cron de keep-alive (F1).
- Pasar de `drizzle-kit push` a migraciones versionadas antes de producción (F8).

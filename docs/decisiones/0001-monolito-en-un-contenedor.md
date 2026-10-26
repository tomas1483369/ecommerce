# 0001. Monolito en un solo contenedor Docker
Estado: Aceptada (2026-10-25)

## Contexto
El proyecto ya compila la SPA de Vite y la API Express en una sola imagen (`Dockerfile` de la raíz). El objetivo es desplegar barato y poder levantarlo todo localmente con Docker.

## Decisión
Mantener el monolito: Express sirve `/api`, `/webhooks` y los archivos estáticos del frontend desde el mismo origen. Localmente se usa `docker-compose.yml` con PostgreSQL 16 y la misma imagen de producción.

## Alternativas descartadas
- Frontend en un hosting estático aparte: dos despliegues, CORS y cookies entre dominios (complica la auth propia del ADR 0004).

## Consecuencias
- Mismo origen: las cookies de sesión pueden ser `SameSite=Lax` sin configuración extra.
- Un solo servicio que pagar en Railway.

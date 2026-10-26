# Testing

## Herramientas

| Tipo | Herramienta | Dónde | Comando |
| --- | --- | --- | --- |
| Unitarios backend | Vitest | `backend/src/**/*.test.ts` | `npm --prefix backend test` |
| Unitarios frontend | Vitest | `frontend/src/**/*.test.js` | `npm --prefix frontend test` |
| Tipos backend | `tsc --noEmit` | — | `npm --prefix backend run typecheck` |
| Lint frontend | ESLint | — | `npm --prefix frontend run lint` |
| Todo | — | — | `npm run check && npm test` |
| Punta a punta | Playwright (pendiente, se añade en F2) | `e2e/` | — |

Usa siempre `vitest run` (sin modo vigilancia): el hook `Stop` lo ejecuta en cada respuesta con cambios.

## Qué se prueba primero

Prioridad por riesgo de dinero o seguridad:

1. **Pagos (F6)**: firma de integridad de Wompi, verificación del checksum del webhook, idempotencia (el mismo evento dos veces no crea dos órdenes), montos en centavos.
2. **Stock (F4)**: no vender más de lo disponible; el descuento es atómico; un pago rechazado no descuenta.
3. **Auth (F5)**: hash de contraseñas, sesión expirada o revocada, autorización por rol en rutas de admin.
4. **Formato (F3)**: `formatPrice` en COP.
5. **UI (F2)**: navbar — megamenú con teclado, acordeón móvil — con Playwright.

## Convenciones

- El test va junto al archivo: `checkoutController.ts` → `checkoutController.test.ts`.
- Extrae la lógica pura (calcular totales, firmar, verificar checksum, validar stock) a funciones en `lib/` para probarla sin base de datos ni red.
- No llames a servicios reales (Wompi, ImageKit) en tests: usa datos fijos.
- Nombres de tests en inglés, descriptivos del comportamiento.
- Revisa tú mismo los tests de pagos, stock y auth: un test escrito por la IA puede probar lo que el código hace en vez de lo que debería hacer.

## Pendiente

- Tests de integración de la API contra un PostgreSQL de prueba (docker compose) cuando llegue F4.
- Playwright + Playwright MCP para verificar la UI en navegador (F2).

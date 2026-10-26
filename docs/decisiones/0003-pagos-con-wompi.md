# 0003. Pagos con Wompi
Estado: Aceptada (2026-10-25). Reemplaza Polar.

## Contexto
La tienda vende en Colombia y en COP. Polar está pensado para productos digitales en USD y obliga a usar un "producto" con precio dinámico. Wompi (Bancolombia) acepta tarjetas, PSE, Nequi y botón Bancolombia, y no tiene costo fijo mensual: cobra comisión por transacción (verificar tarifa vigente).

## Decisión
Usar el **Web Checkout** de Wompi (redirección), conservando el patrón actual `checkout_session` → webhook → `order`:

1. `POST /api/checkout` recalcula precios y stock, crea el `checkout_session` y devuelve la URL de `https://checkout.wompi.co/p/` con `public-key`, `currency=COP`, `amount-in-cents`, `reference` (id de la sesión), `redirect-url` y `signature:integrity`.
2. Firma de integridad: SHA-256 de `reference + amountInCents + currency + secreto_de_integridad`, calculada en el servidor.
3. Webhook `POST /webhooks/wompi`, evento `transaction.updated`: verificar `signature.checksum` (SHA-256 de los valores de `signature.properties` concatenados + `timestamp` + secreto de eventos). Si `status = APPROVED`, crear la orden y descontar stock en una transacción; idempotente por id de transacción.
4. La página de retorno consulta el estado al backend; nunca confía en los parámetros de la URL.

Verificar estos detalles contra la documentación oficial (docs.wompi.co) al implementar F6.

## Alternativas descartadas
- Mercado Pago: comisiones similares, menos medios colombianos integrados de serie.
- ePayco / PayU: integración más antigua y documentación menos clara.

## Consecuencias
- Variables nuevas: `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET`, `WOMPI_ENV` (sandbox/producción).
- Las columnas `polar_*` se renombran a `payment_reference` / `payment_transaction_id`.

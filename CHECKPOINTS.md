# Checkpoints

Criterios concretos de "terminado". Quien revise (persona o subagente) compara contra esta lista, no contra su opinión.

## Siempre

- [ ] `npm run check` y `npm test` en verde (pegar la salida como evidencia).
- [ ] `npm run build` en verde si cambiaron dependencias, configuración o el Dockerfile.
- [ ] Ningún secreto en el diff ni en variables `VITE_*`.
- [ ] Variables de entorno nuevas validadas en `backend/src/lib/env.ts` y documentadas en `backend/.env.example`.
- [ ] docs/progreso.md con una entrada nueva; docs/roadmap.md actualizado; en feature_list.json solo cambió `passes`.
- [ ] Si se tomó una decisión de arquitectura o de servicio: ADR nuevo en docs/decisiones/.

## Si hay interfaz

- [ ] Textos en español, precios con `formatPrice` (COP).
- [ ] Solo tokens de docs/diseno.md; ninguna clase de DaisyUI nueva.
- [ ] Respeta el diseño aprobado en el lienzo de Claude Design (enlace en docs/diseno.md).
- [ ] Verificado en navegador a 375, 768, 1024 y 1440 px (y 360 px en móvil), sin scroll horizontal.
- [ ] Navegable con teclado (Tab, Enter, Esc) y con foco visible.
- [ ] Revisión con `/impeccable audit` en las pantallas tocadas (ADR 0012).
- [ ] Lista de calidad de interfaz: íconos SVG (nunca emoji); cursor de mano en todo lo clicable; hover con transición de 150–300 ms; contraste de texto ≥ 4.5:1; `prefers-reduced-motion` respetado; objetivos táctiles ≥ 44 px en móvil (mínimo 24 px en web); nada importante depende solo del hover.

## Si toca la base de datos

- [ ] El esquema en `backend/src/db/schema.ts` coincide con lo que usa el código.
- [ ] Desde F8: hay una migración generada con `drizzle-kit generate` y versionada.
- [ ] El seed sigue funcionando.

## Si toca pagos, stock o auth

- [ ] Tests unitarios del caso feliz **y** de los casos de error (firma inválida, evento repetido, stock insuficiente, sesión inválida, rol sin permiso).
- [ ] El servidor recalcula precios y stock; nunca confía en montos que envía el navegador.
- [ ] Operaciones de dinero y stock dentro de una transacción de BD.

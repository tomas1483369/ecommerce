---
name: registrar-decision
description: Crea un ADR numerado en docs/decisiones/ con el formato del proyecto. Úsala cuando el usuario diga "registra esta decisión", cuando se elija o descarte una librería, servicio o patrón de arquitectura, o cuando una decisión anterior se reemplace.
---

1. Lista `docs/decisiones/` y toma el número siguiente al mayor (4 dígitos: `0011`).
2. Nombre del archivo: `NNNN-titulo-en-minusculas-con-guiones.md` (en español, sin tildes).
3. Usa exactamente este formato:

   ```markdown
   # NNNN. Título
   Estado: Aceptada (AAAA-MM-DD)

   ## Contexto
   Qué problema había y qué restricciones aplican (costo, pocas APIs externas, Colombia/COP).

   ## Decisión
   Qué se hará, en concreto (librerías, tablas, variables de entorno).

   ## Alternativas descartadas
   - Opción: por qué no.

   ## Consecuencias
   Qué cambia, qué se elimina, qué fase del roadmap lo implementa.
   ```

4. Si el usuario aún no la aprobó, usa `Estado: **Propuesta** (fecha), esperando confirmación del usuario.` y pregúntale.
5. Si reemplaza a otro ADR: no borres el viejo; cambia su estado a `Reemplazada por NNNN (fecha)` y en el nuevo escribe `Reemplaza NNNN.`
6. Si afecta la tabla "Estado actual → objetivo" de docs/arquitectura.md o una fase de docs/roadmap.md, actualízalas.
7. Agrega una línea en la entrada del día de docs/progreso.md: `ADR NNNN aceptado/propuesto: resumen`.

# 0009. Skills y flujo de trabajo con Claude Code
Estado: Aceptada (2026-10-25). La parte de UI UX Pro Max fue reemplazada por 0012 (2026-10-25).

## Contexto
El usuario consideró Superpowers, grill-me, OpenSpec y UI UX Pro Max. La guía de harness recomienda empezar con lo mínimo y no combinar dos sistemas de especificación.

## Decisión
- **Superpowers**: flujo principal (brainstorm → plan → TDD → revisión). Sus specs y planes quedan en `docs/superpowers/`.
- **UI UX Pro Max**: solo en las fases de interfaz (F2, F3, F7), para paleta, tipografía y patrones de layout. Lo que decida se vuelca en docs/diseno.md.
- **grill-me**: opcional, solo en las fases con decisiones grandes (F5 auth, F6 pagos), antes del brainstorm.
- **OpenSpec: no por ahora.** Se solapa con las specs y planes de Superpowers; usar los dos duplica documentos y confunde al agente.
- **Playwright MCP** a partir de F2, para que Claude verifique la navbar y las páginas en un navegador real.

## Consecuencias
- Cada skill nueva se agrega solo cuando resuelva un problema concreto (guía, paso 11).

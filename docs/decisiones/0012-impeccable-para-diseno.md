# 0012. Impeccable en lugar de UI UX Pro Max
Estado: Aceptada (2026-10-25)

Reemplaza la parte de UI UX Pro Max de 0009.

## Contexto
UI UX Pro Max se usó en F2 y F7, pero aportó poco: su base no tenía coincidencias para tienda ni carruseles, y su paleta y tipografía automáticas (dorado, Cormorant) chocaban con la marca ya decidida. El usuario pidió quitarla y usar Impeccable.

## Decisión
- Plugin **Impeccable** (pbakaus/impeccable, Apache 2.0) con alcance de proyecto: `enabledPlugins` + `extraKnownMarketplaces` en `.claude/settings.json`.
- Una skill, `/impeccable <comando>`. Para este proyecto sirven sobre todo `audit` y `critique` (revisar una pantalla), `polish` y `animate` (pulir), y `document` (generar `DESIGN.md` desde el código).
- La marca (rojo/negro/blanco, Inter) y docs/diseno.md siguen mandando; lo que Impeccable proponga y el usuario apruebe se vuelca allí.
- Las reglas de calidad que ya estaban en docs/diseno.md y CHECKPOINTS.md se mantienen: son buenas prácticas, no dependen de la skill.

## Alternativas descartadas
- Seguir con UI UX Pro Max: su base de datos no cubre e-commerce y sus sugerencias de marca no aplicaban.
- Usar ambas: se solapan y duplicarían criterios de diseño.

## Consecuencias
- Impeccable instala hooks propios (al iniciar sesión, después de cada edición y al terminar) que ejecutan un binario descargado de los releases de GitHub del proyecto y verificado con SHA256. Corren junto a los hooks del proyecto.
- Si se usa `/impeccable init` o `document`, crearán `PRODUCT.md` y `DESIGN.md`; deben quedar alineados con docs/vision.md y docs/diseno.md (que siguen siendo la fuente principal).
- Se eliminaron el plugin, su marketplace y su caché local.

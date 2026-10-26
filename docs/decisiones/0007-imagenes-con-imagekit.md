# 0007. Mantener ImageKit para imágenes
Estado: Aceptada (2026-10-25). El usuario delegó la elección.

## Contexto
Se preguntó si conviene ImageKit o Cloudinary. ImageKit ya está integrado: subida firmada desde el admin (`backend/src/lib/imagekit.ts`, `frontend/src/lib/imagekitUpload.js`), borrado por `fileId`, transformaciones por URL (`frontend/src/lib/imagekitUrl.js`) y marca de agua de texto.

## Decisión
Mantener ImageKit.

## Comparación

| | ImageKit | Cloudinary |
| --- | --- | --- |
| Plan gratuito | Cuota mensual de ancho de banda y almacenamiento | "Créditos" compartidos entre almacenamiento, ancho de banda y transformaciones |
| Transformaciones por URL | Sí | Sí, con más opciones avanzadas (IA, video) |
| Esfuerzo en este proyecto | Ninguno, ya funciona | Reescribir subida, URLs, borrado y marca de agua |

Para un catálogo de decenas o pocos cientos de productos, los dos planes gratuitos alcanzan (verificar cuotas vigentes en sus páginas de precios). Cloudinary solo compensaría si se necesitara video de producto o edición con IA.

## Consecuencias
- No hay trabajo de migración. Se conserva la marca de agua "TecnoSoftware".

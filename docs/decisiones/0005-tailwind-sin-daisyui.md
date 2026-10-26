# 0005. Tailwind puro, sin DaisyUI
Estado: Aceptada (2026-10-25)

## Contexto
El frontend usa DaisyUI con el tema `forest` (19 archivos con clases como `btn`, `card`, `badge`, `navbar`). La apariencia objetivo (Samsung/Apple: blanco y negro con acento rojo, botones píldora, mucho espacio) choca con el estilo propio de DaisyUI y obligaría a pelear contra sus valores por defecto.

## Decisión
Eliminar DaisyUI y usar Tailwind 4 con tokens propios definidos con `@theme` en `index.css` (docs/diseno.md). Los pocos componentes repetidos (botón, tarjeta, insignia, modal) se escriben como componentes React propios.

## Alternativas descartadas
- Mantener DaisyUI con un tema personalizado: sigue imponiendo radios, sombras y estructura que no se parecen a la referencia.
- shadcn/ui: buena opción, pero suma Radix y un sistema de variantes que el proyecto aún no necesita. Se puede reconsiderar si aparecen componentes complejos (diálogos, menús accesibles).

## Consecuencias
- Hay que reescribir los componentes existentes (fase F2).
- La accesibilidad del megamenú, el acordeón y los modales se implementa a mano (docs/diseno.md, sección Accesibilidad).

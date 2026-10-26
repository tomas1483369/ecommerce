# 0006. Interfaz en español y precios en pesos colombianos
Estado: Aceptada (2026-10-25)

## Contexto
La tienda es para Colombia. Hoy todo está en inglés y en USD.

## Decisión
- Textos visibles en español de Colombia (`es-CO`); código y commits en inglés.
- Moneda única COP. Los montos se siguen guardando como **enteros en centavos** (`price_cents`, `total_cents`): coincide con `amount_in_cents` de Wompi y evita cambiar la semántica de las columnas. $1.299.900 COP = `129990000`.
- `formatPrice` usa `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
- Sin librería de i18n: hay un solo idioma, los textos van directamente en los componentes.

## Alternativas descartadas
- Guardar pesos enteros: obligaría a multiplicar por 100 en cada llamada a Wompi y a cambiar todas las columnas.
- react-i18next: innecesario con un solo idioma.

## Consecuencias
- La columna `currency` queda redundante; se mantiene con valor `cop` por si algún día se vende en otra moneda.

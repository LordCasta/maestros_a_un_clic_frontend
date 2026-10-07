/**
 * Colores de diseño para código JavaScript: librerías que reciben colores como string
 * (mapas, gráficas, canvas). Así usan la misma paleta que Tailwind sin escribir hex,
 * que la guarda de colores rechaza.
 *
 *   new Chart(ctx, { data: { datasets: [{ backgroundColor: tokenColor('primary-600') }] } })
 *
 * Lee la variable CSS del token (src/app/main.css usa `@theme static` para que existan todas).
 */

type Scale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
type Family = 'primary' | 'neutral' | 'success' | 'danger' | 'warning' | 'info'

export type ColorToken =
  | `${Family}-${Scale}`
  | 'canvas'
  | 'surface'
  | 'surface-muted'
  | 'white'
  | 'black'

export function tokenColor(token: ColorToken): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${token}`)
    .trim()

  if (!value) {
    throw new Error(`El token de color "${token}" no existe en src/app/main.css.`)
  }

  return value
}

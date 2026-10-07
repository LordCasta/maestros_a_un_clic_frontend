/**
 * Tests de la guarda de colores. Si cambias scripts/check-design-tokens.mjs y alguno de estos
 * casos deja de fallar, la regla se aflojó. Este archivo está protegido (AGENTS.md § Guardas).
 */
import { describe, expect, it } from 'vitest'

import { checkSource } from '../check-design-tokens.mjs'

const errorsOf = (source, file) => checkSource(source, file).errors.map((error) => error.text)

describe('guarda de colores: permite los tokens', () => {
  it('acepta clases con tokens, opacidades y sombras oficiales', () => {
    const source =
      '<div class="bg-primary-600 text-neutral-900 border-danger-200 bg-white/10 bg-surface-muted shadow-card hover:shadow-raised" />'
    expect(errorsOf(source)).toEqual([])
  })

  it('acepta variables CSS, currentColor y anclas que no son colores', () => {
    const source = [
      '<svg><path fill="currentColor" stroke="currentColor" /></svg>',
      '<p :style="{ color: `var(--color-primary-600)` }" />',
      '<a href="#booking" />',
      '<style>.x { color: var(--color-neutral-700); }</style>',
    ].join('\n')
    expect(errorsOf(source)).toEqual([])
  })
})

describe('guarda de colores: rechaza colores fuera de los tokens', () => {
  it.each([
    ['paleta de Tailwind', '<p class="text-gray-500" />'],
    ['paleta de Tailwind con variante', '<p class="hover:bg-blue-600/50" />'],
    ['hex arbitrario', '<p class="bg-[#2563EB]" />'],
    [
      'rgba dentro de una sombra arbitraria',
      '<p class="shadow-[0_30px_80px_rgba(15,23,42,0.24)]" />',
    ],
    ['hex en style', '<p style="color: #2563eb" />'],
    ['rgb en style', '<p style="background: rgb(0 0 0)" />'],
    ['hex en :style', `<p :style="{ color: '#fff' }" />`],
    ['fill fijo en SVG', '<svg><path fill="#ff0000" /></svg>'],
    ['stroke fijo en SVG', '<svg><path stroke="rgb(1,2,3)" /></svg>'],
    ['hex en un string de TS', "const color = '#2563eb'"],
    ['rgb en un string de TS', 'const color = "rgba(0, 0, 0, 0.5)"'],
    ['hex en un bloque <style>', '<style>.x { color: #123456; }</style>'],
  ])('%s', (_case, source) => {
    expect(errorsOf(source)).toHaveLength(1)
  })

  it('revisa archivos .css completos', () => {
    expect(errorsOf('.card { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }', 'x.css')).toHaveLength(1)
  })
})

describe('guarda de colores: excepciones', () => {
  it('acepta tokens-ignore con motivo en la línea anterior y lo reporta', () => {
    const source = [
      '<!-- tokens-ignore: logo de WhatsApp, colores oficiales de la marca -->',
      '<svg><path fill="#25D366" /></svg>',
    ].join('\n')
    const result = checkSource(source)
    expect(result.errors).toEqual([])
    expect(result.ignored).toHaveLength(1)
  })

  it('rechaza tokens-ignore sin motivo', () => {
    const source = '<svg><path fill="#25D366" /></svg> <!-- tokens-ignore -->'
    expect(checkSource(source).errors[0]?.message).toContain('motivo')
  })

  it('solo advierte (no falla) valores arbitrarios que no son color', () => {
    const result = checkSource('<p class="w-[74%] tracking-[0.2em] md:grid-cols-[1fr_auto]" />')
    expect(result.errors).toEqual([])
    expect(result.warnings.map((warning) => warning.text)).toEqual(['w-[74%]', 'tracking-[0.2em]'])
  })
})

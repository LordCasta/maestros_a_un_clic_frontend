/**
 * Verifica que src/ use solo los tokens de color de src/app/main.css.
 *
 * Rechaza:
 *  - Colores arbitrarios en clases: bg-[#2563EB], text-[#0F172A]…
 *  - Colores de la paleta por defecto de Tailwind (desactivada): bg-blue-600, text-gray-500…
 *  - Hex sueltos dentro de bloques <style>.
 *
 * Uso: npm run lint:tokens
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../src/', import.meta.url))
const EXTENSIONS = ['.vue', '.ts']

const UTILITIES =
  'bg|text|border|border-[trblxy]|ring|ring-offset|from|via|to|fill|stroke|outline|divide|placeholder|decoration|accent|caret|shadow'
const TAILWIND_PALETTE =
  'slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

const RULES = [
  {
    pattern: new RegExp(`\\b(?:${UTILITIES})-\\[#[0-9a-fA-F]{3,8}\\]`, 'g'),
    message: 'color hex arbitrario: usa un token (primary-600, neutral-900, surface-muted…)',
  },
  {
    pattern: new RegExp(`\\b(?:${UTILITIES})-(?:${TAILWIND_PALETTE})-\\d{2,3}\\b`, 'g'),
    message:
      'color de la paleta de Tailwind (desactivada): usa primary, neutral, success, danger, warning o info',
  },
]

const STYLE_HEX = /#[0-9a-fA-F]{3,8}\b/g

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : walk(path)
    return EXTENSIONS.some((ext) => name.endsWith(ext)) ? [path] : []
  })
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length
}

const problems = []

for (const file of walk(ROOT)) {
  const source = readFileSync(file, 'utf8')

  for (const { pattern, message } of RULES) {
    for (const match of source.matchAll(pattern)) {
      problems.push(
        `${relative(process.cwd(), file)}:${lineOf(source, match.index)}  ${match[0]}  → ${message}`,
      )
    }
  }

  for (const block of source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    for (const match of block[1].matchAll(STYLE_HEX)) {
      const index = block.index + block[0].indexOf(block[1]) + match.index
      problems.push(
        `${relative(process.cwd(), file)}:${lineOf(source, index)}  ${match[0]}  → hex en <style>: usa var(--color-…)`,
      )
    }
  }
}

if (problems.length > 0) {
  console.error(`✖ ${problems.length} uso(s) de color fuera de los tokens de diseño:\n`)
  console.error(problems.join('\n'))
  console.error('\nTokens disponibles: src/app/main.css · Guía: docs/sistema-de-diseno.md')
  process.exit(1)
}

console.log('✔ Colores: solo tokens de diseño.')

/**
 * Verificador de tokens de diseño: src/ solo puede usar los colores de src/app/main.css.
 *
 * ⚠️ GUARDA DEL PROYECTO. No la aflojes, no la saltes ni la borres para que algo pase.
 *    Si necesitas un color que no existe, agrégalo como token en main.css en un PR con la
 *    etiqueta `cambio-de-reglas` (ver AGENTS.md § Guardas y docs/sistema-de-diseno.md § 8).
 *    Sus casos están cubiertos por scripts/__tests__/check-design-tokens.spec.mjs.
 *
 * Errores (fallan el CI):
 *  - Paleta por defecto de Tailwind (desactivada): bg-blue-600, text-gray-500…
 *  - Color en valor arbitrario: bg-[#2563EB], shadow-[0_4px_8px_rgba(0,0,0,0.2)]…
 *  - Color literal en style="…", :style="…", fill/stroke/stop-color="…" o en un string ("#fff", 'rgb(0 0 0)').
 *  - Color literal en <style> o en archivos .css (salvo src/app/main.css, que define los tokens).
 *  - `tokens-ignore` sin motivo.
 * Advertencias (no fallan): valores arbitrarios que no son color (w-[74%], tracking-[0.2em]…).
 *
 * Excepción explícita, para casos reales (p. ej. un SVG de marca ajena que debe ir en línea):
 *   <!-- tokens-ignore: logo de WhatsApp, colores oficiales de la marca -->   (en la línea o la anterior)
 *   // tokens-ignore: motivo
 * Los logos y SVG con colores propios van como archivo en src/assets/brand/, que no se revisa.
 *
 * Uso: npm run lint:tokens
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const EXTENSIONS = ['.vue', '.ts', '.css']
const EXEMPT = [`app${sep}main.css`, `assets${sep}`]

const UTILITIES =
  'bg|text|border|border-[trblxyse]|ring|ring-offset|from|via|to|fill|stroke|outline|divide|placeholder|decoration|accent|caret|shadow|inset-shadow|drop-shadow'
const TAILWIND_PALETTE =
  'slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

/**
 * Literal de color: #hex o función de color con números (no var()).
 * Sin \b antes de la función: en valores arbitrarios va pegada a "_" (0_4px_8px_rgba(…)).
 */
const COLOR_LITERAL = String.raw`#[0-9a-fA-F]{3,8}\b|(?<![a-zA-Z])(?:rgba?|hsla?|oklch|oklab|lch|lab|hwb)\(\s*[\d.]`
const COLOR_LITERAL_RE = new RegExp(COLOR_LITERAL)

const IGNORE_RE = /tokens-ignore\b:?([^\n]*?)\s*(?:-->|\*\/|$)/

const ERROR_RULES = [
  {
    pattern: new RegExp(String.raw`\b(?:${UTILITIES})-(?:${TAILWIND_PALETTE})-\d{2,3}\b`, 'g'),
    message:
      'color de la paleta de Tailwind (desactivada): usa primary, neutral, success, danger, warning o info',
  },
  {
    pattern: new RegExp(
      String.raw`\b[\w:-]*-\[[^\]\s]*?(?:${COLOR_LITERAL}|color-mix\()[^\]\s]*\]`,
      'g',
    ),
    message: 'color en valor arbitrario: usa un token de color o de sombra (main.css)',
  },
  {
    pattern: new RegExp(String.raw`(?<![:\w-])style\s*=\s*"[^"]*(?:${COLOR_LITERAL})[^"]*"`, 'g'),
    message: 'color en style="…": usa clases con tokens',
  },
  {
    pattern: new RegExp(String.raw`:style\s*=\s*"[^"]*(?:${COLOR_LITERAL})[^"]*"`, 'g'),
    message: 'color en :style: usa var(--color-…) o tokenColor() de @/shared/utils/tokens',
  },
  {
    pattern:
      /\b(?:fill|stroke|stop-color|flood-color|lighting-color|color)\s*=\s*"\s*(?:#|rgba?\(|hsla?\()/g,
    message: 'color fijo en un atributo SVG: usa currentColor o mueve el SVG a src/assets/brand/',
  },
  {
    pattern: /(['"`])(?:#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?|oklch)\(\s*[\d.][^'"`]*)\1/g,
    message: 'color literal en el código: usa tokenColor() de @/shared/utils/tokens',
  },
]

const ARBITRARY_RE = /\b[\w:-]*-\[[^\]\s]+\]/g
/** Plantillas de grilla: no tienen equivalente en tokens, no se advierten. */
const ARBITRARY_ALLOWED_RE = /(?:^|:)grid-(?:cols|rows)-\[/

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length
}

/** Revisa un archivo. Exportado para los tests del verificador. */
export function checkSource(source, file = 'archivo.vue') {
  const lines = source.split('\n')
  const errors = []
  const warnings = []
  const ignored = []

  // ¿La línea (o la anterior) tiene un tokens-ignore con motivo?
  const ignoreFor = (line) => {
    for (const candidate of [lines[line - 1], lines[line - 2]]) {
      const match = candidate?.match(IGNORE_RE)
      if (match) return match[1].trim()
    }
    return null
  }

  const report = (index, text, message) => {
    const line = lineOf(source, index)
    const reason = ignoreFor(line)
    if (reason === null) errors.push({ file, line, text, message })
    else if (reason.length >= 5) ignored.push({ file, line, text, reason })
    else
      errors.push({
        file,
        line,
        text,
        message: '`tokens-ignore` necesita un motivo (al menos 5 caracteres)',
      })
  }

  // Rangos ya reportados: un mismo color detectado por dos reglas cuenta una sola vez.
  const taken = []
  const overlaps = (start, end) => taken.some(([a, b]) => start < b && end > a)
  const isCss = file.endsWith('.css')

  if (!isCss) {
    for (const { pattern, message } of ERROR_RULES) {
      for (const match of source.matchAll(pattern)) {
        const end = match.index + match[0].length
        if (overlaps(match.index, end)) continue
        taken.push([match.index, end])
        report(match.index, match[0], message)
      }
    }

    for (const match of source.matchAll(ARBITRARY_RE)) {
      if (overlaps(match.index, match.index + match[0].length)) continue
      if (COLOR_LITERAL_RE.test(match[0])) continue
      if (ARBITRARY_ALLOWED_RE.test(match[0])) continue
      warnings.push({ file, line: lineOf(source, match.index), text: match[0] })
    }
  }

  // Bloques <style> de .vue, o el archivo .css completo.
  const blocks = isCss
    ? [{ content: source, offset: 0 }]
    : [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((block) => ({
        content: block[1],
        offset: block.index + block[0].indexOf(block[1]),
      }))
  for (const { content, offset } of blocks) {
    for (const match of content.matchAll(new RegExp(COLOR_LITERAL, 'g'))) {
      report(offset + match.index, match[0], 'color literal en CSS: usa var(--color-…)')
    }
  }

  return { errors, warnings, ignored }
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : walk(path)
    return EXTENSIONS.some((ext) => name.endsWith(ext)) ? [path] : []
  })
}

function run() {
  const ROOT = fileURLToPath(new URL('../src/', import.meta.url))
  const results = walk(ROOT)
    .filter((path) => !EXEMPT.some((exempt) => relative(ROOT, path).startsWith(exempt)))
    .map((path) => checkSource(readFileSync(path, 'utf8'), relative(process.cwd(), path)))

  const errors = results.flatMap((result) => result.errors)
  const warnings = results.flatMap((result) => result.warnings)
  const ignored = results.flatMap((result) => result.ignored)

  if (warnings.length) {
    console.warn(
      `⚠ ${warnings.length} valor(es) arbitrario(s) no de color (no bloquea, pero revísalos):`,
    )
    for (const w of warnings) console.warn(`  ${w.file}:${w.line}  ${w.text}`)
    console.warn('')
  }
  if (ignored.length) {
    console.warn(`ⓘ ${ignored.length} excepción(es) con tokens-ignore:`)
    for (const i of ignored) console.warn(`  ${i.file}:${i.line}  ${i.text}  → ${i.reason}`)
    console.warn('')
  }
  if (errors.length) {
    console.error(`✖ ${errors.length} uso(s) de color fuera de los tokens de diseño:\n`)
    for (const e of errors) console.error(`  ${e.file}:${e.line}  ${e.text}  → ${e.message}`)
    console.error(
      '\nTokens: src/app/main.css · Guía: docs/sistema-de-diseno.md · No aflojes esta regla: AGENTS.md § Guardas',
    )
    process.exit(1)
  }
  console.log('✔ Colores: solo tokens de diseño.')
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) run()

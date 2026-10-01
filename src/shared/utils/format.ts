import { config } from '../config'

/**
 * Formatos de presentación. Toda fecha, precio o duración que se muestre pasa por aquí,
 * para que la app sea consistente y siempre use la hora de Colombia.
 */

const money = new Intl.NumberFormat(config.locale, {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const date = new Intl.DateTimeFormat(config.locale, {
  timeZone: config.timezone,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dateTime = new Intl.DateTimeFormat(config.locale, {
  timeZone: config.timezone,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

const time = new Intl.DateTimeFormat(config.locale, {
  timeZone: config.timezone,
  hour: 'numeric',
  minute: '2-digit',
})

const decimal = new Intl.NumberFormat(config.locale, { maximumFractionDigits: 1 })

/** 45000 → "$ 45.000" */
export function formatMoney(value: number | null | undefined): string {
  return value === null || value === undefined ? 'A convenir' : money.format(value)
}

/** ISO → "2 oct 2026" */
export function formatDate(iso: string): string {
  return date.format(new Date(iso))
}

/** ISO → "jue, 2 oct, 9:00 a. m." */
export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso))
}

/** ISO → "9:00 a. m." */
export function formatTime(iso: string): string {
  return time.format(new Date(iso))
}

/** 90 → "1 h 30 min" */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}

/** 4.85 → "4,9" */
export function formatRating(value: number): string {
  return decimal.format(value)
}

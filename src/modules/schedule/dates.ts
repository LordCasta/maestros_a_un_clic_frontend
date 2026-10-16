import { config } from '@/shared/config'

/** Fechas de la agenda, siempre en la hora de Colombia aunque el navegador esté en otra zona. */

const ONE_DAY_MS = 24 * 60 * 60 * 1000

// en-CA da el formato Y-m-d que espera la API.
const keyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: config.timezone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const weekdayFormat = new Intl.DateTimeFormat(config.locale, {
  timeZone: config.timezone,
  weekday: 'short',
})
const dayFormat = new Intl.DateTimeFormat(config.locale, {
  timeZone: config.timezone,
  day: 'numeric',
})
const monthFormat = new Intl.DateTimeFormat(config.locale, {
  timeZone: config.timezone,
  month: 'short',
})

export interface DayOption {
  /** Y-m-d */
  key: string
  weekday: string
  day: string
  month: string
}

/** Date → "2026-10-17" en la hora de Colombia. */
export function dateKey(date: Date): string {
  return keyFormat.format(date)
}

/** Los próximos `count` días desde `from` (incluido), para elegir fecha de reserva. */
export function upcomingDays(count: number, from: Date = new Date()): DayOption[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from.getTime() + index * ONE_DAY_MS)
    return {
      key: dateKey(date),
      weekday: weekdayFormat.format(date).replace('.', ''),
      day: dayFormat.format(date),
      month: monthFormat.format(date).replace('.', ''),
    }
  })
}

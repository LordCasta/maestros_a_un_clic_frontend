import { config } from '@/shared/config'

/** Rangos rápidos de fechas para los ingresos (HU037), en la hora de Colombia. */

const keyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: config.timezone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Date → "2026-10-20" en la hora de Colombia. */
export function dateKey(date: Date): string {
  return keyFormat.format(date)
}

export interface DateRange {
  from: string
  to: string
}

export type RangePreset = 'this-month' | 'last-month' | 'last-30-days' | 'this-year'

export const RANGE_PRESETS: { key: RangePreset; label: string }[] = [
  { key: 'this-month', label: 'Este mes' },
  { key: 'last-month', label: 'Mes pasado' },
  { key: 'last-30-days', label: 'Últimos 30 días' },
  { key: 'this-year', label: 'Este año' },
]

const pad = (value: number) => String(value).padStart(2, '0')

export function presetRange(preset: RangePreset, now: Date = new Date()): DateRange {
  const today = dateKey(now)
  const [year, month] = today.split('-').map(Number) as [number, number]

  switch (preset) {
    case 'this-month':
      return { from: `${year}-${pad(month)}-01`, to: today }
    case 'last-month': {
      const prevYear = month === 1 ? year - 1 : year
      const prevMonth = month === 1 ? 12 : month - 1
      const lastDay = new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate()
      return {
        from: `${prevYear}-${pad(prevMonth)}-01`,
        to: `${prevYear}-${pad(prevMonth)}-${pad(lastDay)}`,
      }
    }
    case 'last-30-days':
      return { from: dateKey(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)), to: today }
    case 'this-year':
      return { from: `${year}-01-01`, to: today }
  }
}

import type { AvailabilityRule } from '@/shared/types/models'

import type { UpdateRulesPayload } from './api'

/**
 * Horario semanal en forma editable: un día por fila, con sus franjas.
 * Las reglas de la API van de 0 (domingo) a 6 (sábado); en pantalla la semana empieza el lunes.
 */

export const WEEK = [
  { weekday: 1, label: 'Lunes' },
  { weekday: 2, label: 'Martes' },
  { weekday: 3, label: 'Miércoles' },
  { weekday: 4, label: 'Jueves' },
  { weekday: 5, label: 'Viernes' },
  { weekday: 6, label: 'Sábado' },
  { weekday: 0, label: 'Domingo' },
] as const

export const DEFAULT_RANGE = { start_time: '08:00', end_time: '17:00' }

export interface TimeRange {
  start_time: string
  end_time: string
}

export interface DayDraft {
  weekday: number
  label: string
  enabled: boolean
  ranges: TimeRange[]
}

export function toDrafts(
  rules: Pick<AvailabilityRule, 'weekday' | 'start_time' | 'end_time'>[],
): DayDraft[] {
  return WEEK.map(({ weekday, label }) => {
    const ranges = rules
      .filter((rule) => rule.weekday === weekday)
      .map(({ start_time, end_time }) => ({ start_time, end_time }))
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
    return { weekday, label, enabled: ranges.length > 0, ranges }
  })
}

/** Solo los días activos; las horas "HH:MM" se comparan bien como texto. */
export function toRules(drafts: DayDraft[]): UpdateRulesPayload['rules'] {
  return drafts
    .filter((day) => day.enabled)
    .flatMap((day) => day.ranges.map((range) => ({ weekday: day.weekday, ...range })))
    .sort((a, b) => a.weekday - b.weekday || a.start_time.localeCompare(b.start_time))
}

/**
 * Problemas que el backend también rechaza (422), para avisar antes de guardar.
 * Clave: `${weekday}-${índice de la franja}`.
 */
export function findProblems(drafts: DayDraft[]): Record<string, string> {
  const problems: Record<string, string> = {}

  for (const day of drafts.filter((draft) => draft.enabled)) {
    if (day.ranges.length === 0) {
      problems[`${day.weekday}-0`] = 'Agrega al menos una franja o desactiva el día.'
    }

    day.ranges.forEach((range, index) => {
      if (!range.start_time || !range.end_time) {
        problems[`${day.weekday}-${index}`] = 'Completa la hora de inicio y de fin.'
      } else if (range.end_time <= range.start_time) {
        problems[`${day.weekday}-${index}`] = 'La hora de fin debe ser después de la de inicio.'
      }
    })

    const sorted = day.ranges
      .map((range, index) => ({ ...range, index }))
      .filter((range) => range.start_time && range.end_time)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i]!
      if (current.start_time < sorted[i - 1]!.end_time) {
        problems[`${day.weekday}-${current.index}`] ??= 'Se cruza con otra franja del mismo día.'
      }
    }
  }

  return problems
}

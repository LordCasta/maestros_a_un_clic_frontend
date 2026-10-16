import { describe, expect, it } from 'vitest'

import { blockSchema } from '../schemas'
import { findProblems, toDrafts, toRules } from '../weekly'

const rules = [
  { weekday: 1, start_time: '14:00', end_time: '18:00' },
  { weekday: 1, start_time: '08:00', end_time: '12:00' },
  { weekday: 0, start_time: '09:00', end_time: '12:00' },
]

describe('weekly schedule', () => {
  it('shows the week starting on Monday with its ranges in order', () => {
    const drafts = toDrafts(rules)

    expect(drafts.map((day) => day.label)).toEqual([
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ])
    expect(drafts[0]).toMatchObject({
      enabled: true,
      ranges: [
        { start_time: '08:00', end_time: '12:00' },
        { start_time: '14:00', end_time: '18:00' },
      ],
    })
    expect(drafts[1]?.enabled).toBe(false)
    expect(drafts[6]?.enabled).toBe(true)
  })

  it('sends only the enabled days', () => {
    const drafts = toDrafts(rules)
    drafts[6]!.enabled = false

    expect(toRules(drafts)).toEqual([
      { weekday: 1, start_time: '08:00', end_time: '12:00' },
      { weekday: 1, start_time: '14:00', end_time: '18:00' },
    ])
  })

  it('finds ranges that end before they start or overlap', () => {
    const drafts = toDrafts([
      { weekday: 2, start_time: '08:00', end_time: '12:00' },
      { weekday: 2, start_time: '11:00', end_time: '13:00' },
      { weekday: 3, start_time: '10:00', end_time: '09:00' },
    ])

    expect(findProblems(drafts)).toEqual({
      '2-1': 'Se cruza con otra franja del mismo día.',
      '3-0': 'La hora de fin debe ser después de la de inicio.',
    })
  })

  it('asks for a range on an enabled day without any', () => {
    const drafts = toDrafts([])
    drafts[0]!.enabled = true

    expect(findProblems(drafts)).toEqual({
      '1-0': 'Agrega al menos una franja o desactiva el día.',
    })
  })
})

describe('blockSchema', () => {
  it('requires the end after the start', () => {
    const result = blockSchema.safeParse({
      date: '2026-10-20',
      start_time: '10:00',
      end_time: '09:00',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['end_time'])
  })

  it('accepts a valid block without reason', () => {
    expect(
      blockSchema.safeParse({ date: '2026-10-20', start_time: '09:00', end_time: '11:00' }).success,
    ).toBe(true)
  })
})

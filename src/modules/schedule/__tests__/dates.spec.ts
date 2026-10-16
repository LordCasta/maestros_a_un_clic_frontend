import { describe, expect, it } from 'vitest'

import { dateKey, upcomingDays } from '../dates'

describe('dates', () => {
  it('formats the day in Colombia even when it is already the next day in UTC', () => {
    // 2026-10-17 03:00 UTC = 2026-10-16 22:00 en Bogotá.
    expect(dateKey(new Date('2026-10-17T03:00:00Z'))).toBe('2026-10-16')
  })

  it('lists consecutive days starting today', () => {
    const days = upcomingDays(3, new Date('2026-10-16T15:00:00Z'))

    expect(days.map((day) => day.key)).toEqual(['2026-10-16', '2026-10-17', '2026-10-18'])
    expect(days[0]).toMatchObject({ day: '16' })
    expect(days[0]?.weekday).toMatch(/^vie/)
  })
})

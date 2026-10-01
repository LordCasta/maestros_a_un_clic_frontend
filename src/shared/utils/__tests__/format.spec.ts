import { describe, expect, it } from 'vitest'

import { formatDuration, formatMoney, formatRating, formatTime } from '../format'

// Intl usa espacios no separables: se normalizan para comparar.
const normalize = (text: string) => text.replace(/\s/g, ' ')

describe('format', () => {
  it('formats Colombian pesos without decimals', () => {
    expect(normalize(formatMoney(45000))).toBe('$ 45.000')
    expect(formatMoney(null)).toBe('A convenir')
  })

  it('formats durations in hours and minutes', () => {
    expect(formatDuration(45)).toBe('45 min')
    expect(formatDuration(120)).toBe('2 h')
    expect(formatDuration(90)).toBe('1 h 30 min')
  })

  it('always shows times in Colombia regardless of the device timezone', () => {
    // 15:00 UTC = 10:00 en Bogotá
    expect(normalize(formatTime('2026-10-02T15:00:00Z'))).toMatch(/^10:00 a\. ?m\.$/)
  })

  it('formats ratings with a decimal comma', () => {
    expect(formatRating(4.86)).toBe('4,9')
  })
})

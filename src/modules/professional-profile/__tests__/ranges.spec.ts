import { describe, expect, it } from 'vitest'

import { dateKey, presetRange } from '../ranges'

// 20 de octubre de 2026 al mediodía en Bogotá.
const NOW = new Date('2026-10-20T17:00:00Z')

describe('presetRange', () => {
  it('builds the quick ranges in Colombian time', () => {
    expect(presetRange('this-month', NOW)).toEqual({ from: '2026-10-01', to: '2026-10-20' })
    expect(presetRange('last-month', NOW)).toEqual({ from: '2026-09-01', to: '2026-09-30' })
    expect(presetRange('last-30-days', NOW)).toEqual({ from: '2026-09-21', to: '2026-10-20' })
    expect(presetRange('this-year', NOW)).toEqual({ from: '2026-01-01', to: '2026-10-20' })
  })

  it('goes back to December of the previous year in January', () => {
    expect(presetRange('last-month', new Date('2026-01-10T17:00:00Z'))).toEqual({
      from: '2025-12-01',
      to: '2025-12-31',
    })
  })

  it('uses the Colombian date even when it is already tomorrow in UTC', () => {
    expect(dateKey(new Date('2026-11-01T03:00:00Z'))).toBe('2026-10-31')
  })
})

import { afterEach, describe, expect, it } from 'vitest'

import { tokenColor } from '../tokens'

describe('tokenColor', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--color-primary-600')
  })

  it('reads the CSS variable of the token', () => {
    document.documentElement.style.setProperty('--color-primary-600', ' #2563eb ')

    expect(tokenColor('primary-600')).toBe('#2563eb')
  })

  it('fails loudly when the token does not exist', () => {
    expect(() => tokenColor('info-950')).toThrow('no existe')
  })
})

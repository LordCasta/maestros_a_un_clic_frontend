import { describe, expect, it } from 'vitest'

import { changePasswordSchema } from '../schemas'

const validPayload = {
  current_password: 'ContrasenaActual123!',
  password: 'NuevaContrasenaSegura456!',
  password_confirmation: 'NuevaContrasenaSegura456!',
}

describe('account changePasswordSchema', () => {
  it('accepts a valid password change payload', () => {
    expect(changePasswordSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects empty current password', () => {
    const result = changePasswordSchema.safeParse({
      ...validPayload,
      current_password: '',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.current_password).toEqual([
      'Ingresa tu contraseña actual.',
    ])
  })

  it('rejects a new password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...validPayload,
      password: 'corta',
      password_confirmation: 'corta',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password).toEqual([
      'La contraseña debe tener al menos 8 caracteres.',
    ])
  })

  it('rejects mismatched password confirmation', () => {
    const result = changePasswordSchema.safeParse({
      ...validPayload,
      password_confirmation: 'otra-diferente!',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.password_confirmation).toEqual([
      'Las contraseñas no coinciden.',
    ])
  })
})

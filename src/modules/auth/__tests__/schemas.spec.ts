import { describe, expect, it } from 'vitest'

import {
  forgotPasswordSchema,
  registerClientSchema,
  registerProfessionalSteps,
  resetPasswordSchema,
} from '../schemas'

const account = {
  name: 'Camila Restrepo',
  email: 'camila@example.com',
  password: 'password123',
  password_confirmation: 'password123',
}

describe('auth schemas', () => {
  it('accepts a valid client registration', () => {
    expect(registerClientSchema.safeParse(account).success).toBe(true)
  })

  it('rejects mismatched passwords on the confirmation field', () => {
    const result = registerClientSchema.safeParse({
      ...account,
      password_confirmation: 'otra-clave',
    })

    expect(result.error?.flatten().fieldErrors.password_confirmation).toEqual([
      'Las contraseñas no coinciden.',
    ])
  })

  it('validates each professional step on its own', () => {
    const [accountStep, profileStep] = registerProfessionalSteps

    // El paso 1 no exige campos del paso 2.
    expect(accountStep.safeParse({ ...account, commune_id: 11 }).success).toBe(true)

    const profile = profileStep.safeParse({
      category_ids: [],
      experience_years: '5',
      hourly_rate: '0',
      description: 'Corta',
    })
    expect(Object.keys(profile.error?.flatten().fieldErrors ?? {}).sort()).toEqual([
      'category_ids',
      'description',
      'hourly_rate',
    ])
  })

  it('validates forgotPasswordSchema (HU020)', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'usuario@example.com' }).success).toBe(true)
    expect(forgotPasswordSchema.safeParse({ email: 'correo-invalido' }).success).toBe(false)
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false)
  })

  it('validates resetPasswordSchema (HU020)', () => {
    const valid = {
      token: 'token123',
      email: 'usuario@example.com',
      password: 'password123',
      password_confirmation: 'password123',
    }
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true)

    // Token faltante
    expect(resetPasswordSchema.safeParse({ ...valid, token: '' }).success).toBe(false)

    // Contraseña corta
    expect(
      resetPasswordSchema.safeParse({ ...valid, password: 'corta', password_confirmation: 'corta' })
        .success,
    ).toBe(false)

    // Confirmación no coincide
    expect(
      resetPasswordSchema.safeParse({ ...valid, password_confirmation: 'otra-diferente' }).success,
    ).toBe(false)
  })
})

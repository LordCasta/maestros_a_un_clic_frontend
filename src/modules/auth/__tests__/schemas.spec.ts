import { describe, expect, it } from 'vitest'

import { registerClientSchema, registerProfessionalSteps } from '../schemas'

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
})

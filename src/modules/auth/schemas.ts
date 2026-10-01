import { z } from 'zod'

/**
 * Validación en el cliente. Replica las reglas de los FormRequest del backend
 * (app/Http/Requests); el backend vuelve a validar siempre.
 * Los nombres de campo son los del request de la API.
 */

const password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.')

const avatar = z
  .custom<File>((value) => value instanceof File, 'Selecciona una imagen.')
  .refine((file) => file.size <= 5 * 1024 * 1024, 'La foto no debe pesar más de 5 MB.')
  .refine((file) => /^image\/(jpeg|png|webp)$/.test(file.type), 'Usa una imagen JPG, PNG o WEBP.')
  .nullable()
  .optional()

export const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1, 'Ingresa tu contraseña.'),
})

const accountFields = {
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().min(1).email().max(255),
  password,
  password_confirmation: z.string().min(1, 'Confirma tu contraseña.'),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(255).optional(),
  avatar,
}

const passwordsMatch = {
  check: (data: { password: string; password_confirmation: string }) =>
    data.password === data.password_confirmation,
  error: { message: 'Las contraseñas no coinciden.', path: ['password_confirmation'] },
}

export const registerClientSchema = z
  .object({
    ...accountFields,
    commune_id: z.number().int().nullable().optional(),
  })
  .refine(passwordsMatch.check, passwordsMatch.error)

/** Registro de profesional en dos pasos: un esquema por paso (patrón multi-paso de VeeValidate). */
export const registerProfessionalSteps = [
  z
    .object({
      ...accountFields,
      commune_id: z.number({ invalid_type_error: 'Selecciona tu comuna.' }).int(),
    })
    .refine(passwordsMatch.check, passwordsMatch.error),
  z.object({
    category_ids: z.array(z.number().int()).min(1, 'Elige al menos una especialidad.'),
    experience_years: z.coerce.number().int().min(0).max(60),
    hourly_rate: z.coerce.number().positive('La tarifa debe ser mayor a 0.'),
    description: z.string().trim().min(50, 'Cuéntanos más: al menos 50 caracteres.').max(2000),
  }),
] as const

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterClientForm = z.infer<typeof registerClientSchema>
export type RegisterProfessionalForm = z.infer<(typeof registerProfessionalSteps)[0]> &
  z.infer<(typeof registerProfessionalSteps)[1]>

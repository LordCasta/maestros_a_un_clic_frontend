import { z } from 'zod'

const passwordRule = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.')

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Ingresa tu contraseña actual.'),
    password: passwordRule,
    password_confirmation: z.string().min(1, 'Confirma tu nueva contraseña.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'],
  })

export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>

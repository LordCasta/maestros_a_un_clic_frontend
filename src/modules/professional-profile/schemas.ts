import { z } from 'zod'

/**
 * Validación en el cliente. Replica los FormRequest del backend (UpdateProfessionalProfileRequest,
 * StoreProfessionalServiceRequest, StorePortfolioItemRequest); el backend vuelve a validar.
 */

/** Los <input type="number"> entregan texto; vacío significa "sin dato". */
const numberInput = z.union([z.number(), z.string()]).nullable().optional()

const optionalNumber = (schema: z.ZodNumber) =>
  numberInput
    .transform((value) =>
      value === '' || value === null || value === undefined ? null : Number(value),
    )
    .pipe(schema.nullable())

const requiredNumber = (schema: z.ZodNumber) =>
  numberInput
    .transform((value) => (value === '' || value === null ? undefined : Number(value)))
    .pipe(schema)

export const profileSchema = z.object({
  description: z.string().trim().max(2000).optional(),
  experience_years: optionalNumber(z.number().int().min(0).max(70)),
  hourly_rate: requiredNumber(
    z.number({ required_error: 'Indica tu tarifa por hora.' }).gt(0, 'Debe ser mayor que 0.'),
  ),
  service_radius_km: requiredNumber(z.number().int().min(1).max(100)),
  commune_id: z.number().nullable().optional(),
  address: z.string().trim().max(255).optional(),
})

export const DURATION_OPTIONS = [30, 45, 60, 90, 120, 180, 240, 300, 360, 480]

export const serviceSchema = z.object({
  category_id: z.number({
    required_error: 'Elige la categoría.',
    invalid_type_error: 'Elige la categoría.',
  }),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional(),
  price_type: z.enum(['fixed', 'hourly']),
  price: requiredNumber(
    z.number({ required_error: 'Indica el precio.' }).gt(0, 'Debe ser mayor que 0.'),
  ),
  estimated_duration_minutes: z.number().int().min(15).max(720),
})

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const portfolioSchema = z.object({
  image: z
    .custom<File>((value) => value instanceof File, 'Selecciona una foto.')
    .refine((file) => file.size <= MAX_IMAGE_BYTES, 'La foto no debe pesar más de 5 MB.')
    .refine(
      (file) => /^image\/(jpeg|png|webp)$/.test(file.type),
      'Usa una imagen JPG, PNG o WEBP.',
    ),
  description: z.string().trim().max(255).optional(),
})

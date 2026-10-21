import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const documentFileSchema = z
  .custom<File | null>((val) => val === null || val instanceof File, {
    message: 'Archivo inválido',
  })
  .refine((file): file is File => file instanceof File, {
    message: 'Debes adjuntar un archivo',
  })
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: 'El archivo no puede superar 10 MB',
  })
  .refine((file) => !file || ALLOWED_MIME_TYPES.includes(file.type), {
    message: 'Formato no permitido. Usa JPG, PNG, WEBP o PDF',
  })

export const selfieFileSchema = z
  .custom<File | null>((val) => val === null || val instanceof File, {
    message: 'Archivo inválido',
  })
  .refine((file): file is File => file instanceof File, {
    message: 'Debes tomarte una selfie para verificar tu identidad',
  })
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: 'La imagen no puede superar 10 MB',
  })
  .refine((file) => !file || ALLOWED_IMAGE_MIME_TYPES.includes(file.type), {
    message: 'La selfie debe ser una foto (JPG, PNG o WEBP)',
  })

export const replaceDocumentSchema = z.object({
  file: documentFileSchema,
  title: z.string().max(255, 'Máximo 255 caracteres').optional().default(''),
})

export type ReplaceDocumentFormValues = z.infer<typeof replaceDocumentSchema>

export const rejectVerificationSchema = z.object({
  reason: z
    .string()
    .min(5, 'Ingresa un motivo de al menos 5 caracteres.')
    .max(1000, 'El motivo no puede superar los 1000 caracteres.'),
})

export type RejectVerificationFormValues = z.infer<typeof rejectVerificationSchema>

export const rejectDocumentSchema = z.object({
  rejection_reason: z
    .string()
    .min(5, 'Ingresa el motivo de rechazo del documento.')
    .max(1000, 'El motivo no puede superar los 1000 caracteres.'),
})

export type RejectDocumentFormValues = z.infer<typeof rejectDocumentSchema>

import { describe, expect, it } from 'vitest'

import {
  documentFileSchema,
  rejectDocumentSchema,
  rejectVerificationSchema,
  replaceDocumentSchema,
  selfieFileSchema,
} from '../schemas'

describe('verification schemas', () => {
  it('accepts valid PDF and image files for documentFileSchema', () => {
    const pdfFile = new File(['dummy content'], 'cedula.pdf', { type: 'application/pdf' })
    const imgFile = new File(['dummy image'], 'cedula.jpg', { type: 'image/jpeg' })

    expect(documentFileSchema.safeParse(pdfFile).success).toBe(true)
    expect(documentFileSchema.safeParse(imgFile).success).toBe(true)
  })

  it('rejects unsupported file formats in documentFileSchema', () => {
    const textFile = new File(['dummy text'], 'test.txt', { type: 'text/plain' })
    const result = documentFileSchema.safeParse(textFile)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Formato no permitido. Usa JPG, PNG, WEBP o PDF')
  })

  it('rejects files larger than 10MB in documentFileSchema', () => {
    // 11MB file
    const largeFile = new File([new Uint8Array(11 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    })
    const result = documentFileSchema.safeParse(largeFile)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('El archivo no puede superar 10 MB')
  })

  it('rejects non-image files for selfieFileSchema', () => {
    const pdfFile = new File(['dummy content'], 'selfie.pdf', { type: 'application/pdf' })
    const result = selfieFileSchema.safeParse(pdfFile)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('La selfie debe ser una foto (JPG, PNG o WEBP)')
  })

  it('validates replaceDocumentSchema with file and optional title', () => {
    const file = new File(['content'], 'cedula.pdf', { type: 'application/pdf' })
    const valid = replaceDocumentSchema.safeParse({
      file,
      title: 'Cédula de ciudadanía legible',
    })

    expect(valid.success).toBe(true)
  })

  it('validates rejectVerificationSchema requires a reason of at least 5 chars', () => {
    const short = rejectVerificationSchema.safeParse({ reason: 'abc' })
    expect(short.success).toBe(false)
    expect(short.error?.issues[0]?.message).toBe('Ingresa un motivo de al menos 5 caracteres.')

    const valid = rejectVerificationSchema.safeParse({
      reason: 'Los documentos adjuntos no corresponden a la persona registrada.',
    })
    expect(valid.success).toBe(true)
  })

  it('validates rejectDocumentSchema requires a reason of at least 5 chars', () => {
    const empty = rejectDocumentSchema.safeParse({ rejection_reason: '' })
    expect(empty.success).toBe(false)

    const valid = rejectDocumentSchema.safeParse({
      rejection_reason: 'El documento de identidad está borroso o incompleto.',
    })
    expect(valid.success).toBe(true)
  })
})

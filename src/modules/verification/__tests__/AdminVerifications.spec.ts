import { PiniaColada } from '@pinia/colada'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { User, VerificationDocument, VerificationRequest } from '@/shared/types/models'

import { verificationApi } from '../api'
import AdminDocumentRejectModal from '../components/AdminDocumentRejectModal.vue'
import AdminVerificationDetailModal from '../components/AdminVerificationDetailModal.vue'
import AdminVerificationRejectModal from '../components/AdminVerificationRejectModal.vue'

vi.mock('../api', () => ({
  verificationApi: {
    approve: vi.fn<(typeof verificationApi)['approve']>(),
    reject: vi.fn<(typeof verificationApi)['reject']>(),
    updateDocumentStatus: vi.fn<(typeof verificationApi)['updateDocumentStatus']>(),
  },
}))

const mockRequest: VerificationRequest = {
  id: 10,
  status: 'pending',
  rejection_reason: null,
  background_check_status: 'not_checked',
  submitted_at: '2026-10-17T12:00:00-05:00',
  reviewed_at: null,
  user: {
    id: 5,
    name: 'Carlos Maestro',
    email: 'carlos@ejemplo.com',
    role: 'professional',
    verification_status: 'pending',
    rating: { average: 5, count: 1 },
    created_at: '2026-10-17T12:00:00-05:00',
  } as unknown as User,
  documents: [
    {
      id: 101,
      type: 'id_document',
      title: 'Cédula de ciudadanía',
      status: 'pending',
      rejection_reason: null,
      file_url: 'http://localhost:8000/storage/cedula.pdf',
      created_at: '2026-10-17T12:00:00-05:00',
    },
    {
      id: 102,
      type: 'selfie',
      title: 'Selfie de verificación',
      status: 'pending',
      rejection_reason: null,
      file_url: 'http://localhost:8000/storage/selfie.jpg',
      created_at: '2026-10-17T12:00:00-05:00',
    },
  ],
  created_at: '2026-10-17T12:00:00-05:00',
}

describe('Admin Verification Modals', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders AdminVerificationRejectModal with required reason field', () => {
    const pinia = createPinia()
    const wrapper = mount(AdminVerificationRejectModal, {
      props: {
        open: true,
        request: mockRequest,
      },
      global: {
        plugins: [pinia, PiniaColada],
        stubs: { teleport: true },
      },
    })

    expect(wrapper.text()).toContain('Rechazar solicitud de verificación')
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('renders AdminDocumentRejectModal with reason field', () => {
    const pinia = createPinia()
    const doc = mockRequest.documents[0] as VerificationDocument
    const wrapper = mount(AdminDocumentRejectModal, {
      props: {
        open: true,
        document: doc,
      },
      global: {
        plugins: [pinia, PiniaColada],
        stubs: { teleport: true },
      },
    })

    expect(wrapper.text()).toContain('Rechazar documento')
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('renders AdminVerificationDetailModal with user info and documents', () => {
    const pinia = createPinia()
    const wrapper = mount(AdminVerificationDetailModal, {
      props: {
        open: true,
        request: mockRequest,
      },
      global: {
        plugins: [pinia, PiniaColada],
        stubs: { teleport: true },
      },
    })

    expect(wrapper.text()).toContain('Carlos Maestro')
    expect(wrapper.text()).toContain('carlos@ejemplo.com')
    expect(wrapper.text()).toContain('Documento de identidad (cédula)')
    expect(wrapper.text()).toContain('Selfie de verificación')
    expect(wrapper.text()).toContain('Aprobar verificación')
    expect(wrapper.text()).toContain('Rechazar verificación')
  })
})

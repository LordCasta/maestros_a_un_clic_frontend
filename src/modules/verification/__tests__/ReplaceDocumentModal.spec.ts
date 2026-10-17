import { PiniaColada } from '@pinia/colada'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import type { VerificationDocument } from '@/shared/types/models'

import { verificationApi } from '../api'
import ReplaceDocumentModal from '../components/ReplaceDocumentModal.vue'

vi.mock('../api', () => ({
  verificationApi: {
    replaceDocument: vi.fn<(typeof verificationApi)['replaceDocument']>(),
  },
}))

const mockRejectedDoc: VerificationDocument = {
  id: 42,
  type: 'id_document',
  title: 'Cédula borrosa',
  status: 'rejected',
  rejection_reason: 'La cédula no es legible.',
  file_url: null,
  created_at: '2026-10-17T12:00:00-05:00',
}

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(ReplaceDocumentModal, {
    props: {
      open: true,
      document: mockRejectedDoc,
    },
    global: {
      plugins: [pinia, PiniaColada],
      stubs: { teleport: true },
    },
  })

  return { wrapper }
}

describe('ReplaceDocumentModal', () => {
  it('renders modal with rejection reason and fields', () => {
    const { wrapper } = setup()

    expect(wrapper.text()).toContain('Reemplazar documento rechazado')
    expect(wrapper.text()).toContain('La cédula no es legible.')
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })
})

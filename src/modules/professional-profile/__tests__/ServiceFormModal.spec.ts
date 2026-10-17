import { PiniaColada, useQueryCache } from '@pinia/colada'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { catalogKeys } from '@/modules/catalog'
import type { Category } from '@/shared/types/models'

import { professionalProfileApi } from '../api'
import ServiceFormModal from '../components/ServiceFormModal.vue'

vi.mock('../api', () => ({
  professionalProfileApi: {
    createService: vi.fn<(typeof professionalProfileApi)['createService']>(),
    updateService: vi.fn<(typeof professionalProfileApi)['updateService']>(),
  },
}))

const category = (id: number, name: string, children: Category[] = []): Category => ({
  id,
  parent_id: null,
  name,
  slug: name,
  icon: null,
  children,
})

const CATALOG = [
  category(1, 'Plomería', [{ ...category(11, 'Fugas'), parent_id: 1 }]),
  category(2, 'Electricidad', [{ ...category(21, 'Tomas'), parent_id: 2 }]),
]

async function mountModal() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const open = ref(false)
  // El catálogo ya está en caché, como en la app (se pide una vez por sesión).
  const Host = defineComponent({
    setup() {
      useQueryCache().setQueryData(catalogKeys.categories, CATALOG)
      return () =>
        h(ServiceFormModal, {
          open: open.value,
          service: null,
          specialtyIds: [1],
          'onUpdate:open': (value: boolean) => (open.value = value),
        })
    },
  })
  const wrapper = mount(Host, {
    global: { plugins: [pinia, PiniaColada], stubs: { teleport: true } },
  })
  // Abrirlo después de montar, como al pulsar "Nuevo servicio": así se cargan los valores iniciales.
  open.value = true
  await flushPromises()
  return wrapper
}

describe('ServiceFormModal', () => {
  it('only offers the subcategories of the own specialties', async () => {
    const wrapper = await mountModal()

    const options = wrapper
      .findAll('select')[0]!
      .findAll('option')
      .map((option) => option.text())
    expect(options).toContain('Plomería · Fugas')
    expect(options).not.toContain('Electricidad · Tomas')
  })

  it('creates the service with price and estimated duration', async () => {
    vi.mocked(professionalProfileApi.createService).mockResolvedValue({
      success: true,
      message: 'Servicio creado.',
      data: {} as never,
    })
    const wrapper = await mountModal()

    const [categorySelect, , durationSelect] = wrapper.findAll('select')
    await categorySelect!.setValue('11')
    await wrapper.find('input:not([type="number"])').setValue('Reparación de fugas')
    await wrapper.find('input[type="number"]').setValue('80000')
    await durationSelect!.setValue('90')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    // La validación de VeeValidate es asíncrona: se espera a que llegue a la API.
    await vi.waitFor(() =>
      expect(professionalProfileApi.createService).toHaveBeenCalledWith(
        expect.objectContaining({
          category_id: 11,
          title: 'Reparación de fugas',
          price: 80000,
          price_type: 'fixed',
          estimated_duration_minutes: 90,
        }),
      ),
    )
  })
})

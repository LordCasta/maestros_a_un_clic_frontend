import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import type { Professional } from '@/shared/types/models'

import ProfessionalCard from '../ProfessionalCard.vue'

const baseProfessional: Professional = {
  id: 1,
  name: 'Juan Pérez',
  avatar_url: null,
  is_verified: true,
  rating: {
    average: 4.8,
    count: 12,
  },
  description: 'Especialista en plomería residencial con 5 años de experiencia.',
  experience_years: 5,
  hourly_rate: 45000,
  commune: {
    id: 11,
    name: 'Laureles - Estadio',
    code: '11',
    type: 'comuna',
  },
}

function mountCard(overrides: Partial<Professional> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: { template: '<div />' },
      },
      {
        path: '/profesionales/:id',
        name: 'professional-detail',
        component: { template: '<div />' },
      },
    ],
  })

  return mount(ProfessionalCard, {
    props: {
      professional: { ...baseProfessional, ...overrides },
    },
    global: {
      plugins: [router],
    },
  })
}

describe('ProfessionalCard', () => {
  it('renders basic professional details', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Juan Pérez')
    expect(wrapper.text()).toContain('Laureles - Estadio')
    expect(wrapper.text()).toContain('45.000')
    expect(wrapper.text()).not.toContain('km')
    expect(wrapper.text()).not.toContain('Comuna aledaña')
  })

  it('renders distance when distance_km is present', () => {
    const wrapper = mountCard({ distance_km: 2.5 })

    expect(wrapper.text()).toContain('· a 2.5 km')
  })

  it('renders the suggested badge when is_suggested is true', () => {
    const wrapper = mountCard({ is_suggested: true, distance_km: 4.2 })

    expect(wrapper.text()).toContain('· a 4.2 km')
    expect(wrapper.text()).toContain('Comuna aledaña')
  })
})

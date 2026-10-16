<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { ProfessionalAvailability } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseCard, BaseInput, BaseSelect } from '@/shared/ui'

import { useUpdateRules } from '../queries'
import { DEFAULT_RANGE, findProblems, toDrafts, toRules, type DayDraft } from '../weekly'

/**
 * HU003: días y franjas en que el profesional atiende, y el descanso entre servicios.
 * Se guarda todo junto (PUT /professional/availability/rules reemplaza el horario completo).
 */
const props = defineProps<{ availability: ProfessionalAvailability }>()

const BUFFER_OPTIONS = [0, 10, 15, 20, 30, 45, 60, 90, 120].map((minutes) => ({
  value: minutes,
  label: minutes === 0 ? 'Sin descanso' : `${minutes} minutos`,
}))

const toast = useToastStore()
const { mutateAsync, isLoading } = useUpdateRules()

const days = ref<DayDraft[]>([])
const buffer = ref(0)
const formError = ref('')

function reset() {
  days.value = toDrafts(props.availability.rules)
  buffer.value = props.availability.buffer_minutes
}
watch(() => props.availability, reset, { immediate: true })

const problems = computed(() => findProblems(days.value))
const hasProblems = computed(() => Object.keys(problems.value).length > 0)
const dirty = computed(
  () =>
    buffer.value !== props.availability.buffer_minutes ||
    JSON.stringify(toRules(days.value)) !==
      JSON.stringify(toRules(toDrafts(props.availability.rules))),
)

function toggle(day: DayDraft) {
  day.enabled = !day.enabled
  if (day.enabled && day.ranges.length === 0) day.ranges.push({ ...DEFAULT_RANGE })
}

function addRange(day: DayDraft) {
  const last = day.ranges[day.ranges.length - 1]
  day.ranges.push(last ? { start_time: last.end_time, end_time: '' } : { ...DEFAULT_RANGE })
}

async function save() {
  formError.value = ''
  try {
    const response = await mutateAsync({ buffer_minutes: buffer.value, rules: toRules(days.value) })
    toast.success(response.message ?? 'Horario guardado.')
  } catch (error) {
    formError.value = error instanceof ApiError ? error.message : 'No pudimos guardar el horario.'
  }
}
</script>

<template>
  <BaseCard as="section" class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-neutral-900">Horario semanal</h2>
        <p class="mt-1 text-sm text-neutral-500">
          Los clientes solo pueden reservar dentro de estas franjas.
        </p>
      </div>
      <div class="flex gap-2">
        <BaseButton v-if="dirty" variant="ghost" :disabled="isLoading" @click="reset">
          Descartar
        </BaseButton>
        <BaseButton :loading="isLoading" :disabled="!dirty || hasProblems" @click="save">
          Guardar horario
        </BaseButton>
      </div>
    </div>

    <BaseAlert v-if="formError" tone="danger">{{ formError }}</BaseAlert>

    <ul class="divide-y divide-neutral-100">
      <li
        v-for="day in days"
        :key="day.weekday"
        class="flex flex-col gap-3 py-4 sm:flex-row sm:items-start"
      >
        <div class="flex w-40 shrink-0 items-center gap-3 sm:pt-2">
          <button
            type="button"
            role="switch"
            :aria-checked="day.enabled"
            :aria-label="`Atiendo los ${day.label.toLowerCase()}`"
            :class="[
              'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
              day.enabled ? 'bg-primary-600' : 'bg-neutral-200',
            ]"
            @click="toggle(day)"
          >
            <span
              :class="[
                'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
                day.enabled ? 'translate-x-5.5' : 'translate-x-0.5',
              ]"
            />
          </button>
          <span class="font-semibold text-neutral-900">{{ day.label }}</span>
        </div>

        <p v-if="!day.enabled" class="text-sm text-neutral-400 sm:pt-2.5">No atiendo</p>

        <div v-else class="flex-1 space-y-2">
          <div v-for="(range, index) in day.ranges" :key="index" class="space-y-1">
            <div class="flex items-center gap-2">
              <BaseInput
                v-model="range.start_time"
                type="time"
                :aria-label="`${day.label}, franja ${index + 1}: desde`"
                class="w-32"
              />
              <span class="text-sm text-neutral-400">a</span>
              <BaseInput
                v-model="range.end_time"
                type="time"
                :aria-label="`${day.label}, franja ${index + 1}: hasta`"
                class="w-32"
              />
              <BaseButton
                variant="ghost"
                size="sm"
                :aria-label="`Quitar franja ${index + 1} del ${day.label.toLowerCase()}`"
                @click="day.ranges.splice(index, 1)"
              >
                <Trash2 class="size-4" />
              </BaseButton>
            </div>
            <p
              v-if="problems[`${day.weekday}-${index}`]"
              class="text-xs font-medium text-danger-600"
            >
              {{ problems[`${day.weekday}-${index}`] }}
            </p>
          </div>
          <p
            v-if="day.ranges.length === 0 && problems[`${day.weekday}-0`]"
            class="text-xs font-medium text-danger-600"
          >
            {{ problems[`${day.weekday}-0`] }}
          </p>
          <BaseButton variant="ghost" size="sm" @click="addRange(day)">
            <Plus class="size-4" /> Agregar franja
          </BaseButton>
        </div>
      </li>
    </ul>

    <div class="max-w-xs border-t border-neutral-100 pt-5">
      <BaseSelect
        v-model="buffer"
        label="Descanso entre servicios"
        hint="Se bloquea antes y después de cada reserva, para desplazarte o descansar."
        :options="BUFFER_OPTIONS"
      />
    </div>
  </BaseCard>
</template>

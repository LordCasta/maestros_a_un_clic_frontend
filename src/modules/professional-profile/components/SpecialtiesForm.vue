<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useCategories } from '@/modules/catalog'
import { ApiError } from '@/shared/http/client'
import { useToastStore } from '@/shared/stores/toast'
import type { MyProfessionalProfile } from '@/shared/types/models'
import { BaseAlert, BaseButton, BaseCard, BaseChoiceGroup } from '@/shared/ui'

import { useSyncCategories } from '../queries'

/** HU009: agregar o quitar especialidades del catálogo (al menos una). */
const props = defineProps<{ profile: MyProfessionalProfile }>()

const toast = useToastStore()
const { rootOptions } = useCategories()
const { mutateAsync, isLoading } = useSyncCategories()

const current = computed(() => props.profile.categories.map((category) => category.id))
const selected = ref<number[]>([])
watch(current, (ids) => (selected.value = [...ids]), { immediate: true })

const dirty = computed(
  () => [...selected.value].sort().join(',') !== [...current.value].sort().join(','),
)
const error = ref('')

async function save() {
  error.value = ''
  if (selected.value.length === 0) {
    error.value = 'Elige al menos una especialidad.'
    return
  }
  try {
    const response = await mutateAsync(selected.value)
    toast.success(response.message ?? 'Especialidades actualizadas.')
  } catch (failure) {
    error.value =
      failure instanceof ApiError
        ? (failure.errors.category_ids?.[0] ?? failure.message)
        : 'No pudimos guardar las especialidades.'
  }
}
</script>

<template>
  <BaseCard as="section" class="space-y-5">
    <div>
      <h2 class="text-xl font-black text-neutral-900">Especialidades</h2>
      <p class="mt-1 text-sm text-neutral-500">
        Te encuentran por estas categorías y en ellas puedes crear tus servicios.
      </p>
    </div>
    <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>
    <BaseChoiceGroup v-model="selected" :options="rootOptions" />
    <div class="flex justify-end">
      <BaseButton :loading="isLoading" :disabled="!dirty" @click="save">
        Guardar especialidades
      </BaseButton>
    </div>
  </BaseCard>
</template>

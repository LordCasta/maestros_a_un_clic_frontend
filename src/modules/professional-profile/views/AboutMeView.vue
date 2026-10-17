<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { BaseAlert, BaseSkeleton } from '@/shared/ui'

import PortfolioManager from '../components/PortfolioManager.vue'
import ProfileForm from '../components/ProfileForm.vue'
import SpecialtiesForm from '../components/SpecialtiesForm.vue'
import { useMyProfile } from '../queries'

/** HU009: el profesional edita su perfil, sus especialidades y su portafolio. */
const { data: profile, isPending, error } = useMyProfile()
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <header>
      <h1 class="text-3xl font-black text-neutral-900">Mi perfil</h1>
      <p class="mt-1 text-neutral-500">Mantén tu información al día para atraer más clientes.</p>
    </header>

    <div v-if="isPending" class="space-y-6">
      <BaseSkeleton class="h-96" />
      <BaseSkeleton class="h-40" />
    </div>

    <BaseAlert v-else-if="error" tone="danger" title="No pudimos cargar tu perfil">
      {{ error.message }}
    </BaseAlert>

    <template v-else-if="profile">
      <BaseAlert v-if="profile.verification_status !== 'approved'" tone="info">
        Tu perfil aún no es público: aparecerá en las búsquedas cuando el equipo apruebe tus
        documentos. Puedes consultar o subir tus documentos en
        <RouterLink :to="{ name: 'professional-verification' }" class="font-bold underline">
          Verificación de perfil </RouterLink
        >.
      </BaseAlert>
      <ProfileForm :profile="profile" />
      <SpecialtiesForm :profile="profile" />
      <PortfolioManager />
    </template>
  </div>
</template>

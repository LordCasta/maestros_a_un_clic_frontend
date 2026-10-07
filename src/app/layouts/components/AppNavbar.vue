<script setup lang="ts">
import { LogOut, Menu, Search, X } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { homeRouteFor, useAuthStore } from '@/modules/auth'
import { BaseAvatar, BaseButton, BrandMark } from '@/shared/ui'

import { NAV_ITEMS } from '../navigation'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const items = computed(() => NAV_ITEMS[auth.role ?? 'guest'])
const logoRoute = computed(() =>
  auth.isAuthenticated ? homeRouteFor(auth.role) : { name: 'home' },
)

const query = ref('')
const mobileOpen = ref(false)
watch(
  () => route.fullPath,
  () => (mobileOpen.value = false),
)

function search() {
  router.push({ name: 'search', query: query.value ? { q: query.value } : {} })
}

// HU021: al cerrar sesión se vuelve al inicio.
async function logout() {
  await auth.logout()
  await router.replace({ name: 'home' })
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-xl">
    <div class="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
      <RouterLink
        :to="logoRoute"
        class="shrink-0 transition hover:opacity-80"
        aria-label="Ir al inicio"
      >
        <BrandMark size="sm" :subtitle="null" />
      </RouterLink>

      <form role="search" class="relative hidden max-w-md flex-1 lg:block" @submit.prevent="search">
        <Search
          class="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-neutral-400"
        />
        <input
          v-model="query"
          type="search"
          aria-label="Buscar profesionales"
          placeholder="¿Qué servicio necesitas hoy?"
          class="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pr-4 pl-11 text-sm transition outline-none focus:border-primary-500 focus:bg-white"
        />
      </form>

      <nav class="ml-auto hidden items-center gap-1 md:flex" aria-label="Principal">
        <RouterLink
          v-for="item in items"
          :key="item.label"
          :to="item.to"
          class="rounded-xl px-3 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          active-class="bg-primary-50 text-primary-700"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-2 md:ml-0">
        <template v-if="auth.user">
          <BaseAvatar
            :name="auth.user.name"
            :src="auth.user.avatar_url"
            size="sm"
            class="hidden md:inline-flex"
          />
          <BaseButton variant="ghost" size="sm" class="hidden md:inline-flex" @click="logout">
            <LogOut class="size-4" /> Salir
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton
            variant="ghost"
            size="sm"
            class="hidden md:inline-flex"
            :to="{ name: 'login' }"
          >
            Iniciar sesión
          </BaseButton>
          <BaseButton size="sm" class="hidden md:inline-flex" :to="{ name: 'register-client' }">
            Registrarse
          </BaseButton>
        </template>

        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl bg-neutral-100 md:hidden"
          :aria-expanded="mobileOpen"
          aria-label="Menú"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="size-5" />
          <Menu v-else class="size-5" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="space-y-1 border-t border-neutral-100 px-4 py-4 md:hidden">
      <form role="search" class="relative mb-3" @submit.prevent="search">
        <Search
          class="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-neutral-400"
        />
        <input
          v-model="query"
          type="search"
          aria-label="Buscar profesionales"
          placeholder="Buscar servicio…"
          class="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pr-4 pl-11 text-sm outline-none focus:border-primary-500"
        />
      </form>
      <RouterLink
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
        active-class="bg-primary-50 text-primary-700"
      >
        <component :is="item.icon" class="size-4.5" /> {{ item.label }}
      </RouterLink>
      <div class="pt-3">
        <BaseButton v-if="auth.user" variant="outline" block @click="logout">
          <LogOut class="size-4" /> Cerrar sesión
        </BaseButton>
        <div v-else class="grid grid-cols-2 gap-2">
          <BaseButton variant="outline" :to="{ name: 'login' }">Iniciar sesión</BaseButton>
          <BaseButton :to="{ name: 'register-client' }">Registrarse</BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

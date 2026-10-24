<script setup lang="ts">
import { LogOut, Menu, Search, X } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { homeRouteFor, useAuthStore } from '@/modules/auth'
import { NotificationBell } from '@/modules/notifications'
import { BaseAvatar, BaseButton, BrandMark } from '@/shared/ui'

import { NAV_ITEMS } from '../navigation'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const items = computed(() => NAV_ITEMS[auth.role ?? 'guest'])
const logoRoute = computed(() =>
  auth.isAuthenticated ? homeRouteFor(auth.role) : { name: 'home' },
)

/**
 * Con sesión hay muchos enlaces (hasta 8): el menú completo solo cabe desde xl (1280 px) y
 * no deja espacio para el buscador, que pasa al menú desplegable. Las clases van completas
 * para que Tailwind las encuentre.
 */
const compact = computed(() => items.value.length > 2)
const showFrom = computed(() => (compact.value ? 'hidden xl:flex' : 'hidden md:flex'))
const hideFrom = computed(() => (compact.value ? 'xl:hidden' : 'md:hidden'))

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

      <form
        v-if="!compact"
        role="search"
        class="relative hidden max-w-md flex-1 lg:block"
        @submit.prevent="search"
      >
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

      <nav :class="['ml-auto items-center gap-1', showFrom]" aria-label="Principal">
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

      <div :class="['flex items-center gap-2', compact ? 'ml-auto xl:ml-0' : 'ml-auto md:ml-0']">
        <!-- Se ocultan con un contenedor: BaseButton y BaseAvatar traen su propio inline-flex,
             que le gana a un "hidden" puesto en el componente. -->
        <template v-if="auth.user">
          <!-- HU018: notificaciones -->
          <NotificationBell />
          <div :class="['items-center gap-2', showFrom]">
            <BaseAvatar :name="auth.user.name" :src="auth.user.avatar_url" size="sm" />
            <BaseButton variant="ghost" size="sm" @click="logout">
              <LogOut class="size-4" /> Salir
            </BaseButton>
          </div>
        </template>
        <div v-else :class="['items-center gap-2', showFrom]">
          <BaseButton variant="ghost" size="sm" :to="{ name: 'login' }">Iniciar sesión</BaseButton>
          <BaseButton size="sm" :to="{ name: 'register-client' }">Registrarse</BaseButton>
        </div>

        <button
          type="button"
          :class="['flex size-10 items-center justify-center rounded-xl bg-neutral-100', hideFrom]"
          :aria-expanded="mobileOpen"
          aria-label="Menú"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="size-5" />
          <Menu v-else class="size-5" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" :class="['space-y-1 border-t border-neutral-100 px-4 py-4', hideFrom]">
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

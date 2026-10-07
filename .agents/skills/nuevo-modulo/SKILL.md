---
name: nuevo-modulo
description: Crea un módulo nuevo del frontend (src/modules/<modulo>) con la misma estructura y estilo que el módulo de referencia de favoritos. Úsalo al empezar una funcionalidad nueva o una historia de usuario que necesite pantallas y endpoints propios.
---

# Crear un módulo nuevo

Sigue los pasos en orden. Al terminar, el módulo debe verse y comportarse como `src/modules/favorites/`.

## 0. Antes de escribir código

1. Lee el issue de la HU (repo backend → Issues) y sus criterios de aceptación.
2. Busca los endpoints del módulo en el contrato: repo backend → `docs/api/endpoints.md`. Si un endpoint está en "Planeados", el backend todavía no existe: implementa primero el backend o pide que se haga. **No simules la API con datos falsos.**
3. Abre `src/modules/favorites/` y tenlo como plantilla.

## 1. Tipos (`src/shared/types/models.ts`)

Si la API devuelve un recurso nuevo, agrega su interfaz copiando el Resource del backend campo por campo (mismos nombres en `snake_case`, fechas como `string` ISO 8601, dinero como `number`). Documenta con `/** XxxResource */`.

## 2. `api.ts` — una función por endpoint, sin lógica

```ts
import { http } from '@/shared/http/client'
import type { ApiPaginated, ApiSuccess, PageQuery } from '@/shared/types/api'
import type { Service } from '@/shared/types/models'

/** Contrato: backend/docs/api/endpoints.md § <Sección> */
export const servicesApi = {
  list: (query: PageQuery) => http.get<ApiPaginated<Service>>('/professional/services', { query: { ...query } }),
  create: (payload: ServicePayload) => http.post<ApiSuccess<Service>>('/professional/services', payload),
  remove: (id: number) => http.delete<ApiSuccess<null>>(`/professional/services/${id}`),
}
```

Archivos: `http.post(url, toFormData(valores))`.

## 3. `queries.ts` — Pinia Colada

```ts
export const serviceKeys = {
  all: ['services'] as const,
  list: (page: number) => ['services', 'list', page] as const,
}

export function useServices(page: MaybeRefOrGetter<number>) {
  return useQuery({
    key: () => serviceKeys.list(toValue(page)),
    query: () => servicesApi.list({ page: toValue(page) }),
    placeholderData: (previous) => previous,
  })
}

export function useDeleteService() {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: (id: number) => servicesApi.remove(id),
    onSettled: () => queryCache.invalidateQueries({ key: serviceKeys.all }),
  })
}
```

Las mutaciones **invalidan**; no copies respuestas a variables locales.

## 4. `schemas.ts` (si hay formularios)

Zod con las mismas reglas del FormRequest del backend y los **mismos nombres de campo del request**. Ejemplo: `src/modules/auth/schemas.ts`.

## 5. Componentes y vistas

- Vistas en `views/` con sufijo `View` (`MyServicesView.vue`); componentes en `components/`.
- Arma todo con `@/shared/ui`. Solo tokens de color (ver `docs/sistema-de-diseno.md`).
- Vista de lista: copia la estructura de `src/modules/favorites/views/MyFavoritesView.vue` (encabezado + cuatro estados).
- Formulario: copia `src/modules/auth/components/LoginForm.vue` (useForm + defineField + `applyServerErrors` + BaseAlert).
- Confirmación destructiva: copia `src/modules/bookings/components/CancelBookingModal.vue`.
- Acción completada: `useToastStore().success(response.message)`.

## 6. `routes.ts` e `index.ts`

```ts
// routes.ts
export const servicesRoutes: ModuleRoutes = {
  professional: [
    { path: 'services', name: 'professional-services', component: () => import('./views/MyServicesView.vue'), meta: { title: 'Mis servicios' } },
  ],
}
```

```ts
// index.ts: solo lo que otros módulos pueden usar
/** Módulo de … (HU0xx). API pública del módulo: lo que no se exporta aquí es interno. */
export { serviceKeys, useServices } from './queries'
export { servicesRoutes } from './routes'
```

Registra las rutas en `src/app/router/index.ts` (arreglo `MODULES`) y, si aplica, el enlace en `src/app/layouts/navigation.ts`. Eso toca `src/app`: menciónalo en el PR.

## 7. Tests (`__tests__/`)

- Esquemas Zod: casos válidos e inválidos (ejemplo: `src/modules/auth/__tests__/schemas.spec.ts`).
- Componente principal: mockea `<modulo>Api` con `vi.mock('../api')` y monta con Pinia, PiniaColada y un router de memoria (ejemplo: `src/modules/favorites/__tests__/FavoriteButton.spec.ts`).

## 8. Verificación final

```bash
npm run lint && npm run format && npm run type-check && npx vitest run && npm run build
```

Todo en verde. Actualiza la tabla "Estado de los módulos" de `docs/arquitectura.md` y marca los criterios cumplidos en el issue.

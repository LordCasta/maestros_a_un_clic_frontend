---
name: conectar-maqueta
description: Reemplaza los datos de muestra escritos en el código de una vista "maqueta" (portada, dashboards, Sobre mí, Mis servicios, Disponibilidad) por datos reales de la API, conservando su diseño. Úsalo cuando una HU pida que una de esas pantallas funcione de verdad.
---

# Conectar una maqueta a la API

Varias vistas se hicieron antes que la API y tienen datos inventados (`const services = ref([...])`, imágenes de Unsplash, nombres de ejemplo). La tabla "Estado de los módulos" de `docs/arquitectura.md` dice cuáles son:

| Vista | Módulo | Datos que necesita |
|-------|--------|--------------------|
| `src/modules/home/views/HomeView.vue` | búsqueda | Categorías (`useCategories`) y profesionales destacados (`useProfessionalSearch` con `sort: 'rating'`) |
| `src/modules/dashboard/views/ClientDashboardView.vue` | varios | Reservas activas (`useBookings`), favoritos (`useFavorites`), categorías |
| `src/modules/dashboard/views/ProfessionalDashboardView.vue` | varios | Reservas recibidas, ingresos (HU037), servicios |
| `src/modules/professional-profile/views/AboutMeView.vue` | perfil profesional | `PATCH /professional/profile` |
| `src/modules/professional-profile/views/MyServicesView.vue` | perfil profesional | `/professional/services` |
| `src/modules/schedule/views/AvailabilityView.vue` | agenda | `/professional/availability` |

## Pasos

1. **Identifica los datos falsos**: arreglos y objetos escritos a mano en el `<script>`, URLs de imágenes externas, textos de ejemplo. Anota qué endpoint reemplaza a cada uno (repo backend → `docs/api/endpoints.md`).
2. **Si el dato es de otro módulo, úsalo desde su `index.ts`** (`import { useFavorites } from '@/modules/favorites'`). Si ese módulo no exporta lo que necesitas, pídeselo a su responsable o agrégalo en su `index.ts` avisando en el PR.
3. **Si el endpoint no existe aún, no lo inventes**: deja ese bloque como está, con un comentario `// MAQUETA: pendiente de <endpoint> (HU0xx)`.
4. **Reemplaza los datos** por la query del módulo (`useX()`), y adapta la plantilla a los campos reales de `src/shared/types/models.ts` (p. ej. `professional.avatar_url`, no `image`; `rating.average`, no `rating`).
5. **Agrega los cuatro estados** (cargando con `BaseSkeleton`, error con `BaseAlert` + Reintentar, vacío con `BaseEmptyState`, contenido).
6. **Conserva el diseño, pero con piezas estándar**: cambia botones, tarjetas, badges e inputs hechos a mano por los componentes de `@/shared/ui`, y las listas de profesionales por `ProfessionalCard`. Fechas y precios con `@/shared/utils/format`. Mantén la composición y la jerarquía visual de la maqueta.
7. **Formularios de la maqueta** (p. ej. crear servicio): pásalos a VeeValidate + Zod con los nombres de campo del request (ver `src/modules/auth/components/LoginForm.vue`). Reemplaza `confirm()` por `BaseModal` y `alert()` por toasts.
8. **Borra lo que quedó sin uso**: tipos `Mock…`, arreglos de muestra, funciones de formato locales (`formatPrice`).
9. **Tests**: al menos el estado vacío y el de contenido de la vista, con la API mockeada.
10. **Verifica**: `npm run lint && npm run type-check && npx vitest run`, revisa la pantalla con las cuentas demo (`cliente@maestros.test` / `profesional@maestros.test`, contraseña `password`) y actualiza la tabla "Estado de los módulos" de `docs/arquitectura.md`.

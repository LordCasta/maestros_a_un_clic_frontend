---
trigger: glob
globs: "src/**/*.vue, src/**/*.css"
---

# Sistema de diseño (se activa al editar componentes o estilos)

Antes de escribir una clase de Tailwind, revisa estas reglas. Son obligatorias y CI las verifica.

## Resumen

- **Colores**: solo `primary-*` (marca, `primary-600` = #2563EB), `neutral-*` (texto/bordes), `success-*`, `danger-*`, `warning-*` (`warning-400` = estrellas), `info-*`, y `canvas`, `surface`, `surface-muted`, `white`, `black`. La paleta por defecto de Tailwind no existe en este proyecto.
- **Prohibido**: `bg-blue-600`, `text-gray-500`, `bg-[#2563EB]`, hex en `<style>`. En CSS usa `var(--color-primary-600)`.
- **Componentes**: importa de `@/shared/ui` (BaseButton, BaseInput, BaseSelect, BaseTextarea, BaseChoiceGroup, BaseFileInput, BaseStepper, BaseCard, BaseModal, BaseAlert, BaseBadge, BaseRating, BaseAvatar, BaseSkeleton, BaseEmptyState, BasePagination, BaseSpinner, BrandMark, ImageWithFallback). Tarjeta de profesional: `@/shared/components/ProfessionalCard.vue`.
- **Patrón de página**: contenedor `mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8` (listados) o `max-w-4xl` (detalles); encabezado con `h1 class="text-3xl font-black text-neutral-900"` y `p class="mt-1 text-neutral-500"`.
- **Verifica** con `npm run lint:tokens` y compara visualmente en `/_ui`.

## Guía completa

@[Sistema de diseño](../../docs/sistema-de-diseno.md)

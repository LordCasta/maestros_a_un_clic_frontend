---
trigger: glob
globs: "src/**/*.vue, src/**/*.css, src/**/*.ts"
---

# Sistema de diseño (se activa al editar componentes, estilos o código de src/)

Antes de escribir una clase de Tailwind o un color, revisa estas reglas. Son obligatorias y el CI las verifica.

## Resumen

- **Colores**: solo `primary-*` (marca, `primary-600`), `neutral-*` (texto/bordes), `success-*`, `danger-*`, `warning-*` (`warning-400` = estrellas), `info-*`, y `canvas`, `surface`, `surface-muted`, `white`, `black`. La paleta por defecto de Tailwind no existe en este proyecto.
- **Prohibido**: `bg-blue-600`, `text-gray-500`, `bg-[#…]`, `shadow-[…rgba(…)]`, y cualquier `#hex`, `rgb()` o `hsl()` en `style`, `:style`, `fill`/`stroke` de SVG, strings de TS o CSS. En CSS usa `var(--color-…)`.
- **Colores en JavaScript** (mapas, gráficas): `tokenColor('primary-600')` de `@/shared/utils/tokens`.
- **Logos con colores propios**: archivo en `src/assets/brand/` y `<img>`. Íconos: `@lucide/vue`.
- **Sombras**: solo `shadow-card` y `shadow-raised`. ¿Necesitas otra? Se agrega como token, no como valor arbitrario.
- **Componentes**: importa de `@/shared/ui` (BaseButton, BaseInput, BaseSelect, BaseTextarea, BaseChoiceGroup, BaseFileInput, BaseStepper, BaseCard, BaseModal, BaseAlert, BaseBadge, BaseRating, BaseAvatar, BaseSkeleton, BaseEmptyState, BasePagination, BaseSpinner, BrandMark, ImageWithFallback). Tarjeta de profesional: `@/shared/components/ProfessionalCard.vue`.
- **Patrón de página**: contenedor `mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8` (listados) o `max-w-4xl` (detalles); encabezado con `h1 class="text-3xl font-black text-neutral-900"` y `p class="mt-1 text-neutral-500"`.
- **Si `npm run lint:tokens` falla, corrige el color; nunca edites el verificador ni `main.css` para que pase** (AGENTS.md § Guardas). Compara visualmente en `/_ui`.

## Guía completa

@[Sistema de diseño](../../docs/sistema-de-diseno.md)

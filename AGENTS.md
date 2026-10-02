# Maestros a un clic — Frontend · Instrucciones para agentes de IA

Lee esto antes de escribir código. Aplica a cualquier asistente (Antigravity, Claude Code, Codex, Cursor…). Es un resumen: el detalle está en la documentación enlazada, y si algo choca, manda la documentación.

## Qué es

SPA en Vue 3 + TypeScript del marketplace que conecta clientes con maestros y profesionales del hogar en Medellín. Consume la API Laravel del repo `maestros_a_un_clic_backend` (`/api/v1`). Textos de la interfaz en **español de Colombia**.

## Lee antes de trabajar

| Documento | Para qué |
|-----------|----------|
| `docs/arquitectura.md` | Estructura por módulos, datos, formularios, rutas, tests |
| `docs/sistema-de-diseno.md` | Paleta, tipografía, forma, componentes base, accesibilidad |
| `CONTRIBUTING.md` | Ramas, commits, PRs, qué es de quién |
| Repo backend → `docs/api/convenciones.md` y `docs/api/endpoints.md` | Contrato de la API: formato de respuestas, errores, endpoints |
| `src/modules/favorites/` | **Módulo de referencia.** Ante la duda, copia su forma |
| `/_ui` con `npm run dev` | Catálogo vivo de colores y componentes |

## Reglas que no se negocian

### Estilo visual
1. **Solo tokens de color**: `primary`, `neutral`, `success`, `danger`, `warning`, `info`, `canvas`, `surface`, `surface-muted`, `white`, `black` (definidos en `src/app/main.css`). La paleta por defecto de Tailwind **está desactivada**: `bg-blue-600`, `text-gray-500` o `bg-[#2563EB]` no funcionan y `npm run lint:tokens` los rechaza.
2. **Componentes base primero** (`import { BaseButton, BaseInput, … } from '@/shared/ui'`). No crees un botón, input, tarjeta, modal o badge propio. Si falta un componente reutilizable, va a `src/shared/ui`, se muestra en `/_ui` y se documenta en `docs/sistema-de-diseno.md`.
3. **Escala fija**: títulos de página `text-3xl font-black`, secciones `text-xl font-black`, texto `text-neutral-700`, secundario `text-sm text-neutral-500`. Radios: `rounded-xl` controles, `rounded-3xl` tarjetas. Sombras: `shadow-card` y `shadow-raised`. Fuente única: Plus Jakarta Sans (ya aplicada).
4. **Íconos solo de `@lucide/vue`**. Nada de SVG pegado ni de otros paquetes.
5. Sin valores arbitrarios (`h-[500px]`, `rounded-[1.75rem]`) salvo casos únicos justificados.

### Código
6. `<script setup lang="ts">` siempre, con el bloque `<script>` antes de `<template>`. Props y emits tipados (`defineProps<{…}>()`).
7. **Estructura**: `src/app` (arranque, router, layouts), `src/shared` (lo común), `src/modules/<modulo>` (cada funcionalidad). `shared` nunca importa de `modules`. Un módulo importa a otro **solo desde su `index.ts`** (`@/modules/auth`), nunca un archivo interno.
8. **Datos del servidor con Pinia Colada** (`useQuery` / `useMutation` en `queries.ts`, keys en `<modulo>Keys`, las mutaciones invalidan). Pinia (stores) solo para sesión y toasts. Nunca `fetch` directo: siempre `http` de `@/shared/http/client`.
9. **Tipos de la API** solo en `src/shared/types/models.ts` (espejo de los Resources del backend). No declares tu propia versión de `Booking`, `Professional`, etc.
10. **Formularios con VeeValidate + Zod**. Los nombres de campo son los del request de la API (`snake_case`). Errores del servidor con `applyServerErrors(error, setErrors)`. Archivos con `useField<File | null>`.
11. **Vistas con cuatro estados**: cargando (`BaseSkeleton`), error (`BaseAlert` + Reintentar), vacío (`BaseEmptyState` con acción) y contenido.
12. **Feedback**: toast (`useToastStore`) para acciones completadas, `BaseAlert` para errores de formulario, `BaseModal` para confirmar. **Nunca** `alert()`, `confirm()` ni `prompt()`.
13. **Rutas por nombre** (`:to="{ name: 'professional-detail', params: { id } }"`), nombres en kebab-case con el área como prefijo (`client-bookings`). Fechas, dinero y duraciones con `@/shared/utils/format` (hora de Colombia, pesos sin decimales).
14. No inventes endpoints: usa los del contrato. Si falta uno, dilo en vez de simularlo con datos falsos.

## Antes de dar una tarea por terminada

Corre y deja en verde:

```bash
npm run lint          # oxlint + ESLint + tokens de diseño
npm run format        # Prettier
npm run type-check    # vue-tsc
npx vitest run        # tests
```

Si cambiaste rutas, layouts o algo de `src/shared`, corre también `npm run build`. Agrega tests en `__tests__/` para esquemas Zod y para el componente principal que tocaste (copia `src/modules/favorites/__tests__/FavoriteButton.spec.ts`).

## Procedimientos disponibles (skills)

- `.agents/skills/nuevo-modulo/` — crear un módulo nuevo siguiendo el patrón de favoritos.
- `.agents/skills/conectar-maqueta/` — reemplazar los datos de muestra de una vista por datos reales de la API.

## No hagas

- No edites `src/shared` ni `src/app` sin avisar en el PR: son de los dos desarrolladores.
- No agregues dependencias sin justificarlo en el PR. No quites `@emnapi/core` ni `@emnapi/runtime` aunque parezcan sin uso (ver `docs/arquitectura.md` § Dependencias).
- No toques módulos de otra persona (ver la tabla de responsables en `CONTRIBUTING.md` del backend).
- No borres ni desactives tests o reglas de lint para que algo pase.

# Sistema de diseño

Reglas visuales de Maestros a un clic. Todo lo de aquí está implementado: los tokens en `src/app/main.css`, los componentes en `src/shared/ui` y el catálogo vivo en **`/_ui`** (con `npm run dev`).

## 1. Principios

1. **Confianza primero.** Es un marketplace donde alguien deja entrar a un desconocido a su casa: la interfaz es limpia, clara y consistente. Nada de efectos que distraigan.
2. **Se arma con piezas existentes.** Antes de escribir estilos, busca el componente base. Si falta uno, se agrega a `shared/ui` (revisado por los dos) y al catálogo `/_ui`.
3. **Solo tokens.** Ningún color, fuente o sombra escrito a mano. `npm run lint:tokens` lo verifica en CI.

## 2. Color

La paleta por defecto de Tailwind **está desactivada**: `bg-blue-600` o `text-gray-500` no generan estilos. Solo existen estos tokens:

| Token | Uso | Ejemplos |
|-------|-----|----------|
| `primary-50…950` | Marca (azul del Figma, `primary-600` = `#2563EB`): botones principales, enlaces, foco, íconos destacados | `bg-primary-600`, `text-primary-700`, `bg-primary-50` |
| `neutral-50…950` | Texto, bordes y fondos neutros (escala slate del Figma) | `text-neutral-900` títulos, `text-neutral-500` secundario, `border-neutral-200` |
| `success-*` | Verificado, completado, confirmaciones | `text-success-600`, `bg-success-50` |
| `danger-*` | Errores, cancelar, eliminar | `bg-danger-600`, `text-danger-700` |
| `warning-*` | Pendientes, avisos. `warning-400` = estrellas de calificación | `bg-warning-50`, `fill-warning-400` |
| `info-*` | Información y acentos secundarios (degradados del dashboard) | `bg-info-50`, `text-info-700` |
| `canvas` | Fondo de página | `bg-canvas` (ya aplicado en `body`) |
| `surface` | Tarjetas y paneles | `bg-surface` |
| `surface-muted` | Bloques dentro de una tarjeta | `bg-surface-muted` |
| `white`, `black` | Puntuales (texto sobre primary, transparencias) | `text-white`, `bg-white/10` |

Reglas:
- Texto sobre fondo claro: `neutral-900` (títulos), `neutral-700` (lectura), `neutral-500` (secundario). Nunca más claro que `neutral-400` para texto.
- Un solo color de acción por pantalla: el botón principal es `primary`. Las acciones secundarias van `outline` o `ghost`.
- `danger` solo para acciones destructivas o errores, nunca como decoración.
- En estilos CSS usa las variables: `var(--color-primary-600)`.

## 3. Tipografía

Fuente única: **Plus Jakarta Sans** (variable, cargada desde npm con `@fontsource-variable`; no depende de Google Fonts).

| Uso | Clases |
|-----|--------|
| Título de página | `text-3xl font-black` (portada hasta `text-5xl`) |
| Título de sección | `text-xl font-black` o `font-bold` |
| Título de tarjeta | `text-lg font-bold` |
| Etiquetas, botones, énfasis | `text-sm font-semibold` |
| Texto de lectura | `text-base` o `text-sm`, `text-neutral-700`, `leading-6`/`leading-7` |
| Texto secundario | `text-sm text-neutral-500` |
| Ayudas y errores de campo | `text-xs` |

## 4. Forma y espacio

| Elemento | Radio | Otros |
|----------|-------|-------|
| Botones, inputs, selects | `rounded-xl` | Alto `h-11` (md), `h-9` (sm), `h-12` (lg) |
| Tarjetas (`BaseCard`) | `rounded-3xl` | `shadow-card`, borde `neutral-100` |
| Bloques dentro de tarjetas | `rounded-2xl` | `bg-surface-muted` |
| Héroes y bloques destacados | `rounded-4xl` | `shadow-raised` |
| Insignias, chips, avatares | `rounded-full` | |

- Sombras: solo `shadow-card` (reposo) y `shadow-raised` (hover, modales, toasts).
- Espaciado entre secciones: `space-y-6` / `space-y-8`. Dentro de tarjetas: `p-6` (`padding="md"`).
- Ancho de contenido: `max-w-7xl` (búsqueda, portada), `max-w-5xl` (listados), `max-w-4xl` (detalles).
- No uses valores arbitrarios (`rounded-[1.75rem]`, `h-[500px]`) salvo para casos únicos y justificados.

## 5. Componentes base

Importa siempre desde `@/shared/ui`.

| Componente | Cuándo usarlo |
|------------|---------------|
| `BaseButton` | Toda acción. Variantes `primary`, `secondary`, `outline`, `ghost`, `danger`; `loading` mientras se envía; `to` para navegar |
| `BaseInput`, `BaseSelect`, `BaseTextarea` | Campos con `label`, `hint` y `error`. Ícono con el slot `#icon` |
| `BaseChoiceGroup` | Selección múltiple en chips (especialidades) |
| `BaseFileInput` | Subida de archivos (uno o varios) |
| `BaseStepper` | Formularios de varios pasos |
| `BaseCard` | Contenedor estándar. `variant="muted"` para bloques internos; `interactive` si es clicable |
| `BaseModal` | Diálogos y confirmaciones (reemplaza `confirm()`) |
| `BaseAlert` | Mensajes en línea: error de formulario, aviso de verificación |
| `ToastContainer` + `useToastStore` | Confirmar que una acción se completó |
| `BaseBadge` | Estados y etiquetas. Para reservas: `BookingStatusBadge` |
| `BaseRating` | Calificación ★ 4,8 (12) |
| `BaseAvatar` | Foto de perfil con iniciales de respaldo |
| `BaseSkeleton` | Contenido cargando |
| `BaseEmptyState` | Listas vacías, siempre con una acción si existe |
| `BasePagination` | Listas paginadas de la API (`meta`) |
| `BaseSpinner` | Esperas cortas dentro de un botón o bloque |
| `BrandMark` | Logo |
| `ImageWithFallback` | Imágenes externas que pueden fallar |

Componentes de dominio compartidos (`src/shared/components`): `ProfessionalCard`.

## 6. Íconos

- Paquete único: **`@lucide/vue`** (`import { Heart } from '@lucide/vue'`). No mezclar con otros paquetes ni SVG pegados a mano.
- Tamaños: `size-4` dentro de botones y texto, `size-5` en navegación y campos, `size-6`/`size-7` en encabezados.
- Las categorías del backend traen `icon` con el nombre del ícono de lucide.
- Íconos decorativos con `aria-hidden="true"`; botones que solo tienen ícono, con `aria-label`.

## 7. Accesibilidad mínima

- Todo campo tiene `label` (los componentes base lo conectan solos).
- Foco visible: el contorno `primary-600` de `main.css`; no lo quites con `outline-none` sin dar otro indicador.
- Contraste: texto normal nunca más claro que `neutral-500` sobre blanco.
- Estados que no dependan solo del color: `BookingStatusBadge` tiene texto, el favorito tiene `aria-pressed`.
- Modales con `role="dialog"`, cierre con Esc y foco inicial (ya resuelto en `BaseModal`).

## 8. Cómo se hace cumplir

| Herramienta | Qué revisa |
|-------------|------------|
| `@theme { --color-*: initial }` | La paleta por defecto no existe: un color fuera de los tokens no genera estilo |
| `npm run lint:tokens` | Rechaza `bg-[#…]`, colores de la paleta de Tailwind y hex en `<style>` |
| Revisión de PR | Uso de componentes base y de la escala tipográfica |
| `/_ui` | Catálogo para comparar visualmente |

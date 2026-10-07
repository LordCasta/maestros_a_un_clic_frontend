# Cómo trabajamos

El flujo de trabajo es **el mismo en los dos repos**. La versión completa (reparto por módulos, tareas, ramas, commits, pull requests, cambios que afectan a los dos y definición de listo) está en el `CONTRIBUTING.md` del [backend](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/CONTRIBUTING.md).

**¿Primera vez?** Empieza por la [guía de trabajo](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/guia-de-trabajo.md): instalación de los dos repos y el paso a paso de un issue hasta `main`, con los comandos.

Resumen y lo propio del frontend:

## Ramas y commits

- `main` protegida; ramas cortas desde `main`: `feature/HU004-aceptar-reserva`, `fix/…`, `docs/…`, `chore/…`.
- Conventional Commits en español con el módulo como alcance: `feat(reservas): aceptar y rechazar solicitudes (HU004)`.
- PR con la plantilla y **CI en verde** (obligatorio: sin eso GitHub no deja fusionar). Se pide revisión a la otra persona; si en **48 horas** nadie revisó, el autor fusiona. Cambios en `src/shared`, `src/app` o el contrato de la API sí esperan su visto bueno. Siempre **Squash and merge**.
- Si el CI falla: [guía de trabajo § 4](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/guia-de-trabajo.md#4-si-el-ci-falla).
- Los issues de las HU están en el [repo del backend](https://github.com/LordCasta/maestros_a_un_clic_backend/issues). El PR del backend los referencia (`Refs #N`) y el del frontend, que se fusiona último, los cierra con `Closes LordCasta/maestros_a_un_clic_backend#N`.

## Antes de abrir un PR

```bash
npm run lint          # oxlint + ESLint + tokens de diseño
npm run format        # Prettier
npm run type-check
npx vitest run
npm run build
```

## Reglas propias del frontend

1. **Cada módulo es de una persona.** Trabaja dentro de `src/modules/<tu-modulo>/`. Otro módulo solo se usa por su `index.ts`.
2. **`src/shared/` y `src/app/` son de los dos.** Cualquier cambio ahí (un componente base, el cliente HTTP, el router) lo revisan ambos, aunque sea pequeño.
3. **Nada de colores, fuentes ni sombras a mano.** Solo tokens; si falta algo, se propone en `main.css` y se documenta en `docs/sistema-de-diseno.md`.
4. **Componentes base primero.** Si necesitas uno nuevo y reutilizable, va a `src/shared/ui`, al catálogo `/_ui` y a la tabla del sistema de diseño.
5. **Tipos de la API en un solo lugar.** Si cambia un Resource del backend, se actualiza `src/shared/types/models.ts` en el PR que acompaña al del backend.
6. **El contrato manda.** Un módulo nuevo empieza por los endpoints de `docs/api/endpoints.md` del backend. Si necesitas cambiarlos, se acuerda primero.

## Trabajo con asistentes de IA

Cada uno usa la herramienta que prefiera (Antigravity, Claude Code…). Todas leen las mismas instrucciones del repo:

| Archivo | Quién lo lee | Contenido |
|---------|--------------|-----------|
| `AGENTS.md` | Antigravity, Codex, Cursor (siempre activo) | Reglas esenciales y comandos de verificación. **Fuente única.** |
| `CLAUDE.md` | Claude Code | Solo importa `AGENTS.md` |
| `.agents/rules/sistema-de-diseno.md` | Antigravity, al editar `.vue`/`.css` | Paleta, componentes y patrones visuales (incluye `docs/sistema-de-diseno.md`) |
| `.agents/rules/arquitectura.md` | Antigravity, al editar `src/` | Estructura y patrones (incluye `docs/arquitectura.md`) |
| `.agents/skills/nuevo-modulo/` | Antigravity (y Claude Code, desde `CLAUDE.md`) | Procedimiento para crear un módulo como el de favoritos |
| `.agents/skills/conectar-maqueta/` | Ídem | Procedimiento para pasar una maqueta a datos reales |

Reglas:
- **Las reglas se cambian en la documentación, no en el chat.** Si el asistente debería hacer algo distinto, se actualiza `AGENTS.md` o `docs/` en un PR y lo revisan los dos. No dejes convenciones solo en tus reglas globales personales.
- **El asistente corre los chequeos** (`npm run lint`, `type-check`, `vitest`) antes de dar algo por terminado. Si no los corre, pídeselo.
- **Un PR hecho con IA se revisa igual que cualquier otro.** Quien lo abre responde por el código.
- Al pedir una tarea, indica el issue de la HU y el módulo. Ej.: *"Implementa HU019 (#19) en el módulo cuenta siguiendo AGENTS.md y la skill nuevo-modulo"*.

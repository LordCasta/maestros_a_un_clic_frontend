# Cómo trabajamos

El flujo de trabajo es **el mismo en los dos repos**. La versión completa (reparto por módulos, tareas, ramas, commits, pull requests, cambios que afectan a los dos y definición de listo) está en el `CONTRIBUTING.md` del [backend](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/CONTRIBUTING.md).

Resumen y lo propio del frontend:

## Ramas y commits

- `main` protegida; ramas cortas desde `main`: `feature/HU004-aceptar-reserva`, `fix/…`, `docs/…`, `chore/…`.
- Conventional Commits en español con el módulo como alcance: `feat(reservas): aceptar y rechazar solicitudes (HU004)`.
- PR con la plantilla, CI en verde, aprobado por la otra persona, **Squash and merge**.

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

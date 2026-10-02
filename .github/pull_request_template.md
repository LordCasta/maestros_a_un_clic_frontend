## Qué cierra

<!-- Los issues de las HU viven en el repo del backend: -->
Closes LordCasta/maestros_a_un_clic_backend#<!-- número del issue de la HU -->

PR del backend relacionado: <!-- enlace, si aplica -->

## Qué cambió

<!-- Qué se agregó o modificó, en pocas líneas. -->

## Cómo probarlo

<!-- Ruta, cuenta demo y pasos. Ej: /client/bookings con cliente@maestros.test → cancelar una reserva pendiente -->

## Capturas

<!-- Si cambia la interfaz: antes / después, en escritorio y en móvil. -->

## Checklist

- [ ] Sigue [docs/arquitectura.md](../docs/arquitectura.md): módulo autocontenido, imports por `index.ts`.
- [ ] Usa componentes de `@/shared/ui` y solo tokens de diseño.
- [ ] Vistas con los cuatro estados: cargando, error, vacío y contenido.
- [ ] Tests en `__tests__/` (esquemas y componente principal).
- [ ] `npm run lint`, `npm run type-check`, `npx vitest run` y `npm run build` en verde.
- [ ] Si cambia `src/shared` o `src/app`: la otra persona lo revisó.

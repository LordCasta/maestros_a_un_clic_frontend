# Maestros a un clic — Frontend

Aplicación web del marketplace que conecta clientes con maestros y profesionales del hogar en Medellín.

Vue 3 · TypeScript · Vite · Tailwind CSS 4 · Pinia + Pinia Colada · VeeValidate + Zod

Backend: [maestros_a_un_clic_backend](https://github.com/LordCasta/maestros_a_un_clic_backend)

## Documentación del proyecto

La documentación del proyecto completo (frontend y backend) vive en el repositorio del backend, junto a los issues:

| Documento                  | Markdown                                                                                                               | PDF                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Índice                     | [docs/proyecto](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/README.md)             | —                                                                                                                                            |
| Documento del proyecto     | [01](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/01-documento-del-proyecto.md)     | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/01-documento-del-proyecto.pdf)                     |
| Requisitos                 | [02](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/02-requisitos.md)                 | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/02-requisitos.pdf)                                 |
| Diagramas                  | [03](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/03-diagramas.md)                  | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/03-diagramas.pdf)                                  |
| Trazabilidad               | [04](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/04-trazabilidad.md)               | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/04-trazabilidad.pdf)                               |
| Pruebas                    | [05](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/05-pruebas.md)                    | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/05-pruebas.pdf)                                    |
| Despliegue y operación     | [06](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/06-despliegue-y-operacion.md)     | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/06-despliegue-y-operacion.pdf)                     |
| Seguridad y privacidad     | [07](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/07-seguridad-y-privacidad.md)     | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/07-seguridad-y-privacidad.pdf)                     |
| Decisiones de arquitectura | [08](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/08-decisiones-de-arquitectura.md) | [PDF](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/08-decisiones-de-arquitectura.pdf)                 |
| **Todo en un archivo**     | —                                                                                                                      | [documentacion-completa.pdf](https://github.com/LordCasta/maestros_a_un_clic_backend/blob/main/docs/proyecto/pdf/documentacion-completa.pdf) |

## Documentación técnica

| Documento                                              | Contenido                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)                     | Flujo de trabajo en equipo: ramas, commits, pull requests, asistentes de IA                 |
| [AGENTS.md](AGENTS.md)                                 | Instrucciones para asistentes de IA (Antigravity, Claude Code, Codex, Cursor)               |
| [docs/arquitectura.md](docs/arquitectura.md)           | Estructura por módulos, datos, formularios, rutas y checklist. **Leer antes de programar.** |
| [docs/sistema-de-diseno.md](docs/sistema-de-diseno.md) | Tokens, tipografía, componentes base y reglas visuales                                      |
| `/_ui`                                                 | Catálogo vivo del sistema de diseño (solo con `npm run dev`)                                |
| Contrato de la API                                     | Repo del backend → `docs/api/` y `http://127.0.0.1:8000/docs/api`                           |

## Instalación local

Requisitos: Node.js 20.19+ o 22.12+, y el backend corriendo (`composer dev` en su repo).

```bash
npm install
cp .env.example .env     # URL de la API y datos de Reverb
npm run dev              # http://localhost:5173
```

Cuentas demo (contraseña `password`): `cliente@maestros.test`, `profesional@maestros.test`, `pendiente@maestros.test` (cliente sin verificar). Vienen del `DemoSeeder` del backend.

## Comandos

| Comando              | Qué hace                                                         |
| -------------------- | ---------------------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                                           |
| `npm run build`      | Revisa tipos y genera `dist/`                                    |
| `npm run type-check` | Solo revisión de tipos (`vue-tsc`)                               |
| `npm run test:unit`  | Tests en modo observador (`npx vitest run` para una sola pasada) |
| `npm run lint`       | oxlint + ESLint + tokens de diseño + lockfile sincronizado       |
| `npm run fix`        | Corrige lo que se pueda automáticamente                          |
| `npm run format`     | Formatea `src/` con Prettier                                     |

GitHub Actions corre lint, formato, tipos, tests y build en cada pull request. Un cambio no se integra si alguno falla.

## Editor

VS Code con las extensiones recomendadas del repo (`.vscode/extensions.json`): Vue (Official), ESLint, Prettier, oxc y Vitest. Formatea y corrige al guardar.

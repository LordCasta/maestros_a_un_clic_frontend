**Manual de Usuario — Frontend (Maestros a un clic)**

**Versión:** 1.0
**Fecha:** 2026-05-27

**1. Introducción**

- Propósito: Este documento explica cómo usar y operar el frontend de la aplicación "Maestros a un clic" desde el punto de vista del usuario final (clientes y profesionales) y contiene notas básicas para tareas de mantenimiento y despliegue rápidas.

**2. Requisitos mínimos**

- Navegador moderno: Chrome, Edge, Firefox o Safari (últimas versiones recomendadas).
- Conexión a Internet estable para consumir APIs y mapas embebidos.

**3. Iniciar sesión y roles**

- La aplicación distingue dos roles principales: Cliente y Profesional.
- Acceso: desde la pantalla de Login (`/login`) ingresa email y contraseña.
- Al iniciar sesión correctamente, el usuario es redirigido automáticamente al dashboard correspondiente según su rol:
  - Cliente → Dashboard Cliente
  - Profesional → Dashboard Profesional
- Para iniciar sesión con otra cuenta es necesario cerrar sesión primero (botón "Cerrar sesión" en el encabezado).

**4. Navegación principal**

- Barra superior (Navbar): contiene el logotipo, búsqueda, acceso al perfil y el botón "Cerrar sesión".
- Sidebar: accesos rápidos a secciones relevantes según el rol (reservas, favoritos, servicios, agenda).
- Rutas clave:
  - Home: `/`
  - Login: `/login`
  - Registro Cliente: `/register-client`
  - Registro Profesional: `/register-professional`
  - Dashboard Cliente: `/client/dashboard`
  - Dashboard Profesional: `/professional/dashboard`
  - Perfil profesional (estático por ahora): `/professional/1`
  - Sobre mí (profesional): `/professional/about` (o ruta similar según la implementación)

**5. Funcionalidades destacadas**

- Buscar profesionales: usa la barra de búsqueda para filtrar por categoría o ubicación.
- Reservas: clientes pueden ver y gestionar sus reservas desde "Mis reservas".
- Favoritos: marca profesionales como favoritos y accede desde "Mis favoritos".
- Para profesionales: gestionar disponibilidad, servicios y subir certificados/portafolio.
- Mapas: Ambos dashboards integran un iframe de Google Maps para mostrar ubicaciones.

**6. Cómo cerrar sesión**

- Pulsa el botón "Cerrar sesión" en el Navbar. Esto limpia la sesión local y redirige al Login.

**7. Pantalla de perfil profesional (estática)**

- Actualmente la vista "Ver perfil" es estática y todos los enlaces apuntan a `/professional/1`.
- Si quieres que sea dinámica, contacta a un desarrollador para integrar el endpoint que devuelva datos del profesional y actualizar la vista para recibir un `id` como parámetro.

**8. Mantenimiento rápido (para desarrolladores)**

- Instalar dependencias:

```bash
npm install
```

- Ejecutar en modo desarrollo:

```bash
npm run dev
```

- Comprobar y ejecutar tests (si existen):

```bash
npm run test
```

**9. Cambios visuales frecuentes**

- Logotipo / Brand: componente central `src/components/common/BrandMark.vue` — editar aquí para cambiar la iconografía o texto.
- Footer: `src/components/common/AppFooter.vue` — se reutiliza en los dashboards.
- Mapas: componente `src/components/common/GoogleMapsEmbed.vue` contiene el `iframe` que se incrusta en los dashboards.

**10. Solución de problemas**

- Si la aplicación no redirige correctamente después del login: asegúrate de que el token y usuario estén almacenados en `localStorage` y que la tienda de auth (`src/stores/auth.ts`) esté hidratada.
- Errores de estilos/Tailwind: ejecutar el servidor de dev y revisar la consola para warnings; algunas utilidades personalizadas pueden necesitar ajustes si el linter/compilador los marca.
- Si el mapa no carga: confirmar la URL del `iframe` y las políticas de CORS/Google Maps embebidos.

**11. Solicitudes comunes de mejora**

- Hacer el perfil profesional dinámico: actualizar `src/views/public/ProfessionalDetail.vue` para usar la API y recibir `id` en la ruta.
- Ocultar enlaces de Login/Registro cuando el usuario esté autenticado: lógica en `src/components/layout/Navbar.vue`.
- Internacionalización (i18n): extraer cadenas de texto y agregar `vue-i18n`.

**12. Contacto y soporte**

- Para problemas de producción o integración con el backend, contactar al equipo de desarrollo con logs de consola y pasos para reproducir.

---

Este manual es una guía rápida; si quieres, puedo generar una versión más detallada (con capturas, ejemplos de cuentas de prueba, flujos de usuario paso a paso o traducciones). Indícame el formato preferido.

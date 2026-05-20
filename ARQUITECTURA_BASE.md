# 📐 Arquitectura - Maestros a un Clic Frontend

## Estructura de Carpetas Base (Creada)

```
src/
├── api/                       # Endpoints y comunicación HTTP
│   ├── axios.ts              # Configuración centralizada de Axios
│   ├── auth.ts               # Endpoints de autenticación
│   ├── professional.ts       # Endpoints de profesionales
│   ├── client.ts             # Endpoints del cliente
│   ├── booking.ts            # Endpoints de reservas
│   ├── favorite.ts           # Endpoints de favoritos
│   └── upload.ts             # Endpoints de carga de archivos
│
├── components/               # Componentes reutilizables
│   ├── common/               # Componentes globales
│   │   ├── Button.vue        # Botón genérico
│   │   ├── Card.vue          # Card genérica
│   │   ├── Modal.vue         # Modal genérico
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorAlert.vue
│   │
│   ├── auth/                 # Componentes de autenticación
│   │   ├── LoginForm.vue
│   │   ├── RegisterClientForm.vue
│   │   └── RegisterProfessionalForm.vue
│   │
│   ├── client/               # Componentes específicos del cliente
│   │   ├── ProfessionalCard.vue
│   │   ├── CategoryCard.vue
│   │   ├── BookingCard.vue
│   │   ├── SearchBar.vue
│   │   └── FilterPanel.vue
│   │
│   ├── professional/         # Componentes específicos del profesional
│   │   ├── BookingList.vue
│   │   ├── ProfileEditor.vue
│   │   ├── CertificateUpload.vue
│   │   └── PortfolioUpload.vue
│   │
│   └── layout/               # Componentes de layout
│       ├── Navbar.vue
│       └── Sidebar.vue
│
├── composables/              # Lógica reutilizable (Composition API)
│   ├── useAuth.ts            # Autenticación y sesión
│   ├── useFetch.ts           # Peticiones HTTP genéricas
│   ├── useValidation.ts      # Validaciones de formularios
│   └── useLocation.ts        # Geolocalización
│
├── config/                   # Configuración global
│   └── app.ts               # Variables y settings de la app
│
├── constants/                # Constantes
│   ├── roles.ts             # Roles de usuario
│   ├── colors.ts            # Paleta de colores
│   └── specialties.ts       # Especialidades disponibles
│
├── stores/                   # Pinia stores (State Management)
│   ├── auth.ts              # Estado de autenticación
│   ├── user.ts              # Estado del usuario actual
│   ├── professionals.ts     # Estado de profesionales
│   ├── bookings.ts          # Estado de reservas
│   ├── favorites.ts         # Estado de favoritos
│   └── ui.ts                # Estado de UI (notificaciones, etc)
│
├── types/                    # TypeScript types/interfaces
│   └── index.ts             # Tipos principales del proyecto
│
├── utils/                    # Funciones utilitarias
│   ├── validators.ts        # Validaciones
│   └── formatters.ts        # Formateo de datos
│
├── services/                 # Servicios de negocio
│   └── storage.ts           # LocalStorage/SessionStorage
│
├── layouts/                  # Layouts principales
│   ├── MainLayout.vue       # Layout principal (con navbar)
│   ├── AuthLayout.vue       # Layout para auth (sin navbar)
│   ├── ClientLayout.vue     # Layout para cliente
│   └── ProfessionalLayout.vue # Layout para profesional
│
├── views/                    # Páginas/Vistas
│   ├── auth/                # Vistas de autenticación
│   │   ├── Login.vue
│   │   ├── RegisterClient.vue
│   │   └── RegisterProfessional.vue
│   │
│   ├── public/              # Vistas públicas (sin login)
│   │   ├── Home.vue         # Landing page / inicio
│   │   ├── ProfessionalDetail.vue
│   │   └── SearchResults.vue
│   │
│   ├── client/              # Vistas para clientes autenticados
│   │   ├── Dashboard.vue
│   │   ├── BookingDetail.vue
│   │   ├── MyBookings.vue
│   │   └── MyFavorites.vue
│   │
│   └── professional/        # Vistas para profesionales autenticados
│       ├── Dashboard.vue
│       ├── MyServices.vue
│       └── Availability.vue
│
├── router/                   # Vue Router
│   └── index.ts             # Rutas configuradas
│
└── App.vue                  # Componente raíz
```

---

## 📋 Mejoras Implementadas vs Arquitectura Original

| Mejora                         | Descripción                                                       |
| ------------------------------ | ----------------------------------------------------------------- |
| **Composables**                | Lógica reutilizable para Composition API de Vue 3                 |
| **Types**                      | Carpeta dedicada a TypeScript interfaces/types                    |
| **Constants**                  | Valores constantes centralizados (roles, colores, especialidades) |
| **Utils**                      | Funciones utilitarias (validadores, formatters)                   |
| **Config**                     | Configuración centralizada de la aplicación                       |
| **Services**                   | Servicios de negocio (storage, etc)                               |
| **Components/layout**          | Separación clara de layout components                             |
| **Subdivisión de componentes** | Organización por dominio (auth, client, professional, common)     |

---

## 🎨 Paleta de Colores (Figma → Tailwind)

```
Azul Principal:   #2563EB (blue-600)
Azul Hover:       #1D4ED8 (blue-700)
Verde Éxito:      #10B981 (emerald-500)
Fondo Claro:      #F8FAFC (slate-50)
Fondo Secundario: #F4F7FB (slate-100)
```

---

## 📱 Vistas Identificadas (desde Figma)

### Públicas (Sin Login)

- ✅ **Home.vue** - Landing page con búsqueda, categorías, profesionales
- ✅ **ProfessionalDetail.vue** - Detalle de profesional
- ✅ **SearchResults.vue** - Resultados de búsqueda

### Autenticación

- ✅ **Login.vue** - Login con email/contraseña
- ✅ **RegisterClient.vue** - Registro cliente (2 pasos)
- ✅ **RegisterProfessional.vue** - Registro profesional (3 pasos)

### Cliente (Autenticado)

- ✅ **Dashboard.vue** - Dashboard principal del cliente
- ✅ **BookingDetail.vue** - Detalle de reserva
- ✅ **MyBookings.vue** - Mis reservas
- ✅ **MyFavorites.vue** - Mis favoritos

### Profesional (Autenticado)

- ✅ **Dashboard.vue** - Dashboard profesional
- ✅ **MyServices.vue** - Mis servicios
- ✅ **Availability.vue** - Disponibilidad

---

## 🧩 Componentes Planificados

### Comunes

- `Button.vue` - Botón reutilizable con variantes
- `Card.vue` - Card genérica
- `Modal.vue` - Modal reutilizable
- `LoadingSpinner.vue` - Spinner de carga
- `ErrorAlert.vue` - Alerta de error

### Layout

- `Navbar.vue` - Barra de navegación
- `Sidebar.vue` - Barra lateral

### Autenticación

- `LoginForm.vue` - Formulario de login
- `RegisterClientForm.vue` - Formulario registro cliente
- `RegisterProfessionalForm.vue` - Formulario registro profesional

### Cliente

- `ProfessionalCard.vue` - Card de profesional con rating
- `CategoryCard.vue` - Card de categoría
- `BookingCard.vue` - Card de reserva
- `SearchBar.vue` - Barra de búsqueda
- `FilterPanel.vue` - Panel de filtros

### Profesional

- `BookingList.vue` - Lista de reservas
- `ProfileEditor.vue` - Editor de perfil
- `CertificateUpload.vue` - Carga de certificados
- `PortfolioUpload.vue` - Carga de portafolio

---

## 📊 Stores (Pinia)

- **auth.ts** - Estado de autenticación (token, login/logout)
- **user.ts** - Usuario actual (datos, rol)
- **professionals.ts** - Profesionales listados
- **bookings.ts** - Reservas del usuario
- **favorites.ts** - Favoritos del cliente
- **ui.ts** - Estado de UI (notificaciones, modales)

---

## 🔌 API Endpoints (Mapeados)

Todos los endpoints del `api.md` estarán disponibles en:

- `api/auth.ts` - Endpoints de autenticación
- `api/professional.ts` - Endpoints GET profesionales
- `api/booking.ts` - Endpoints de reservas
- `api/favorite.ts` - Endpoints de favoritos
- `api/upload.ts` - Endpoint de carga de archivos
- `api/client.ts` - Endpoints específicos de cliente

---

## ✅ Estado Actual

**Estructura Base Completa:**

- ✅ Carpetas organizadas por dominio
- ✅ Archivos plantilla creados (sin código)
- ✅ Arquitectura escalable
- ✅ Convenciones Vue 3 + TypeScript
- ✅ Listo para implementación de código

**Próximos Pasos:**

1. Implementar tipos TypeScript (`types/index.ts`)
2. Crear constantes (`constants/*.ts`)
3. Configurar Axios (`api/axios.ts`)
4. Implementar composables (`composables/*.ts`)
5. Crear stores Pinia (`stores/*.ts`)
6. Implementar componentes comunes
7. Implementar vistas y componentes específicos

---

## 🎯 Convenciones a Seguir

✅ **Composition API** con `<script setup lang="ts">`
✅ **Tailwind CSS** para estilos
✅ **Naming PascalCase** para componentes `.vue`
✅ **camelCase** para archivos `.ts`
✅ **Tipos TypeScript** en todos los archivos
✅ **Comentarios en español** (documentación)
✅ **Props y emits** tipados
✅ **Mobile-first** responsive design
✅ **Colores de paleta** definida

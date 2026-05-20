## Maestros a un clic - API para Frontend

Este documento es una referencia de consumo para cliente web/mobile.

## Base URL y headers

- Base URL: `http://127.0.0.1:8000`
- Prefijo API: `/api`
- Header recomendado en todas las requests:
  - `Accept: application/json`
- Rutas protegidas:
  - `Authorization: Bearer <token>`

## Formato de respuesta

Exito:

```json
{
  "success": true,
  "message": "Texto opcional",
  "data": {}
}
```

Error validacion (422):

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field": ["Error..."]
  }
}
```

Error auth (401):

```json
{
  "message": "Unauthenticated."
}
```

## Flujo recomendado de autenticacion

1. Registrar o hacer login.
2. Guardar `data.token`.
3. Enviar token en `Authorization: Bearer <token>`.
4. Usar `/api/auth/me` para hidratar sesion.
5. En logout, eliminar token local del frontend.

---

## Endpoints

### Auth

### POST `/api/auth/register/client`
- Content-Type: `multipart/form-data`
- Publica: si

Campos:
- `name` (required)
- `email` (required, unique)
- `password` (required, min 8)
- `password_confirmation` (required)
- `selfie` (required, image)
- `document` (required, file)
- `commune` (optional)
- `latitude` (optional)
- `longitude` (optional)
- `phone` (optional)

Respuesta 201:

```json
{
  "success": true,
  "message": "Usuario registrado",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Cliente",
      "email": "juan@example.com",
      "role": "client"
    },
    "token": "plain_text_token"
  }
}
```

### POST `/api/auth/register/professional`
- Content-Type: `multipart/form-data`
- Publica: si

Campos:
- `name` (required)
- `email` (required, unique)
- `password` (required)
- `password_confirmation` (required)
- `description` (required, min 50)
- `experience_years` (required, integer >= 0)
- `specialties[]` (required, ids existentes)
- `hourly_rate` (optional)
- `profile_photo` (optional, image)
- `certificates[]` (optional, files)
- `portfolio_images[]` (optional, images)
- `commune` / `latitude` / `longitude` / `phone` (optional)

Respuesta 201:

```json
{
  "success": true,
  "message": "Profesional registrado",
  "data": {
    "user": {
      "id": 2,
      "email": "pro@example.com",
      "role": "professional"
    },
    "token": "plain_text_token"
  }
}
```

### POST `/api/auth/login`
- Content-Type: `application/json`
- Publica: si
- Rate limit: 10 intentos por minuto

Body:

```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

Respuesta 200:

```json
{
  "success": true,
  "message": "Autenticado",
  "data": {
    "token": "plain_text_token",
    "user": {
      "id": 1,
      "email": "juan@example.com",
      "role": "client"
    },
    "role": "client"
  }
}
```

### POST `/api/auth/logout`
- Protegida: si

Respuesta 200:

```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

### GET `/api/auth/me`
- Protegida: si

Respuesta 200:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "juan@example.com",
    "role": "client"
  }
}
```

---

### Professionals

### GET `/api/professionals`
- Publica: si
- Query params disponibles:
  - `commune`
  - `specialty_id`
  - `min_price`
  - `max_price`
  - `per_page` (default 15)

Ejemplo:

`/api/professionals?commune=Santiago&specialty_id=1&min_price=10000&max_price=50000&per_page=10`

Respuesta 200:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 0
  }
}
```

### GET `/api/professionals/{id}`
- Publica: si
- Respuesta 200 o 404

---

### Uploads

### POST `/api/uploads`
- Protegida: si
- Content-Type: `multipart/form-data`

Campos:
- `file` (required, `jpg,jpeg,png,pdf`, max 10MB)
- `folder` (optional, default `uploads`)

Respuesta 200:

```json
{
  "success": true,
  "data": {
    "path": "profiles/abc123.jpg",
    "url": "http://127.0.0.1:8000/storage/profiles/abc123.jpg"
  }
}
```

---

### Favorites

### GET `/api/favorites`
- Protegida: si
- Lista favoritos del cliente autenticado

### POST `/api/favorites/{professional}`
- Protegida: si
- `{professional}` debe ser un usuario con rol `professional`

Respuesta 201:

```json
{
  "success": true,
  "message": "Agregado a favoritos",
  "data": {
    "id": 1,
    "professional": {
      "id": 2,
      "name": "Carlos Pro"
    }
  }
}
```

### DELETE `/api/favorites/{professional}`
- Protegida: si

Respuesta 200:

```json
{
  "success": true,
  "message": "Eliminado de favoritos"
}
```

---

### Bookings

### POST `/api/bookings`
- Protegida: si
- Solo cliente autenticado
- Content-Type: `application/json`

Body:

```json
{
  "professional_id": 2,
  "service_description": "Instalación de grifería",
  "scheduled_date": "2026-06-01 14:00:00",
  "total": 45000
}
```

Reglas clave:
- `professional_id` requerido
- `scheduled_date` debe ser futura

### GET `/api/bookings`
- Protegida: si
- Si auth es professional: retorna bookings por `professional_id`
- Si auth es client: retorna bookings por `client_id`

### GET `/api/bookings/{id}`
- Protegida: si
- Requiere policy (solo involucrados o admin)

### POST `/api/bookings/{id}/cancel`
- Protegida: si
- Requiere policy (cliente duenio o admin)

---

### Dashboard cliente

### GET `/api/client/dashboard`
- Protegida: si

Respuesta 200:

```json
{
  "success": true,
  "data": {
    "active_bookings": [],
    "favorites": [],
    "nearby_professionals": [],
    "popular_categories": []
  }
}
```

## Errores comunes en frontend

1. Respuesta HTML en vez de JSON:
   - Enviar `Accept: application/json`
   - Verificar que la URL tenga prefijo `/api`

2. 401 en rutas protegidas:
   - Falta `Authorization: Bearer <token>`
   - Token expirado/eliminado

3. 422 en registros:
   - Falta `password_confirmation`
   - `specialties[]` vacio o IDs inexistentes
   - Archivos con mime o tamano no permitido

4. 429 en login:
   - Exceso de intentos por minuto


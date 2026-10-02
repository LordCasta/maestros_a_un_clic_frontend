import { http } from '@/shared/http/client'
import type { ApiSuccess } from '@/shared/types/api'
import type { Favorite } from '@/shared/types/models'

/**
 * Endpoints de favoritos (solo clientes). Contrato: backend/docs/api/endpoints.md § Favoritos
 *
 * Patrón de todos los módulos: un objeto `<modulo>Api` con una función por endpoint,
 * tipada con el envelope de la API. Sin lógica: eso va en queries.ts o en el componente.
 */
export const favoritesApi = {
  list: () => http.get<ApiSuccess<Favorite[]>>('/favorites'),
  add: (professionalId: number) => http.post<ApiSuccess<Favorite>>(`/favorites/${professionalId}`),
  remove: (professionalId: number) => http.delete<ApiSuccess<null>>(`/favorites/${professionalId}`),
}

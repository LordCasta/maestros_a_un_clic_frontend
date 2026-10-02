import type { User } from '@/shared/types/models'

/**
 * Persistencia de la sesión en localStorage. Solo la usa el store de auth.
 * El acceso está protegido con try/catch: en modo privado o con almacenamiento
 * bloqueado la app sigue funcionando (la sesión dura lo que dure la pestaña).
 */

const TOKEN_KEY = 'maestros.auth.token'
const USER_KEY = 'maestros.auth.user'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Sin almacenamiento disponible: se ignora.
  }
}

export const sessionStorage = {
  load(): { token: string | null; user: User | null } {
    const token = read(TOKEN_KEY)
    const rawUser = read(USER_KEY)
    try {
      return { token, user: rawUser ? (JSON.parse(rawUser) as User) : null }
    } catch {
      return { token, user: null }
    }
  },
  save(token: string, user: User): void {
    write(TOKEN_KEY, token)
    write(USER_KEY, JSON.stringify(user))
  },
  saveUser(user: User): void {
    write(USER_KEY, JSON.stringify(user))
  },
  clear(): void {
    write(TOKEN_KEY, null)
    write(USER_KEY, null)
  },
}

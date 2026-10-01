const TOKEN_KEY = 'maestros-a-un-clic.auth.token'
const USER_KEY = 'maestros-a-un-clic.auth.user'

const hasWindow = typeof window !== 'undefined'

const readValue = (key: string) => {
  if (!hasWindow) {
    return null
  }

  return window.localStorage.getItem(key)
}

const writeValue = (key: string, value: string) => {
  if (!hasWindow) {
    return
  }

  window.localStorage.setItem(key, value)
}

const removeValue = (key: string) => {
  if (!hasWindow) {
    return
  }

  window.localStorage.removeItem(key)
}

export const storage = {
  getToken() {
    return readValue(TOKEN_KEY)
  },
  setToken(token: string) {
    writeValue(TOKEN_KEY, token)
  },
  removeToken() {
    removeValue(TOKEN_KEY)
  },
  getUser<T>() {
    const rawUser = readValue(USER_KEY)

    if (!rawUser) {
      return null
    }

    try {
      return JSON.parse(rawUser) as T
    } catch {
      return null
    }
  },
  setUser(user: unknown) {
    writeValue(USER_KEY, JSON.stringify(user))
  },
  removeUser() {
    removeValue(USER_KEY)
  },
  clearAuth() {
    removeValue(TOKEN_KEY)
    removeValue(USER_KEY)
  },
}

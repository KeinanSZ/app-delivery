import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getCurrentUser, loginRequest } from '../services/api'
import type { User } from '../types'
import { AuthContext } from './auth-context'
const TOKEN_KEY = 'mesa-patio-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [checkingSession, setCheckingSession] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  useEffect(() => {
    let active = true
    if (!token) return () => { active = false }

    getCurrentUser(token)
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false)
      })

    return () => { active = false }
  }, [token])

  const signIn = useCallback(async (username: string, password: string) => {
    const result = await loginRequest(username, password)
    const nextToken = result.accessToken || result.token
    if (!nextToken) throw new Error('A API não retornou um token de acesso.')
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setCheckingSession(false)
    setUser({
      id: result.id,
      username: result.username,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      image: result.image,
    })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setCheckingSession(false)
  }, [])

  const value = useMemo(
    () => ({ user, token, checkingSession, signIn, signOut }),
    [user, token, checkingSession, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

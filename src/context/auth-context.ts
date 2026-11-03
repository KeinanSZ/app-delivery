import { createContext } from 'react'
import type { User } from '../types'

export interface AuthContextValue {
  user: User | null
  token: string | null
  checkingSession: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('pp_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [])

  const login = useCallback((u: User) => {
    setUser(u)
    sessionStorage.setItem('pp_user', JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('pp_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

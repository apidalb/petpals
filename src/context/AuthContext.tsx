'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Force clean auth state on app bootstrap so users are never auto-logged in.
    setUser(null)
    sessionStorage.removeItem('pp_user')
  }, [])

  const login = useCallback((u: User) => {
    setUser(u)
    sessionStorage.setItem('pp_user', JSON.stringify(u))
  }, [])

  const logout = useCallback(async () => {
    const supabase = createClient()
    try {
      await supabase.auth.signOut()
    } finally {
      setUser(null)
      sessionStorage.removeItem('pp_user')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

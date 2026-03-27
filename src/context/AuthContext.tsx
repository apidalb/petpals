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
    const supabase = createClient()
    let mounted = true

    const setFromSession = async (sessionUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', sessionUser.id)
        .maybeSingle()

      if (!mounted) return

      const nextUser: User = {
        id: sessionUser.id,
        email: sessionUser.email ?? '',
        name: (profile?.full_name as string) || (sessionUser.user_metadata?.full_name as string) || 'User',
        role: (profile?.role as 'adopter' | 'admin') || 'adopter',
      }

      setUser(nextUser)
      sessionStorage.setItem('pp_user', JSON.stringify(nextUser))
    }

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        await setFromSession(data.session.user)
        return
      }

      try {
        const stored = sessionStorage.getItem('pp_user')
        if (stored && mounted) setUser(JSON.parse(stored))
      } catch {}
    }

    bootstrap()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await setFromSession(session.user)
        return
      }

      if (!mounted) return
      setUser(null)
      sessionStorage.removeItem('pp_user')
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback((u: User) => {
    setUser(u)
    sessionStorage.setItem('pp_user', JSON.stringify(u))
  }, [])

  const logout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
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

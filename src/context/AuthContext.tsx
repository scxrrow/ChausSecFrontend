import { createContext, useContext, useState, type ReactNode } from 'react'
import { isAuthenticated, logout as apiLogout } from '../api/chaussec'

interface AuthContextValue {
  authenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  authenticated: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated)

  const login = () => setAuthenticated(true)
  const logout = () => {
    apiLogout()
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

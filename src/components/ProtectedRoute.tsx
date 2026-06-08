import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth()
  return authenticated ? <>{children}</> : <Navigate to="/login" replace />
}

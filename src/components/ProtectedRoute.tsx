import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function ProtectedRoute() {
  const { token, checkingSession } = useAuth()
  if (checkingSession) return <div className="screen-loader">Conferindo seu acesso…</div>
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

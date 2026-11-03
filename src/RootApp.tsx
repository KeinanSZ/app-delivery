import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { MenuPage } from './pages/MenuPage'

export default function RootApp() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/menu" element={<MenuPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  )
}

import { Navigate, Outlet } from 'react-router'
import { isTokenExpired } from '@/lib/utils'

const ProtectedRoute = (): React.JSX.Element => {
  const token = localStorage.getItem('tonin_token')
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('tonin_token')
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
export default ProtectedRoute

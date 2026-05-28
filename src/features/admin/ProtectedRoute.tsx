import { Navigate, Outlet } from 'react-router'
import { isTokenExpired } from '@/lib/utils'
import { TOKEN_KEY } from '@/lib/constants'

const ProtectedRoute = (): React.JSX.Element => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY)
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}
export default ProtectedRoute

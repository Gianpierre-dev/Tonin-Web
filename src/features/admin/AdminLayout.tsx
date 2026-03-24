import { Outlet } from 'react-router'

const AdminLayout = (): React.JSX.Element => {
  return <div className="min-h-screen flex"><nav className="w-64 border-r p-4">Admin</nav><main className="flex-1 p-4"><Outlet /></main></div>
}
export default AdminLayout

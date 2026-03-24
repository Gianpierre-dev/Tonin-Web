import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router'
import { Button } from '@/shared/ui/button'
import { MenuIcon, XIcon, LogOutIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/admin/estados', label: 'Estados' },
  { to: '/admin/frases', label: 'Frases' },
  { to: '/admin/uploads', label: 'Uploads' },
] as const

const AdminLayout = (): React.JSX.Element => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('tonin_token')
    navigate('/admin/login')
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-lg font-semibold">Tonin Admin</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menu"
        >
          <XIcon />
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" />
          Cerrar sesion
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r bg-popover transition-transform md:static md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-2 border-b px-4 h-12 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </Button>
          <span className="text-sm font-semibold">Tonin Admin</span>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

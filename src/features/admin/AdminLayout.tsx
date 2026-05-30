import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import { BrandLogo } from '@/shared/ui/BrandLogo'
import { MenuIcon, XIcon, LogOutIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TOKEN_KEY } from '@/lib/constants'

const NAV_ITEMS = [
  { to: '/admin/estados', key: 'admin.nav.estados' },
  { to: '/admin/frases', key: 'admin.nav.frases' },
  { to: '/admin/uploads', key: 'admin.nav.uploads' },
] as const

const AdminLayout = (): React.JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    navigate('/admin/login')
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <BrandLogo className="h-8" />
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label={t('admin.menu.close')}
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
            {t(item.key)}
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
          {t('admin.logout')}
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
            aria-label={t('admin.menu.open')}
          >
            <MenuIcon />
          </Button>
          <BrandLogo className="h-6" />
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

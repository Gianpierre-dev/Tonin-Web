import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import { BrandLogo } from '@/shared/ui/BrandLogo'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { login } from '@/shared/api/endpoints'
import { TOKEN_KEY } from '@/lib/constants'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import axios from 'axios'

const LoginScreen = (): React.JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { token } = await login(username, password)
      localStorage.setItem(TOKEN_KEY, token)
      navigate('/admin/estados')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError(t('admin.login.invalidCredentials'))
      } else {
        setError(t('admin.login.genericError'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-xl border bg-popover p-6 shadow-md">
        <BrandLogo className="mx-auto mb-2 h-12" />
        <h1 className="mb-6 text-center text-sm font-medium text-muted-foreground">
          {t('admin.panelTitle')}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">{t('admin.login.username')}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t('admin.login.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('admin.login.submitting') : t('admin.login.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen

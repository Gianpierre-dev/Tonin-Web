import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'
import { AudioProvider } from '@/shared/audio/AudioProvider'
import { HomeScreen } from '@/features/home/HomeScreen'
import { PhraseScreen } from '@/features/phrase/PhraseScreen'

const AdminLayout = lazy(() => import('@/features/admin/AdminLayout'))
const LoginScreen = lazy(() => import('@/features/admin/LoginScreen'))
const EstadosPage = lazy(() => import('@/features/admin/EstadosPage'))
const FrasesPage = lazy(() => import('@/features/admin/FrasesPage'))
const UploadsPage = lazy(() => import('@/features/admin/UploadsPage'))
const ProtectedRoute = lazy(() => import('@/features/admin/ProtectedRoute'))

const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AudioProvider>
          <Suspense fallback={<div className="min-h-screen bg-warm-black" />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/phrase/:moodName" element={<PhraseScreen />} />
              <Route path="/admin/login" element={<LoginScreen />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="estados" replace />} />
                  <Route path="estados" element={<EstadosPage />} />
                  <Route path="frases" element={<FrasesPage />} />
                  <Route path="uploads" element={<UploadsPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AudioProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

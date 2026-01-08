import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { AuthPage } from '@/pages/AuthPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { useTheme } from '@/hooks/useTheme'

type Page = 'dashboard' | 'projects' | 'settings'

function App() {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  // Initialize theme
  useTheme()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Cargando..." />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
          }}
        />
      </>
    )
  }

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={toggleSidebar}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {currentPage === 'dashboard' && <DashboardPage />}
              {currentPage === 'projects' && <ProjectsPage />}
              {currentPage === 'settings' && <SettingsPage />}
            </div>
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'glass-strong',
        }}
      />
    </AuthProvider>
  )
}

export default App

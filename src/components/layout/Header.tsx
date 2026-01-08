import { useState } from 'react'
import { motion } from 'framer-motion'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'
import { Sun, Moon, LogOut, User, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export const Header = ({ onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const user = useAuthStore((state) => state.user)
  const { theme, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Sesión cerrada')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 glass-strong border-b border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Menu button + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:inline">YectosPro</span>
          </div>
        </div>

        {/* Right: Theme toggle + User menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 p-0"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <span className="hidden md:inline text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.displayName || user?.email?.split('@')[0]}
              </span>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 glass-strong rounded-xl shadow-2xl p-2 z-50"
                >
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.displayName || 'Usuario'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

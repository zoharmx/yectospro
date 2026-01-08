import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Folder, Settings, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: 'dashboard' | 'projects' | 'settings'
  onPageChange: (page: 'dashboard' | 'projects' | 'settings') => void
}

export const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as const, label: 'Proyectos', icon: Folder },
    { id: 'settings' as const, label: 'Configuración', icon: Settings },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed left-0 top-0 bottom-0 w-64 z-50 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]',
          'glass-strong border-r border-slate-200 dark:border-slate-700',
          !isOpen && 'lg:hidden'
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden self-end p-2 mb-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id)
                    if (window.innerWidth < 1024) onClose()
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all-smooth',
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/50'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              YectosPro v2.0
              <br />
              <span className="text-[10px]">© 2024 Todos los derechos reservados</span>
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

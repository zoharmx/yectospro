import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { User, Shield } from 'lucide-react'

export const SettingsPage = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Configuración</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Administra tu cuenta y preferencias
        </p>
      </motion.div>

      <div className="grid gap-6">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Información de Usuario
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Nombre</label>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {user?.displayName || 'Sin nombre'}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Email</label>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {user?.email}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguridad
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Gestiona la seguridad de tu cuenta
            </p>
            <Button variant="outline">Cambiar Contraseña</Button>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass>
            <h2 className="text-xl font-semibold mb-2">Acerca de YectosPro</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Versión 2.0 - Plataforma profesional de gestión de proyectos
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

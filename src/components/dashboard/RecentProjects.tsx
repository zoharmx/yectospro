import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Project } from '@/types'
import { formatCurrency, formatRelativeTime } from '@/utils/formatting'
import { calculateProgress, calculateProjectStatus } from '@/utils/calculations'
import { Clock } from 'lucide-react'

interface RecentProjectsProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export const RecentProjects = ({ projects, onProjectClick }: RecentProjectsProps) => {
  const recentProjects = projects.slice(0, 5)

  const getStatusVariant = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'primary'
      case 'on_hold':
        return 'warning'
      default:
        return 'neutral'
    }
  }

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'in_progress':
        return 'En Progreso'
      case 'on_hold':
        return 'En Espera'
      default:
        return 'No Iniciado'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card glass>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Proyectos Recientes
        </h3>
        <div className="space-y-3">
          {recentProjects.map((project, index) => {
            const status = calculateProjectStatus(project)
            const progress = calculateProgress(project)

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => onProjectClick(project)}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all-smooth border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {project.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {project.client}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(status)} size="sm">
                    {getStatusLabel(status)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {formatCurrency(project.amountPaid)} / {formatCurrency(project.totalCost)}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatRelativeTime(project.createdAt)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )
          })}

          {recentProjects.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No hay proyectos recientes
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

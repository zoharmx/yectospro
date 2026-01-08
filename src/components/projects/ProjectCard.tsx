import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Project } from '@/types'
import { formatCurrency } from '@/utils/formatting'
import { calculateProgress, calculateProjectStatus } from '@/utils/calculations'
import { Edit, Trash2, DollarSign, CheckCircle } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
  onClick: () => void
  index?: number
}

export const ProjectCard = ({ project, onEdit, onDelete, onClick, index = 0 }: ProjectCardProps) => {
  const progress = calculateProgress(project)
  const status = calculateProjectStatus(project)
  const pendingAmount = project.totalCost - project.amountPaid

  const getStatusColor = (s: Project['status']): 'success' | 'primary' | 'neutral' | 'warning' => {
    switch (s) {
      case 'completed': return 'success'
      case 'in_progress': return 'primary'
      case 'on_hold': return 'warning'
      default: return 'neutral'
    }
  }

  const getStatusLabel = (s: Project['status']): string => {
    switch (s) {
      case 'completed': return 'Completado'
      case 'in_progress': return 'En Progreso'
      case 'on_hold': return 'En Espera'
      default: return 'No Iniciado'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover glass className="group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 truncate">{project.client}</p>
          </div>
          <Badge variant={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
        </div>

        {project.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">Progreso</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-600 dark:text-slate-400">Pagado</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {formatCurrency(project.amountPaid)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-600 dark:text-slate-400">Pendiente</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Stages */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span>
              {project.stages.filter((s) => s.completed).length} / {project.stages.length} etapas
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Eliminar
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

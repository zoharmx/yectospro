import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useProjects } from '@/hooks/useProjects'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ProjectsChart } from '@/components/dashboard/ProjectsChart'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { RecentProjects } from '@/components/dashboard/RecentProjects'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { calculateDashboardStats } from '@/utils/calculations'
import { formatCurrency } from '@/utils/formatting'
import {
  Folder,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Project } from '@/types'

export const DashboardPage = () => {
  const { projects, isLoading } = useProjects()
  const [, setSelectedProject] = useState<Project | null>(null)

  const stats = useMemo(() => calculateDashboardStats(projects), [projects])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="xl" text="Cargando dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Vista general de tus proyectos y finanzas
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Proyectos"
          value={stats.totalProjects}
          icon={Folder}
          color="primary"
          index={0}
        />
        <StatsCard
          title="Completados"
          value={stats.completedProjects}
          icon={CheckCircle}
          color="success"
          trend={{
            value: Math.round(stats.completionRate),
            isPositive: true,
          }}
          index={1}
        />
        <StatsCard
          title="En Progreso"
          value={stats.inProgressProjects}
          icon={Clock}
          color="warning"
          index={2}
        />
        <StatsCard
          title="Ingresos Totales"
          value={formatCurrency(stats.paidAmount)}
          icon={DollarSign}
          color="success"
          index={3}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Valor Total de Proyectos"
          value={formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          color="primary"
          index={4}
        />
        <StatsCard
          title="Pendiente por Cobrar"
          value={formatCurrency(stats.pendingAmount)}
          icon={DollarSign}
          color="warning"
          index={5}
        />
        <StatsCard
          title="Valor Promedio"
          value={formatCurrency(stats.averageProjectValue)}
          icon={TrendingUp}
          color="primary"
          index={6}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsChart projects={projects} />
        <RevenueChart projects={projects} />
      </div>

      {/* Recent Projects */}
      <RecentProjects projects={projects} onProjectClick={setSelectedProject} />
    </div>
  )
}

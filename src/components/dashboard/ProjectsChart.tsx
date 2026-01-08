import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card } from '@/components/ui/Card'
import { Project } from '@/types'
import { calculateProjectStatus } from '@/utils/calculations'
import { motion } from 'framer-motion'

interface ProjectsChartProps {
  projects: Project[]
}

export const ProjectsChart = ({ projects }: ProjectsChartProps) => {
  const chartData = useMemo(() => {
    const statusCount: Record<string, number> = {
      completed: 0,
      in_progress: 0,
      not_started: 0,
      on_hold: 0,
    }

    projects.forEach((project) => {
      const status = calculateProjectStatus(project)
      if (status) {
        statusCount[status] = (statusCount[status] || 0) + 1
      }
    })

    return [
      { name: 'Completados', value: statusCount.completed, color: '#10b981' },
      { name: 'En Progreso', value: statusCount.in_progress, color: '#6366f1' },
      { name: 'No Iniciados', value: statusCount.not_started, color: '#f59e0b' },
      { name: 'En Espera', value: statusCount.on_hold, color: '#ef4444' },
    ].filter((item) => item.value > 0)
  }, [projects])

  if (chartData.length === 0) {
    return (
      <Card glass>
        <h3 className="text-lg font-semibold mb-4">Distribución de Proyectos</h3>
        <div className="h-64 flex items-center justify-center text-slate-500">
          No hay proyectos para mostrar
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card glass>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Distribución de Proyectos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}

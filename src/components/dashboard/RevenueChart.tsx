import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Project } from '@/types'
import { formatCurrency } from '@/utils/formatting'
import { motion } from 'framer-motion'

interface RevenueChartProps {
  projects: Project[]
}

export const RevenueChart = ({ projects }: RevenueChartProps) => {
  const chartData = useMemo(() => {
    // Group projects by month
    const monthlyData: Record<string, { total: number; paid: number }> = {}

    projects.forEach((project) => {
      const date = project.createdAt.toDate()
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, paid: 0 }
      }

      monthlyData[monthKey].total += project.totalCost
      monthlyData[monthKey].paid += project.amountPaid
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        'Total Esperado': data.total,
        'Total Pagado': data.paid,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months
  }, [projects])

  if (chartData.length === 0) {
    return (
      <Card glass>
        <h3 className="text-lg font-semibold mb-4">Ingresos por Mes</h3>
        <div className="h-64 flex items-center justify-center text-slate-500">
          No hay datos para mostrar
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card glass>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Ingresos por Mes
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="Total Esperado" fill="#6366f1" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Total Pagado" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'success' | 'warning' | 'danger'
  index?: number
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  index = 0,
}: StatsCardProps) => {
  const colors = {
    primary: 'from-primary-500 to-purple-600',
    success: 'from-emerald-500 to-teal-600',
    warning: 'from-amber-500 to-orange-600',
    danger: 'from-rose-500 to-pink-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card glass className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {value}
            </h3>
            {trend && (
              <div
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-medium',
                  trend.isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'p-3 rounded-xl bg-gradient-to-br shadow-lg',
              colors[color]
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full opacity-20"></div>
      </Card>
    </motion.div>
  )
}

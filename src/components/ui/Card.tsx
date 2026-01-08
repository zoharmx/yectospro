import { HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  glass?: boolean
}

export const Card = ({ children, hover = false, glass = false, className, ...props }: CardProps) => {
  if (hover) {
    const MotionDiv = motion.div
    return (
      <MotionDiv
        className={cn(
          'rounded-xl p-6 transition-all-smooth cursor-pointer',
          glass
            ? 'glass shadow-lg'
            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md',
          className
        )}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 300 }}
        {...(props as any)}
      >
        {children}
      </MotionDiv>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all-smooth',
        glass
          ? 'glass shadow-lg'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

import React from 'react'
import { Card, CardContent } from './Card'
import { cn } from '@/lib/utils'

export interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple'
}

export function StatsCard({ title, value, icon, description, trend, color = 'indigo' }: StatsCardProps) {
  const iconColors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400',
    sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400',
  }

  return (
    <Card hover className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
          </div>
          {icon && (
            <div className={cn('p-3 rounded-xl border border-transparent shadow-xs', iconColors[color])}>
              {icon}
            </div>
          )}
        </div>
        {(description || trend) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {trend && (
              <span className={cn('font-semibold', trend.isPositive ? 'text-emerald-600' : 'text-rose-600')}>
                {trend.value}
              </span>
            )}
            {description && <span className="text-slate-500 dark:text-slate-400">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

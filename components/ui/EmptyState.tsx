import React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from './Button'

export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  icon = <Inbox className="h-10 w-10 text-slate-400" />,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">{icon}</div>
      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

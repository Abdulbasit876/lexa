import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
  hover?: boolean
}

export function Card({ className, glass = false, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-white text-slate-900 shadow-sm transition-all duration-200 dark:bg-slate-900 dark:text-slate-100 border-slate-200/80 dark:border-slate-800',
        glass && 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md',
        hover && 'hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-3 border-b border-slate-100 dark:border-slate-800/60', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-slate-500 dark:text-slate-400 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

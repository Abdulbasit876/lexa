import React from 'react'
import { getInitials, cn } from '@/lib/utils'

export interface AvatarProps {
  name: string
  image?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ name, image, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn('rounded-full object-cover border border-slate-200 dark:border-slate-800', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}

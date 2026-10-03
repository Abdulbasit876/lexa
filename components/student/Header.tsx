'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function StudentHeader({ user, student }: { user?: any; student?: any }) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Student Portal</h1>
        <Badge variant="success">Active Student</Badge>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/lectures" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Public Video Lectures <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <Avatar name={student?.fullName || user?.name || user?.username || 'Student'} size="sm" />
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold block text-slate-900 dark:text-slate-100">{student?.fullName || user?.name || user?.username}</span>
            <span className="text-[10px] text-slate-500 font-mono font-semibold">{student?.studentId || 'STUDENT'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Bell, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function AdminHeader({ title = 'Dashboard', user }: { title?: string; user?: any }) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
        <Badge variant="primary">Admin Portal</Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* Link to public website */}
        <Link href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Public Website <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        {/* User profile info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <Avatar name={user?.name || user?.username || 'Admin'} size="sm" />
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold block text-slate-900 dark:text-slate-100">{user?.name || user?.username || 'Administrator'}</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">SUPER ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  )
}

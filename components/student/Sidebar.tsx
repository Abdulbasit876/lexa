'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  GraduationCap,
  LayoutDashboard,
  User,
  BookOpen,
  Laptop,
  Video,
  CalendarCheck,
  CreditCard,
  Receipt,
  FileText,
  Award,
  ScrollText,
  Bell,
  Bot,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function StudentSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
    { href: '/dashboard/academic', label: 'My Academic Class', icon: BookOpen },
    { href: '/dashboard/courses', label: 'My Computer Courses', icon: Laptop },
    { href: '/dashboard/lectures', label: 'Public Lectures', icon: Video },
    { href: '/dashboard/attendance', label: 'My Attendance', icon: CalendarCheck },
    { href: '/dashboard/fees', label: 'Fee Status & Submit', icon: CreditCard },
    { href: '/dashboard/payments', label: 'My Payments', icon: Receipt },
    { href: '/dashboard/tests', label: 'Tests', icon: FileText },
    { href: '/dashboard/results', label: 'Results', icon: Award },
    { href: '/dashboard/certificates', label: 'My Certificates', icon: ScrollText },
    { href: '/dashboard/announcements', label: 'Announcements', icon: Bell },
    { href: '/dashboard/ai-tutor', label: 'Lexa AI Tutor', icon: Bot },
    { href: '/dashboard/support', label: 'Support & Contact', icon: HelpCircle },
  ]

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0d1322] text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-white tracking-tight uppercase text-sm block">Academy Lexa</span>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Student Portal</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn('hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30', collapsed ? 'w-20' : 'w-64')}>
        {SidebarContent}
      </aside>

      {/* Mobile Toggle & Drawer */}
      <div className="lg:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 rounded-xl bg-slate-900 text-white shadow-lg border border-slate-800"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full z-10 animate-in slide-in-from-left duration-200">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

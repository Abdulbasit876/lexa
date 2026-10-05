import React from 'react'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/ui/StatsCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  CreditCard,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Bell,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils'

export default async function AdminDashboardPage() {
  // Aggregate real DB counts
  const totalStudents = await prisma.student.count()
  const activeStudents = await prisma.student.count({ where: { status: 'ACTIVE' } })
  const leftStudents = await prisma.student.count({ where: { status: 'LEFT' } })

  // Today's attendance percentage
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayAttendanceCount = await prisma.attendance.count({
    where: { date: today, status: 'PRESENT' },
  })
  const attendanceRate = activeStudents > 0 ? Math.round((todayAttendanceCount / activeStudents) * 100) : 0

  // Financial aggregates for current month
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const paidFees = await prisma.fee.aggregate({
    where: { month: currentMonthStart },
    _sum: { paidAmount: true },
  })
  const pendingFees = await prisma.fee.aggregate({
    where: { month: currentMonthStart, status: 'PENDING' },
    _sum: { amount: true },
  })

  // Recent Admissions
  const recentAdmissions = await prisma.admission.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { student: true, academicClass: true },
  })

  // Recent Payments for review
  const pendingPayments = await prisma.payment.findMany({
    where: { status: 'PENDING_REVIEW' },
    take: 5,
    include: { student: true },
    orderBy: { createdAt: 'desc' },
  })

  // Recent Announcements
  const recentAnnouncements = await prisma.announcement.findMany({
    take: 4,
    orderBy: { date: 'desc' },
  })

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back, Admin 👋</h2>
          <p className="text-xs text-slate-500 mt-1">Here&apos;s what&apos;s happening in your academy today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/students/new">
            <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
              Add Student
            </Button>
          </Link>
          <Link href="/admin/attendance">
            <Button variant="outline" size="sm" icon={<CalendarCheck className="h-4 w-4" />}>
              Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 MAIN KPI STAT CARDS MATCHING REFERENCE DESIGN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          color="indigo"
          icon={<Users className="h-6 w-6" />}
          description="Registered student accounts"
        />
        <StatsCard
          title="Active Students"
          value={activeStudents}
          color="emerald"
          icon={<UserCheck className="h-6 w-6" />}
          description="Currently enrolled"
        />
        <StatsCard
          title="Left Students"
          value={leftStudents}
          color="amber"
          icon={<UserX className="h-6 w-6" />}
          description="Preserved historical records"
        />
        <StatsCard
          title="Today's Attendance"
          value={`${attendanceRate}%`}
          color="sky"
          icon={<CalendarCheck className="h-6 w-6" />}
          description="Students present today"
        />
      </div>

      {/* 2 FINANCIAL COLLECTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatsCard
          title="This Month's Collection"
          value={formatCurrency(Number(paidFees._sum.paidAmount || 0))}
          color="indigo"
          icon={<CreditCard className="h-6 w-6" />}
          description="Total fee collected in current month"
        />
        <StatsCard
          title="Pending Fees"
          value={formatCurrency(Number(pendingFees._sum.amount || 0))}
          color="rose"
          icon={<AlertCircle className="h-6 w-6" />}
          description="Outstanding uncollected fees"
        />
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RECENT ADMISSIONS (7 COLS) */}
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Admissions</CardTitle>
              <CardDescription>New student joinings and course enrollments</CardDescription>
            </div>
            <Link href="/admin/admissions">
              <Button variant="ghost" size="sm" icon={<ArrowUpRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAdmissions.map((adm) => (
                <div key={adm.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar name={adm.student.fullName} size="md" />
                    <div>
                      <Link href={`/admin/students/${adm.student.id}`} className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600">
                        {adm.student.fullName}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {adm.academicClass?.name || 'Computer Student'} • Joined {formatDate(adm.admissionDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">{formatCurrency(Number(adm.monthlyFee))}/mo</Badge>
                    <span className="block text-[11px] text-slate-400 mt-1">{timeAgo(adm.createdAt)}</span>
                  </div>
                </div>
              ))}

              {recentAdmissions.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500">No recent admissions found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* PENDING PAYMENTS & ANNOUNCEMENTS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* PENDING PAYMENT SUBMISSIONS REVIEW */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-600" /> Pending Payments
                </CardTitle>
                <CardDescription>Manual student payment submissions</CardDescription>
              </div>
              <Link href="/admin/payments">
                <Button variant="ghost" size="sm">
                  Review
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingPayments.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">{p.student.fullName}</span>
                      <span className="text-[11px] text-slate-500">
                        {p.paymentMethod} • Ref: {p.transactionRef || 'N/A'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-emerald-600 block">{formatCurrency(Number(p.amount))}</span>
                      <Badge variant="warning" size="sm">PENDING</Badge>
                    </div>
                  </div>
                ))}

                {pendingPayments.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No pending payment submissions.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* LATEST ANNOUNCEMENTS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-500" /> Academy Announcements
                </CardTitle>
              </div>
              <Link href="/admin/announcements">
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recentAnnouncements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{ann.title}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(ann.date)}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{ann.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

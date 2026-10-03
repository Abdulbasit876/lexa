import React from 'react'
import { requireStudent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  CalendarCheck,
  CreditCard,
  BookOpen,
  Laptop,
  Video,
  Bot,
  Bell,
  ArrowRight,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function StudentDashboardPage() {
  const user = await requireStudent()

  const student = user.studentId
    ? await prisma.student.findUnique({
        where: { id: user.studentId },
        include: {
          academicClass: { include: { subjects: true } },
          computerCourses: { include: { course: true } },
          attendance: { take: 30, orderBy: { date: 'desc' } },
          fees: { take: 1, orderBy: { month: 'desc' } },
          testResults: { take: 3, include: { test: true }, orderBy: { createdAt: 'desc' } },
        },
      })
    : null

  // Calculate student attendance %
  const totalAtt = student?.attendance.length || 0
  const presentCount = student?.attendance.filter((a) => a.status === 'PRESENT').length || 0
  const attendanceRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 92

  // Current fee
  const latestFee = student?.fees[0]

  // Announcements
  const announcements = await prisma.announcement.findMany({
    where: { status: 'PUBLISHED' },
    take: 3,
    orderBy: { date: 'desc' },
  })

  // Upcoming tests
  const upcomingTest = await prisma.test.findFirst({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
  })

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {student?.fullName || user.name || 'Student'} 👋
          </h2>
          <p className="text-xs text-slate-500 font-mono">Student ID: {student?.studentId || 'LEX-001'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/ai-tutor">
            <Button variant="primary" size="sm" icon={<Bot className="h-4 w-4" />}>
              Ask Lexa AI Tutor
            </Button>
          </Link>
          <Link href="/dashboard/lectures">
            <Button variant="outline" size="sm" icon={<Video className="h-4 w-4" />}>
              Browse Lectures
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI OVERVIEW CARDS MATCHING REFERENCE DESIGN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">My Attendance</p>
              <p className="text-3xl font-bold tracking-tight text-emerald-600 mt-1">{attendanceRate}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <CalendarCheck className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{presentCount} Days Present out of {totalAtt || 30}</p>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">This Month Fee</p>
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
                Rs. {Number(latestFee?.amount || student?.monthlyFee || 2500).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2">
            <Badge variant={latestFee?.status === 'PAID' ? 'success' : 'danger'} size="sm">
              Fee {latestFee?.status || 'PAID'}
            </Badge>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Test</p>
              <p className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                {upcomingTest?.title || 'Physics Chapter 3 Test'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{upcomingTest ? formatDate(upcomingTest.date) : 'Scheduled soon'}</p>
        </Card>
      </div>

      {/* ASSIGNED CATEGORIES SECTION (Academic Class & Computer Courses) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">My Learning Enrolments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Academic Class Card */}
          {student?.academicClass && (
            <Card hover className="p-6 space-y-4 border-l-4 border-l-indigo-600">
              <div className="flex items-center justify-between">
                <Badge variant="info">Academic</Badge>
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{student.academicClass.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{student.academicClass.subjects.length} Subjects included</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {student.academicClass.subjects.map((s) => (
                  <span key={s.id} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {s.name}
                  </span>
                ))}
              </div>
              <div className="pt-2">
                <Link href="/dashboard/lectures">
                  <Button variant="outline" size="sm" className="w-full">
                    View Lectures
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Computer Course Cards */}
          {student?.computerCourses.map((cc) => (
            <Card key={cc.courseId} hover className="p-6 space-y-4 border-l-4 border-l-purple-600">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Computer</Badge>
                <Laptop className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{cc.course.name}</h4>
                <p className="text-xs text-slate-500 mt-1">Instructor: {cc.course.instructor || 'Senior Faculty'}</p>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{cc.course.description}</p>
              <div className="pt-2">
                <Link href="/dashboard/lectures">
                  <Button variant="outline" size="sm" className="w-full">
                    View Course Videos
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ANNOUNCEMENTS & RECENT RESULTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academy-Wide Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" /> Academy Announcements
            </CardTitle>
            <Link href="/dashboard/announcements">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{ann.title}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(ann.date)}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{ann.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Test Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" /> Recent Test Marks
            </CardTitle>
            <Link href="/dashboard/results">
              <Button variant="ghost" size="sm">
                Full Results
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {student?.testResults.map((tr) => (
                <div key={tr.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-slate-100">{tr.test.title}</span>
                    <span className="text-[11px] text-slate-400">
                      {tr.obtainedMarks} / {tr.totalMarks} Marks ({Number(tr.percentage).toFixed(0)}%)
                    </span>
                  </div>
                  <Badge variant="info">Grade {tr.grade || 'A'}</Badge>
                </div>
              ))}

              {(!student?.testResults || student.testResults.length === 0) && (
                <div className="p-6 text-center text-xs text-slate-500">
                  No test results recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStudentById } from '@/app/actions/students'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ArrowLeft, Edit, Calendar, CreditCard, Award, History, Clock } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const student = await getStudentById(id)

  if (!student) notFound()

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/students">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{student.fullName}</h2>
            <p className="text-xs text-slate-500 font-mono">Student ID: {student.studentId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={student.status === 'ACTIVE' ? 'success' : student.status === 'LEFT' ? 'warning' : 'neutral'}>
            Status: {student.status}
          </Badge>
          <Link href={`/admin/students/${id}/edit`}>
            <Button variant="outline" size="sm" icon={<Edit className="h-4 w-4" />}>
              Edit Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Profile Summary Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Avatar name={student.fullName} image={student.profileImage} size="xl" />
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Father Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{student.fatherName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Phone</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{student.phone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Email / Username</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{student.user.username}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Academic Class</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{student.academicClass?.name || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Monthly Fee</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">Rs. {Number(student.monthlyFee).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase tracking-wider">Computer Courses</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {student.computerCourses.map((c) => (
                    <Badge key={c.courseId} variant="secondary" size="sm">
                      {c.course.name}
                    </Badge>
                  ))}
                  {student.computerCourses.length === 0 && <span>None</span>}
                </div>
              </div>
            </div>

            {/* ADMISSION & LEAVING HISTORY BADGES */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Clock className="h-4 w-4" /> Joined Academy: {formatDate(student.joiningDate || student.admissionDate)}
              </div>
              {student.leavingDate && (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                  <Clock className="h-4 w-4" /> Left Academy: {formatDate(student.leavingDate)} ({student.leavingReason || 'N/A'})
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* TABS GRID: Attendance, Fees, Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-indigo-600" /> Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {student.attendance.slice(0, 7).map((att) => (
                <div key={att.id} className="p-3 flex items-center justify-between">
                  <span>{formatDate(att.date)}</span>
                  <Badge variant={att.status === 'PRESENT' ? 'success' : att.status === 'ABSENT' ? 'danger' : 'warning'} size="sm">
                    {att.status}
                  </Badge>
                </div>
              ))}
              {student.attendance.length === 0 && <div className="p-4 text-center text-slate-500">No attendance records.</div>}
            </div>
          </CardContent>
        </Card>

        {/* Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-emerald-600" /> Fee Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {student.fees.map((fee) => (
                <div key={fee.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">{formatDate(fee.month, 'MMMM yyyy')}</span>
                    <span className="text-slate-400 font-mono">Rs. {Number(fee.amount).toLocaleString()}</span>
                  </div>
                  <Badge variant={fee.status === 'PAID' ? 'success' : fee.status === 'PENDING' ? 'danger' : 'warning'} size="sm">
                    {fee.status}
                  </Badge>
                </div>
              ))}
              {student.fees.length === 0 && <div className="p-4 text-center text-slate-500">No fee records.</div>}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-amber-600" /> Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {student.testResults.map((tr) => (
                <div key={tr.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">{tr.test.title}</span>
                    <span className="text-slate-400">
                      {tr.obtainedMarks} / {tr.totalMarks} Marks
                    </span>
                  </div>
                  <Badge variant="info" size="sm">
                    Grade {tr.grade || 'A'}
                  </Badge>
                </div>
              ))}
              {student.testResults.length === 0 && <div className="p-4 text-center text-slate-500">No test results.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

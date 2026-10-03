import React from 'react'
import { requireStudent } from '@/lib/auth'
import { getStudentAttendanceHistory } from '@/app/actions/attendance'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CalendarCheck } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function StudentAttendancePage() {
  const user = await requireStudent()
  const history = user.studentId ? await getStudentAttendanceHistory(user.studentId) : []

  const total = history.length
  const present = history.filter((a) => a.status === 'PRESENT').length
  const absent = history.filter((a) => a.status === 'ABSENT').length
  const leave = history.filter((a) => a.status === 'LEAVE').length
  const percentage = total > 0 ? Math.round((present / total) * 100) : 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CalendarCheck className="h-6 w-6 text-emerald-600" /> My Attendance History
        </h2>
        <p className="text-xs text-slate-500">Summary of your attendance records and daily logs.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Attendance Rate</span>
          <span className="text-2xl font-bold text-emerald-600 block">{percentage}%</span>
        </Card>
        <Card className="p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Present Days</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block">{present}</span>
        </Card>
        <Card className="p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Absent Days</span>
          <span className="text-2xl font-bold text-rose-600 block">{absent}</span>
        </Card>
        <Card className="p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Leave Days</span>
          <span className="text-2xl font-bold text-amber-600 block">{leave}</span>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Class / Course</th>
                <th className="p-4">Status</th>
                <th className="p-4">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {history.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{formatDate(att.date)}</td>
                  <td className="p-4">
                    {att.academicClass ? (
                      <Badge variant="info">{att.academicClass.name}</Badge>
                    ) : att.computerCourse ? (
                      <Badge variant="secondary">{att.computerCourse.name}</Badge>
                    ) : (
                      'General'
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={att.status === 'PRESENT' ? 'success' : att.status === 'ABSENT' ? 'danger' : 'warning'}>
                      {att.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">{att.note || '—'}</td>
                </tr>
              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

import React from 'react'
import { requireStudent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'

export default async function StudentProfilePage() {
  const user = await requireStudent()

  const student = user.studentId
    ? await prisma.student.findUnique({
        where: { id: user.studentId },
        include: { user: true, academicClass: true, computerCourses: { include: { course: true } } },
      })
    : null

  if (!student) return <div>Profile not found.</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Student Profile</h2>
        <p className="text-xs text-slate-500">Personal information and enrolled program details.</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <Avatar name={student.fullName} size="xl" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{student.fullName}</h3>
            <p className="text-xs text-slate-500 font-mono">Student ID: {student.studentId}</p>
            <div className="mt-2">
              <Badge variant="success">Status: {student.status}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
          <div><span className="text-slate-400 font-semibold uppercase tracking-wider block">Father Name</span><span className="font-bold text-slate-900 dark:text-slate-100">{student.fatherName || '—'}</span></div>
          <div><span className="text-slate-400 font-semibold uppercase tracking-wider block">Phone</span><span className="font-bold text-slate-900 dark:text-slate-100">{student.phone || '—'}</span></div>
          <div><span className="text-slate-400 font-semibold uppercase tracking-wider block">Email</span><span className="font-bold text-slate-900 dark:text-slate-100">{student.email || student.user.email}</span></div>
          <div><span className="text-slate-400 font-semibold uppercase tracking-wider block">Joined Date</span><span className="font-bold text-slate-900 dark:text-slate-100">{formatDate(student.joiningDate || student.admissionDate)}</span></div>
          <div><span className="text-slate-400 font-semibold uppercase tracking-wider block">Academic Class</span><span className="font-bold text-indigo-600">{student.academicClass?.name || 'None'}</span></div>
          <div><span className="text-slate-400 font-semibold uppercase tracking-wider block">Monthly Fee</span><span className="font-bold text-slate-900 dark:text-slate-100">Rs. {Number(student.monthlyFee).toLocaleString()}</span></div>
        </div>
      </Card>
    </div>
  )
}

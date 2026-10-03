import React from 'react'
import { getAdmissions } from '@/app/actions/admissions'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminAdmissionsPage() {
  const admissions = await getAdmissions()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admissions Record</h2>
        <p className="text-xs text-slate-500">History of all student joinings, assigned classes, and initial fee terms.</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Admission Date</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Academic Class</th>
                <th className="p-4">Computer Courses</th>
                <th className="p-4">Monthly Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {admissions.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={adm.student.fullName} size="sm" />
                      <div>
                        <Link href={`/admin/students/${adm.student.id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 block">
                          {adm.student.fullName}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">{adm.student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{formatDate(adm.admissionDate)}</td>
                  <td className="p-4">{formatDate(adm.joiningDate || adm.admissionDate)}</td>
                  <td className="p-4">
                    {adm.academicClass ? <Badge variant="info">{adm.academicClass.name}</Badge> : <span className="text-slate-400">None</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {adm.courses.map((c) => (
                        <Badge key={c.courseId} variant="secondary" size="sm">
                          {c.course.name}
                        </Badge>
                      ))}
                      {adm.courses.length === 0 && <span className="text-slate-400">None</span>}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">Rs. {Number(adm.monthlyFee).toLocaleString()}</td>
                </tr>
              ))}

              {admissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No admission records found.
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

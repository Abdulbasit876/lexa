import React from 'react'
import { requireStudent } from '@/lib/auth'
import { getTestResults } from '@/app/actions/tests'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Award, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function StudentResultsPage() {
  const user = await requireStudent()
  const results = user.studentId ? await getTestResults({ studentId: user.studentId }) : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="h-6 w-6 text-amber-600" /> My Test Results & Grades
        </h2>
        <p className="text-xs text-slate-500">View test performance history and grade reports.</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Test Title</th>
                <th className="p-4">Class / Subject</th>
                <th className="p-4">Date</th>
                <th className="p-4">Obtained / Total Marks</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{r.test.title}</td>
                  <td className="p-4 text-slate-500">
                    {r.test.academicClass ? r.test.academicClass.name : r.test.computerCourse ? r.test.computerCourse.name : '—'}
                  </td>
                  <td className="p-4">{formatDate(r.test.date)}</td>
                  <td className="p-4 font-mono font-bold">
                    {r.obtainedMarks} / {r.totalMarks}
                  </td>
                  <td className="p-4 font-bold text-indigo-600">{Number(r.percentage).toFixed(1)}%</td>
                  <td className="p-4">
                    <Badge variant="info">Grade {r.grade || 'A'}</Badge>
                  </td>
                </tr>
              ))}

              {results.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No test results recorded for your account yet.
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

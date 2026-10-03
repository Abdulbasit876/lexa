import React from 'react'
import Link from 'next/link'
import { getStudents } from '@/app/actions/students'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { UserPlus, Search, Eye, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; classId?: string; courseId?: string }>
}) {
  const params = await searchParams
  const search = params.q
  const status = params.status as any
  const academicClassId = params.classId
  const computerCourseId = params.courseId

  const students = await getStudents({ search, status, academicClassId, computerCourseId })
  const classes = await getAcademicClasses()
  const courses = await getComputerCourses()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Students Management</h2>
          <p className="text-xs text-slate-500">View and manage all registered student accounts and category assignments.</p>
        </div>
        <Link href="/admin/students/new">
          <Button variant="primary" size="md" icon={<UserPlus className="h-4 w-4" />}>
            Add New Student
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            name="q"
            defaultValue={search || ''}
            placeholder="Search student name, ID or phone..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            name="status"
            defaultValue={status || ''}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="LEFT">Left</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            name="classId"
            defaultValue={academicClassId || ''}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
          >
            <option value="">All Academic Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <Button type="submit" variant="outline" size="sm" icon={<Search className="h-3.5 w-3.5" />}>
            Filter Results
          </Button>
        </form>
      </Card>

      {/* Students Data Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">ID</th>
                <th className="p-4">Academic Class</th>
                <th className="p-4">Computer Courses</th>
                <th className="p-4">Monthly Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={student.fullName} size="sm" />
                      <div>
                        <Link href={`/admin/students/${student.id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 block">
                          {student.fullName}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-normal">{student.phone || student.user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{student.studentId}</td>
                  <td className="p-4">
                    {student.academicClass ? (
                      <Badge variant="info">{student.academicClass.name}</Badge>
                    ) : (
                      <span className="text-slate-400 text-[11px]">None</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {student.computerCourses.map((cc) => (
                        <span key={cc.courseId} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
                          {cc.course.name}
                        </span>
                      ))}
                      {student.computerCourses.length === 0 && <span className="text-slate-400 text-[11px]">None</span>}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">Rs. {Number(student.monthlyFee).toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={student.status === 'ACTIVE' ? 'success' : student.status === 'LEFT' ? 'warning' : 'neutral'}>
                      {student.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/students/${student.id}`}>
                        <Button variant="ghost" size="sm" icon={<Eye className="h-3.5 w-3.5" />}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No students match the criteria.
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

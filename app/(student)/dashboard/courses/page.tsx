import React from 'react'
import { requireStudent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Laptop } from 'lucide-react'

export default async function StudentCoursesPage() {
  const user = await requireStudent()

  const student = user.studentId
    ? await prisma.student.findUnique({
        where: { id: user.studentId },
        include: {
          computerCourses: {
            include: { course: { include: { chapters: true } } },
          },
        },
      })
    : null

  const courses = student?.computerCourses.map((cc) => cc.course) || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Laptop className="h-6 w-6 text-purple-600" /> My Computer Courses
        </h2>
        <p className="text-xs text-slate-500">Computer and IT skill courses you are enrolled in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{course.name}</h3>
              <Badge variant="secondary">Instructor: {course.instructor || 'Faculty'}</Badge>
            </div>
            <p className="text-xs text-slate-500">{course.description}</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">Modules & Chapters:</span>
              <div className="space-y-1">
                {course.chapters.map((ch) => (
                  <div key={ch.id} className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                    Ch {ch.chapterNumber}: {ch.title}
                  </div>
                ))}
                {course.chapters.length === 0 && <span className="text-slate-400 italic">No chapters listed yet.</span>}
              </div>
            </div>
          </Card>
        ))}

        {courses.length === 0 && (
          <Card className="col-span-2 p-8 text-center text-slate-500">You are not enrolled in any computer courses.</Card>
        )}
      </div>
    </div>
  )
}

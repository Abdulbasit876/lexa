import React from 'react'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BookOpen, Laptop } from 'lucide-react'

export default async function CoursesPage() {
  const academicClasses = await getAcademicClasses()
  const computerCourses = await getComputerCourses()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="primary">Educational Offerings</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">Academic Classes & Computer Courses</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Explore all academic subjects offered from Class 6 to Intermediate level, as well as hands-on computer and digital skill courses.
        </p>
      </div>

      {/* ACADEMIC CLASSES */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-600" /> Academic Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicClasses.map((ac) => (
            <Card key={ac.id} hover className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{ac.name}</h3>
                <Badge variant="info">{ac.subjects.length} Subjects</Badge>
              </div>
              <p className="text-xs text-slate-500">{ac.description || 'Comprehensive academic study program.'}</p>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Subjects Included:</p>
                <div className="flex flex-wrap gap-2">
                  {ac.subjects.map((sub) => (
                    <span key={sub.id} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* COMPUTER COURSES */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Laptop className="h-6 w-6 text-purple-600" /> Computer Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {computerCourses.map((cc) => (
            <Card key={cc.id} hover className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{cc.name}</h3>
                <Badge variant="secondary">Rs. {Number(cc.fee || 0).toLocaleString()}</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{cc.description}</p>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1 text-xs text-slate-500">
                <div><span className="font-semibold text-slate-700 dark:text-slate-300">Instructor:</span> {cc.instructor || 'Senior Faculty'}</div>
                <div><span className="font-semibold text-slate-700 dark:text-slate-300">Chapters:</span> {cc.chapters.length} Modules</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

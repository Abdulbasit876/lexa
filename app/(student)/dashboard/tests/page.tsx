import React from 'react'
import { getTests } from '@/app/actions/tests'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function StudentTestsPage() {
  const tests = await getTests()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-600" /> Scheduled Tests
        </h2>
        <p className="text-xs text-slate-500 font-normal">Upcoming and past examination test schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((t) => (
          <Card key={t.id} className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="info">
                {t.academicClass ? t.academicClass.name : t.computerCourse ? t.computerCourse.name : 'General Test'}
              </Badge>
              <span className="text-xs font-mono font-bold text-indigo-600">{t.totalMarks} Total Marks</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Date: {formatDate(t.date)}</p>
            </div>

            {t.description && <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t.description}</p>}
          </Card>
        ))}

        {tests.length === 0 && (
          <Card className="col-span-2 p-8 text-center text-slate-500">No scheduled tests found.</Card>
        )}
      </div>
    </div>
  )
}

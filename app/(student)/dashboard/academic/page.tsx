import React from 'react'
import { requireStudent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BookOpen } from 'lucide-react'

export default async function StudentAcademicPage() {
  const user = await requireStudent()

  const student = user.studentId
    ? await prisma.student.findUnique({
      where: { id: user.studentId },
      include: {
        academicClass: {
          include: { subjects: { include: { chapters: true } } },
        },
      },
    })
    : null

  const academicClass = student?.academicClass

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-600" /> My Academic Class
        </h2>
        <p className="text-xs text-slate-500">Subjects and chapters assigned to your academic grade.</p>
      </div>

      {academicClass ? (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{academicClass.name}</h3>
                <p className="text-xs text-slate-500">{academicClass.description}</p>
              </div>
              <Badge variant="info">{academicClass.subjects.length} Subjects</Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicClass.subjects.map((sub: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; chapters: { id: React.Key | null | undefined; chapterNumber: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }[] }) => (
              <Card key={sub.id} className="p-6 space-y-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{sub.name}</h4>
                <div className="space-y-1 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Chapters Included:</p>
                  {sub.chapters.map((ch: { id: React.Key | null | undefined; chapterNumber: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
                    <div key={ch.id} className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                      Ch {ch.chapterNumber}: {ch.title}
                    </div>
                  ))}
                  {sub.chapters.length === 0 && <p className="italic">No chapters added yet.</p>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center text-slate-500">You are not currently enrolled in an academic class.</Card>
      )}
    </div>
  )
}

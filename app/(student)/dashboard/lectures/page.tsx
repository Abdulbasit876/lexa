import React from 'react'
import { getPublicLectures } from '@/app/actions/lectures'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ExternalLink, Video } from 'lucide-react'

export default async function StudentLecturesPage() {
  const lectures = await getPublicLectures()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Video className="h-6 w-6 text-purple-600" /> Public Video Lectures
        </h2>
        <p className="text-xs text-slate-500">Open video resources (YouTube, Facebook, Web links) provided by your instructors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectures.map((lec) => (
          <Card key={lec.id} hover className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={lec.platform === 'YOUTUBE' ? 'danger' : 'info'}>{lec.platform}</Badge>
                {lec.duration && <span className="text-xs text-slate-400 font-mono">⏱ {lec.duration}</span>}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{lec.title}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                  {lec.academicSubject
                    ? `${lec.academicSubject.academicClass.name} — ${lec.academicSubject.name}`
                    : lec.computerCourse?.name || 'General Lecture'}
                </p>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{lec.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <a href={lec.videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="primary" size="sm" className="w-full justify-center" icon={<ExternalLink className="h-3.5 w-3.5" />}>
                  Open Lecture
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

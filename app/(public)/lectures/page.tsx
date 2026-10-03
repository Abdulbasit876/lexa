import React from 'react'
import { getPublicLectures } from '@/app/actions/lectures'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ExternalLink, Video, Play, Search } from 'lucide-react'

export default async function PublicLecturesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; platform?: string; q?: string }>
}) {
  const params = await searchParams
  const category = params.category as any
  const platform = params.platform as any
  const search = params.q

  const lectures = await getPublicLectures({ category, platform, search })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="success">Open Learning Resources</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">Public Video Lectures</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Browse open video lectures, tutorials, and study resources uploaded by Academy Lexa instructors. Anyone can open and watch!
        </p>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <a href="/lectures">
          <Badge variant={!category ? 'primary' : 'neutral'} size="md" className="cursor-pointer">
            All Lectures
          </Badge>
        </a>
        <a href="/lectures?category=ACADEMIC">
          <Badge variant={category === 'ACADEMIC' ? 'primary' : 'neutral'} size="md" className="cursor-pointer">
            Academic Subjects
          </Badge>
        </a>
        <a href="/lectures?category=COMPUTER">
          <Badge variant={category === 'COMPUTER' ? 'primary' : 'neutral'} size="md" className="cursor-pointer">
            Computer Courses
          </Badge>
        </a>
      </div>

      {/* Lecture Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectures.map((lec) => (
          <Card key={lec.id} hover className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={lec.platform === 'YOUTUBE' ? 'danger' : 'info'}>
                  {lec.platform}
                </Badge>
                {lec.duration && <span className="text-xs text-slate-400 font-mono">⏱ {lec.duration}</span>}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">{lec.title}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                  {lec.academicSubject
                    ? `${lec.academicSubject.academicClass.name} — ${lec.academicSubject.name}`
                    : lec.computerCourse?.name || 'General Lecture'}
                  {lec.chapter ? ` (${lec.chapter.title})` : ''}
                </p>
              </div>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{lec.description || 'Watch full video lecture on external platform.'}</p>
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

      {lectures.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          No public lectures found for the selected filter.
        </div>
      )}
    </div>
  )
}

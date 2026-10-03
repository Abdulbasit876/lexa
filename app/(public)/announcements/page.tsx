import React from 'react'
import { getPublicAnnouncements } from '@/app/actions/announcements'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Bell } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function PublicAnnouncementsPage() {
  const announcements = await getPublicAnnouncements()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="warning">Official Updates</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">Academy Announcements</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Stay updated with important announcements, test schedules, holidays, and academy notices.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 shrink-0">
              <Bell className="h-6 w-6" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{ann.title}</h3>
                <span className="text-xs text-slate-400 font-medium">{formatDate(ann.date)}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{ann.description}</p>
            </div>
          </Card>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            No public announcements at this time.
          </div>
        )}
      </div>
    </div>
  )
}

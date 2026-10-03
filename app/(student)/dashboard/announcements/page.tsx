import React from 'react'
import { getAnnouncements } from '@/app/actions/announcements'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Bell } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function StudentAnnouncementsPage() {
  const announcements = await getAnnouncements(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="h-6 w-6 text-amber-500" /> Academy Announcements
        </h2>
        <p className="text-xs text-slate-500">Official academy-wide notices and updates visible to all registered students.</p>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 shrink-0">
              <Bell className="h-6 w-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{ann.title}</h3>
                <span className="text-xs text-slate-400 font-medium">{formatDate(ann.date)}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{ann.description}</p>
            </div>
          </Card>
        ))}

        {announcements.length === 0 && (
          <Card className="p-8 text-center text-slate-500">No announcements published at this time.</Card>
        )}
      </div>
    </div>
  )
}

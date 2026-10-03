'use client'

import React, { useState, useEffect } from 'react'
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '@/app/actions/announcements'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Bell, Plus, Trash2, Globe } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminAnnouncementsPage() {
  const toast = useToast()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [addModal, setAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: true,
  })

  const loadData = () => {
    getAnnouncements(true).then(setAnnouncements)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await createAnnouncement({
      title: formData.title,
      description: formData.description,
      isPublic: formData.isPublic,
    })

    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Academy-wide announcement published!')
    setFormData({ title: '', description: '', isPublic: true })
    setAddModal(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    await deleteAnnouncement(id)
    toast.success('Announcement deleted.')
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Academy Announcements</h2>
          <p className="text-xs text-slate-500">Publish academy-wide announcements visible to all students and website visitors.</p>
        </div>
        <Button onClick={() => setAddModal(true)} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
          New Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => (
          <Card key={ann.id} className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="warning">PUBLISHED</Badge>
                {ann.isPublic && (
                  <Badge variant="info" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Public
                  </Badge>
                )}
              </div>
              <button onClick={() => handleDelete(ann.id)} className="text-slate-400 hover:text-rose-500 p-1">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{ann.title}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{formatDate(ann.date)}</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{ann.description}</p>
          </Card>
        ))}
      </div>

      {/* Modal Add Announcement */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Publish Academy-Wide Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Announcement Title *" required placeholder="e.g. Physics Test on Monday" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea label="Announcement Details *" required rows={4} placeholder="Notice content..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Also display on public website landing page</span>
          </label>

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            Publish Announcement
          </Button>
        </form>
      </Modal>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '@/app/actions/social-links'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Share2, Plus, Trash2, ExternalLink, Edit2 } from 'lucide-react'
import { SocialPlatform } from '@prisma/client'

export default function AdminSocialLinksPage() {
  const toast = useToast()
  const [links, setLinks] = useState<any[]>([])
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    platform: SocialPlatform.YOUTUBE,
    displayName: '',
    url: '',
  })

  const loadData = () => {
    getSocialLinks(false).then(setLinks)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (editingId) {
      const res = await updateSocialLink(editingId, formData)
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Social link updated!')
      setEditModal(false)
    } else {
      const res = await createSocialLink(formData)
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Social link added!')
      setAddModal(false)
    }

    setFormData({ platform: SocialPlatform.YOUTUBE, displayName: '', url: '' })
    setEditingId(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social link?')) return
    await deleteSocialLink(id)
    toast.success('Deleted.')
    loadData()
  }

  const openEditModal = (link: any) => {
    setEditingId(link.id)
    setFormData({
      platform: link.platform,
      displayName: link.displayName,
      url: link.url,
    })
    setEditModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Social Media Links</h2>
          <p className="text-xs text-slate-500">Manage social links displayed on the public website footer & contact pages.</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ platform: SocialPlatform.YOUTUBE, displayName: '', url: '' }); setAddModal(true); }} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
          Add Social Link
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Platform</th>
                <th className="p-4">Display Name</th>
                <th className="p-4">URL</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <Badge variant="info">{link.platform}</Badge>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{link.displayName}</td>
                  <td className="p-4 font-mono text-indigo-600 dark:text-indigo-400">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                      {link.url} <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(link)} className="text-slate-400 hover:text-indigo-600 p-1 mr-2">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(link.id)} className="text-slate-400 hover:text-rose-500 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {links.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No social links configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal Add/Edit Link */}
      <Modal isOpen={addModal || editModal} onClose={() => { setAddModal(false); setEditModal(false); setEditingId(null); }} title={editingId ? "Edit Social Link" : "Add Social Link"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Platform *" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}>
            <option value="YOUTUBE">YouTube</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="TWITTER">Twitter</option>
            <option value="WEBSITE">Official Website</option>
            <option value="OTHER">Other</option>
          </Select>

          <Input label="Display Name *" required placeholder="e.g. Academy Lexa YouTube" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} />
          <Input label="Target URL *" type="url" required placeholder="https://youtube.com/..." value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            {editingId ? "Update Link" : "Save Link"}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

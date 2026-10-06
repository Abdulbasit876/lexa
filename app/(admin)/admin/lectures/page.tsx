'use client'

import React, { useState, useEffect } from 'react'
import { getPublicLectures, createLecture, updateLecture, deleteLecture } from '@/app/actions/lectures'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Video, Plus, Trash2, ExternalLink, Edit2 } from 'lucide-react'
import { LectureCategory, LecturePlatform } from '@prisma/client'

export default function AdminLecturesPage() {
  const toast = useToast()
  const [lectures, setLectures] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<{
    title: string
    description: string
    category: LectureCategory
    platform: LecturePlatform
    videoUrl: string
    duration: string
    academicSubjectId: string
    computerCourseId: string
  }>({
    title: '',
    description: '',
    category: LectureCategory.ACADEMIC,
    platform: LecturePlatform.YOUTUBE,
    videoUrl: '',
    duration: '',
    academicSubjectId: '',
    computerCourseId: '',
  })

  const loadData = () => {
    getPublicLectures().then(setLectures)
    getAcademicClasses().then(setClasses)
    getComputerCourses().then(setCourses)
  }

  useEffect(() => {
    loadData()
  }, [])

  const allSubjects = classes.flatMap((c) =>
    c.subjects.map((s: any) => ({
      id: s.id,
      label: `${c.name} — ${s.name}`,
    }))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      platform: formData.platform,
      videoUrl: formData.videoUrl,
      duration: formData.duration,
      academicSubjectId: formData.category === LectureCategory.ACADEMIC ? formData.academicSubjectId : undefined,
      computerCourseId: formData.category === LectureCategory.COMPUTER ? formData.computerCourseId : undefined,
    }

    if (editingId) {
      const res = await updateLecture(editingId, payload)
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Public lecture link updated!')
      setEditModal(false)
    } else {
      const res = await createLecture(payload)
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Public lecture link added!')
      setAddModal(false)
    }

    setFormData({
      title: '',
      description: '',
      category: LectureCategory.ACADEMIC,
      platform: LecturePlatform.YOUTUBE,
      videoUrl: '',
      duration: '',
      academicSubjectId: '',
      computerCourseId: '',
    })
    setEditingId(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lecture link?')) return
    await deleteLecture(id)
    toast.success('Lecture deleted.')
    loadData()
  }

  const openEditModal = (lec: any) => {
    setEditingId(lec.id)
    setFormData({
      title: lec.title,
      description: lec.description || '',
      category: lec.category,
      platform: lec.platform,
      videoUrl: lec.videoUrl,
      duration: lec.duration || '',
      academicSubjectId: lec.academicSubjectId || '',
      computerCourseId: lec.computerCourseId || '',
    })
    setEditModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Public Lectures Management</h2>
          <p className="text-xs text-slate-500">Manage external video links (YouTube, Facebook, Instagram, Web) accessible by everyone.</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ title: '', description: '', category: LectureCategory.ACADEMIC, platform: LecturePlatform.YOUTUBE, videoUrl: '', duration: '', academicSubjectId: '', computerCourseId: '' }); setAddModal(true); }} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
          Add Public Lecture Link
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Lecture Title</th>
                <th className="p-4">Category / Subject</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Duration</th>
                <th className="p-4">External Link</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {lectures.map((lec) => (
                <tr key={lec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{lec.title}</td>
                  <td className="p-4">
                    {lec.academicSubject ? (
                      <Badge variant="info">
                        {lec.academicSubject.academicClass.name} — {lec.academicSubject.name}
                      </Badge>
                    ) : lec.computerCourse ? (
                      <Badge variant="secondary">{lec.computerCourse.name}</Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={lec.platform === 'YOUTUBE' ? 'danger' : 'info'}>{lec.platform}</Badge>
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{lec.duration || '—'}</td>
                  <td className="p-4">
                    <a href={lec.videoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono">
                      Open URL <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(lec)} className="text-slate-400 hover:text-indigo-600 p-1 mr-2">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(lec.id)} className="text-slate-400 hover:text-rose-500 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {lectures.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No public lectures created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal Add/Edit Lecture */}
      <Modal isOpen={addModal || editModal} onClose={() => { setAddModal(false); setEditModal(false); setEditingId(null); }} title={editingId ? "Edit Public Lecture Link" : "Add Public Lecture Link"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Lecture Title *" required placeholder="e.g. Lecture 01 — Introduction to Motion" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea label="Description" placeholder="Topics covered..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as LectureCategory })}>
              <option value="ACADEMIC">Academic</option>
              <option value="COMPUTER">Computer Course</option>
            </Select>

            <Select label="Platform *" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value as LecturePlatform })}>
              <option value="YOUTUBE">YouTube</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="EXTERNAL">External Web URL</option>
            </Select>
          </div>

          <Input label="External Video URL *" type="url" required placeholder="https://www.youtube.com/watch?v=..." value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
          <Input label="Duration (Optional)" placeholder="25:30" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />

          {formData.category === LectureCategory.ACADEMIC ? (
            <Select label="Select Subject *" required value={formData.academicSubjectId} onChange={(e) => setFormData({ ...formData, academicSubjectId: e.target.value })}>
              <option value="">-- Choose Subject --</option>
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          ) : (
            <Select label="Select Computer Course *" required value={formData.computerCourseId} onChange={(e) => setFormData({ ...formData, computerCourseId: e.target.value })}>
              <option value="">-- Choose Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            {editingId ? "Update Lecture Link" : "Save Lecture Link"}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

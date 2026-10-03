'use client'

import React, { useState, useEffect } from 'react'
import { getChapters, createChapter, deleteChapter } from '@/app/actions/chapters'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Bookmark, Plus, Trash2 } from 'lucide-react'

export default function AdminChaptersPage() {
  const toast = useToast()
  const [chapters, setChapters] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [addModal, setAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    chapterNumber: '1',
    categoryType: 'ACADEMIC',
    academicSubjectId: '',
    computerCourseId: '',
  })

  const loadData = () => {
    getChapters().then(setChapters)
    getAcademicClasses().then(setClasses)
    getComputerCourses().then(setCourses)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Helper for subjects dropdown
  const allSubjects = classes.flatMap((c) =>
    c.subjects.map((s: any) => ({
      id: s.id,
      label: `${c.name} — ${s.name}`,
    }))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await createChapter({
      title: formData.title,
      chapterNumber: parseInt(formData.chapterNumber, 10) || 1,
      academicSubjectId: formData.categoryType === 'ACADEMIC' ? formData.academicSubjectId : undefined,
      computerCourseId: formData.categoryType === 'COMPUTER' ? formData.computerCourseId : undefined,
    })

    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Chapter added!')
    setFormData({ title: '', chapterNumber: '1', categoryType: 'ACADEMIC', academicSubjectId: '', computerCourseId: '' })
    setAddModal(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return
    await deleteChapter(id)
    toast.success('Chapter deleted.')
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chapter Management</h2>
          <p className="text-xs text-slate-500">Organize subject and course materials into structured chapters.</p>
        </div>
        <Button onClick={() => setAddModal(true)} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
          Add Chapter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Ch #</th>
                <th className="p-4">Chapter Title</th>
                <th className="p-4">Belongs To</th>
                <th className="p-4">Lectures</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {chapters.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-bold text-indigo-600">Ch. {ch.chapterNumber}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{ch.title}</td>
                  <td className="p-4">
                    {ch.academicSubject ? (
                      <Badge variant="info">
                        {ch.academicSubject.academicClass.name} — {ch.academicSubject.name}
                      </Badge>
                    ) : ch.computerCourse ? (
                      <Badge variant="secondary">{ch.computerCourse.name}</Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-4 text-slate-500">{ch.lectures.length} Lectures</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(ch.id)} className="text-slate-400 hover:text-rose-500 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {chapters.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No chapters created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal Add Chapter */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Chapter">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Chapter Title *" required placeholder="e.g. Chapter 1: Physical Quantities" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input label="Chapter Number" type="number" value={formData.chapterNumber} onChange={(e) => setFormData({ ...formData, chapterNumber: e.target.value })} />

          <Select label="Category Type" value={formData.categoryType} onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}>
            <option value="ACADEMIC">Academic Subject</option>
            <option value="COMPUTER">Computer Course</option>
          </Select>

          {formData.categoryType === 'ACADEMIC' ? (
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
            Save Chapter
          </Button>
        </form>
      </Modal>
    </div>
  )
}

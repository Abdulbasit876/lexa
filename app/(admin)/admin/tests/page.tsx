'use client'

import React, { useState, useEffect } from 'react'
import { getTests, createTest, deleteTest } from '@/app/actions/tests'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { FileText, Plus, Trash2, Award } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { LectureCategory } from '@prisma/client'
import Link from 'next/link'

export default function AdminTestsPage() {
  const toast = useToast()
  const [tests, setTests] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [addModal, setAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<{
    title: string
    category: LectureCategory
    date: string
    totalMarks: string
    description: string
    academicClassId: string
    computerCourseId: string
  }>({
    title: '',
    category: LectureCategory.ACADEMIC,
    date: new Date().toISOString().split('T')[0],
    totalMarks: '100',
    description: '',
    academicClassId: '',
    computerCourseId: '',
  })

  const loadData = () => {
    getTests().then(setTests)
    getAcademicClasses().then(setClasses)
    getComputerCourses().then(setCourses)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await createTest({
      title: formData.title,
      category: formData.category,
      date: formData.date,
      totalMarks: parseInt(formData.totalMarks, 10) || 100,
      description: formData.description,
      academicClassId: formData.category === LectureCategory.ACADEMIC ? formData.academicClassId : undefined,
      computerCourseId: formData.category === LectureCategory.COMPUTER ? formData.computerCourseId : undefined,
    })

    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Test created successfully!')
    setFormData({
      title: '',
      category: LectureCategory.ACADEMIC,
      date: new Date().toISOString().split('T')[0],
      totalMarks: '100',
      description: '',
      academicClassId: '',
      computerCourseId: '',
    })
    setAddModal(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return
    await deleteTest(id)
    toast.success('Test deleted.')
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tests Management</h2>
          <p className="text-xs text-slate-500">Create examination tests and record student marks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/results">
            <Button variant="outline" size="md" icon={<Award className="h-4 w-4" />}>
              Enter Student Marks
            </Button>
          </Link>
          <Button onClick={() => setAddModal(true)} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
            Create Test
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Test Title</th>
                <th className="p-4">Class / Course</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total Marks</th>
                <th className="p-4">Graded Students</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{test.title}</td>
                  <td className="p-4">
                    {test.academicClass ? (
                      <Badge variant="info">{test.academicClass.name}</Badge>
                    ) : test.computerCourse ? (
                      <Badge variant="secondary">{test.computerCourse.name}</Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-4">{formatDate(test.date)}</td>
                  <td className="p-4 font-bold text-indigo-600">{test.totalMarks} Marks</td>
                  <td className="p-4 text-slate-500">{test._count.results} Graded</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(test.id)} className="text-slate-400 hover:text-rose-500 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {tests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No tests created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal Add Test */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Create New Test">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Test Title *" required placeholder="e.g. Physics Chapter 3 Test" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Test Date *" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <Input label="Total Marks *" type="number" required value={formData.totalMarks} onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })} />
          </div>

          <Select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as LectureCategory })}>
            <option value="ACADEMIC">Academic Class</option>
            <option value="COMPUTER">Computer Course</option>
          </Select>

          {formData.category === LectureCategory.ACADEMIC ? (
            <Select label="Select Class *" required value={formData.academicClassId} onChange={(e) => setFormData({ ...formData, academicClassId: e.target.value })}>
              <option value="">-- Choose Class --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
            Save Test
          </Button>
        </form>
      </Modal>
    </div>
  )
}

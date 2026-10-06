'use client'

import React, { useState, useEffect } from 'react'
import { getComputerCourses, createComputerCourse, updateComputerCourse, deleteComputerCourse } from '@/app/actions/courses'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { Laptop, Plus, Trash2, Edit2 } from 'lucide-react'

export default function AdminComputerCoursesPage() {
  const toast = useToast()
  const [courses, setCourses] = useState<any[]>([])
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee: '3000',
    instructor: '',
  })

  const loadData = () => {
    getComputerCourses().then(setCourses)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const payload = {
      name: formData.name,
      description: formData.description,
      fee: parseFloat(formData.fee) || 0,
      instructor: formData.instructor,
    }

    if (editingId) {
      const res = await updateComputerCourse(editingId, payload)
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Computer course updated!')
      setEditModal(false)
    } else {
      const res = await createComputerCourse(payload)
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Computer course created!')
      setAddModal(false)
    }

    setFormData({ name: '', description: '', fee: '3000', instructor: '' })
    setEditingId(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    await deleteComputerCourse(id)
    toast.success('Course deleted.')
    loadData()
  }

  const openEditModal = (course: any) => {
    setEditingId(course.id)
    setFormData({
      name: course.name,
      description: course.description || '',
      fee: course.fee ? course.fee.toString() : '0',
      instructor: course.instructor || '',
    })
    setEditModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Computer Courses Management</h2>
          <p className="text-xs text-slate-500">Manage vocational & IT courses (Web Dev, MS Office, Graphic Design, etc.).</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ name: '', description: '', fee: '3000', instructor: '' }); setAddModal(true); }} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
          Add Computer Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{course.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Rs. {Number(course.fee || 0).toLocaleString()}</Badge>
                <button onClick={() => openEditModal(course)} className="text-slate-400 hover:text-indigo-600 p-1">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(course.id)} className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{course.description}</p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
              <span>Instructor: <strong className="text-slate-700 dark:text-slate-300">{course.instructor || 'Faculty'}</strong></span>
              <span>Students: <strong className="text-indigo-600">{course._count.students}</strong></span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Add/Edit Course */}
      <Modal isOpen={addModal || editModal} onClose={() => { setAddModal(false); setEditModal(false); setEditingId(null); }} title={editingId ? "Edit Computer Course" : "Add New Computer Course"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Course Name *" required placeholder="e.g. Graphic Design" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Textarea label="Description" placeholder="Course outline..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Input label="Course Fee (Rs.)" type="number" value={formData.fee} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} />
          <Input label="Instructor Name" placeholder="Sir Ahmed" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            {editingId ? "Update Course" : "Create Course"}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

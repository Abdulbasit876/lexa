'use client'

import React, { useState, useEffect } from 'react'
import { getAcademicClasses, createAcademicClass, updateAcademicClass, deleteAcademicClass, createAcademicSubject, updateAcademicSubject, deleteAcademicSubject } from '@/app/actions/academic'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { BookOpen, Plus, Trash2, FolderPlus, Edit2 } from 'lucide-react'

export default function AcademicClassesPage() {
  const toast = useToast()
  const [classes, setClasses] = useState<any[]>([])
  
  const [addClassModal, setAddClassModal] = useState(false)
  const [editClassModal, setEditClassModal] = useState(false)
  const [editingClassId, setEditingClassId] = useState<string | null>(null)
  
  const [addSubjectModal, setAddSubjectModal] = useState(false)
  const [editSubjectModal, setEditSubjectModal] = useState(false)
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null)
  
  const [selectedClassId, setSelectedClassId] = useState('')
  const [className, setClassName] = useState('')
  const [classDescription, setClassDescription] = useState('')
  const [subjectName, setSubjectName] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)

  const loadData = () => {
    getAcademicClasses().then(setClasses)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (editingClassId) {
      const res = await updateAcademicClass(editingClassId, { name: className, description: classDescription })
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Academic class updated!')
      setEditClassModal(false)
    } else {
      const res = await createAcademicClass({ name: className, description: classDescription })
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Academic class created!')
      setAddClassModal(false)
    }

    setClassName('')
    setClassDescription('')
    setEditingClassId(null)
    loadData()
  }

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (editingSubjectId) {
      const res = await updateAcademicSubject(editingSubjectId, { name: subjectName })
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Subject updated!')
      setEditSubjectModal(false)
    } else {
      const res = await createAcademicSubject({ name: subjectName, academicClassId: selectedClassId })
      setIsLoading(false)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Subject added!')
      setAddSubjectModal(false)
    }

    setSubjectName('')
    setEditingSubjectId(null)
    loadData()
  }

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    await deleteAcademicClass(id)
    toast.success('Class deleted.')
    loadData()
  }

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return
    await deleteAcademicSubject(id)
    toast.success('Subject deleted.')
    loadData()
  }
  
  const openEditClassModal = (cls: any) => {
    setEditingClassId(cls.id)
    setClassName(cls.name)
    setClassDescription(cls.description || '')
    setEditClassModal(true)
  }

  const openEditSubjectModal = (sub: any) => {
    setEditingSubjectId(sub.id)
    setSubjectName(sub.name)
    setEditSubjectModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Academic Classes & Subjects</h2>
          <p className="text-xs text-slate-500">Manage academic grade levels (Class 6 - Intermediate) and their respective subjects.</p>
        </div>
        <Button onClick={() => { setEditingClassId(null); setClassName(''); setClassDescription(''); setAddClassModal(true); }} variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
          Add Academic Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{cls.name}</h3>
                <p className="text-xs text-slate-500">{cls.description || 'Academic Grade'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">{cls._count.students} Enrolled</Badge>
                <button onClick={() => openEditClassModal(cls)} className="text-slate-400 hover:text-indigo-600 p-1">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteClass(cls.id)} className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Subjects</h4>
                <Button
                  onClick={() => {
                    setSelectedClassId(cls.id)
                    setEditingSubjectId(null)
                    setSubjectName('')
                    setAddSubjectModal(true)
                  }}
                  variant="ghost"
                  size="sm"
                  icon={<Plus className="h-3 w-3" />}
                >
                  Add Subject
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cls.subjects.map((sub: any) => (
                  <span
                    key={sub.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/50"
                  >
                    {sub.name}
                    <button onClick={() => openEditSubjectModal(sub)} className="hover:text-indigo-600 ml-1">
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleDeleteSubject(sub.id)} className="hover:text-rose-500">
                      ×
                    </button>
                  </span>
                ))}
                {cls.subjects.length === 0 && <span className="text-xs text-slate-400 italic">No subjects added yet.</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Add/Edit Class */}
      <Modal isOpen={addClassModal || editClassModal} onClose={() => { setAddClassModal(false); setEditClassModal(false); setEditingClassId(null); }} title={editingClassId ? "Edit Academic Class" : "Add Academic Class"}>
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <Input label="Class Name *" required placeholder="e.g. Class 11" value={className} onChange={(e) => setClassName(e.target.value)} />
          <Input label="Description" placeholder="HSSC Part 1" value={classDescription} onChange={(e) => setClassDescription(e.target.value)} />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            {editingClassId ? "Update Class" : "Create Class"}
          </Button>
        </form>
      </Modal>

      {/* Modal Add/Edit Subject */}
      <Modal isOpen={addSubjectModal || editSubjectModal} onClose={() => { setAddSubjectModal(false); setEditSubjectModal(false); setEditingSubjectId(null); }} title={editingSubjectId ? "Edit Subject" : "Add Subject to Class"}>
        <form onSubmit={handleSubjectSubmit} className="space-y-4">
          <Input label="Subject Name *" required placeholder="e.g. Physics" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            {editingSubjectId ? "Update Subject" : "Add Subject"}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

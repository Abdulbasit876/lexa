'use client'

import React, { useState, useEffect } from 'react'
import {
  getCertificates,
  issueCertificate,
  updateCertificate,
  deleteCertificate,
} from '@/app/actions/certificates'
import { getStudents } from '@/app/actions/students'
import { getAcademicClasses } from '@/app/actions/academic'
import { getComputerCourses } from '@/app/actions/courses'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/components/ui/Toast'
import { Award, Plus, Edit2, Trash2, Download, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function AdminCertificatesPage() {
  const toast = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])

  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    studentId: '',
    title: 'Certificate of Completion',
    description: '',
    issuedDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    grade: '',
    remarks: '',
    academicClassId: '',
    computerCourseId: '',
  })

  const loadData = () => {
    getCertificates().then(setCertificates)
    getStudents({ status: 'ACTIVE' as any }).then(setStudents)
    getAcademicClasses().then(setClasses)
    getComputerCourses().then(setCourses)
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      studentId: '',
      title: 'Certificate of Completion',
      description: '',
      issuedDate: new Date().toISOString().split('T')[0],
      validUntil: '',
      grade: '',
      remarks: '',
      academicClassId: '',
      computerCourseId: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (editingId) {
      const res = await updateCertificate(editingId, {
        title: formData.title,
        description: formData.description,
        issuedDate: formData.issuedDate,
        validUntil: formData.validUntil || undefined,
        grade: formData.grade,
        remarks: formData.remarks,
      })
      setIsLoading(false)
      if (!res.success) { toast.error(res.error || 'Failed'); return }
      toast.success('Certificate updated!')
      setEditModal(false)
      setEditingId(null)
    } else {
      const res = await issueCertificate({
        studentId: formData.studentId,
        title: formData.title,
        description: formData.description,
        issuedDate: formData.issuedDate,
        validUntil: formData.validUntil || undefined,
        grade: formData.grade,
        remarks: formData.remarks,
        academicClassId: formData.academicClassId || undefined,
        computerCourseId: formData.computerCourseId || undefined,
      })
      setIsLoading(false)
      if (!res.success) { toast.error(res.error || 'Failed'); return }
      toast.success(`Certificate ${res.certificate?.certificateNumber} issued!`)
      setAddModal(false)
      resetForm()
    }
    loadData()
  }

  const openEditModal = (cert: any) => {
    setEditingId(cert.id)
    setFormData({
      studentId: cert.studentId,
      title: cert.title,
      description: cert.description || '',
      issuedDate: cert.issuedDate ? new Date(cert.issuedDate).toISOString().split('T')[0] : '',
      validUntil: cert.validUntil ? new Date(cert.validUntil).toISOString().split('T')[0] : '',
      grade: cert.grade || '',
      remarks: cert.remarks || '',
      academicClassId: cert.academicClassId || '',
      computerCourseId: cert.computerCourseId || '',
    })
    setEditModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate? This cannot be undone.')) return
    const res = await deleteCertificate(id)
    if (!res.success) { toast.error(res.error || 'Failed'); return }
    toast.success('Certificate deleted.')
    loadData()
  }

  const CertForm = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!editingId && (
        <Select
          label="Student *"
          required
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
        >
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.fullName} ({s.studentId})</option>
          ))}
        </Select>
      )}
      <Input
        label="Certificate Title *"
        required
        placeholder="Certificate of Completion"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <Input
        label="Description / Achievement"
        placeholder="Successfully completed..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      {!editingId && (
        <>
          <Select
            label="For Academic Class (Optional)"
            value={formData.academicClassId}
            onChange={(e) => setFormData({ ...formData, academicClassId: e.target.value, computerCourseId: '' })}
          >
            <option value="">-- None --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select
            label="For Computer Course (Optional)"
            value={formData.computerCourseId}
            onChange={(e) => setFormData({ ...formData, computerCourseId: e.target.value, academicClassId: '' })}
          >
            <option value="">-- None --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Issue Date *"
          type="date"
          required
          value={formData.issuedDate}
          onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
        />
        <Input
          label="Valid Until"
          type="date"
          value={formData.validUntil}
          onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Grade (Optional)"
          placeholder="A+, Distinction..."
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        />
        <Input
          label="Remarks (Optional)"
          placeholder="With Honours..."
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
        />
      </div>
      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
        {editingId ? 'Update Certificate' : 'Issue Certificate'}
      </Button>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            Certificates
          </h2>
          <p className="text-xs text-slate-500">Issue, manage, and download student completion certificates.</p>
        </div>
        <Button
          onClick={() => { resetForm(); setAddModal(true) }}
          variant="primary"
          size="md"
          icon={<Plus className="h-4 w-4" />}
        >
          Issue Certificate
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Cert. No.</th>
                <th className="p-4">Student</th>
                <th className="p-4">Title</th>
                <th className="p-4">For Class / Course</th>
                <th className="p-4">Issued Date</th>
                <th className="p-4">Grade</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {cert.certificateNumber}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={cert.student.fullName} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{cert.student.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{cert.student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{cert.title}</td>
                  <td className="p-4">
                    {cert.academicClass ? (
                      <Badge variant="info">{cert.academicClass.name}</Badge>
                    ) : cert.computerCourse ? (
                      <Badge variant="secondary">{cert.computerCourse.name}</Badge>
                    ) : (
                      <span className="text-slate-400">General</span>
                    )}
                  </td>
                  <td className="p-4">{formatDate(cert.issuedDate)}</td>
                  <td className="p-4">
                    {cert.grade ? <Badge variant="success">{cert.grade}</Badge> : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/certificates/${cert.id}`} title="Preview Certificate">
                        <button className="text-slate-400 hover:text-indigo-600 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <button onClick={() => openEditModal(cert)} className="text-slate-400 hover:text-indigo-600 p-1">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(cert.id)} className="text-slate-400 hover:text-rose-500 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {certificates.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No certificates issued yet. Click &quot;Issue Certificate&quot; to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Issue Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Issue New Certificate">
        {CertForm}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setEditingId(null) }} title="Edit Certificate">
        {CertForm}
      </Modal>
    </div>
  )
}

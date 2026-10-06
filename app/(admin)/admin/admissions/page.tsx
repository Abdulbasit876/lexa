'use client'

import React, { useState, useEffect } from 'react'
import { getAdmissions, updateAdmission, deleteAdmission } from '@/app/actions/admissions'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Edit2, Trash2 } from 'lucide-react'

export default function AdminAdmissionsPage() {
  const toast = useToast()
  const [admissions, setAdmissions] = useState<any[]>([])
  const [editModal, setEditModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    admissionDate: '',
    joiningDate: '',
    monthlyFee: '',
    initialPayment: '',
    notes: '',
  })

  const loadData = () => {
    getAdmissions().then(setAdmissions)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setIsLoading(true)

    const payload = {
      admissionDate: formData.admissionDate,
      joiningDate: formData.joiningDate || undefined,
      monthlyFee: parseFloat(formData.monthlyFee) || 0,
      initialPayment: parseFloat(formData.initialPayment) || 0,
      notes: formData.notes,
    }

    const res = await updateAdmission(editingId, payload)
    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Admission updated!')
    setEditModal(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admission?')) return
    await deleteAdmission(id)
    toast.success('Admission deleted.')
    loadData()
  }

  const openEditModal = (adm: any) => {
    setEditingId(adm.id)
    setFormData({
      admissionDate: adm.admissionDate ? new Date(adm.admissionDate).toISOString().split('T')[0] : '',
      joiningDate: adm.joiningDate ? new Date(adm.joiningDate).toISOString().split('T')[0] : '',
      monthlyFee: adm.monthlyFee ? adm.monthlyFee.toString() : '0',
      initialPayment: adm.initialPayment ? adm.initialPayment.toString() : '0',
      notes: adm.notes || '',
    })
    setEditModal(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admissions Record</h2>
        <p className="text-xs text-slate-500">History of all student joinings, assigned classes, and initial fee terms.</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Admission Date</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Academic Class</th>
                <th className="p-4">Computer Courses</th>
                <th className="p-4">Monthly Fee</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {admissions.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={adm.student.fullName} size="sm" />
                      <div>
                        <Link href={`/admin/students/${adm.student.id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 block">
                          {adm.student.fullName}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">{adm.student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{formatDate(adm.admissionDate)}</td>
                  <td className="p-4">{formatDate(adm.joiningDate || adm.admissionDate)}</td>
                  <td className="p-4">
                    {adm.academicClass ? <Badge variant="info">{adm.academicClass.name}</Badge> : <span className="text-slate-400">None</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {adm.courses.map((c: any) => (
                        <Badge key={c.courseId} variant="secondary" size="sm">
                          {c.course.name}
                        </Badge>
                      ))}
                      {adm.courses.length === 0 && <span className="text-slate-400">None</span>}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">Rs. {Number(adm.monthlyFee).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(adm)} className="text-slate-400 hover:text-indigo-600 p-1 mr-2">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(adm.id)} className="text-slate-400 hover:text-rose-500 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {admissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No admission records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setEditingId(null); }} title="Edit Admission">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Admission Date *" type="date" required value={formData.admissionDate} onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })} />
          <Input label="Joining Date" type="date" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} />
          <Input label="Monthly Fee (Rs.)" type="number" required value={formData.monthlyFee} onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })} />
          <Input label="Initial Payment (Rs.)" type="number" value={formData.initialPayment} onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })} />
          <Input label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            Update Admission
          </Button>
        </form>
      </Modal>
    </div>
  )
}

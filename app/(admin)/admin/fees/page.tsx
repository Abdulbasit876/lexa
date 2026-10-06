'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getFees, generateMonthlyFees, markFeePaid, createOrUpdateFee } from '@/app/actions/fees'
import { getAcademicClasses } from '@/app/actions/academic'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/components/ui/Toast'
import { CreditCard, CheckCircle, RefreshCw, Edit2 } from 'lucide-react'
import { formatDate, getCurrentMonth } from '@/lib/utils'
import Link from 'next/link'

export default function AdminFeesPage() {
  const toast = useToast()
  const [fees, setFees] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [month, setMonth] = useState(getCurrentMonth())
  const [filterStatus, setFilterStatus] = useState('')
  const [filterClassId, setFilterClassId] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const [editModal, setEditModal] = useState(false)
  const [editingFee, setEditingFee] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    paidAmount: '',
    status: 'PENDING',
    notes: '',
  })

  const loadData = useCallback(async () => {
    const data = await getFees({
      month: month || undefined,
      status: filterStatus as any || undefined,
      academicClassId: filterClassId || undefined,
    })
    setFees(data)
  }, [month, filterStatus, filterClassId])

  useEffect(() => {
    getAcademicClasses().then(setClasses)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleGenerate = async () => {
    setIsGenerating(true)
    const res = await generateMonthlyFees(month)
    setIsGenerating(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success(`Generated fees for ${res.generatedCount} students!`)
    loadData()
  }

  const handleMarkPaid = async (feeId: string) => {
    const res = await markFeePaid(feeId)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success('Fee marked as paid!')
    loadData()
  }

  const openEditModal = (fee: any) => {
    setEditingFee(fee)
    setFormData({
      amount: fee.amount?.toString() || '0',
      paidAmount: fee.paidAmount?.toString() || '0',
      status: fee.status || 'PENDING',
      notes: fee.notes || '',
    })
    setEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFee) return
    setIsLoading(true)

    const feeMonth = new Date(editingFee.month)
    const monthStr = `${feeMonth.getFullYear()}-${String(feeMonth.getMonth() + 1).padStart(2, '0')}`

    const res = await createOrUpdateFee({
      studentId: editingFee.studentId,
      month: monthStr,
      amount: parseFloat(formData.amount) || 0,
      paidAmount: parseFloat(formData.paidAmount) || 0,
      status: formData.status as any,
      notes: formData.notes,
    })

    setIsLoading(false)
    if (!res.success) {
      toast.error(res.error || 'Failed to update fee')
      return
    }

    toast.success('Fee updated!')
    setEditModal(false)
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fee Management</h2>
          <p className="text-xs text-slate-500">Track monthly fee generation, pending balances, and record payments.</p>
        </div>

        <Button onClick={handleGenerate} isLoading={isGenerating} variant="primary" size="md" icon={<RefreshCw className="h-4 w-4" />}>
          Generate Fees for {month}
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIAL">Partial</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Class</label>
            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="">All Classes</option>
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button onClick={loadData} variant="outline" size="sm" className="w-full">
              Filter Fees
            </Button>
          </div>
        </div>
      </Card>

      {/* Fees Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Month</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Paid Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {fees.map((fee: any) => (
                <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={fee.student.fullName} size="sm" />
                      <div>
                        <Link href={`/admin/students/${fee.student.id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 block">
                          {fee.student.fullName}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">{fee.student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{formatDate(fee.month, 'MMMM yyyy')}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">Rs. {Number(fee.amount).toLocaleString()}</td>
                  <td className="p-4 font-bold text-emerald-600">Rs. {Number(fee.paidAmount).toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={fee.status === 'PAID' ? 'success' : fee.status === 'PENDING' ? 'danger' : 'warning'}>
                      {fee.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(fee)} className="text-slate-400 hover:text-indigo-600 p-1">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {fee.status !== 'PAID' && (
                        <Button onClick={() => handleMarkPaid(fee.id)} variant="success" size="sm" icon={<CheckCircle className="h-3.5 w-3.5" />}>
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {fees.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No fee records found for this month/filter. Click &quot;Generate Fees&quot; to issue monthly fees to active students.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Fee Modal */}
      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setEditingFee(null); }} title="Edit Fee Record">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Fee Amount (Rs.) *"
            type="number"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <Input
            label="Paid Amount (Rs.)"
            type="number"
            value={formData.paidAmount}
            onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
          </Select>
          <Input
            label="Notes"
            placeholder="Any notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center">
            Update Fee
          </Button>
        </form>
      </Modal>
    </div>
  )
}

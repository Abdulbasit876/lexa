'use client'

import React, { useState, useEffect } from 'react'
import { submitPayment, getPaymentSettings } from '@/app/actions/payments'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { CreditCard, Send, Building2, Smartphone, HelpCircle, CheckCircle2 } from 'lucide-react'
import { PaymentMethod } from '@prisma/client'

export default function StudentFeesPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<any>(null)
  const [payModal, setPayModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    amount: '2500',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    transactionRef: '',
    paymentDate: new Date().toISOString().split('T')[0],
    submissionNote: '',
  })

  useEffect(() => {
    getPaymentSettings().then(setSettings)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await submitPayment({
      amount: parseFloat(formData.amount) || 0,
      paymentMethod: formData.paymentMethod,
      transactionRef: formData.transactionRef,
      paymentDate: formData.paymentDate,
      submissionNote: formData.submissionNote,
    })

    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Payment notification submitted! Admin will verify and confirm.')
    setPayModal(false)
    setFormData({
      amount: '2500',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      transactionRef: '',
      paymentDate: new Date().toISOString().split('T')[0],
      submissionNote: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fee Status & Manual Payment</h2>
          <p className="text-xs text-slate-500">View official academy payment details and submit your fee transaction ID.</p>
        </div>

        <Button onClick={() => setPayModal(true)} variant="primary" size="md" icon={<Send className="h-4 w-4" />}>
          Submit Fee Transaction ID
        </Button>
      </div>

      {/* ACADEMY OFFICIAL PAYMENT ACCOUNTS DISPLAY */}
      {settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Official Bank Account</h3>
            </div>
            <div className="text-xs space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl">
              <p><span className="text-slate-400">Bank Name:</span> <strong>{settings.bankName || 'Demo Bank'}</strong></p>
              <p><span className="text-slate-400">Account Title:</span> <strong>{settings.accountTitle || 'Academy Lexa'}</strong></p>
              <p><span className="text-slate-400">Account Number:</span> <strong className="font-mono text-indigo-600">{settings.accountNumber || '1234-5678-9012'}</strong></p>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Easypaisa & JazzCash</h3>
            </div>
            <div className="text-xs space-y-2">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                <span className="font-bold text-emerald-600 block">Easypaisa</span>
                <span>Title: {settings.easypaisaName || 'Academy Lexa'} • Number: <strong className="font-mono">{settings.easypaisaNumber || '03001234567'}</strong></span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                <span className="font-bold text-amber-600 block">JazzCash</span>
                <span>Title: {settings.jazzcashName || 'Academy Lexa'} • Number: <strong className="font-mono">{settings.jazzcashNumber || '03001234567'}</strong></span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Manual Payment Submission Form */}
      <Modal isOpen={payModal} onClose={() => setPayModal(false)} title="Submit Fee Payment Reference">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Amount Sent (Rs.) *" type="number" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />

          <Select label="Payment Method *" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="JAZZCASH">JazzCash</option>
            <option value="EASYPAISA">Easypaisa</option>
            <option value="CASH">Cash at Campus</option>
            <option value="OTHER">Other</option>
          </Select>

          <Input label="Transaction ID / Reference Number *" required placeholder="e.g. TRX-987654321" value={formData.transactionRef} onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })} />
          <Input label="Payment Date *" type="date" required value={formData.paymentDate} onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })} />
          <Textarea label="Optional Note" placeholder="Month or fee remarks..." value={formData.submissionNote} onChange={(e) => setFormData({ ...formData, submissionNote: e.target.value })} />

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full justify-center" icon={<Send className="h-4 w-4" />}>
            Submit Transaction for Review
          </Button>
        </form>
      </Modal>
    </div>
  )
}

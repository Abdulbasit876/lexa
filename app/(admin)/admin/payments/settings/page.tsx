'use client'

import React, { useState, useEffect } from 'react'
import { getPaymentSettings, updatePaymentSettings } from '@/app/actions/payments'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSettingsPage() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    easypaisaName: '',
    easypaisaNumber: '',
    jazzcashName: '',
    jazzcashNumber: '',
    instructions: '',
  })

  useEffect(() => {
    getPaymentSettings().then((s) => {
      setFormData({
        bankName: s.bankName || '',
        accountTitle: s.accountTitle || '',
        accountNumber: s.accountNumber || '',
        iban: s.iban || '',
        easypaisaName: s.easypaisaName || '',
        easypaisaNumber: s.easypaisaNumber || '',
        jazzcashName: s.jazzcashName || '',
        jazzcashNumber: s.jazzcashNumber || '',
        instructions: s.instructions || '',
      })
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await updatePaymentSettings(formData)
    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Payment account details updated!')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/payments">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payment Account Settings</h2>
          <p className="text-xs text-slate-500">Configure bank, Easypaisa, and JazzCash details shown to public visitors & students.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* BANK ACCOUNT */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">1. Bank Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Bank Name" placeholder="Demo Bank Ltd" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                <Input label="Account Title" placeholder="Academy Lexa" value={formData.accountTitle} onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })} />
                <Input label="Account Number" placeholder="1234-5678-9012" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                <Input label="IBAN" placeholder="PK00DEMO0000..." value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} />
              </div>
            </div>

            {/* EASYPAISA & JAZZCASH */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">2. Mobile Wallets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Easypaisa Account Title" placeholder="Academy Lexa" value={formData.easypaisaName} onChange={(e) => setFormData({ ...formData, easypaisaName: e.target.value })} />
                <Input label="Easypaisa Mobile Number" placeholder="03001234567" value={formData.easypaisaNumber} onChange={(e) => setFormData({ ...formData, easypaisaNumber: e.target.value })} />
                <Input label="JazzCash Account Title" placeholder="Academy Lexa" value={formData.jazzcashName} onChange={(e) => setFormData({ ...formData, jazzcashName: e.target.value })} />
                <Input label="JazzCash Mobile Number" placeholder="03001234567" value={formData.jazzcashNumber} onChange={(e) => setFormData({ ...formData, jazzcashNumber: e.target.value })} />
              </div>
            </div>

            {/* INSTRUCTIONS */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">3. Payment Instructions</h3>
              <Textarea
                label="Student Instructions"
                rows={3}
                placeholder="Instructions for students when sending fee..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full justify-center" icon={<Save className="h-4 w-4" />}>
              Save Payment Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

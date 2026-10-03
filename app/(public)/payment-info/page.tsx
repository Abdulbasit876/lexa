import React from 'react'
import { getPaymentSettings } from '@/app/actions/payments'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Building2, Smartphone, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function PaymentInfoPage() {
  const settings = await getPaymentSettings()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="info">Manual Payment Details</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">Fee & Payment Information</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Send your monthly fee using any of the official academy accounts below. Registered students can log in and submit payment transaction IDs for confirmation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BANK ACCOUNT */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Bank Transfer</h3>
              <p className="text-xs text-slate-500">{settings.bankName || 'Official Bank Account'}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Account Title</span><span className="font-bold text-slate-900 dark:text-slate-100">{settings.accountTitle || 'Academy Lexa'}</span></div>
            <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Account Number</span><span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{settings.accountNumber || '1234-5678-9012'}</span></div>
            {settings.iban && <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">IBAN</span><span className="font-mono text-xs text-slate-700 dark:text-slate-300">{settings.iban}</span></div>}
          </div>
        </Card>

        {/* MOBILE WALLETS (EASYPAISA & JAZZCASH) */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Mobile Accounts</h3>
              <p className="text-xs text-slate-500">Easypaisa & JazzCash</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Easypaisa</span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title: {settings.easypaisaName || 'Academy Lexa'}</p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">Number: {settings.easypaisaNumber || '0300-1234567'}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">JazzCash</span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title: {settings.jazzcashName || 'Academy Lexa'}</p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">Number: {settings.jazzcashNumber || '0300-1234567'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* INSTRUCTIONS */}
      <Card className="p-6 space-y-3 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-600" /> Payment Instructions
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {settings.instructions || 'Send your fee to any of the accounts above. Log into your Student Portal and navigate to "My Fees" -> "Submit Payment" to submit your Transaction Reference ID.'}
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button variant="primary" size="sm">
              Log In to Submit Payment Reference
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

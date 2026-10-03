import React from 'react'
import { requireStudent } from '@/lib/auth'
import { getPayments } from '@/app/actions/payments'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Receipt } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function StudentPaymentsPage() {
  const user = await requireStudent()
  const payments = user.studentId ? await getPayments({ studentId: user.studentId }) : []


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Receipt className="h-6 w-6 text-indigo-600" /> My Fee Payment Submissions
        </h2>
        <p className="text-xs text-slate-500">History of fee payment reference submissions and admin review statuses.</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method & Ref ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Admin Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">{formatDate(p.createdAt)}</td>
                  <td className="p-4 font-bold text-emerald-600">Rs. {Number(p.amount).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="font-bold block text-slate-900 dark:text-slate-100">{p.paymentMethod}</span>
                    <span className="text-slate-500 font-mono">{p.transactionRef || 'No Ref'}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant={p.status === 'APPROVED' || p.status === 'PAID' ? 'success' : p.status === 'REJECTED' ? 'danger' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">{p.adminNote || '—'}</td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No payment submissions submitted yet. Submit fee references via &quot;Fee Status &amp; Submit&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

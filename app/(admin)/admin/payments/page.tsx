import React from 'react'
import { getPayments, reviewPayment } from '@/app/actions/payments'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { CheckCircle2, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status = params.status as any
  const payments = await getPayments({ status })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Student Payments Review</h2>
          <p className="text-xs text-slate-500">Review, confirm, or reject manual payment notification submissions from students.</p>
        </div>
        <Link href="/admin/payments/settings">
          <Button variant="outline" size="sm">
            Payment Account Settings
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Amount Sent</th>
                <th className="p-4">Method & Ref ID</th>
                <th className="p-4">Payment Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.student.fullName} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{p.student.fullName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{p.student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-emerald-600">Rs. {Number(p.amount).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="font-bold block text-slate-900 dark:text-slate-100">{p.paymentMethod}</span>
                    <span className="text-slate-500 font-mono">{p.transactionRef || 'No Ref'}</span>
                  </td>
                  <td className="p-4">{formatDate(p.paymentDate)}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        p.status === 'APPROVED' || p.status === 'PAID'
                          ? 'success'
                          : p.status === 'REJECTED'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    {p.status === 'PENDING_REVIEW' && (
                      <div className="flex items-center justify-end gap-2">
                        <form
                          action={async () => {
                            'use server'
                            await reviewPayment({ paymentId: p.id, status: 'APPROVED' })
                          }}
                        >
                          <Button type="submit" variant="success" size="sm" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                            Approve
                          </Button>
                        </form>

                        <form
                          action={async () => {
                            'use server'
                            await reviewPayment({ paymentId: p.id, status: 'REJECTED' })
                          }}
                        >
                          <Button type="submit" variant="danger" size="sm" icon={<XCircle className="h-3.5 w-3.5" />}>
                            Reject
                          </Button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No payment submissions found.
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

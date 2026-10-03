'use server'

import React from 'react'
import { getFees, generateMonthlyFees, markFeePaid } from '@/app/actions/fees'
import { getAcademicClasses } from '@/app/actions/academic'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { CreditCard, CheckCircle, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { getCurrentMonth } from '@/lib/utils'

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; status?: string; classId?: string }>
}) {
  const params = await searchParams
  const month = params.month || getCurrentMonth()
  const status = params.status as any
  const classId = params.classId

  const fees = await getFees({ month, status, academicClassId: classId })
  const classes = await getAcademicClasses()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fee Management</h2>
          <p className="text-xs text-slate-500">Track monthly fee generation, pending balances, and record payments.</p>
        </div>

        <form
          action={async () => {
            'use server'
            await generateMonthlyFees(month)
          }}
        >
          <Button type="submit" variant="primary" size="md" icon={<RefreshCw className="h-4 w-4" />}>
            Generate Fees for {month}
          </Button>
        </form>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Month</label>
            <input
              type="month"
              name="month"
              defaultValue={month}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
            <select
              name="status"
              defaultValue={status || ''}
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
              name="classId"
              defaultValue={classId || ''}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="">All Classes</option>
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Filter Fees
            </Button>
          </div>
        </form>
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
                    {fee.status !== 'PAID' && (
                      <form
                        action={async () => {
                          'use server'
                          await markFeePaid(fee.id)
                        }}
                      >
                        <Button type="submit" variant="success" size="sm" icon={<CheckCircle className="h-3.5 w-3.5" />}>
                          Mark Paid
                        </Button>
                      </form>
                    )}
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
    </div>
  )
}

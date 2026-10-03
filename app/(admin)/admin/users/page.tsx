import React from 'react'
import { getUsers, toggleUserActive } from '@/app/actions/users'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { UserCog, Power } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users & Roles</h2>
        <p className="text-xs text-slate-500">Overview of administrator and student user accounts.</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.student?.fullName || u.username} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{u.student?.fullName || u.username}</span>
                        <span className="text-[11px] text-slate-400 font-mono">@{u.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono">{u.email}</td>
                  <td className="p-4">
                    <Badge variant={u.role === 'ADMIN' ? 'primary' : 'info'}>{u.role}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.isActive ? 'success' : 'neutral'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="p-4 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="p-4 text-right">
                    <form
                      action={async () => {
                        'use server'
                        await toggleUserActive(u.id)
                      }}
                    >
                      <Button type="submit" variant="ghost" size="sm" icon={<Power className="h-3.5 w-3.5" />}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

import React from 'react'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Bot } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default async function AdminAITutorLogsPage() {
  const recentMessages = await prisma.aIMessage.findMany({
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: {
      conversation: {
        include: {
          user: {
            include: { student: true },
          },
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bot className="h-6 w-6 text-indigo-600" /> AI Tutor Logs
        </h2>
        <p className="text-xs text-slate-500">Monitor student questions and AI assistant responses.</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Student User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Message Content</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {recentMessages.map((msg: any) => (
                <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={msg.conversation.user.student?.fullName || msg.conversation.user.username} size="sm" />
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {msg.conversation.user.student?.fullName || msg.conversation.user.username}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={msg.role === 'user' ? 'info' : 'primary'}>{msg.role.toUpperCase()}</Badge>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">{msg.content}</p>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{formatDateTime(msg.createdAt)}</td>
                </tr>
              ))}

              {recentMessages.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No AI interaction logs recorded yet.
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

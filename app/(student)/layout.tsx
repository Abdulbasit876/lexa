import React from 'react'
import { requireStudent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StudentSidebar } from '@/components/student/Sidebar'
import { StudentHeader } from '@/components/student/Header'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudent()

  const student = user.studentId
    ? await prisma.student.findUnique({
        where: { id: user.studentId },
        include: { academicClass: true, computerCourses: { include: { course: true } } },
      })
    : null

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader user={user} student={student} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  )
}

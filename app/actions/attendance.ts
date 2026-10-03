'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { AttendanceStatus } from '@prisma/client'

export async function getAttendanceForClassOrCourse(data: {
  date: string
  academicClassId?: string
  computerCourseId?: string
}) {
  await requireAdmin()

  const dateObj = new Date(data.date)

  // Find enrolled students
  let students: any[] = []
  if (data.academicClassId) {
    students = await prisma.student.findMany({
      where: { academicClassId: data.academicClassId, status: 'ACTIVE' },
      select: { id: true, studentId: true, fullName: true },
      orderBy: { fullName: 'asc' },
    })
  } else if (data.computerCourseId) {
    const enrollments = await prisma.studentComputerCourse.findMany({
      where: { courseId: data.computerCourseId, student: { status: 'ACTIVE' } },
      include: { student: { select: { id: true, studentId: true, fullName: true } } },
    })
    students = enrollments.map((e: any) => e.student)
  }

  // Find existing attendance records for this date
  const existingAttendance = await prisma.attendance.findMany({
    where: {
      date: dateObj,
      academicClassId: data.academicClassId || null,
      computerCourseId: data.computerCourseId || null,
    },
  })

  const attendanceMap = new Map<string, any>(existingAttendance.map((a: any) => [a.studentId, a]))

  return students.map((s: any) => ({
    studentId: s.id,
    studentIdNum: s.studentId,
    fullName: s.fullName,
    status: attendanceMap.get(s.id)?.status || AttendanceStatus.PRESENT,
    note: attendanceMap.get(s.id)?.note || '',
  }))
}

export async function saveAttendanceBatch(data: {
  date: string
  academicClassId?: string
  computerCourseId?: string
  records: { studentId: string; status: AttendanceStatus; note?: string }[]
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    const dateObj = new Date(data.date)

    // Upsert each attendance record
    await prisma.$transaction(
      data.records.map((r: any) => {
        const uniqueWhere = data.academicClassId
          ? {
              studentId_date_academicClassId: {
                studentId: r.studentId,
                date: dateObj,
                academicClassId: data.academicClassId,
              },
            }
          : {
              studentId_date_computerCourseId: {
                studentId: r.studentId,
                date: dateObj,
                computerCourseId: data.computerCourseId!,
              },
            }

        return prisma.attendance.upsert({
          where: uniqueWhere as any,
          update: {
            status: r.status,
            note: r.note || null,
          },
          create: {
            studentId: r.studentId,
            date: dateObj,
            status: r.status,
            note: r.note || null,
            academicClassId: data.academicClassId || null,
            computerCourseId: data.computerCourseId || null,
          },
        })
      })
    )

    revalidatePath('/admin/attendance')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save attendance' }
  }
}

export async function getStudentAttendanceHistory(studentId: string) {
  return prisma.attendance.findMany({
    where: { studentId },
    include: {
      academicClass: true,
      computerCourse: true,
    },
    orderBy: { date: 'desc' },
  })
}

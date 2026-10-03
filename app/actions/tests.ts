'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { LectureCategory } from '@prisma/client'
import { getGrade, serialize } from '@/lib/utils'

// Tests CRUD
export async function createTest(data: {
  title: string
  category: LectureCategory
  date: string
  totalMarks: number
  description?: string
  academicClassId?: string
  academicSubjectId?: string
  computerCourseId?: string
}) {
  await requireAdmin()

  try {
    const test = await prisma.test.create({
      data: {
        title: data.title,
        category: data.category,
        date: new Date(data.date),
        totalMarks: data.totalMarks,
        description: data.description || null,
        academicClassId: data.academicClassId || null,
        academicSubjectId: data.academicSubjectId || null,
        computerCourseId: data.computerCourseId || null,
      },
    })

    revalidatePath('/admin/tests')
    revalidatePath('/dashboard/tests')
    return { success: true, test }
  } catch (error: any) {
    return { error: error.message || 'Failed to create test' }
  }
}

export async function updateTest(
  id: string,
  data: {
    title?: string
    category?: LectureCategory
    date?: string
    totalMarks?: number
    description?: string
    isActive?: boolean
  }
) {
  await requireAdmin()

  const updateData: any = { ...data }
  if (data.date) updateData.date = new Date(data.date)

  await prisma.test.update({
    where: { id },
    data: updateData,
  })

  revalidatePath('/admin/tests')
  return { success: true }
}

export async function deleteTest(id: string) {
  await requireAdmin()
  await prisma.test.delete({ where: { id } })
  revalidatePath('/admin/tests')
  return { success: true }
}

export async function getTests() {
  const data = await prisma.test.findMany({
    include: {
      academicClass: true,
      academicSubject: true,
      computerCourse: true,
      _count: { select: { results: true } },
    },
    orderBy: { date: 'desc' },
  })
  return serialize(data)
}

// Test Results CRUD
export async function recordTestResult(data: {
  studentId: string
  testId: string
  obtainedMarks: number
  remarks?: string
}) {
  await requireAdmin()

  const test = await prisma.test.findUnique({ where: { id: data.testId } })
  if (!test) return { error: 'Test not found' }

  const percentage = (data.obtainedMarks / test.totalMarks) * 100
  const grade = getGrade(percentage)

  const result = await prisma.testResult.upsert({
    where: {
      studentId_testId: {
        studentId: data.studentId,
        testId: data.testId,
      },
    },
    update: {
      obtainedMarks: data.obtainedMarks,
      totalMarks: test.totalMarks,
      percentage,
      grade,
      remarks: data.remarks || null,
    },
    create: {
      studentId: data.studentId,
      testId: data.testId,
      obtainedMarks: data.obtainedMarks,
      totalMarks: test.totalMarks,
      percentage,
      grade,
      remarks: data.remarks || null,
    },
  })

  revalidatePath('/admin/results')
  revalidatePath('/admin/tests')
  revalidatePath('/dashboard/results')
  return { success: true, result: serialize(result) }
}

export async function getTestResults(filters?: { testId?: string; studentId?: string }) {
  const where: any = {}
  if (filters?.testId) where.testId = filters.testId
  if (filters?.studentId) where.studentId = filters.studentId

  const data = await prisma.testResult.findMany({
    where,
    include: {
      student: { include: { academicClass: true } },
      test: {
        include: {
          academicClass: true,
          academicSubject: true,
          computerCourse: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return serialize(data)
}

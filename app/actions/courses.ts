'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { CourseStatus } from '@prisma/client'
import { serialize } from '@/lib/utils'

export async function createComputerCourse(data: {
  name: string
  description?: string
  thumbnail?: string
  status?: CourseStatus
  startDate?: string
  endDate?: string
  fee?: number
  instructor?: string
  displayOrder?: number
}) {
  await requireAdmin()

  const existing = await prisma.computerCourse.findUnique({ where: { name: data.name } })
  if (existing) return { error: 'Course name already exists' }

  const course = await prisma.computerCourse.create({
    data: {
      name: data.name,
      description: data.description || null,
      thumbnail: data.thumbnail || null,
      status: data.status || CourseStatus.ACTIVE,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      fee: data.fee || null,
      instructor: data.instructor || null,
      displayOrder: data.displayOrder || 0,
    },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  return { success: true, course: serialize(course) }
}

export async function updateComputerCourse(
  id: string,
  data: {
    name?: string
    description?: string
    thumbnail?: string
    status?: CourseStatus
    startDate?: string
    endDate?: string
    fee?: number
    instructor?: string
    displayOrder?: number
  }
) {
  await requireAdmin()

  const updateData: any = { ...data }
  if (data.startDate) updateData.startDate = new Date(data.startDate)
  if (data.endDate) updateData.endDate = new Date(data.endDate)

  await prisma.computerCourse.update({
    where: { id },
    data: updateData,
  })

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${id}`)
  revalidatePath('/courses')
  return { success: true }
}

export async function deleteComputerCourse(id: string) {
  await requireAdmin()
  await prisma.computerCourse.delete({ where: { id } })
  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  return { success: true }
}

export async function getComputerCourses() {
  const data = await prisma.computerCourse.findMany({
    include: {
      chapters: {
        orderBy: { chapterNumber: 'asc' },
      },
      _count: {
        select: { students: true, lectures: true },
      },
    },
    orderBy: { displayOrder: 'asc' },
  })
  return serialize(data)
}

export async function getComputerCourseById(id: string) {
  const data = await prisma.computerCourse.findUnique({
    where: { id },
    include: {
      chapters: {
        include: { lectures: true },
        orderBy: { chapterNumber: 'asc' },
      },
      students: {
        include: { student: true },
      },
      lectures: true,
    },
  })
  return serialize(data)
}

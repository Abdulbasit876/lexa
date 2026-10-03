'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export async function createChapter(data: {
  title: string
  description?: string
  chapterNumber?: number
  academicSubjectId?: string
  computerCourseId?: string
}) {
  await requireAdmin()

  if (!data.academicSubjectId && !data.computerCourseId) {
    return { error: 'Chapter must belong to either an Academic Subject or a Computer Course' }
  }

  const chapter = await prisma.chapter.create({
    data: {
      title: data.title,
      description: data.description || null,
      chapterNumber: data.chapterNumber || 1,
      academicSubjectId: data.academicSubjectId || null,
      computerCourseId: data.computerCourseId || null,
    },
  })

  revalidatePath('/admin/chapters')
  revalidatePath('/admin/lectures')
  return { success: true, chapter }
}

export async function updateChapter(
  id: string,
  data: {
    title?: string
    description?: string
    chapterNumber?: number
    isActive?: boolean
  }
) {
  await requireAdmin()

  await prisma.chapter.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/chapters')
  return { success: true }
}

export async function deleteChapter(id: string) {
  await requireAdmin()
  await prisma.chapter.delete({ where: { id } })
  revalidatePath('/admin/chapters')
  return { success: true }
}

export async function getChapters(filters?: {
  academicSubjectId?: string
  computerCourseId?: string
}) {
  const where: any = {}
  if (filters?.academicSubjectId) where.academicSubjectId = filters.academicSubjectId
  if (filters?.computerCourseId) where.computerCourseId = filters.computerCourseId

  return prisma.chapter.findMany({
    where,
    include: {
      academicSubject: { include: { academicClass: true } },
      computerCourse: true,
      lectures: { orderBy: { lectureNumber: 'asc' } },
    },
    orderBy: { chapterNumber: 'asc' },
  })
}

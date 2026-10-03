'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { LectureCategory, LecturePlatform } from '@prisma/client'
import { isValidUrl } from '@/lib/utils'

export async function createLecture(data: {
  title: string
  description?: string
  category: LectureCategory
  platform: LecturePlatform
  videoUrl: string
  thumbnail?: string
  lectureNumber?: number
  duration?: string
  academicSubjectId?: string
  computerCourseId?: string
  chapterId?: string
}) {
  await requireAdmin()

  if (!isValidUrl(data.videoUrl)) {
    return { error: 'Please enter a valid external video URL' }
  }

  const lecture = await prisma.lecture.create({
    data: {
      title: data.title,
      description: data.description || null,
      category: data.category,
      platform: data.platform,
      videoUrl: data.videoUrl,
      thumbnail: data.thumbnail || null,
      lectureNumber: data.lectureNumber || 1,
      duration: data.duration || null,
      academicSubjectId: data.academicSubjectId || null,
      computerCourseId: data.computerCourseId || null,
      chapterId: data.chapterId || null,
    },
  })

  revalidatePath('/admin/lectures')
  revalidatePath('/lectures')
  revalidatePath('/dashboard/lectures')
  return { success: true, lecture }
}

export async function updateLecture(
  id: string,
  data: {
    title?: string
    description?: string
    category?: LectureCategory
    platform?: LecturePlatform
    videoUrl?: string
    thumbnail?: string
    lectureNumber?: number
    duration?: string
    academicSubjectId?: string | null
    computerCourseId?: string | null
    chapterId?: string | null
    isActive?: boolean
  }
) {
  await requireAdmin()

  if (data.videoUrl && !isValidUrl(data.videoUrl)) {
    return { error: 'Please enter a valid external video URL' }
  }

  await prisma.lecture.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/lectures')
  revalidatePath('/lectures')
  revalidatePath('/dashboard/lectures')
  return { success: true }
}

export async function deleteLecture(id: string) {
  await requireAdmin()
  await prisma.lecture.delete({ where: { id } })
  revalidatePath('/admin/lectures')
  revalidatePath('/lectures')
  revalidatePath('/dashboard/lectures')
  return { success: true }
}

export async function getPublicLectures(filters?: {
  category?: LectureCategory
  academicClassId?: string
  academicSubjectId?: string
  computerCourseId?: string
  chapterId?: string
  platform?: LecturePlatform
  search?: string
}) {
  const where: any = { isActive: true }

  if (filters?.category) where.category = filters.category
  if (filters?.academicSubjectId) where.academicSubjectId = filters.academicSubjectId
  if (filters?.computerCourseId) where.computerCourseId = filters.computerCourseId
  if (filters?.chapterId) where.chapterId = filters.chapterId
  if (filters?.platform) where.platform = filters.platform

  if (filters?.academicClassId) {
    where.academicSubject = { academicClassId: filters.academicClassId }
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  return prisma.lecture.findMany({
    where,
    include: {
      academicSubject: { include: { academicClass: true } },
      computerCourse: true,
      chapter: true,
    },
    orderBy: [{ lectureNumber: 'asc' }, { publishDate: 'desc' }],
  })
}

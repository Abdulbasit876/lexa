'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { AnnouncementStatus } from '@prisma/client'

export async function createAnnouncement(data: {
  title: string
  description: string
  status?: AnnouncementStatus
  isPublic?: boolean
}): Promise<{ success: boolean; announcement?: any; error?: string }> {
  try {
    await requireAdmin()

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || AnnouncementStatus.PUBLISHED,
        isPublic: data.isPublic ?? false,
        date: new Date(),
      },
    })

    revalidatePath('/admin/announcements')
    revalidatePath('/announcements')
    revalidatePath('/dashboard/announcements')
    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true, announcement }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create announcement' }
  }
}

export async function updateAnnouncement(
  id: string,
  data: {
    title?: string
    description?: string
    status?: AnnouncementStatus
    isPublic?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    await prisma.announcement.update({
      where: { id },
      data,
    })

    revalidatePath('/admin/announcements')
    revalidatePath('/announcements')
    revalidatePath('/dashboard/announcements')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update announcement' }
  }
}

export async function deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    await prisma.announcement.delete({ where: { id } })
    revalidatePath('/admin/announcements')
    revalidatePath('/announcements')
    revalidatePath('/dashboard/announcements')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete announcement' }
  }
}

export async function getAnnouncements(includeDrafts = false) {
  const where: any = {}
  if (!includeDrafts) {
    where.status = AnnouncementStatus.PUBLISHED
  }

  return prisma.announcement.findMany({
    where,
    orderBy: { date: 'desc' },
  })
}

export async function getPublicAnnouncements() {
  return prisma.announcement.findMany({
    where: {
      status: AnnouncementStatus.PUBLISHED,
      isPublic: true,
    },
    orderBy: { date: 'desc' },
    take: 10,
  })
}

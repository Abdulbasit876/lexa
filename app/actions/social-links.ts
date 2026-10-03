'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { SocialPlatform } from '@prisma/client'

export async function createSocialLink(data: {
  platform: SocialPlatform
  url: string
  displayName: string
  displayOrder?: number
}) {
  await requireAdmin()

  try {
    const socialLink = await prisma.socialLink.create({
      data: {
        platform: data.platform,
        url: data.url,
        displayName: data.displayName,
        displayOrder: data.displayOrder || 0,
      },
    })

    revalidatePath('/admin/social-links')
    revalidatePath('/')
    return { success: true, socialLink }
  } catch (error: any) {
    return { error: error.message || 'Failed to create social link' }
  }
}

export async function updateSocialLink(
  id: string,
  data: {
    platform?: SocialPlatform
    url?: string
    displayName?: string
    isActive?: boolean
    displayOrder?: number
  }
) {
  await requireAdmin()

  await prisma.socialLink.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/social-links')
  revalidatePath('/')
  return { success: true }
}

export async function deleteSocialLink(id: string) {
  await requireAdmin()
  await prisma.socialLink.delete({ where: { id } })
  revalidatePath('/admin/social-links')
  revalidatePath('/')
  return { success: true }
}

export async function getSocialLinks(activeOnly = true) {
  const where: any = {}
  if (activeOnly) where.isActive = true

  return prisma.socialLink.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
  })
}

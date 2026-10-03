'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export async function getAcademySettings() {
  const settings = await prisma.academySettings.findFirst()
  if (!settings) {
    return prisma.academySettings.create({
      data: {
        name: 'Academy Lexa',
        tagline: 'Learn Today, Lead Tomorrow',
        description: 'Quality education for a better future. Offering academic classes and computer courses.',
        address: '123 Education Street, Knowledge City',
        phone: '+92-300-1234567',
        email: 'info@academylexa.com',
      },
    })
  }
  return settings
}

export async function updateAcademySettings(data: {
  name?: string
  tagline?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  logo?: string
  heroImage?: string
}): Promise<{ success: boolean; settings?: any; error?: string }> {
  try {
    await requireAdmin()

    const existing = await getAcademySettings()

    const updated = await prisma.academySettings.update({
      where: { id: existing.id },
      data,
    })

    revalidatePath('/admin/settings')
    revalidatePath('/')
    return { success: true, settings: updated }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update academy settings' }
  }
}

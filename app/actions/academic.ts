'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

// Academic Classes CRUD
export async function createAcademicClass(data: { name: string; description?: string; displayOrder?: number }) {
  await requireAdmin()
  const existing = await prisma.academicClass.findUnique({ where: { name: data.name } })
  if (existing) return { error: 'Class name already exists' }

  const academicClass = await prisma.academicClass.create({
    data: {
      name: data.name,
      description: data.description || null,
      displayOrder: data.displayOrder || 0,
    },
  })

  revalidatePath('/admin/academic')
  revalidatePath('/courses')
  return { success: true, academicClass }
}

export async function updateAcademicClass(id: string, data: { name?: string; description?: string; isActive?: boolean; displayOrder?: number }) {
  await requireAdmin()

  await prisma.academicClass.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/academic')
  revalidatePath('/courses')
  return { success: true }
}

export async function deleteAcademicClass(id: string) {
  await requireAdmin()
  await prisma.academicClass.delete({ where: { id } })
  revalidatePath('/admin/academic')
  return { success: true }
}

export async function getAcademicClasses() {
  return prisma.academicClass.findMany({
    include: {
      subjects: {
        orderBy: { displayOrder: 'asc' },
      },
      _count: {
        select: { students: true },
      },
    },
    orderBy: { displayOrder: 'asc' },
  })
}

// Academic Subjects CRUD
export async function createAcademicSubject(data: { name: string; academicClassId: string; description?: string; displayOrder?: number }) {
  await requireAdmin()

  try {
    const subject = await prisma.academicSubject.create({
      data: {
        name: data.name,
        academicClassId: data.academicClassId,
        description: data.description || null,
        displayOrder: data.displayOrder || 0,
      },
    })

    revalidatePath(`/admin/academic/${data.academicClassId}/subjects`)
    revalidatePath('/admin/academic')
    return { success: true, subject }
  } catch (error: any) {
    return { error: error.message || 'Failed to create subject' }
  }
}

export async function updateAcademicSubject(id: string, data: { name?: string; description?: string; isActive?: boolean; displayOrder?: number }) {
  await requireAdmin()

  const updated = await prisma.academicSubject.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/academic')
  return { success: true, subject: updated }
}

export async function deleteAcademicSubject(id: string) {
  await requireAdmin()
  await prisma.academicSubject.delete({ where: { id } })
  revalidatePath('/admin/academic')
  return { success: true }
}

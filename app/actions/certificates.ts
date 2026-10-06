'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin, requireStudent } from '@/lib/auth'
import { serialize } from '@/lib/utils'

// Generate a unique certificate number e.g. LEXA-2024-0001
async function generateCertificateNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `LEXA-${year}-`

  const last = await prisma.certificate.findFirst({
    where: { certificateNumber: { startsWith: prefix } },
    orderBy: { certificateNumber: 'desc' },
  })

  let nextNum = 1
  if (last) {
    const parts = last.certificateNumber.split('-')
    nextNum = parseInt(parts[parts.length - 1], 10) + 1
  }

  return `${prefix}${String(nextNum).padStart(4, '0')}`
}

export async function issueCertificate(data: {
  studentId: string
  title: string
  description?: string
  issuedDate?: string
  validUntil?: string
  grade?: string
  remarks?: string
  academicClassId?: string
  computerCourseId?: string
}): Promise<{ success: boolean; certificate?: any; error?: string }> {
  try {
    await requireAdmin()

    const certificateNumber = await generateCertificateNumber()

    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber,
        title: data.title,
        description: data.description || null,
        issuedDate: data.issuedDate ? new Date(data.issuedDate) : new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        grade: data.grade || null,
        remarks: data.remarks || null,
        studentId: data.studentId,
        academicClassId: data.academicClassId || null,
        computerCourseId: data.computerCourseId || null,
      },
      include: {
        student: true,
        academicClass: true,
        computerCourse: true,
      },
    })

    revalidatePath('/admin/certificates')
    revalidatePath('/dashboard/certificates')
    return { success: true, certificate: serialize(certificate) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to issue certificate' }
  }
}

export async function getCertificates(filters?: {
  studentId?: string
}) {
  await requireAdmin()

  const where: any = {}
  if (filters?.studentId) where.studentId = filters.studentId

  const data = await prisma.certificate.findMany({
    where,
    include: {
      student: true,
      academicClass: true,
      computerCourse: true,
    },
    orderBy: { issuedDate: 'desc' },
  })

  return serialize(data)
}

export async function updateCertificate(id: string, data: {
  title?: string
  description?: string
  issuedDate?: string
  validUntil?: string
  grade?: string
  remarks?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    const updateData: any = { ...data }
    if (data.issuedDate) updateData.issuedDate = new Date(data.issuedDate)
    if (data.validUntil) updateData.validUntil = new Date(data.validUntil)

    await prisma.certificate.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/admin/certificates')
    revalidatePath('/dashboard/certificates')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update certificate' }
  }
}

export async function deleteCertificate(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    await prisma.certificate.delete({ where: { id } })
    revalidatePath('/admin/certificates')
    revalidatePath('/dashboard/certificates')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete certificate' }
  }
}

export async function getStudentCertificates() {
  const user = await requireStudent()

  if (!user.studentId) return []

  const data = await prisma.certificate.findMany({
    where: { studentId: user.studentId },
    include: {
      student: true,
      academicClass: true,
      computerCourse: true,
    },
    orderBy: { issuedDate: 'desc' },
  })

  return serialize(data)
}

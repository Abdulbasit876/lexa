'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { serialize } from '@/lib/utils'

export async function createAdmission(data: {
  studentId: string
  admissionDate: string
  joiningDate?: string
  monthlyFee: number
  initialPayment?: number
  academicClassId?: string
  computerCourseIds?: string[]
  notes?: string
}) {
  await requireAdmin()

  const admission = await prisma.admission.create({
    data: {
      studentId: data.studentId,
      admissionDate: new Date(data.admissionDate),
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
      monthlyFee: data.monthlyFee,
      initialPayment: data.initialPayment || 0,
      academicClassId: data.academicClassId || null,
      notes: data.notes || null,
      courses: data.computerCourseIds
        ? {
            create: data.computerCourseIds.map((cId) => ({ courseId: cId })),
          }
        : undefined,
    },
  })

  // Update student status/fee if changed
  await prisma.student.update({
    where: { id: data.studentId },
    data: {
      admissionDate: new Date(data.admissionDate),
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,
      monthlyFee: data.monthlyFee,
      academicClassId: data.academicClassId || undefined,
    },
  })

  revalidatePath('/admin/admissions')
  revalidatePath(`/admin/students/${data.studentId}`)
  return { success: true, admission: serialize(admission) }
}

export async function getAdmissions() {
  await requireAdmin()
  const data = await prisma.admission.findMany({
    include: {
      student: true,
      academicClass: true,
      courses: { include: { course: true } },
    },
    orderBy: { admissionDate: 'desc' },
  })
  return serialize(data)
}

export async function updateAdmission(id: string, data: {
  admissionDate?: string
  joiningDate?: string
  monthlyFee?: number
  initialPayment?: number
  academicClassId?: string | null
  notes?: string | null
}) {
  await requireAdmin()

  const updateData: any = { ...data }
  if (data.admissionDate) updateData.admissionDate = new Date(data.admissionDate)
  if (data.joiningDate) updateData.joiningDate = new Date(data.joiningDate)

  const admission = await prisma.admission.update({
    where: { id },
    data: updateData,
  })

  revalidatePath('/admin/admissions')
  revalidatePath(`/admin/students/${admission.studentId}`)
  return { success: true, admission: serialize(admission) }
}

export async function deleteAdmission(id: string) {
  await requireAdmin()
  await prisma.admission.delete({ where: { id } })
  revalidatePath('/admin/admissions')
  return { success: true }
}

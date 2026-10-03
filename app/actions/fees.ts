'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { FeeStatus } from '@prisma/client'
import { serialize } from '@/lib/utils'

export async function createOrUpdateFee(data: {
  studentId: string
  month: string // YYYY-MM
  amount: number
  status?: FeeStatus
  paidAmount?: number
  dueDate?: string
  notes?: string
}): Promise<{ success: boolean; fee?: any; error?: string }> {
  try {
    await requireAdmin()

    const monthDate = new Date(`${data.month}-01`)

    const fee = await prisma.fee.upsert({
      where: {
        studentId_month: {
          studentId: data.studentId,
          month: monthDate,
        },
      },
      update: {
        amount: data.amount,
        status: data.status || FeeStatus.PENDING,
        paidAmount: data.paidAmount || 0,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes || null,
      },
      create: {
        studentId: data.studentId,
        month: monthDate,
        amount: data.amount,
        status: data.status || FeeStatus.PENDING,
        paidAmount: data.paidAmount || 0,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes || null,
      },
    })

    revalidatePath('/admin/fees')
    revalidatePath(`/admin/students/${data.studentId}`)
    return { success: true, fee: serialize(fee) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create or update fee' }
  }
}

export async function generateMonthlyFees(month: string): Promise<{ success: boolean; generatedCount?: number; error?: string }> {
  try {
    await requireAdmin()
    const monthDate = new Date(`${month}-01`)

    // Get active students
    const activeStudents = await prisma.student.findMany({
      where: { status: 'ACTIVE' },
    })

    let count = 0
    for (const student of activeStudents) {
      if (Number(student.monthlyFee) > 0) {
        await prisma.fee.upsert({
          where: {
            studentId_month: {
              studentId: student.id,
              month: monthDate,
            },
          },
          update: {},
          create: {
            studentId: student.id,
            month: monthDate,
            amount: student.monthlyFee,
            status: FeeStatus.PENDING,
            paidAmount: 0,
          },
        })
        count++
      }
    }

    revalidatePath('/admin/fees')
    return { success: true, generatedCount: count }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to generate monthly fees' }
  }
}

export async function getFees(filters?: {
  month?: string
  status?: FeeStatus
  studentId?: string
  academicClassId?: string
}) {
  await requireAdmin()

  const where: any = {}

  if (filters?.month) {
    where.month = new Date(`${filters.month}-01`)
  }

  if (filters?.status) {
    where.status = filters.status
  }

  if (filters?.studentId) {
    where.studentId = filters.studentId
  }

  if (filters?.academicClassId) {
    where.student = { academicClassId: filters.academicClassId }
  }

  const data = await prisma.fee.findMany({
    where,
    include: {
      student: {
        include: { academicClass: true },
      },
      payments: true,
    },
    orderBy: [{ month: 'desc' }, { createdAt: 'desc' }],
  })
  return serialize(data)
}

export async function markFeePaid(feeId: string, notes?: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    const fee = await prisma.fee.findUnique({ where: { id: feeId } })
    if (!fee) return { success: false, error: 'Fee record not found' }

    await prisma.fee.update({
      where: { id: feeId },
      data: {
        status: FeeStatus.PAID,
        paidAmount: fee.amount,
        notes: notes || fee.notes,
      },
    })

    revalidatePath('/admin/fees')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to mark fee as paid' }
  }
}

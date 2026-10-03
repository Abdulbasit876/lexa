'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin, requireAuth, requireStudent } from '@/lib/auth'
import { PaymentSubmissionStatus, PaymentMethod, FeeStatus } from '@prisma/client'
import { serialize } from '@/lib/utils'

// Student manual payment submission
export async function submitPayment(data: {
  amount: number
  paymentMethod: PaymentMethod
  transactionRef?: string
  paymentDate: string
  submissionNote?: string
  feeId?: string
}): Promise<{ success: boolean; payment?: any; error?: string }> {
  try {
    const user = await requireStudent()

    if (!user.studentId) {
      return { success: false, error: 'Student profile not linked' }
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: user.studentId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionRef: data.transactionRef || null,
        paymentDate: new Date(data.paymentDate),
        submissionNote: data.submissionNote || null,
        feeId: data.feeId || null,
        status: PaymentSubmissionStatus.PENDING_REVIEW,
      },
    })

    revalidatePath('/dashboard/fees')
    revalidatePath('/dashboard/payments')
    revalidatePath('/admin/payments')
    return { success: true, payment: serialize(payment) }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit payment' }
  }
}

// Admin payment review: approve / reject / mark paid
export async function reviewPayment(data: {
  paymentId: string
  status: PaymentSubmissionStatus
  adminNote?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    const payment = await prisma.payment.findUnique({
      where: { id: data.paymentId },
      include: { fee: true },
    })

    if (!payment) return { success: false, error: 'Payment submission not found' }

    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: data.paymentId },
        data: {
          status: data.status,
          adminNote: data.adminNote || null,
          reviewedAt: new Date(),
        },
      })

      // If payment approved or marked paid, update linked Fee if present
      if ((data.status === PaymentSubmissionStatus.APPROVED || data.status === PaymentSubmissionStatus.PAID) && payment.feeId) {
        const currentPaid = Number(payment.fee?.paidAmount || 0)
        const newPaid = currentPaid + Number(payment.amount)
        const feeAmount = Number(payment.fee?.amount || 0)

        let feeStatus: FeeStatus = FeeStatus.PARTIAL
        if (newPaid >= feeAmount) {
          feeStatus = FeeStatus.PAID
        }

        await tx.fee.update({
          where: { id: payment.feeId },
          data: {
            paidAmount: newPaid,
            status: feeStatus,
          },
        })
      }
    })

    revalidatePath('/admin/payments')
    revalidatePath('/admin/fees')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to review payment' }
  }
}

export async function getPayments(filters?: {
  status?: PaymentSubmissionStatus
  studentId?: string
}) {
  const user = await requireAuth()

  const where: any = {}
  if (filters?.status) where.status = filters.status

  if (user.role === 'STUDENT') {
    if (!user.studentId) return []
    where.studentId = user.studentId
  } else if (filters?.studentId) {
    where.studentId = filters.studentId
  }

  const data = await prisma.payment.findMany({
    where,
    include: {
      student: {
        include: { academicClass: true },
      },
      fee: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return serialize(data)
}

// Payment Settings CRUD (Bank/Easypaisa/Jazzcash details)
export async function getPaymentSettings() {
  const settings = await prisma.paymentSettings.findFirst()
  if (!settings) {
    return prisma.paymentSettings.create({
      data: {
        bankName: 'Demo Bank Ltd',
        accountTitle: 'Academy Lexa',
        accountNumber: '1234-5678-9012-3456',
        iban: 'PK00DEMO0000001234567890',
        easypaisaName: 'Academy Lexa',
        easypaisaNumber: '03001234567',
        jazzcashName: 'Academy Lexa',
        jazzcashNumber: '03001234567',
        instructions: 'Send monthly fee using any method above and submit your Transaction Reference ID via the Student Portal.',
      },
    })
  }
  return settings
}

export async function updatePaymentSettings(data: {
  bankName?: string
  accountTitle?: string
  accountNumber?: string
  iban?: string
  easypaisaName?: string
  easypaisaNumber?: string
  jazzcashName?: string
  jazzcashNumber?: string
  instructions?: string
}): Promise<{ success: boolean; settings?: any; error?: string }> {
  try {
    await requireAdmin()

    const existing = await getPaymentSettings()

    const updated = await prisma.paymentSettings.update({
      where: { id: existing.id },
      data,
    })

    revalidatePath('/admin/payments/settings')
    revalidatePath('/payment-info')
    revalidatePath('/dashboard/fees')
    return { success: true, settings: updated }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update payment settings' }
  }
}

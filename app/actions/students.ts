'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/lib/auth'
import { StudentStatus } from '@prisma/client'
import { serialize } from '@/lib/utils'

export async function createStudent(data: {
  fullName: string
  fatherName?: string
  phone?: string
  email?: string
  address?: string
  dateOfBirth?: string
  username: string
  password: string
  monthlyFee: number
  academicClassId?: string
  computerCourseIds?: string[]
  notes?: string
}) {
  await requireAdmin()

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username.toLowerCase() },
        ...(data.email ? [{ email: data.email.toLowerCase() }] : []),
      ],
    },
  })

  if (existingUser) {
    return { error: 'Username or Email already exists' }
  }

  // Generate unique Student ID like LEX-101
  const count = await prisma.student.count()
  const studentId = `LEX-${String(count + 1).padStart(3, '0')}`

  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create User + Student in transaction
  const student = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: data.username.toLowerCase(),
        email: data.email?.toLowerCase() || `${data.username.toLowerCase()}@academylexa.com`,
        password: hashedPassword,
        role: 'STUDENT',
      },
    })

    const newStudent = await tx.student.create({
      data: {
        studentId,
        fullName: data.fullName,
        fatherName: data.fatherName || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        status: StudentStatus.ACTIVE,
        admissionDate: new Date(),
        joiningDate: new Date(),
        monthlyFee: data.monthlyFee,
        notes: data.notes || null,
        academicClassId: data.academicClassId || null,
        userId: user.id,
      },
    })

    if (data.computerCourseIds && data.computerCourseIds.length > 0) {
      await tx.studentComputerCourse.createMany({
        data: data.computerCourseIds.map((courseId) => ({
          studentId: newStudent.id,
          courseId,
        })),
      })
    }

    // Record admission
    await tx.admission.create({
      data: {
        studentId: newStudent.id,
        admissionDate: new Date(),
        joiningDate: new Date(),
        monthlyFee: data.monthlyFee,
        academicClassId: data.academicClassId || null,
        courses: data.computerCourseIds
          ? {
              create: data.computerCourseIds.map((cId) => ({ courseId: cId })),
            }
          : undefined,
      },
    })

    return newStudent
  })

  revalidatePath('/admin/students')
  revalidatePath('/admin/admissions')
  return { success: true, student: serialize(student) }
}

export async function updateStudent(
  id: string,
  data: {
    fullName?: string
    fatherName?: string
    phone?: string
    email?: string
    address?: string
    dateOfBirth?: string
    status?: StudentStatus
    leavingDate?: string
    leavingReason?: string
    monthlyFee?: number
    notes?: string
    academicClassId?: string | null
    computerCourseIds?: string[]
  }
) {
  await requireAdmin()

  const updateData: any = { ...data }
  if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth)
  if (data.leavingDate) updateData.leavingDate = new Date(data.leavingDate)
  delete updateData.computerCourseIds

  await prisma.$transaction(async (tx) => {
    await tx.student.update({
      where: { id },
      data: updateData,
    })

    if (data.computerCourseIds !== undefined) {
      await tx.studentComputerCourse.deleteMany({ where: { studentId: id } })
      if (data.computerCourseIds.length > 0) {
        await tx.studentComputerCourse.createMany({
          data: data.computerCourseIds.map((cId) => ({
            studentId: id,
            courseId: cId,
          })),
        })
      }
    }
  })

  revalidatePath('/admin/students')
  revalidatePath(`/admin/students/${id}`)
  return { success: true }
}

export async function getStudents(filters?: {
  search?: string
  status?: StudentStatus
  academicClassId?: string
  computerCourseId?: string
}) {
  await requireAdmin()

  const where: any = {}

  if (filters?.status) {
    where.status = filters.status
  }

  if (filters?.academicClassId) {
    where.academicClassId = filters.academicClassId
  }

  if (filters?.computerCourseId) {
    where.computerCourses = {
      some: { courseId: filters.computerCourseId },
    }
  }

  if (filters?.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { studentId: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  const data = await prisma.student.findMany({
    where,
    include: {
      academicClass: true,
      computerCourses: {
        include: { course: true },
      },
      user: {
        select: { username: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return serialize(data)
}

export async function getStudentById(id: string) {
  const data = await prisma.student.findUnique({
    where: { id },
    include: {
      academicClass: {
        include: { subjects: true },
      },
      computerCourses: {
        include: { course: true },
      },
      user: true,
      attendance: {
        orderBy: { date: 'desc' },
        take: 30,
      },
      fees: {
        orderBy: { month: 'desc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
      testResults: {
        include: { test: true },
        orderBy: { createdAt: 'desc' },
      },
      admissions: {
        include: {
          academicClass: true,
          courses: { include: { course: true } },
        },
      },
    },
  })
  return serialize(data)
}

export async function deleteStudent(id: string) {
  await requireAdmin()
  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) return { error: 'Student not found' }

  await prisma.user.delete({ where: { id: student.userId } })
  revalidatePath('/admin/students')
  return { success: true }
}

'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

export async function getUsers() {
  await requireAdmin()
  return prisma.user.findMany({
    include: {
      student: { select: { fullName: true, studentId: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createUser(data: {
  username: string
  email: string
  password: string
  role: Role
}) {
  await requireAdmin()

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username.toLowerCase() },
        { email: data.email.toLowerCase() },
      ],
    },
  })

  if (existing) return { error: 'Username or Email already exists' }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role,
    },
  })

  revalidatePath('/admin/users')
  return { success: true, user }
}

export async function toggleUserActive(userId: string) {
  await requireAdmin()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: 'User not found' }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  })

  revalidatePath('/admin/users')
  return { success: true }
}

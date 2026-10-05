import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Cleaning dummy data and setting up production database...')

  // =====================================================================
  // CLEANUP ALL DUMMY DATA
  // =====================================================================
  await prisma.aIMessage.deleteMany()
  await prisma.aIConversation.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.socialLink.deleteMany()
  await prisma.testResult.deleteMany()
  await prisma.test.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.fee.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.admissionCourse.deleteMany()
  await prisma.admission.deleteMany()
  await prisma.lecture.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.studentComputerCourse.deleteMany()
  await prisma.academicSubject.deleteMany()
  await prisma.computerCourse.deleteMany()
  await prisma.student.deleteMany()
  await prisma.user.deleteMany()
  await prisma.academicClass.deleteMany()
  await prisma.paymentSettings.deleteMany()
  await prisma.academySettings.deleteMany()

  // =====================================================================
  // DEFAULT ACADEMY SETTINGS
  // =====================================================================
  await prisma.academySettings.create({
    data: {
      name: 'Academy Lexa',
      tagline: 'Learn Today, Lead Tomorrow',
      description: 'Academy Lexa Educational Portal',
    }
  })

  // =====================================================================
  // PRODUCTION ADMIN USER
  // =====================================================================
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@academylexa.com',
      username: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
    }
  })

  console.log('✅ Production cleanup complete!')
  console.log('📋 Admin Credentials:')
  console.log('   Admin Email: admin@academylexa.com')
  console.log('   Password:    admin123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

import { PrismaClient, Role, StudentStatus, AttendanceStatus, FeeStatus, PaymentSubmissionStatus, PaymentMethod, LectureCategory, LecturePlatform, CourseStatus, AnnouncementStatus, SocialPlatform } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Academy Lexa database...')

  // =====================================================================
  // CLEANUP (dev only)
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
  // ACADEMY SETTINGS
  // =====================================================================
  await prisma.academySettings.create({
    data: {
      name: 'Academy Lexa',
      tagline: 'Learn Today, Lead Tomorrow',
      description: 'Academy Lexa is a modern educational institution providing quality academic classes and computer courses to help students achieve their goals.',
      address: '123 Education Street, Knowledge City',
      phone: '+92-300-1234567',
      email: 'info@academylexa.com',
    }
  })

  // =====================================================================
  // PAYMENT SETTINGS
  // =====================================================================
  await prisma.paymentSettings.create({
    data: {
      bankName: 'Demo Bank (Sample Data)',
      accountTitle: 'Academy Lexa',
      accountNumber: '1234-5678-9012-3456',
      iban: 'PK00DEMO0000001234567890',
      easypaisaName: 'Academy Lexa Demo',
      easypaisaNumber: '03001234567',
      jazzcashName: 'Academy Lexa Demo',
      jazzcashNumber: '03001234567',
      instructions: 'Please send the fee to any of the above accounts. After payment, submit your transaction ID through the student portal. Admin will verify and confirm your payment within 24 hours.',
    }
  })

  // =====================================================================
  // ACADEMIC CLASSES
  // =====================================================================
  const class6 = await prisma.academicClass.create({ data: { name: 'Class 6', description: 'Sixth grade academic class', displayOrder: 1 } })
  const class7 = await prisma.academicClass.create({ data: { name: 'Class 7', description: 'Seventh grade academic class', displayOrder: 2 } })
  const class8 = await prisma.academicClass.create({ data: { name: 'Class 8', description: 'Eighth grade academic class', displayOrder: 3 } })
  const class9 = await prisma.academicClass.create({ data: { name: 'Class 9', description: 'Ninth grade — SSC Part 1', displayOrder: 4 } })
  const class10 = await prisma.academicClass.create({ data: { name: 'Class 10', description: 'Tenth grade — SSC Part 2', displayOrder: 5 } })
  const intermediate = await prisma.academicClass.create({ data: { name: 'Intermediate', description: 'Higher secondary level', displayOrder: 6 } })

  // =====================================================================
  // ACADEMIC SUBJECTS
  // =====================================================================
  const physics9 = await prisma.academicSubject.create({ data: { name: 'Physics', academicClassId: class9.id, displayOrder: 1 } })
  const math9 = await prisma.academicSubject.create({ data: { name: 'Mathematics', academicClassId: class9.id, displayOrder: 2 } })
  const chem9 = await prisma.academicSubject.create({ data: { name: 'Chemistry', academicClassId: class9.id, displayOrder: 3 } })
  const cs9 = await prisma.academicSubject.create({ data: { name: 'Computer Science', academicClassId: class9.id, displayOrder: 4 } })
  const eng9 = await prisma.academicSubject.create({ data: { name: 'English', academicClassId: class9.id, displayOrder: 5 } })
  const bio9 = await prisma.academicSubject.create({ data: { name: 'Biology', academicClassId: class9.id, displayOrder: 6 } })

  const physics10 = await prisma.academicSubject.create({ data: { name: 'Physics', academicClassId: class10.id, displayOrder: 1 } })
  const math10 = await prisma.academicSubject.create({ data: { name: 'Mathematics', academicClassId: class10.id, displayOrder: 2 } })

  // =====================================================================
  // COMPUTER COURSES
  // =====================================================================
  const webDev = await prisma.computerCourse.create({
    data: {
      name: 'Web Development',
      description: 'Learn HTML, CSS, JavaScript, and React to build modern websites',
      status: CourseStatus.ACTIVE,
      fee: 3000,
      instructor: 'Sir Ahmed',
      displayOrder: 1,
    }
  })
  const msOffice = await prisma.computerCourse.create({
    data: {
      name: 'MS Office',
      description: 'Master Microsoft Word, Excel, PowerPoint and Outlook',
      status: CourseStatus.ACTIVE,
      fee: 2000,
      instructor: 'Miss Fatima',
      displayOrder: 2,
    }
  })
  const graphicDesign = await prisma.computerCourse.create({
    data: {
      name: 'Graphic Design',
      description: 'Adobe Photoshop, Illustrator and design fundamentals',
      status: CourseStatus.ACTIVE,
      fee: 3500,
      instructor: 'Sir Hassan',
      displayOrder: 3,
    }
  })
  const compBasics = await prisma.computerCourse.create({
    data: {
      name: 'Computer Basics',
      description: 'Introduction to computers, operating systems, and basic software',
      status: CourseStatus.ACTIVE,
      fee: 1500,
      instructor: 'Miss Zainab',
      displayOrder: 4,
    }
  })

  // =====================================================================
  // CHAPTERS
  // =====================================================================
  const physChap1 = await prisma.chapter.create({ data: { title: 'Chapter 1: Physical Quantities and Measurement', chapterNumber: 1, academicSubjectId: physics9.id } })
  const physChap2 = await prisma.chapter.create({ data: { title: 'Chapter 2: Kinematics', chapterNumber: 2, academicSubjectId: physics9.id } })
  const physChap3 = await prisma.chapter.create({ data: { title: 'Chapter 3: Dynamics', chapterNumber: 3, academicSubjectId: physics9.id } })

  const webChap1 = await prisma.chapter.create({ data: { title: 'HTML Fundamentals', chapterNumber: 1, computerCourseId: webDev.id } })
  const webChap2 = await prisma.chapter.create({ data: { title: 'CSS Styling', chapterNumber: 2, computerCourseId: webDev.id } })
  const webChap3 = await prisma.chapter.create({ data: { title: 'JavaScript Basics', chapterNumber: 3, computerCourseId: webDev.id } })

  // =====================================================================
  // LECTURES
  // =====================================================================
  const lecturesData = [
    // Physics Class 9
    { title: 'Lecture 01 - Introduction to Physics', description: 'Overview of physics and its branches', category: LectureCategory.ACADEMIC, platform: LecturePlatform.YOUTUBE, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lectureNumber: 1, academicSubjectId: physics9.id, chapterId: physChap1.id },
    { title: 'Lecture 02 - Units and Dimensions', description: 'SI units, fundamental and derived quantities', category: LectureCategory.ACADEMIC, platform: LecturePlatform.YOUTUBE, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lectureNumber: 2, academicSubjectId: physics9.id, chapterId: physChap1.id },
    { title: 'Lecture 03 - Measurement Errors', description: 'Types of errors and significant figures', category: LectureCategory.ACADEMIC, platform: LecturePlatform.YOUTUBE, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lectureNumber: 3, academicSubjectId: physics9.id, chapterId: physChap1.id },
    { title: 'Lecture 04 - Significant Figures', description: 'Rules and practice problems', category: LectureCategory.ACADEMIC, platform: LecturePlatform.FACEBOOK, videoUrl: 'https://www.facebook.com/watch', lectureNumber: 4, academicSubjectId: physics9.id, chapterId: physChap1.id },
    { title: 'Lecture 05 - Practice Problems', description: 'Solved problems from Chapter 1', category: LectureCategory.ACADEMIC, platform: LecturePlatform.YOUTUBE, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lectureNumber: 5, academicSubjectId: physics9.id, chapterId: physChap1.id },
    // Web Development
    { title: 'HTML Introduction', description: 'What is HTML and how web pages work', category: LectureCategory.COMPUTER, platform: LecturePlatform.YOUTUBE, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lectureNumber: 1, computerCourseId: webDev.id, chapterId: webChap1.id },
    { title: 'HTML Tags and Elements', description: 'Common HTML tags and their usage', category: LectureCategory.COMPUTER, platform: LecturePlatform.YOUTUBE, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lectureNumber: 2, computerCourseId: webDev.id, chapterId: webChap1.id },
    { title: 'CSS Selectors', description: 'How to select and style HTML elements', category: LectureCategory.COMPUTER, platform: LecturePlatform.YOUTUBE, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lectureNumber: 1, computerCourseId: webDev.id, chapterId: webChap2.id },
    { title: 'JavaScript Variables', description: 'var, let, const and data types', category: LectureCategory.COMPUTER, platform: LecturePlatform.INSTAGRAM, videoUrl: 'https://www.instagram.com/reel', lectureNumber: 1, computerCourseId: webDev.id, chapterId: webChap3.id },
  ]

  for (const lecture of lecturesData) {
    await prisma.lecture.create({ data: lecture as any })
  }

  // =====================================================================
  // ADMIN USER
  // =====================================================================
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@academylexa.com',
      username: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
    }
  })

  // =====================================================================
  // STUDENT USERS
  // =====================================================================
  const students = [
    { fullName: 'Ali Raza', fatherName: 'Muhammad Raza', phone: '0300-1234567', studentId: 'LEX-001', academicClassId: class9.id, courses: [webDev.id, msOffice.id], monthlyFee: 2500 },
    { fullName: 'Ahmed Khan', fatherName: 'Khalid Khan', phone: '0301-2345678', studentId: 'LEX-002', academicClassId: class9.id, courses: [webDev.id], monthlyFee: 2500 },
    { fullName: 'Fatima Noor', fatherName: 'Tariq Noor', phone: '0302-3456789', studentId: 'LEX-003', academicClassId: class10.id, courses: [graphicDesign.id], monthlyFee: 2500 },
    { fullName: 'Hassan Ali', fatherName: 'Ali Hassan', phone: '0303-4567890', studentId: 'LEX-004', academicClassId: class9.id, courses: [], monthlyFee: 2000 },
    { fullName: 'Zainab Fatima', fatherName: 'Fateh Ali', phone: '0304-5678901', studentId: 'LEX-005', academicClassId: class10.id, courses: [msOffice.id, compBasics.id], monthlyFee: 2500, status: StudentStatus.LEFT },
  ]

  const createdStudents = []
  for (let i = 0; i < students.length; i++) {
    const s = students[i]
    const pw = await bcrypt.hash('student123', 10)
    const user = await prisma.user.create({
      data: {
        email: `${s.studentId.toLowerCase()}@academylexa.com`,
        username: s.studentId.toLowerCase(),
        password: pw,
        role: Role.STUDENT,
      }
    })

    const student = await prisma.student.create({
      data: {
        studentId: s.studentId,
        fullName: s.fullName,
        fatherName: s.fatherName,
        phone: s.phone,
        status: s.status || StudentStatus.ACTIVE,
        admissionDate: new Date(2024, 0, 15),
        joiningDate: new Date(2024, 0, 20),
        leavingDate: s.status === StudentStatus.LEFT ? new Date(2024, 9, 1) : null,
        leavingReason: s.status === StudentStatus.LEFT ? 'Transferred to another institute' : null,
        monthlyFee: s.monthlyFee,
        academicClassId: s.academicClassId,
        userId: user.id,
      }
    })

    // Assign computer courses
    for (const courseId of s.courses) {
      await prisma.studentComputerCourse.create({
        data: { studentId: student.id, courseId }
      })
    }

    createdStudents.push(student)
  }

  // =====================================================================
  // ATTENDANCE (last 30 days for active students)
  // =====================================================================
  const activeStudents = createdStudents.filter(s => s.status === StudentStatus.ACTIVE)
  const today = new Date()
  for (let d = 29; d >= 0; d--) {
    const date = new Date(today)
    date.setDate(date.getDate() - d)
    date.setHours(0, 0, 0, 0)

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    for (const student of activeStudents) {
      const rand = Math.random()
      const status = rand > 0.15 ? AttendanceStatus.PRESENT : rand > 0.05 ? AttendanceStatus.ABSENT : AttendanceStatus.LEAVE
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date,
          status,
          academicClassId: student.academicClassId,
        }
      }).catch(() => {}) // ignore unique constraint errors
    }
  }

  // =====================================================================
  // FEES (last 5 months)
  // =====================================================================
  const months = [-4, -3, -2, -1, 0]
  for (const student of activeStudents) {
    for (const offset of months) {
      const monthDate = new Date()
      monthDate.setDate(1)
      monthDate.setMonth(monthDate.getMonth() + offset)
      monthDate.setHours(0, 0, 0, 0)

      const isPaid = offset < 0
      const fee = await prisma.fee.create({
        data: {
          studentId: student.id,
          month: monthDate,
          amount: student.monthlyFee,
          status: isPaid ? FeeStatus.PAID : FeeStatus.PENDING,
          paidAmount: isPaid ? student.monthlyFee : 0,
        }
      })

      if (isPaid) {
        await prisma.payment.create({
          data: {
            studentId: student.id,
            feeId: fee.id,
            amount: student.monthlyFee,
            paymentMethod: PaymentMethod.JAZZCASH,
            transactionRef: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
            paymentDate: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 5),
            status: PaymentSubmissionStatus.PAID,
          }
        })
      }
    }
  }

  // =====================================================================
  // TESTS
  // =====================================================================
  const test1 = await prisma.test.create({
    data: {
      title: 'Physics Chapter 2 Test',
      category: LectureCategory.ACADEMIC,
      date: new Date(2024, 4, 10),
      totalMarks: 25,
      description: 'Physical Quantities and Measurement',
      academicClassId: class9.id,
      academicSubjectId: physics9.id,
    }
  })
  const test2 = await prisma.test.create({
    data: {
      title: 'Math Chapter 3 Test',
      category: LectureCategory.ACADEMIC,
      date: new Date(2024, 4, 12),
      totalMarks: 20,
      academicClassId: class9.id,
      academicSubjectId: math9.id,
    }
  })
  const test3 = await prisma.test.create({
    data: {
      title: 'Computer Basics Test',
      category: LectureCategory.COMPUTER,
      date: new Date(2024, 4, 15),
      totalMarks: 30,
      computerCourseId: compBasics.id,
    }
  })

  // =====================================================================
  // TEST RESULTS
  // =====================================================================
  const resultData = [
    { student: activeStudents[0], test: test1, marks: 22, grade: 'A' },
    { student: activeStudents[1], test: test1, marks: 18, grade: 'B' },
    { student: activeStudents[0], test: test2, marks: 17, grade: 'B+' },
    { student: activeStudents[1], test: test2, marks: 14, grade: 'C' },
  ]
  for (const r of resultData) {
    await prisma.testResult.create({
      data: {
        studentId: r.student.id,
        testId: r.test.id,
        obtainedMarks: r.marks,
        totalMarks: r.test.totalMarks,
        percentage: Number(((r.marks / r.test.totalMarks) * 100).toFixed(2)),
        grade: r.grade,
        remarks: r.marks >= 20 ? 'Excellent performance!' : r.marks >= 15 ? 'Good work, keep it up.' : 'Need to improve.',
      }
    })
  }

  // =====================================================================
  // ANNOUNCEMENTS
  // =====================================================================
  await prisma.announcement.createMany({
    data: [
      { title: 'Physics Test on Monday', description: 'Physics Chapter 3 test will be held on Monday. All Class 9 students must prepare Chapter 3 thoroughly.', status: AnnouncementStatus.PUBLISHED, isPublic: true, date: new Date(2024, 4, 5) },
      { title: 'New Lecture Uploaded', description: 'New lecture on CSS Styling has been uploaded. Web Development students can access it from the lectures section.', status: AnnouncementStatus.PUBLISHED, isPublic: false, date: new Date(2024, 4, 7) },
      { title: 'Eid Holidays', description: 'Academy will remain closed from May 10 to May 12 for Eid holidays. Classes will resume on May 13.', status: AnnouncementStatus.PUBLISHED, isPublic: true, date: new Date(2024, 4, 8) },
      { title: 'Fee Reminder', description: 'Monthly fee for May 2024 is now due. Please submit your fee before the 10th of the month. You can submit payment details through the student portal.', status: AnnouncementStatus.PUBLISHED, isPublic: false, date: new Date(2024, 4, 9) },
      { title: 'New Computer Course Starting', description: 'We are starting a new Graphic Design course next month. Interested students can register at the front desk.', status: AnnouncementStatus.DRAFT, isPublic: false, date: new Date(2024, 4, 10) },
    ]
  })

  // =====================================================================
  // SOCIAL LINKS
  // =====================================================================
  await prisma.socialLink.createMany({
    data: [
      { platform: SocialPlatform.YOUTUBE, url: 'https://youtube.com/@academylexa', displayName: 'Academy Lexa YouTube', isActive: true, displayOrder: 1 },
      { platform: SocialPlatform.FACEBOOK, url: 'https://facebook.com/academylexa', displayName: 'Academy Lexa Facebook', isActive: true, displayOrder: 2 },
      { platform: SocialPlatform.INSTAGRAM, url: 'https://instagram.com/academylexa', displayName: 'Academy Lexa Instagram', isActive: true, displayOrder: 3 },
      { platform: SocialPlatform.LINKEDIN, url: 'https://linkedin.com/company/academylexa', displayName: 'Academy Lexa LinkedIn', isActive: true, displayOrder: 4 },
    ]
  })

  // =====================================================================
  // ADMISSIONS
  // =====================================================================
  const ali = createdStudents[0]
  await prisma.admission.create({
    data: {
      studentId: ali.id,
      admissionDate: new Date(2024, 0, 15),
      joiningDate: new Date(2024, 0, 20),
      monthlyFee: 2500,
      initialPayment: 2500,
      notes: 'Admission for Class 9 + Web Development',
      academicClassId: class9.id,
      courses: {
        create: [
          { courseId: webDev.id },
          { courseId: msOffice.id },
        ]
      }
    }
  })

  console.log('✅ Seeding complete!')
  console.log('')
  console.log('📋 Demo Credentials:')
  console.log('   Admin:   admin@academylexa.com / admin123')
  console.log('   Student: lex-001@academylexa.com / student123')
  console.log('   Student: lex-002@academylexa.com / student123')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })

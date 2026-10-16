import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

// Demo accounts used by the one-click login buttons on the frontend.
// Keep these in sync with unicore-client/src/lib/demo.ts (DEMO_ACCOUNTS)
export const DEMO_PASSWORD = 'demo123';
const DEMO = {
  admin: { firstName: 'Demo Admin', email: 'admin@unicore.demo' },
  teacher: { firstName: 'Demo Faculty', email: 'teacher@unicore.demo' },
  student: { firstName: 'Demo Student', email: 'student@unicore.demo' },
};

async function upsertUser(
  firstName: string,
  email: string,
  role: 'ADMIN' | 'TEACHER' | 'STUDENT',
  passwordHash: string,
) {
  return prisma.user.upsert({
    where: { email },
    update: { firstName, role, isActive: true, isEmailVerified: true },
    create: {
      firstName,
      email,
      password: passwordHash,
      role,
      isActive: true,
      isEmailVerified: true,
    },
  });
}

async function main() {
  const salt = Number(process.env.PASSWORD_SALT) || 10;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

  // ---- departments ----
  const cse = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: {
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Software, systems, AI and data science.',
    },
  });
  const eee = await prisma.department.upsert({
    where: { code: 'EEE' },
    update: {},
    create: {
      name: 'Electrical & Electronic Engineering',
      code: 'EEE',
      description: 'Power, electronics and communication.',
    },
  });
  await prisma.department.upsert({
    where: { code: 'BBA' },
    update: {},
    create: {
      name: 'Business Administration',
      code: 'BBA',
      description: 'Management, marketing and finance.',
    },
  });

  // ---- users ----
  const admin = await upsertUser(
    DEMO.admin.firstName,
    DEMO.admin.email,
    'ADMIN',
    passwordHash,
  );
  const teacherUser = await upsertUser(
    DEMO.teacher.firstName,
    DEMO.teacher.email,
    'TEACHER',
    passwordHash,
  );
  const studentUser = await upsertUser(
    DEMO.student.firstName,
    DEMO.student.email,
    'STUDENT',
    passwordHash,
  );

  // ---- profiles (already APPROVED so the demo accounts work immediately) ----
  const teacher = await prisma.teacherProfile.upsert({
    where: { userId: teacherUser.id },
    update: { status: 'APPROVED', isActive: true },
    create: {
      userId: teacherUser.id,
      departmentId: cse.id,
      employeeId: 'DEMO-T-001',
      designation: 'Assistant Professor',
      phone: '01700000001',
      qualification: 'MSc in Computer Science',
      specialization: 'Web Engineering',
      bio: 'Demo faculty account.',
      joiningDate: new Date('2024-01-15'),
      status: 'APPROVED',
    },
  });
  const student = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: { status: 'APPROVED', isActive: true },
    create: {
      userId: studentUser.id,
      departmentId: cse.id,
      studentId: 'DEMO-S-001',
      batch: 2024,
      semester: 3,
      phone: '01700000002',
      dateOfBirth: new Date('2003-05-10'),
      gender: 'male',
      address: 'Rajshahi, Bangladesh',
      status: 'APPROVED',
    },
  });

  // ---- courses ----
  const courseData = [
    { code: 'CSE101', title: 'Introduction to Programming', credit: 3, departmentId: cse.id },
    { code: 'CSE201', title: 'Data Structures', credit: 3, departmentId: cse.id },
    { code: 'CSE301', title: 'Database Systems', credit: 3, departmentId: cse.id },
    { code: 'EEE101', title: 'Basic Electrical Circuits', credit: 3, departmentId: eee.id },
  ];
  const courses = [];
  for (const c of courseData) {
    courses.push(
      await prisma.course.upsert({
        where: { code: c.code },
        update: {},
        create: { ...c, description: `${c.title} (demo course)` },
      }),
    );
  }

  // ---- semester ----
  let semester = await prisma.semester.findFirst({
    where: { name: 'Fall', year: 2026 },
  });
  if (!semester) {
    semester = await prisma.semester.create({
      data: {
        name: 'Fall',
        year: 2026,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-12-31'),
      },
    });
  }

  // ---- course offerings (demo teacher teaches the CSE ones) ----
  const offerings = [];
  for (const [i, course] of courses.entries()) {
    const isCse = course.departmentId === cse.id;
    offerings.push(
      await prisma.courseOffering.upsert({
        where: {
          courseId_semesterId_section: {
            courseId: course.id,
            semesterId: semester.id,
            section: 'A',
          },
        },
        update: { teacherId: isCse ? teacher.id : null },
        create: {
          courseId: course.id,
          semesterId: semester.id,
          section: 'A',
          capacity: 40,
          fee: 3000 + i * 500,
          teacherId: isCse ? teacher.id : null,
        },
      }),
    );
  }

  // ---- weekly routine for the CSE offerings ----
  const slots = [
    { day: 'SUNDAY', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
    { day: 'TUESDAY', startTime: '11:00', endTime: '12:30', room: 'Room 204' },
    { day: 'WEDNESDAY', startTime: '14:00', endTime: '15:30', room: 'Lab 2' },
  ] as const;
  for (const [i, offering] of offerings.slice(0, 3).entries()) {
    const slot = slots[i];
    const exists = await prisma.classRoutine.findFirst({
      where: { courseOfferingId: offering.id, day: slot.day },
    });
    if (!exists) {
      await prisma.classRoutine.create({
        data: { courseOfferingId: offering.id, ...slot },
      });
    }
  }

  // ---- demo student history ----
  // 1) CSE101: confirmed + paid + result published
  // 2) CSE201: pending enrollment (so the payment flow can be tried)
  const paidEnrollment = await prisma.enrollment.upsert({
    where: {
      studentId_courseOfferingId: {
        studentId: student.id,
        courseOfferingId: offerings[0].id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      courseOfferingId: offerings[0].id,
      status: 'CONFIRMED',
      enrolledAt: new Date('2026-09-05'),
    },
  });
  await prisma.payment.upsert({
    where: { enrollmentId: paidEnrollment.id },
    update: {},
    create: {
      enrollmentId: paidEnrollment.id,
      status: 'PAID',
      amount: 3000,
      payerReference: DEMO.student.email,
      merchantInvoiceNumber: 'DEMO-INV-0001',
      bkashTrxId: 'DEMO-TRX-0001',
      paidAt: new Date('2026-09-05'),
    },
  });
  await prisma.result.upsert({
    where: { enrollmentId: paidEnrollment.id },
    update: {},
    create: {
      enrollmentId: paidEnrollment.id,
      marks: 86,
      grade: 'A',
      gradePoint: 4.0,
    },
  });
  await prisma.enrollment.upsert({
    where: {
      studentId_courseOfferingId: {
        studentId: student.id,
        courseOfferingId: offerings[1].id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      courseOfferingId: offerings[1].id,
      status: 'PENDING',
    },
  });

  console.log('Seed complete.');
  console.log(`  admin   ${DEMO.admin.email} / ${DEMO_PASSWORD} (id ${admin.id})`);
  console.log(`  faculty ${DEMO.teacher.email} / ${DEMO_PASSWORD}`);
  console.log(`  student ${DEMO.student.email} / ${DEMO_PASSWORD}`);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

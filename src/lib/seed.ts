import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const DEMO_PASSWORD = 'demo123';

const departments = [
  { name: 'Computer Science & Engineering', code: 'CSE' },
  { name: 'Electrical & Electronic Engineering', code: 'EEE' },
  { name: 'Business Administration', code: 'BBA' },
  { name: 'Civil Engineering', code: 'CE' },
  { name: 'Mechanical Engineering', code: 'ME' },
  { name: 'English', code: 'ENG' },
  { name: 'Mathematics', code: 'MATH' },
  { name: 'Physics', code: 'PHY' },
  { name: 'Chemistry', code: 'CHEM' },
  { name: 'Economics', code: 'ECO' },
];

const courses = [
  {
    code: 'CSE101',
    title: 'Introduction to Programming',
    departmentCode: 'CSE',
  },
  { code: 'EEE101', title: 'Basic Electrical Circuits', departmentCode: 'EEE' },
  { code: 'BBA101', title: 'Principles of Management', departmentCode: 'BBA' },
  { code: 'CE101', title: 'Engineering Mechanics', departmentCode: 'CE' },
  { code: 'ME101', title: 'Thermodynamics', departmentCode: 'ME' },
  { code: 'ENG101', title: 'English Literature', departmentCode: 'ENG' },
  { code: 'MATH101', title: 'Calculus', departmentCode: 'MATH' },
  { code: 'PHY101', title: 'General Physics', departmentCode: 'PHY' },
  { code: 'CHEM101', title: 'General Chemistry', departmentCode: 'CHEM' },
  { code: 'ECO101', title: 'Microeconomics', departmentCode: 'ECO' },
];


const adminNames = [
  'Abdur Rahman',
  'Sabbir Hossain',
  'Mahmudul Hasan',
  'Tanvir Ahmed',
  'Rakibul Islam',
  'Nusrat Jahan',
  'Farhana Akter',
  'Sadia Islam',
  'Mehedi Hasan',
  'Imran Hossain',
];

const teacherNames = [
  'Dr. Arifur Rahman',
  'Dr. Kamal Hossain',
  'Dr. Farzana Akter',
  'Dr. Saiful Islam',
  'Dr. Nusrat Jahan',
  'Dr. Mahbub Alam',
  'Dr. Sharmin Sultana',
  'Dr. Rezaul Karim',
  'Dr. Tahmina Yasmin',
  'Dr. Ashraful Haque',
];


const studentNames = [
  'Rakib Hasan',
  'Sadia Rahman',
  'Naim Ahmed',
  'Mim Akter',
  'Fahim Hossain',
  'Nusrat Islam',
  'Sakib Al Hasan',
  'Sumaiya Akter',
  'Tamim Iqbal',
  'Jannatul Ferdous',
];

const main = async () => {
  console.log('Starting UniCore database seeding...');

  const salt = Number(process.env.PASSWORD_SALT) || 10;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

  // =====================================
  // 1. DEPARTMENTS
  // =====================================

  const departmentMap = new Map<string, string>();

  for (const department of departments) {
    const result = await prisma.department.upsert({
      where: { code: department.code },
      update: {},
      create: {
        ...department,
        description: `${department.name} academic department.`,
      },
    });

    departmentMap.set(department.code, result.id);
  }

  console.log('10 Departments completed.');

  // =====================================
  // 2. SEMESTER
  // =====================================

  const semester = await prisma.semester.upsert({
    where: {
      name_year: {
        name: 'Fall',
        year: 2026,
      },
    },
    update: {},
    create: {
      name: 'Fall',
      year: 2026,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-12-31'),
    },
  });

  // =====================================
  // 3. USERS + ADMIN
  // =====================================

  for (let i = 1; i < adminNames.length; i++) {
    const firstName = adminNames[i];
    await prisma.user.upsert({
      where: {
        email: `admin${i}@unicore.demo`,
      },
      update: {
        firstName,
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
      },
      create: {
        firstName,
        email: `admin${i}@unicore.demo`,
        password: passwordHash,
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
      },
    });
  }

  console.log('10 Admin accounts completed.');

  // =====================================
  // 4. TEACHERS + TEACHER PROFILES
  // =====================================

  const teacherMap = new Map<string, string>();

  for (let i = 1; i < teacherNames.length; i++) {
    const department = departments[i - 1];
    const departmentId = departmentMap.get(department.code)!;
    const firstName = teacherNames[i]
    const user = await prisma.user.upsert({
      where: {
        email: `teacher${i}@unicore.demo`,
      },
      update: {
        firstName,
        role: 'TEACHER',
        isActive: true,
        isEmailVerified: true,
      },
      create: {
        firstName,
        email: `teacher${i}@unicore.demo`,
        password: passwordHash,
        role: 'TEACHER',
        isActive: true,
        isEmailVerified: true,
      },
    });

    const teacher = await prisma.teacherProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        departmentId,
        status: 'APPROVED',
        isActive: true,
      },
      create: {
        userId: user.id,
        departmentId,
        employeeId: `DEMO-T-${String(i).padStart(3, '0')}`,
        designation: 'Assistant Professor',
        phone: `01700000${String(i).padStart(3, '0')}`,
        qualification: 'MSc',
        specialization: department.name,
        bio: `Demo teacher ${i}`,
        joiningDate: new Date('2024-01-15'),
        status: 'APPROVED',
      },
    });

    teacherMap.set(department.code, teacher.id);
  }

  console.log('10 Teachers and profiles completed.');

  // =====================================
  // 5. STUDENTS + STUDENT PROFILES
  // =====================================

  const studentMap = new Map<string, string>();

  for (let i = 1; i < studentNames.length; i++) {
    const department = departments[i - 1];
    const departmentId = departmentMap.get(department.code)!;
    const firstName = studentNames[i]

    const user = await prisma.user.upsert({
      where: {
        email: `student${i}@unicore.demo`,
      },
      update: {
        firstName,
        role: 'STUDENT',
        isActive: true,
        isEmailVerified: true,
      },
      create: {
        firstName,
        email: `student${i}@unicore.demo`,
        password: passwordHash,
        role: 'STUDENT',
        isActive: true,
        isEmailVerified: true,
      },
    });

    const student = await prisma.studentProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        departmentId,
        status: 'APPROVED',
        isActive: true,
      },
      create: {
        userId: user.id,
        departmentId,
        studentId: `DEMO-S-${String(i).padStart(3, '0')}`,
        batch: 2024,
        semester: 3,
        phone: `01800000${String(i).padStart(3, '0')}`,
        dateOfBirth: new Date('2003-05-10'),
        gender: 'male',
        address: 'Rajshahi, Bangladesh',
        status: 'APPROVED',
      },
    });

    studentMap.set(department.code, student.id);
  }

  console.log('10 Students and profiles completed.');

  // =====================================
  // 6. COURSES
  // =====================================

  const courseMap = new Map<string, string>();

  for (const course of courses) {
    const departmentId = departmentMap.get(course.departmentCode)!;

    const result = await prisma.course.upsert({
      where: {
        code: course.code,
      },
      update: {},
      create: {
        code: course.code,
        title: course.title,
        credit: 3,
        departmentId,
        description: `${course.title} - Demo course.`,
      },
    });

    courseMap.set(course.code, result.id);
  }

  console.log('10 Courses completed.');

  // =====================================
  // 7. COURSE OFFERINGS
  // =====================================

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    const courseId = courseMap.get(course.code)!;
    const teacherId = teacherMap.get(course.departmentCode)!;

    await prisma.courseOffering.upsert({
      where: {
        courseId_semesterId_section: {
          courseId,
          semesterId: semester.id,
          section: 'A',
        },
      },
      update: {
        teacherId,
      },
      create: {
        courseId,
        semesterId: semester.id,
        teacherId,
        section: 'A',
        capacity: 40,
        fee: 3000 + i * 500,
      },
    });
  }

  console.log('10 Course Offerings completed.');

  console.log('\n=================================');
  console.log('UniCore Database Seeding Complete');
  console.log('=================================');
  console.log('Total Users: 30');
  console.log('Admins: 10');
  console.log('Teachers: 10');
  console.log('Students: 10');
  console.log('Departments: 10');
  console.log('Courses: 10');
  console.log('Course Offerings: 10');
  console.log(`Password: ${DEMO_PASSWORD}`);
};

export const seedDatabase = async () => {
  try {
    await main();
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};

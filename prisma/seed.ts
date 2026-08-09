import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultAdminEmail = 'admin@physics.cusat.ac.in';
  const defaultAdminPassword = 'adminpassword123';

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: defaultAdminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
    await prisma.admin.create({
      data: {
        email: defaultAdminEmail,
        password: hashedPassword,
        name: 'Head Admin',
      },
    });
    console.log(`[SEED] Created default admin user: ${defaultAdminEmail}`);
  } else {
    console.log('[SEED] Admin user already exists.');
  }

  // Seed sample initial notifications if table is empty
  const count = await prisma.notification.count();
  if (count === 0) {
    await prisma.notification.createMany({
      data: [
        {
          title: 'MSc Physics Semester 2 Exam Schedule Released (June 2026)',
          category: 'Notice',
          link: '/courses',
          isActive: true,
        },
        {
          title: 'International Conference on Advanced Photonics & Quantum Materials',
          category: 'Event',
          link: '/facilities',
          isActive: true,
        },
        {
          title: 'Ph.D. Admission Open 2026 — Department of Physics, CUSAT',
          category: 'Admissions',
          link: '/about',
          isActive: true,
        },
      ],
    });
    console.log('[SEED] Created initial sample notifications.');
  }

  // Seed sample faculty member
  const sampleFacultyEmail = 'faculty@physics.cusat.ac.in';
  const sampleFacultyPassword = 'facultypassword123';
  const existingFaculty = await prisma.faculty.findUnique({
    where: { email: sampleFacultyEmail },
  });

  if (!existingFaculty) {
    const hashedFacultyPassword = await bcrypt.hash(sampleFacultyPassword, 10);
    await prisma.faculty.create({
      data: {
        name: 'Dr. Ramesh Kumar',
        email: sampleFacultyEmail,
        password: hashedFacultyPassword,
        designation: 'Professor & Head',
        department: 'Department of Physics',
        mustChangePassword: true,
      },
    });
    console.log(`[SEED] Created default sample faculty user: ${sampleFacultyEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

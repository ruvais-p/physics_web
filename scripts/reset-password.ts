import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.env.RESET_FACULTY_EMAIL?.trim().toLowerCase();
  const newPassword = process.env.RESET_FACULTY_PASSWORD;

  if (!email || !newPassword || newPassword.length < 12 || newPassword.length > 128) {
    throw new Error(
      'Set RESET_FACULTY_EMAIL and RESET_FACULTY_PASSWORD (12-128 characters) before running this script.',
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const existingFaculty = await prisma.faculty.findUnique({
    where: { email },
  });

  if (existingFaculty) {
    await prisma.faculty.update({
      where: { email },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
        isActive: true,
      },
    });
    console.log(`Successfully reset the password for ${email}.`);
  } else {
    await prisma.faculty.create({
      data: {
        name: 'Dr. Ramesh Kumar',
        email: email,
        password: hashedPassword,
        designation: 'Professor & Head',
        department: 'Department of Physics',
        mustChangePassword: true,
        isActive: true,
      },
    });
    console.log(`Created faculty user ${email}; a password change is required at first login.`);
  }
}

resetPassword()
  .catch((e) => {
    console.error('Error resetting password:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

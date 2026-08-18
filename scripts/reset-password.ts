import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'faculty@physics.cusat.ac.in';
  const newPassword = 'facultypassword123';

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const existingFaculty = await prisma.faculty.findUnique({
    where: { email },
  });

  if (existingFaculty) {
    await prisma.faculty.update({
      where: { email },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
        isActive: true,
      },
    });
    console.log(`Successfully reset password for ${email} to '${newPassword}'`);
  } else {
    await prisma.faculty.create({
      data: {
        name: 'Dr. Ramesh Kumar',
        email: email,
        password: hashedPassword,
        designation: 'Professor & Head',
        department: 'Department of Physics',
        mustChangePassword: false,
        isActive: true,
      },
    });
    console.log(`Created user ${email} with password '${newPassword}'`);
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

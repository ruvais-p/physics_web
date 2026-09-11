import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      title: 'International Symposium on Quantum Materials & Nanostructures (ISQMN-2026)',
      description: 'A three-day international symposium bringing together leading theoretical and experimental physicists to discuss emerging topological quantum states, 2D heterostructures, and room-temperature spintronic devices.',
      image: '/eventssss.jpg',
      startDate: new Date('2026-09-18T10:00:00.000Z'),
      venue: 'Department Auditorium (Main Block), CUSAT',
      apply_link: 'https://cusat.ac.in',
    },
    {
      title: 'National Hands-On Workshop on Confocal Raman & FE-SEM Characterization',
      description: 'An intensive hands-on workshop on field emission scanning electron microscopy (FE-SEM), confocal micro-Raman spectroscopy, and thin film sample preparation protocols for research scholars.',
      image: '/innovation-microscope.png',
      startDate: new Date('2026-09-25T09:30:00.000Z'),
      venue: 'Central Instrumentation Facility (CIF), CUSAT',
      apply_link: 'https://cusat.ac.in',
    },
  ];

  for (const ev of events) {
    const created = await prisma.event.create({
      data: ev,
    });
    console.log('Created event:', created.id, created.title);
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

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial alumni data...');

  // 1. Executives (no affiliation as requested)
  const executives = [
    {
      name: 'Prof. (Dr.) M. R. Anantharaman',
      role: 'Patron & Chief Advisor',
      batch: 'Distinguished Faculty & Former HoD',
      image: '/alumni/anantharaman.jpg',
      sortOrder: 1,
      isActive: true,
    },
    {
      name: 'Dr. S. Prasanth',
      role: 'President',
      batch: 'Class of 1998 · M.Sc. & Ph.D.',
      image: '/alumni/prasanth.jpg',
      sortOrder: 2,
      isActive: true,
    },
    {
      name: 'Dr. Lakshmi K. Menon',
      role: 'Vice President',
      batch: 'Class of 2004 · M.Sc. Physics',
      image: '/alumni/lakshmi.jpg',
      sortOrder: 3,
      isActive: true,
    },
    {
      name: 'Dr. Anandhu R. Nair',
      role: 'General Secretary',
      batch: 'Class of 2018 · Ph.D.',
      image: '/alumni/anandhu.jpg',
      sortOrder: 4,
      isActive: true,
    },
    {
      name: 'Dr. Priya S. Warrier',
      role: 'Joint Secretary',
      batch: 'Class of 2015 · M.Sc. Physics',
      image: '/alumni/priya.jpg',
      sortOrder: 5,
      isActive: true,
    },
    {
      name: 'Prof. Rajesh K. Menon',
      role: 'Treasurer',
      batch: 'Class of 2012 · Ph.D.',
      image: '/alumni/rajesh.jpg',
      sortOrder: 6,
      isActive: true,
    },
  ];

  for (const exec of executives) {
    const existing = await prisma.alumniExecutive.findFirst({
      where: { name: exec.name, role: exec.role },
    });
    if (!existing) {
      await prisma.alumniExecutive.create({ data: exec });
    }
  }

  // 2. Achievements (no category as requested)
  const achievements = [
    {
      awardName: 'Shanti Swarup Bhatnagar Prize in Physical Sciences',
      recipient: 'Dr. S. Prasanth',
      batch: 'Class of 1998 · M.Sc. & Ph.D.',
      date: '26 September 2025',
      photo: '/alumni/award_bhatnagar.jpg',
      desc: 'Conferred India’s highest scientific distinction in recognition of breakthrough discoveries in magnetic nanocomposites, high-entropy alloys, and phase transitions in quantum materials.',
      sortOrder: 1,
    },
    {
      awardName: 'ISRO Outstanding Space Scientist Achievement Award',
      recipient: 'Dr. Priya S. Warrier',
      batch: 'Class of 2015 · M.Sc. Physics',
      date: '14 January 2025',
      photo: '/alumni/award_isro.jpg',
      desc: 'Honored for outstanding technical leadership in engineering multi-spectral optical thin-film sensors and spectrometers successfully deployed on India’s deep-space planetary payloads.',
      sortOrder: 2,
    },
    {
      awardName: 'Alexander von Humboldt International Research Fellowship',
      recipient: 'Dr. Anandhu R. Nair',
      batch: 'Class of 2018 · Ph.D.',
      date: '18 May 2024',
      photo: '/alumni/award_humboldt.jpg',
      desc: 'Awarded the renowned German postdoctoral research fellowship for pioneering experimental investigations into ultrafast femtosecond laser dynamics and quantum light-matter entanglement.',
      sortOrder: 3,
    },
    {
      awardName: 'INSA Medal for Young Scientists in Physics',
      recipient: 'Prof. Rajesh K. Menon',
      batch: 'Class of 2012 · Ph.D.',
      date: '22 November 2023',
      photo: '/alumni/rajesh.jpg',
      desc: 'Recognized by the Indian National Science Academy (INSA) for foundational contributions to spintronic transport mechanisms and low-temperature magnetic heterostructures.',
      sortOrder: 4,
    },
  ];

  for (const ach of achievements) {
    const existing = await prisma.alumniAchievement.findFirst({
      where: { awardName: ach.awardName, recipient: ach.recipient },
    });
    if (!existing) {
      await prisma.alumniAchievement.create({ data: ach });
    }
  }

  // 3. Sponsored Programs (with isRecurring and proofUrl)
  const programs = [
    {
      programName: 'Prof. M. Sabir Memorial Student Excellence Endowment',
      nature: 'Award',
      date: 'Instituted 2024 · Annual',
      photo: '/alumni/program_endowment.jpg',
      sponsor: 'Instituted by Physics Alumni Batch of 1985–1995',
      desc: 'An annual student merit endowment featuring a gold medal and cash fellowship awarded to the postgraduate scholar achieving the highest distinction in Mathematical Physics and Quantum Mechanics coursework.',
      isRecurring: true,
      proofUrl: null,
      sortOrder: 1,
    },
    {
      programName: 'PhyCA Advanced Optics & Laser Instrumentation Facility',
      nature: 'Donation',
      date: 'August 2025',
      photo: '/alumni/program_laser_lab.jpg',
      sponsor: 'Donated by Global Physics Alumni Association (PhyCA)',
      desc: 'A flagship infrastructural donation contributing state-of-the-art optical vibration isolation breadboards, multi-wavelength diode lasers, and precision spectroscopic detectors for departmental M.Sc. and doctoral research laboratories.',
      isRecurring: false,
      proofUrl: null,
      sortOrder: 2,
    },
    {
      programName: 'Dr. Ramesh Babu Theoretical Physics Research Fellowship',
      nature: 'Award',
      date: 'Instituted 2023 · Annual',
      photo: '/alumni/anantharaman.jpg',
      sponsor: 'Alumni Doctoral Research Foundation',
      desc: 'A competitive annual research stipend supporting promising Ph.D. scholars conducting high-impact theoretical investigations in Classical Electrodynamics, Gravitation, and Statistical Mechanics.',
      isRecurring: true,
      proofUrl: null,
      sortOrder: 3,
    },
    {
      programName: 'High-Performance Computing (HPC) Quantum Simulation Cluster',
      nature: 'Donation',
      date: 'February 2025',
      photo: '/alumni/program_hpc.jpg',
      sponsor: 'Sponsored by International Alumni Fraternity (US & Europe)',
      desc: 'Comprehensive computational hardware and server rack donation providing a dedicated 64-core multi-GPU computing node configured specifically for quantum Monte Carlo simulations and theoretical condensed matter calculations.',
      isRecurring: false,
      proofUrl: null,
      sortOrder: 4,
    },
  ];

  for (const prog of programs) {
    const existing = await prisma.alumniSponsoredProgram.findFirst({
      where: { programName: prog.programName },
    });
    if (!existing) {
      await prisma.alumniSponsoredProgram.create({ data: prog });
    }
  }

  console.log('Alumni database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

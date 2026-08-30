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

  // Seed default courses and schemes
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    console.log('[SEED] Seeding initial courses and curriculum schemes...');
    
    await prisma.course.create({
      data: {
        id: 'c1',
        code: 'PHY-MSC-101',
        title: 'Master of Science (M.Sc.) in Physics',
        level: 'MSc',
        duration: '2 Years (4 Semesters)',
        intake: 35,
        fees: '₹12,450 per semester (Gen/OBC) | SC/ST exempted as per Govt. rules',
        eligibility: 'B.Sc. Degree in Physics with Mathematics as subsidiary subject securing minimum 55% marks or CGPA 6.0.',
        description: 'A rigorous postgraduate program providing deep theoretical knowledge and experimental expertise across Classical Mechanics, Quantum Physics, Electrodynamics, Statistical Physics, Condensed Matter, and Photonics.',
        highlights: [
          'Choice-Based Credit System (CBCS) with advanced electives',
          'Mandatory 4th semester master research dissertation project',
          'Hands-on training in computational physics, Python, and Matlab',
          'Direct access to advanced research instrumentation laboratories',
        ],
        schemes: {
          create: [
            { year: 'First Year (Semesters 1 & 2)', scheme: '2024 CBCS Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 1 },
            { year: 'Second Year (Semesters 3 & 4)', scheme: '2024 CBCS Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 2 },
          ],
        },
      },
    });

    await prisma.course.create({
      data: {
        id: 'c2',
        code: 'PHY-PHD-900',
        title: 'Doctor of Philosophy (Ph.D.) in Physics',
        level: 'PhD',
        duration: '3 to 5 Years',
        intake: 20,
        fees: '₹8,200 per semester + Laboratory Bench Fees',
        eligibility: 'M.Sc. in Physics or related discipline with minimum 55% marks AND valid GATE / CSIR-UGC NET JRF / DAT score.',
        description: 'Full-time research degree aimed at creating world-class independent researchers. Scholars work closely with faculty mentors in state-of-the-art research labs across experimental and theoretical physics.',
        highlights: [
          'Comprehensive coursework module',
          'Quarterly progress seminars before Departmental Research Committee (DRC)',
          'Generous institutional & national fellowships (CSIR, UGC, INSPIRE, PMRF, KSCSTE)',
          'Funding support for presenting papers at international conferences abroad',
        ],
        schemes: {
          create: [
            { year: 'Year 1 (Coursework)', scheme: '2024 PhD Regulations', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 1 },
            { year: 'Years 2 - 5 (Research)', scheme: '2024 PhD Regulations', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 2 },
          ],
        },
      },
    });

    await prisma.course.create({
      data: {
        id: 'c3',
        code: 'PHY-INT-501',
        title: 'Integrated M.Sc. in Physics',
        level: 'Integrated MSc',
        duration: '5 Years (10 Semesters)',
        intake: 20,
        fees: '₹15,000 per semester',
        eligibility: 'Passed 10+2 / Higher Secondary Examination with Physics, Chemistry, and Mathematics securing minimum 60% aggregate.',
        description: 'Direct entry 5-year flagship program designed for bright young students after 12th standard. Integrates foundational science with advanced quantum, statistical, and materials research.',
        highlights: [
          'Exit option after 3 years with B.Sc. (Honours) in Physics degree',
          'Early exposure to research laboratories from 3rd year onwards',
          'Interdisciplinary electives in Computer Science, Applied Chemistry & Mathematics',
          'Summer internships at premier institutes (TIFR, IISc, BARC, ISRO)',
        ],
        schemes: {
          create: [
            { year: 'Years 1 & 2 (Foundational)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 1 },
            { year: 'Year 3 (B.Sc. Honours Exit Option)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 2 },
            { year: 'Years 4 & 5 (M.Sc. Advanced)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 3 },
          ],
        },
      },
    });

    console.log('[SEED] Default courses and schemes seeded successfully.');
  }

  // Seed default research laboratories
  const labCount = await prisma.researchLab.count();
  if (labCount === 0) {
    console.log('[SEED] Seeding initial research laboratories...');
    const faculty = await prisma.faculty.findFirst();

    const labsData = [
      {
        id: 'l1',
        name: 'Magnetics & Advanced Materials Laboratory',
        category: 'Materials Science',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
        description: `# Magnetics & Advanced Materials Laboratory

The **Magnetics & Advanced Materials Laboratory** specializes in the synthesis, characterization, and application of nanostructured magnetic materials, multiferroics, and 2D materials for next-generation spintronics and sensor applications.

## Key Research Focus Areas
- **Spintronics & Magnetic Thin Films**: Exchange bias phenomena, spin-orbit torques, and magnetic anisotropy in metallic multilayers.
- **Multiferroic Heterostructures**: Magnetoelectric coupling in nanocomposites for ultra-low power memory devices.
- **2D Topological Insulators**: Synthesis and characterization of transition metal dichalcogenides (TMDs) and MXenes.
- **Energy Storage Materials**: Functional oxide nanoparticles for supercapacitors and lithium-ion batteries.

## Experimental Capabilities & Instrumentation
- Vibrating Sample Magnetometer (VSM) with cryo-temperature attachment (4.2 K to 400 K)
- Sol-gel, hydrothermal, and chemical co-precipitation synthesis setups
- High-temperature tubular furnace (1700°C) with inert gas purge controls
- Keithley 2450 SourceMeter & impedance spectroscopy setup (20 Hz to 50 MHz)

> *Our laboratory collaborates actively with international research facilities such as DAE-CSR, BARC, and DESY Germany for synchrotron radiation characterization.*
`,
      },
      {
        id: 'l2',
        name: 'Quantum Optics & Applied Photonics Lab',
        category: 'Photonics',
        image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80',
        description: `# Quantum Optics & Applied Photonics Lab

The **Quantum Optics & Applied Photonics Lab** conducts theoretical and experimental investigations into non-classical light-matter interactions, nonlinear optics, ultrafast laser spectroscopy, and integrated optical sensors.

## Research Themes
1. **Quantum Information Processing**: Single-photon sources, entangled photon-pair generation via spontaneous parametric down-conversion (SPDC).
2. **Nonlinear Optical Spectroscopy**: Z-scan measurements, optical limiting in organic dyes and semiconductor quantum dots.
3. **Fiber Optic & Photonic Crystal Sensors**: Surface Plasmon Resonance (SPR) sensors for biomedical diagnostic applications.
4. **Ultrafast Dynamics**: Femtosecond laser ablation and transient absorption spectroscopy of nanostructures.

> *"Pioneering quantum photonics solutions for secure optical communications and high-precision sensing."*
`,
      },
      {
        id: 'l3',
        name: 'Theoretical & Computational Physics Group',
        category: 'Theoretical Physics',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80',
        description: `# Theoretical & Computational Physics Group

The **Theoretical & Computational Physics Group** employs first-principles density functional theory (DFT), Monte Carlo simulations, and relativistic quantum mechanics to model novel physical phenomena across condensed matter, cosmology, and nuclear physics.

## Core Specializations
* **Density Functional Theory (DFT)**: Band structure engineering, electron-phonon coupling, and thermoelectric property predictions using VASP, Quantum ESPRESSO, and WIEN2k.
* **Nuclear Structure & Superheavy Elements**: Alpha decay kinetics, cluster decay half-lives, and fission barrier modeling in Z=114-126 nuclei.
* **Gravitation & High Energy Cosmology**: Dark energy models, black hole thermodynamics, and modified gravity theories.
* **Machine Learning in Materials Science**: Physics-informed neural networks (PINNs) for accelerated crystal structure discovery.

## High-Performance Computing (HPC) Facilities
The group maintains a **128-core HPC cluster** (Dual AMD EPYC 7742) with 512 GB RAM and NVIDIA A100 Tensor Core GPUs for accelerated quantum mechanical calculations.
`,
      },
    ];

    for (const lab of labsData) {
      await prisma.researchLab.create({
        data: {
          ...lab,
          faculties: faculty ? { connect: [{ id: faculty.id }] } : undefined,
        },
      });
    }

    console.log('[SEED] Research laboratories seeded successfully.');
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

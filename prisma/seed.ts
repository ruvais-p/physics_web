import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail || adminPassword) {
    if (!adminEmail || !adminPassword || adminPassword.length < 12 || adminPassword.length > 128) {
      throw new Error('ADMIN_EMAIL and an ADMIN_PASSWORD of 12-128 characters are both required.');
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.admin.create({
        data: { email: adminEmail, password: hashedPassword, name: 'Head Admin' },
      });
      console.log(`[SEED] Created configured admin user: ${adminEmail}`);
    } else {
      console.log('[SEED] Configured admin user already exists.');
    }
  } else {
    console.log('[SEED] ADMIN_EMAIL/ADMIN_PASSWORD not set; skipped admin account creation.');
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
  if (process.env.SEED_SAMPLE_FACULTY === 'true') {
    const sampleFacultyEmail = process.env.SAMPLE_FACULTY_EMAIL?.trim().toLowerCase();
    const sampleFacultyPassword = process.env.SAMPLE_FACULTY_PASSWORD;
    if (!sampleFacultyEmail || !sampleFacultyPassword || sampleFacultyPassword.length < 12 || sampleFacultyPassword.length > 128) {
      throw new Error('SAMPLE_FACULTY_EMAIL and a SAMPLE_FACULTY_PASSWORD of 12-128 characters are required.');
    }

    const existingFaculty = await prisma.faculty.findUnique({ where: { email: sampleFacultyEmail } });
    if (!existingFaculty) {
      const hashedFacultyPassword = await bcrypt.hash(sampleFacultyPassword, 12);
      await prisma.faculty.create({
        data: {
          name: 'Sample Faculty',
          email: sampleFacultyEmail,
          password: hashedFacultyPassword,
          designation: 'Faculty Member',
          department: 'Department of Physics',
          qualification: 'Ph.D. in Physics',
          room: 'Department Building',
          mustChangePassword: true,
        },
      });
      console.log(`[SEED] Created configured sample faculty user: ${sampleFacultyEmail}`);
    }
  }

  // Seed default courses and schemes
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    console.log('[SEED] Seeding initial courses and curriculum schemes...');
    
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
            { year: 'Years 1 & 2 (Foundational)', scheme: '2024 Integrated Scheme', pdfUrl: '/placeholder.pdf', sortOrder: 1 },
            { year: 'Year 3 (B.Sc. Honours Exit Option)', scheme: '2024 Integrated Scheme', pdfUrl: '/placeholder.pdf', sortOrder: 2 },
            { year: 'Years 4 & 5 (M.Sc. Advanced)', scheme: '2024 Integrated Scheme', pdfUrl: '/placeholder.pdf', sortOrder: 3 },
          ],
        },
      },
    });

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
            { year: 'First Year (Semesters 1 & 2)', scheme: '2024 CBCS Scheme', pdfUrl: '/placeholder.pdf', sortOrder: 1 },
            { year: 'Second Year (Semesters 3 & 4)', scheme: '2024 CBCS Scheme', pdfUrl: '/placeholder.pdf', sortOrder: 2 },
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
            { year: 'Year 1 (Coursework)', scheme: '2024 PhD Regulations', pdfUrl: '/placeholder.pdf', sortOrder: 1 },
            { year: 'Years 2 - 5 (Research)', scheme: '2024 PhD Regulations', pdfUrl: '/placeholder.pdf', sortOrder: 2 },
          ],
        },
      },
    });

    await prisma.course.create({
      data: {
        id: 'c4',
        code: 'PHY-MTECH-201',
        title: 'M.Tech. in Advanced Materials & Nanotechnology',
        level: 'MTech',
        duration: '2 Years (4 Semesters)',
        intake: 18,
        fees: '₹25,000 per semester',
        eligibility: 'B.Tech. in Nanotechnology/Material Science or M.Sc. in Physics/Applied Physics with minimum 60% marks and valid GATE score.',
        description: 'An interdisciplinary technological postgraduate programme designed to bridge fundamental condensed matter physics with modern semiconductor fabrication, 2D quantum materials, and industrial nanodevices.',
        highlights: [
          'Hands-on cleanroom semiconductor fabrication experience',
          'Industry internships at leading semiconductor and nano-foundries',
          'Advanced training in electron microscopy and thin-film spectroscopy',
          'Choice of specialized electives in quantum computing hardware & photovoltaics',
        ],
        sortOrder: 4,
        schemes: {
          create: [
            { year: 'First Year (Semesters 1 & 2)', scheme: '2024 AICTE Model Curriculum', pdfUrl: '/placeholder.pdf', sortOrder: 1 },
            { year: 'Second Year (Industrial Project & Thesis)', scheme: '2024 M.Tech Regulations', pdfUrl: '/placeholder.pdf', sortOrder: 2 },
          ],
        },
      },
    });

    await prisma.course.create({
      data: {
        id: 'c5',
        code: 'PHY-PGD-301',
        title: 'PG Diploma in Scientific Instrumentation & Computational Modeling',
        level: 'Diploma',
        duration: '1 Year (2 Semesters)',
        intake: 15,
        fees: '₹15,000 total',
        eligibility: 'Graduate degree in Science or Engineering with Physics / Electronics / Mathematics as core subject with minimum 50% marks.',
        description: 'A career-focused professional programme providing rigorous practical training in high-end analytical equipment operation (XRD, AFM, SEM), lab automation, Python data science, and computational physics simulations.',
        highlights: [
          'Intensive laboratory hands-on training with departmental research facilities',
          'Automation using LabVIEW, Python, and microcontroller interfaces',
          'Certification for laboratory scientific officer and technical manager roles',
          'Collaborative capstone industry project',
        ],
        sortOrder: 5,
        schemes: {
          create: [
            { year: 'Full Academic Year (Modules 1 - 4)', scheme: '2024 Industry-Aligned Diploma Scheme', pdfUrl: '/placeholder.pdf', sortOrder: 1 },
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

  // Seed default facilities
  const facilityCount = await prisma.facility.count();
  if (facilityCount === 0) {
    console.log('[SEED] Seeding initial research/department facilities...');
    const faculty = await prisma.faculty.findFirst();

    const facilitiesData = [
      {
        id: 'fac1',
        name: 'X-Ray Powder Diffractometer (XRD)',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
        description: `# X-Ray Powder Diffractometer (XRD)

**Model**: D8 Advance Bruker | **Manufacturer**: Bruker AXS, Germany

High-resolution powder X-ray diffractometer equipped with Cu-Kα radiation source, LynxEye ultra-fast detector, and temperature-controlled sample stage (-180°C to 1200°C).

## Key Specifications & Attachments
- **Angular Range (2θ)**: 0.5° to 140°
- **Detector**: LynxEye 1D silicon strip detector
- **Temperature Range**: Low & High Temperature Attachments (Anton Paar)
- **Analytical Capabilities**: Phase identification, Rietveld refinement, crystallite size calculation & lattice strain analysis.

## Requisition & Guidelines
Users must submit finely powdered, homogeneous samples (< 50 microns). Submission forms available online or at the central instrumentation lab.
`,
      },
      {
        id: 'fac2',
        name: 'Field Emission Scanning Electron Microscope (FE-SEM)',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80',
        description: `# Field Emission Scanning Electron Microscope (FE-SEM)

**Model**: Sigma 300 VP | **Manufacturer**: Carl Zeiss, Germany

Ultra-high resolution Schottky field emission SEM fitted with Oxford EDS (Energy Dispersive X-ray Spectroscopy) for micro-area elemental mapping and morphological analysis of nanostructures.

## Key Technical Features
- **Spatial Resolution**: 1.0 nm @ 15 kV | 1.6 nm @ 1 kV
- **Magnification Range**: 10x to 1,000,000x
- **EDS Microanalysis**: Oxford Ultim Max 65 mm² detector for quantitative element identification.
- **Sputter Coater**: Gold & Carbon dual sputter coater for non-conducting specimens.

> *Operating hours: Monday to Friday (9:30 AM – 4:30 PM)*
`,
      },
      {
        id: 'fac3',
        name: 'Confocal Micro-Raman Spectrometer',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
        description: `# Confocal Micro-Raman Spectrometer

**Model**: LabRAM HR Evolution | **Manufacturer**: Horiba Jobin Yvon, France

High-resolution micro-Raman spectroscopy system with multi-laser excitation sources (532 nm, 633 nm, 785 nm) and automated XYZ spatial mapping stage.

## Technical Specifications
- **Spectral Resolution**: < 0.5 cm⁻¹
- **Excitation Lasers**: 532 nm diode-pumped solid state, 633 nm He-Ne, 785 nm diode
- **Spatial Resolution**: Sub-micron (< 0.5 µm)
- **Photoluminescence (PL)**: Integrated PL spectral mapping capability
`,
      },
      {
        id: 'fac4',
        name: 'Vibrating Sample Magnetometer (VSM)',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
        description: `# Vibrating Sample Magnetometer (VSM)

**Model**: VSM 7404 | **Manufacturer**: Lake Shore Cryotronics, USA

Characterizes magnetic properties of solids, powders, thin films, and liquid ferrofluids as a function of magnetic field (up to 2.1 Tesla) and temperature (77 K to 1000 K).

## Features
- **Dynamic Magnetic Moment Range**: 1 x 10⁻⁶ emu to 10³ emu
- **Maximum Field**: 2.15 Tesla (21.5 kG)
- **Cryostat / Oven Attachments**: Liquid Nitrogen (77 K to 450 K) & High Temp Oven (300 K to 1000 K)
- **Applications**: Hysteresis loop (M-H), FC/ZFC magnetization curves, and Curie point determinations.
`,
      },
    ];

    for (const fac of facilitiesData) {
      await prisma.facility.create({
        data: {
          ...fac,
          faculties: faculty ? { connect: [{ id: faculty.id }] } : undefined,
        },
      });
    }

    console.log('[SEED] Facilities seeded successfully.');
  }

  // Seed default department events
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    console.log('[SEED] Seeding initial department events...');
    const eventsData = [
      {
        title: '15th Department Endowment & Memorial Oration Lecture',
        description: 'Distinguished national physicists will speak on breakthroughs in low-temperature magnetics and topological insulators, followed by an interactive research panel. This prestigious annual memorial lecture brings together leading experimentalists and theorists in solid-state physics.',
        image: '/eventssss.jpg',
        startDate: new Date('2026-07-19T10:00:00.000Z'),
        venue: 'Department Auditorium (Main Block)',
        broadcastToTv: true,
      },
      {
        title: 'Hands-On Workshop on FE-SEM & micro-Raman Spectroscopy',
        description: 'A focused session on equipment slot bookings and instrumentation data analysis for regional researchers. Participants will receive hands-on training on sample preparation.',
        image: '/innovation-microscope.png',
        startDate: new Date('2026-07-06T09:30:00.000Z'),
        venue: 'Central Instrumentation Facility (CIF), CUSAT',
        broadcastToTv: true,
      },
      {
        title: 'National Seminar on Cosmology & Quantum Gravity (CQG-2026)',
        description: 'Presenting recent simulations and mathematical formulations on gravitational waves and cosmic expansions. Guest lectures will be delivered by eminent scientists.',
        image: '/campus.jpg',
        startDate: new Date('2026-06-30T09:00:00.000Z'),
        venue: 'Seminar Hall, Department of Physics',
        broadcastToTv: true,
      },
      {
        title: 'Integrated M.Sc. Orientation & Interactive Session',
        description: 'An orientation ceremony welcoming the newly admitted students to the Integrated M.Sc. Physics program, including a campus tour and interaction with research scholars.',
        image: '/cusat-building.png',
        startDate: new Date('2026-07-12T10:00:00.000Z'),
        venue: 'Foyer, Department Entrance',
        broadcastToTv: true,
      },
      {
        title: 'Alumni Meet 2025: Physics Department Silver Jubilee',
        description: 'A grand alumni reunion celebrating the silver jubilee of the department. Alumni working in prestigious global institutions shared their journeys.',
        image: '/phy_dept.png',
        startDate: new Date('2025-08-05T11:00:00.000Z'),
        venue: 'Department Foyer & Seminar Hall',
      },
      {
        title: 'International Web-Symposium on Ultrafast Photonics',
        description: 'An international virtual conference focusing on femtosecond laser pulses, non-linear optical materials, and silicon photonics integration.',
        image: '/innovation-microscope.png',
        startDate: new Date('2026-03-15T14:00:00.000Z'),
        venue: 'Virtual Auditorium (Zoom Webinar)',
      },
      {
        title: 'National Workshop on Advanced Thin Film Fabrication',
        description: 'Hands-on training session covering RF Magnetron Sputtering, Sol-Gel spin coating, and X-ray diffraction analysis for thin film solar cells.',
        image: '/innovation-pipette.png',
        startDate: new Date('2026-01-10T09:00:00.000Z'),
        venue: 'Thin Film Laboratory, Main Physics Block',
      },
      {
        title: 'International Symposium on Quantum Materials & Nanostructures (ISQMN-2026)',
        description: 'A three-day international symposium bringing together leading theoretical and experimental physicists to discuss emerging topological quantum states, 2D heterostructures, and room-temperature spintronic devices.',
        image: '/eventssss.jpg',
        startDate: new Date('2026-09-18T10:00:00.000Z'),
        venue: 'Department Auditorium (Main Block), CUSAT',
        apply_link: 'https://cusat.ac.in',
        broadcastToTv: true,
      },
      {
        title: 'National Hands-On Workshop on Confocal Raman & FE-SEM Characterization',
        description: 'An intensive hands-on workshop on field emission scanning electron microscopy (FE-SEM), confocal micro-Raman spectroscopy, and thin film sample preparation protocols for research scholars.',
        image: '/innovation-microscope.png',
        startDate: new Date('2026-09-25T09:30:00.000Z'),
        venue: 'Central Instrumentation Facility (CIF), CUSAT',
        apply_link: 'https://cusat.ac.in',
        broadcastToTv: true,
      },
    ];

    for (const ev of eventsData) {
      await prisma.event.create({ data: ev });
    }
    console.log('[SEED] Events seeded successfully.');
  }

  // Seed default news
  const newsCount = await prisma.news.count();
  if (newsCount === 0) {
    console.log('[SEED] Seeding initial news...');
    await prisma.news.createMany({
      data: [
        {
          title: 'Department of Physics to Co-Develop Advanced Astro-payloads with National Space Agencies',
          description: 'A pioneering agreement has been reached to design and build lightweight cosmic-ray detectors and semiconductor payloads. The project will run out of our thin film and electronics laboratories, providing doctoral students and M.Sc. researchers with hands-on development experience.',
          image: '/cusat-building.png',
          date: new Date('2026-07-16T00:00:00.000Z'),
        },
        {
          title: 'Department of Physics Welcomes Incoming 2026 Batch of Postgraduates & Scholars',
          description: 'An orientation ceremony was held at the department foyer to welcome the incoming batch of Integrated M.Sc., M.Sc., and Ph.D. scholars. The faculty introduced the research verticals and advanced instrumentation facilities available for academic endeavors.',
          image: '/eventssss.jpg',
          date: new Date('2026-07-12T00:00:00.000Z'),
        },
        {
          title: 'Dr. Alex Thomas Awarded Prestigious National Research Fellowship',
          description: "The Department of Physics is proud to announce that Dr. Alex Thomas has been awarded the National Research Fellowship in Material Physics. This prestigious award supports the department's pioneering research on hybrid polyaniline-graphene nanostructures for next-generation supercapacitors.",
          image: '/faculty.png',
          date: new Date('2026-06-25T00:00:00.000Z'),
        },
        {
          title: 'Advanced Instrumentation Lab Receives FE-SEM Upgrades',
          description: 'The Central Instrumentation Facility has successfully installed advanced software upgrades to the Field Emission Scanning Electron Microscope (FE-SEM). The upgrade will allow high-resolution surface characterization down to 1nm, accelerating thin film photovoltaic research.',
          image: '/innovation-microscope.png',
          date: new Date('2026-05-15T00:00:00.000Z'),
        },
      ],
    });
    console.log('[SEED] Initial news seeded successfully.');
  }

  // Seed default awards
  const awardCount = await prisma.award.count();
  if (awardCount === 0) {
    console.log('[SEED] Seeding initial awards...');
    await prisma.award.createMany({
      data: [
        {
          title: 'National Material Scientist Fellowship 2026',
          description: 'Recognized for pioneering advancements in hybrid polyaniline-graphene nanostructures for high-energy density supercapacitors and flexible energy storage.',
          date: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          title: 'INSA Young Scientist Medal in Physical Sciences',
          description: 'Conferred for groundbreaking theoretical and computational investigations into topological phase transitions and non-Hermitian photonics.',
          date: new Date('2025-01-01T00:00:00.000Z'),
        },
        {
          title: 'Best International Research Paper Award',
          description: 'Conferred for the high-impact publication on room-temperature multiferroic perovskite thin films grown via pulsed laser deposition.',
          date: new Date('2025-01-01T00:00:00.000Z'),
        },
        {
          title: 'State Young Scientist Award (Physical Sciences)',
          description: 'Honored for outstanding contributions to magnetic nanocomposite fabrication and low-temperature magneto-transport characterization.',
          date: new Date('2024-01-01T00:00:00.000Z'),
        },
      ],
    });
    console.log('[SEED] Initial awards seeded successfully.');
  }

  // Seed default alumni data
  const execCount = await prisma.alumniExecutive.count();
  if (execCount === 0) {
    console.log('[SEED] Seeding alumni executives, achievements, and programs...');
    const executives = [
      {
        name: 'Prof. (Dr.) M. R. Anantharaman',
        role: 'Patron & Chief Advisor',
        batch: 'Distinguished Faculty & Former HoD',
        image: null,
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Dr. S. Prasanth',
        role: 'President',
        batch: 'Class of 1998 · M.Sc. & Ph.D.',
        image: null,
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Dr. Lakshmi K. Menon',
        role: 'Vice President',
        batch: 'Class of 2004 · M.Sc. Physics',
        image: null,
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Dr. Anandhu R. Nair',
        role: 'General Secretary',
        batch: 'Class of 2018 · Ph.D.',
        image: null,
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Dr. Priya S. Warrier',
        role: 'Joint Secretary',
        batch: 'Class of 2015 · M.Sc. Physics',
        image: null,
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Prof. Rajesh K. Menon',
        role: 'Treasurer',
        batch: 'Class of 2012 · Ph.D.',
        image: null,
        sortOrder: 6,
        isActive: true,
      },
    ];

    for (const exec of executives) {
      await prisma.alumniExecutive.create({ data: exec });
    }

    const achievements = [
      {
        awardName: 'Shanti Swarup Bhatnagar Prize in Physical Sciences',
        recipient: 'Dr. S. Prasanth',
        batch: 'Class of 1998 · M.Sc. & Ph.D.',
        date: '26 September 2025',
        photo: null,
        desc: 'Conferred India’s highest scientific distinction in recognition of breakthrough discoveries in magnetic nanocomposites, high-entropy alloys, and phase transitions in quantum materials.',
        sortOrder: 1,
      },
      {
        awardName: 'ISRO Outstanding Space Scientist Achievement Award',
        recipient: 'Dr. Priya S. Warrier',
        batch: 'Class of 2015 · M.Sc. Physics',
        date: '14 January 2025',
        photo: null,
        desc: 'Honored for outstanding technical leadership in engineering multi-spectral optical thin-film sensors and spectrometers successfully deployed on India’s deep-space planetary payloads.',
        sortOrder: 2,
      },
      {
        awardName: 'Alexander von Humboldt International Research Fellowship',
        recipient: 'Dr. Anandhu R. Nair',
        batch: 'Class of 2018 · Ph.D.',
        date: '18 May 2024',
        photo: null,
        desc: 'Awarded the renowned German postdoctoral research fellowship for pioneering experimental investigations into ultrafast femtosecond laser dynamics and quantum light-matter entanglement.',
        sortOrder: 3,
      },
      {
        awardName: 'INSA Medal for Young Scientists in Physics',
        recipient: 'Prof. Rajesh K. Menon',
        batch: 'Class of 2012 · Ph.D.',
        date: '22 November 2023',
        photo: null,
        desc: 'Recognized by the Indian National Science Academy (INSA) for foundational contributions to spintronic transport mechanisms and low-temperature magnetic heterostructures.',
        sortOrder: 4,
      },
    ];

    for (const ach of achievements) {
      await prisma.alumniAchievement.create({ data: ach });
    }

    const programs = [
      {
        programName: 'Prof. M. Sabir Memorial Student Excellence Endowment',
        nature: 'Award',
        date: 'Instituted 2024 · Annual',
        photo: null,
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
        photo: null,
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
        photo: null,
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
        photo: null,
        sponsor: 'Sponsored by International Alumni Fraternity (US & Europe)',
        desc: 'Comprehensive computational hardware and server rack donation providing a dedicated 64-core multi-GPU computing node configured specifically for quantum Monte Carlo simulations and theoretical condensed matter calculations.',
        isRecurring: false,
        proofUrl: null,
        sortOrder: 4,
      },
    ];

    for (const prog of programs) {
      await prisma.alumniSponsoredProgram.create({ data: prog });
    }

    console.log('[SEED] Alumni data seeded successfully.');
  }

  // Seed default About Us content
  const aboutCount = await prisma.aboutUs.count();
  if (aboutCount === 0) {
    console.log('[SEED] Seeding About Us content...');
    await prisma.aboutUs.create({
      data: {
        content: `The Department of Physics was founded in 1963 as a department of the University of Kerala at Ernakulam, and later became a constituent department of Cochin University of Science and Technology (CUSAT) upon its establishment in 1971.

Over the last six decades, the department has grown into a major hub for physical science research in South India, securing DST-FIST, UGC-SAP, and DAE-BRNS assistance. Today, our research laboratories house sophisticated analytical tools such as FE-SEM, XRD, micro-Raman, and low-temperature VSM systems.

The department has pioneered research in magnetic nanocomposites, quantum optics, thin film photovoltaics, and theoretical cosmology. We have successfully completed numerous research projects sponsored by national agencies including DST, UGC, DAE, CSIR, and ISRO.`,
        image: '/campus.jpg',
      },
    });
    console.log('[SEED] About Us content seeded successfully.');
  }

  // Seed default homepage hero slides
  const heroCount = await prisma.hero.count();
  if (heroCount === 0) {
    console.log('[SEED] Seeding home hero slides...');
    await prisma.hero.createMany({
      data: [
        {
          title: 'Excellence in Physical Sciences & Quantum Research',
          description: 'Department of Physics, Cochin University of Science and Technology (CUSAT) — Pioneering fundamental breakthroughs in materials science, photonics, and cosmology since 1963.',
          image: '/campus.jpg',
          order: 1,
          is_visible: true,
        },
        {
          title: 'State-of-the-Art Research Laboratories & Facilities',
          description: 'Equipped with advanced analytical instrumentation including FE-SEM, XRD, micro-Raman, and cryo-VSM supporting doctoral scholars and national sponsored projects.',
          image: '/innovation-microscope.png',
          order: 2,
          is_visible: true,
        },
      ],
    });
    console.log('[SEED] Home hero slides seeded successfully.');
  }

  // Seed default office/administrative staff
  const staffCount = await prisma.staff.count();
  if (staffCount === 0) {
    console.log('[SEED] Seeding administrative office staff...');
    await prisma.staff.create({
      data: {
        name: 'Manoj Kumar K.',
        designation: 'Office Superintendent',
        email: 'physics.office@cusat.ac.in',
        phone: '+91 484 2577404',
        room: 'Ground Floor, Room 101',
        sortOrder: 1,
        isActive: true,
      },
    });
    console.log('[SEED] Administrative staff seeded successfully.');
  }

  // Seed default general settings
  const settingsCount = await prisma.generalSettings.count();
  if (settingsCount === 0) {
    console.log('[SEED] Seeding default general settings...');
    await prisma.generalSettings.create({
      data: {
        id: 'general',
        departmentEmail: 'physics@cusat.ac.in',
        hodEmail: 'aldrin2005@gmail.com',
      },
    });
    console.log('[SEED] General settings seeded successfully.');
  }

  // Seed sample faculty member & sponsored research projects/publications if none exist
  const facultyCount = await prisma.faculty.count();
  let defaultFaculty = await prisma.faculty.findFirst();

  if (facultyCount === 0) {
    console.log('[SEED] Seeding initial department faculty member...');
    const defaultPassword = await bcrypt.hash('CusatPhysics@2026', 12);
    defaultFaculty = await prisma.faculty.create({
      data: {
        name: 'Prof. (Dr.) Aldrin Antony',
        email: 'aldrin2005@gmail.com',
        password: defaultPassword,
        designation: 'Professor & Head of Department',
        department: 'Department of Physics',
        qualification: 'Ph.D. in Materials Physics',
        room: 'Room 204, Second Floor',
        bio: 'Professor specializing in thin film photovoltaics, solar energy materials, transparent conducting oxides, and semiconductor nanostructures.',
        isActive: true,
        mustChangePassword: false,
      },
    });
    console.log('[SEED] Initial faculty member seeded successfully.');
  }

  if (defaultFaculty) {
    const projectCount = await prisma.facultyProject.count();
    if (projectCount === 0) {
      console.log('[SEED] Seeding sponsored research projects...');
      const sampleProjects = [
        {
          title: 'Quantum Transport & Topological Phase Transitions in 2D Transition Metal Dichalcogenide Heterostructures',
          description: 'Investigating low-temperature quantum Hall phenomena, topological edge states, and spin-orbit torque switching in atomically thin 2D layered heterostructures for next-generation quantum computing architectures.',
          agency: 'DST - Science and Engineering Research Board (SERB)',
          role: 'Principal Investigator',
          funding: '₹68.5 Lakhs',
          startDate: new Date('2024-04-01T00:00:00.000Z'),
          endDate: new Date('2027-03-31T00:00:00.000Z'),
          externalLink: 'https://serbonline.in',
          otherFaculty: 'Dr. Ramesh Kumar, Dr. Aldrin Antony',
          status: 'Ongoing',
          facultyId: defaultFaculty.id,
        },
        {
          title: 'Development of Flexible Metal-Oxide Perovskite Tandem Photovoltaics for Space Energy Harvesting',
          description: 'Synthesizing novel halide perovskite and transparent conducting oxide thin films with high radiation hardness, tailored bandgap alignment, and environmental stability under space payload conditions.',
          agency: 'ISRO - RESPOND Program',
          role: 'Principal Investigator',
          funding: '₹42.0 Lakhs',
          startDate: new Date('2023-08-15T00:00:00.000Z'),
          endDate: new Date('2026-08-14T00:00:00.000Z'),
          externalLink: 'https://isro.gov.in',
          otherFaculty: 'Dr. S. Jayalekshmi, Dr. M. Junaid Bushiri',
          status: 'Ongoing',
          facultyId: defaultFaculty.id,
        },
        {
          title: 'Femtosecond Laser Spectroscopy and Z-Scan Nonlinear Optical Characterization of Rare-Earth Doped Nanocomposites',
          description: 'Exploring ultrafast optical limiting, third-order nonlinear susceptibility, and multi-photon absorption in rare-earth titanate nanocrystals for laser protection filters and all-optical switching devices.',
          agency: 'Council of Scientific & Industrial Research (CSIR)',
          role: 'Principal Investigator',
          funding: '₹35.8 Lakhs',
          startDate: new Date('2022-06-01T00:00:00.000Z'),
          endDate: new Date('2025-05-31T00:00:00.000Z'),
          externalLink: 'https://csirhrdg.res.in',
          otherFaculty: 'Dr. N. G. S. Prasad',
          status: 'Ongoing',
          facultyId: defaultFaculty.id,
        },
        {
          title: 'Dark Energy Constraints and Thermodynamic Geometry of Modified Gravity FLRW Cosmologies',
          description: 'Theoretical investigations into holographic dark energy models, f(R,T) gravity extensions, and cosmic microwave background polarization anisotropies using Markov Chain Monte Carlo Bayesian data fitting.',
          agency: 'Board of Research in Nuclear Sciences (BRNS - DAE)',
          role: 'Principal Investigator',
          funding: '₹28.4 Lakhs',
          startDate: new Date('2023-01-01T00:00:00.000Z'),
          endDate: new Date('2025-12-31T00:00:00.000Z'),
          externalLink: 'https://brns.res.in',
          otherFaculty: 'Dr. Titus K. Mathew',
          status: 'Ongoing',
          facultyId: defaultFaculty.id,
        },
        {
          title: 'Solid-State Polymer Electrolytes and Graphene Aerogel Electrodes for High-Energy-Density Supercapacitors',
          description: 'Designing room-temperature ionic liquid infused polymer gel electrolytes and hierarchical porous carbon aerogel supercapacitor cells with extended voltage window and ultra-high cycle life (>50,000 cycles).',
          agency: 'UGC - DAE Consortium for Scientific Research',
          role: 'Principal Investigator',
          funding: '₹45.0 Lakhs',
          startDate: new Date('2021-03-01T00:00:00.000Z'),
          endDate: new Date('2024-02-28T00:00:00.000Z'),
          externalLink: 'https://ugcdaecsr.res.in',
          otherFaculty: 'Dr. M. K. Jayaraj',
          status: 'Completed',
          facultyId: defaultFaculty.id,
        },
        {
          title: 'Nanoscale Magnetic Exchange Bias and Magnetocaloric Effect in Core-Shell Ferrite Nanoparticles for Cryocooling',
          description: 'Investigation of interface spin freezing, superparamagnetism, and room-temperature giant magnetocaloric effect in chemically engineered cobalt-manganese spinel ferrite core-shell nanostructures.',
          agency: 'Kerala State Council for Science, Technology and Environment (KSCSTE)',
          role: 'Principal Investigator',
          funding: '₹24.5 Lakhs',
          startDate: new Date('2020-09-01T00:00:00.000Z'),
          endDate: new Date('2023-08-31T00:00:00.000Z'),
          externalLink: 'https://kscste.kerala.gov.in',
          otherFaculty: 'Dr. Senoy Thomas',
          status: 'Completed',
          facultyId: defaultFaculty.id,
        },
      ];

      for (const proj of sampleProjects) {
        await prisma.facultyProject.create({ data: proj });
      }
      console.log('[SEED] Sponsored research projects seeded successfully.');
    }

    const pubCount = await prisma.facultyPublication.count();
    if (pubCount === 0) {
      console.log('[SEED] Seeding sample journal publications...');
      const samplePublications = [
        {
          title: 'Room-Temperature Giant Magnetoelectric Coupling in BaTiO3-CoFe2O4 Core-Shell Nanocomposites',
          authors: 'Aldrin Antony, Ramesh Kumar, M. R. Anantharaman',
          journal: 'Applied Physics Letters',
          publicationDate: new Date('2024-03-15T00:00:00.000Z'),
          doi: '10.1063/5.0189201',
          category: 'Journal Article',
          description: 'Demonstrating enhanced magnetoelectric coefficient in chemically synthesized core-shell perovskite-spinel heterostructures.',
          facultyId: defaultFaculty.id,
        },
        {
          title: 'Ultrafast Third-Order Nonlinear Optical Response of Bi2Se3 Topological Insulator Nanosheets',
          authors: 'Priya S. Warrier, David Miller, Aldrin Antony',
          journal: 'Physical Review Letters',
          publicationDate: new Date('2023-11-20T00:00:00.000Z'),
          doi: '10.1103/PhysRevLett.131.206901',
          category: 'Journal Article',
          description: 'Z-scan measurement of nonlinear refraction and saturation absorption in 2D layered topological insulators under femtosecond laser excitation.',
          facultyId: defaultFaculty.id,
        },
      ];

      for (const pub of samplePublications) {
        await prisma.facultyPublication.create({ data: pub });
      }
      console.log('[SEED] Journal publications seeded successfully.');
    }

    const profileCount = await prisma.facultyProfile.count();
    if (profileCount === 0) {
      console.log('[SEED] Seeding faculty profile links...');
      await prisma.facultyProfile.create({
        data: {
          facultyId: defaultFaculty.id,
          phone: '+91 484 2577404',
          profiles: {
            google_scholar: 'https://scholar.google.com/citations?user=aldrin_antony',
            orcid: 'https://orcid.org/0000-0002-1825-0097',
            scopus: 'https://www.scopus.com/authid/detail.uri?authorId=57194389200',
            linkedin: 'https://www.linkedin.com/in/aldrin-antony-cusat',
            personal_website: 'https://cusat.ac.in/faculty/aldrin',
          },
        },
      });
      console.log('[SEED] Faculty profile links seeded successfully.');
    }

    const descCount = await prisma.facultyDescription.count();
    if (descCount === 0) {
      console.log('[SEED] Seeding faculty extended research description...');
      await prisma.facultyDescription.create({
        data: {
          facultyId: defaultFaculty.id,
          description: `### Research Focus & Academic Background

Prof. (Dr.) Aldrin Antony is Professor and Head of the Department of Physics at Cochin University of Science and Technology (CUSAT). His research domain centers on advanced thin-film solar photovoltaics, transparent conducting oxides (TCOs), flexible optoelectronic interfaces, and halide perovskite heterostructures.

#### Key Contributions:
- **Photovoltaic Thin Films**: High-efficiency silicon heterojunction (SHJ) and CZTS/CIGS solar cells with optimized surface passivation layers.
- **Nanostructured Transparent Conductors**: Chemically sprayed and sputtered doped zinc oxide and indium oxide nanostructures for optoelectronic devices.
- **National Space & Energy Projects**: Principal Investigator on sponsored research grants funded by ISRO (RESPOND) and DST-SERB investigating radiation-hard photovoltaics for space satellite payloads.`,
        },
      });
      console.log('[SEED] Faculty extended research description seeded successfully.');
    }

    const docCount = await prisma.facultyDocument.count();
    if (docCount === 0) {
      console.log('[SEED] Seeding faculty documents & CV...');
      await prisma.facultyDocument.create({
        data: {
          facultyId: defaultFaculty.id,
          image: '/faculty.png',
          cv: '/placeholder.pdf',
        },
      });
      console.log('[SEED] Faculty documents seeded successfully.');
    }

    const studentCount = await prisma.facultyStudent.count();
    if (studentCount === 0) {
      console.log('[SEED] Seeding faculty research scholars / Ph.D. students...');
      await prisma.facultyStudent.createMany({
        data: [
          {
            facultyId: defaultFaculty.id,
            name: 'Ananya S. Pillai',
            description: 'Senior Research Fellow (CSIR-SRF) · Perovskite-Silicon Tandem Photovoltaics',
            image: null,
          },
          {
            facultyId: defaultFaculty.id,
            name: 'K. V. Rahul',
            description: 'Ph.D. Scholar (UGC-JRF) · Magneto-transport and Spintronics in 2D Heterostructures',
            image: null,
          },
          {
            facultyId: defaultFaculty.id,
            name: 'Meera Nambiar',
            description: 'Doctoral Scholar (INSPIRE Fellow) · Femtosecond Nonlinear Optical Spectroscopy',
            image: null,
          },
        ],
      });
      console.log('[SEED] Faculty research scholars seeded successfully.');
    }
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

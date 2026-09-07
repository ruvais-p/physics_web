import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const facultyMembers = await prisma.faculty.findMany({
    select: { id: true, name: true },
  });

  if (facultyMembers.length === 0) {
    console.log('No faculty members found in database.');
    return;
  }

  console.log(`Found ${facultyMembers.length} faculty members.`);

  // Check existing count of projects
  const existingCount = await prisma.facultyProject.count();
  console.log(`Current project count: ${existingCount}`);

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
    },
  ];

  // Distribute projects among available faculty members
  for (let i = 0; i < sampleProjects.length; i++) {
    const proj = sampleProjects[i];
    const faculty = facultyMembers[i % facultyMembers.length];

    const created = await prisma.facultyProject.create({
      data: {
        ...proj,
        facultyId: faculty.id,
      },
    });

    console.log(`Created Project [${created.id}]: "${created.title}" under faculty: ${faculty.name}`);
  }

  console.log('Successfully seeded sample research projects.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

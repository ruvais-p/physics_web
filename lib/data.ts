export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  email: string;
  phone: string;
  room: string;
  researchFocus: string[];
  bio: string;
  publicationsCount: number;
  citations: number;
  image: string;
  type: 'faculty';
  cvUrl?: string;
  socialLinks?: {
    scholar?: string;
    linkedin?: string;
    orcid?: string;
    researchgate?: string;
  };
}

export interface Scholar {
  id: string;
  name: string;
  supervisor: string;
  topic: string;
  fellowship?: string;
  joiningYear?: number;
  email?: string;
  image: string;
  type: 'scholar';
}

export interface Course {
  id: string;
  title: string;
  code?: string;
  level: string;
  duration: string;
  intake: number;
  eligibility: string;
  description: string;
  highlights: string[];
  syllabus: { semester: string; subjects: string[] }[];
  fees: string;
}

export interface ResearchLab {
  id: string;
  name: string;
  director: string;
  category: string;
  shortDesc: string;
  description: string;
  equipment: string[];
  focusAreas: string[];
  image: string;
  activeProjects: number;
}

export interface ResearchDomain {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface Facility {
  id: string;
  name: string;
  model: string;
  make: string;
  category: string;
  description: string;
  specifications: string[];
  inCharge: string;
  bookingStatus: 'Available' | 'Maintenance' | 'High Demand';
  image: string;
  chargeInternal: string;
  chargeExternal: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume: string;
  doi: string;
  citations: number;
  category: string;
  abstract: string;
}

export const DEPARTMENT_STATS = [
  { label: 'Faculty Members', value: '18+' },
  { label: 'Research Scholars', value: '75+' },
  { label: 'Peer-Reviewed Papers', value: '1,200+' },
  { label: 'Research Labs', value: '9' },
  { label: 'Extramural Grants', value: '₹14.5 Cr' },
];

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'f1',
    name: 'Dr. M. R. Anantharaman',
    designation: 'Emeritus Professor & Senior Scientist',
    qualification: 'Ph.D. (IISc Bangalore)',
    email: 'mra@cusat.ac.in',
    phone: '+91 484 2577404',
    room: 'Phys-201',
    researchFocus: ['Magnetic Nanostructures', 'Conducting Polymers', 'Multiferroics'],
    bio: 'Pioneer in magnetic materials and nanocomposites with over 3 decades of academic excellence and 250+ research publications.',
    publicationsCount: 265,
    citations: 7420,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=mra_placeholder',
      linkedin: 'https://linkedin.com/in/mra_placeholder',
      orcid: 'https://orcid.org/0000-0002-1234-5678',
      researchgate: 'https://www.researchgate.net/profile/M_R_Anantharaman'
    }
  },
  {
    id: 'f2',
    name: 'Dr. V. P. N. Nampoori',
    designation: 'Professor Emeritus',
    qualification: 'Ph.D. (IIT Madras)',
    email: 'nampoori@cusat.ac.in',
    phone: '+91 484 2577405',
    room: 'Phys-204',
    researchFocus: ['Laser Spectroscopy', 'Nonlinear Optics', 'Photothermal Phenomena'],
    bio: 'Renowned expert in photonics and spectroscopy. Former Director of International School of Photonics, CUSAT.',
    publicationsCount: 310,
    citations: 8900,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=nampoori_placeholder',
      linkedin: 'https://linkedin.com/in/nampoori_placeholder',
      orcid: 'https://orcid.org/0000-0002-8765-4321',
      researchgate: 'https://www.researchgate.net/profile/VPN_Nampoori'
    }
  },
  {
    id: 'f3',
    name: 'Dr. B. Pradeep',
    designation: 'Professor & Head of Department',
    qualification: 'Ph.D. (CUSAT)',
    email: 'pradeep@cusat.ac.in',
    phone: '+91 484 2577401',
    room: 'HoD Office / Phys-101',
    researchFocus: ['Thin Film Semiconductors', 'Transparent Conducting Oxides', 'Solar Photovoltaics'],
    bio: 'Specializes in metal oxide thin films for optoelectronic and photovoltaic applications. Leading multiple DST-SERB funded projects.',
    publicationsCount: 145,
    citations: 3200,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=pradeep_placeholder',
      linkedin: 'https://linkedin.com/in/pradeep_placeholder',
      orcid: 'https://orcid.org/0000-0002-3456-7890',
      researchgate: 'https://www.researchgate.net/profile/B_Pradeep'
    }
  },
  {
    id: 'f4',
    name: 'Dr. S. Jayalekshmi',
    designation: 'Professor',
    qualification: 'Ph.D. (IIT Delhi)',
    email: 'jayalekshmi@cusat.ac.in',
    phone: '+91 484 2577408',
    room: 'Phys-208',
    researchFocus: ['Nanodielectrics', 'Organic Supercapacitors', 'Energy Storage Materials'],
    bio: 'Focuses on structural and electrical properties of nanostructured carbon composites and polymer electrolyte devices.',
    publicationsCount: 180,
    citations: 4500,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=jayalekshmi_placeholder',
      linkedin: 'https://linkedin.com/in/jayalekshmi_placeholder',
      orcid: 'https://orcid.org/0000-0002-4567-8901',
      researchgate: 'https://www.researchgate.net/profile/S_Jayalekshmi'
    }
  },
  {
    id: 'f5',
    name: 'Dr. Titus K. Mathew',
    designation: 'Professor',
    qualification: 'Ph.D. (CUSAT)',
    email: 'titus@cusat.ac.in',
    phone: '+91 484 2577410',
    room: 'Phys-302',
    researchFocus: ['Theoretical Cosmology', 'Dark Energy Dynamics', 'Gravitational Physics'],
    bio: 'Theoretical physicist focusing on cosmological models, thermodynamic behavior of expanding universes, and holographic dark energy.',
    publicationsCount: 95,
    citations: 1850,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=titus_placeholder',
      linkedin: 'https://linkedin.com/in/titus_placeholder',
      orcid: 'https://orcid.org/0000-0002-5678-9012',
      researchgate: 'https://www.researchgate.net/profile/Titus_Mathew'
    }
  },
  {
    id: 'f6',
    name: 'Dr. Ramesh Babu T.',
    designation: 'Associate Professor',
    qualification: 'Ph.D. (IISc Bangalore)',
    email: 'rameshbabu@cusat.ac.in',
    phone: '+91 484 2577412',
    room: 'Phys-212',
    researchFocus: ['Quantum Condensed Matter', 'Topological Insulators', 'Density Functional Theory'],
    bio: 'Investigates electronic band structures and quantum transport in two-dimensional van der Waals heterostructures.',
    publicationsCount: 78,
    citations: 1420,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=rameshbabu_placeholder',
      linkedin: 'https://linkedin.com/in/rameshbabu_placeholder',
      orcid: 'https://orcid.org/0000-0002-6789-0123',
      researchgate: 'https://www.researchgate.net/profile/Ramesh_Babu_T'
    }
  },
  {
    id: 'f7',
    name: 'Dr. Asha A. S.',
    designation: 'Associate Professor',
    qualification: 'Ph.D. (CUSAT)',
    email: 'ashaas@cusat.ac.in',
    phone: '+91 484 2577415',
    room: 'Phys-215',
    researchFocus: ['Optoelectronic Thin Films', 'Phosphors & Luminescence', 'Sensors'],
    bio: 'Expert in rare-earth doped luminescence materials and optical gas sensors for environmental monitoring.',
    publicationsCount: 64,
    citations: 980,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=ashaas_placeholder',
      linkedin: 'https://linkedin.com/in/ashaas_placeholder',
      orcid: 'https://orcid.org/0000-0002-7890-1234',
      researchgate: 'https://www.researchgate.net/profile/Asha_AS'
    }
  },
  {
    id: 'f8',
    name: 'Dr. K. P. Santhosh',
    designation: 'Visiting Professor',
    qualification: 'Ph.D. (Calicut University)',
    email: 'santhoshkp@cusat.ac.in',
    phone: '+91 484 2577418',
    room: 'Phys-305',
    researchFocus: ['Nuclear Fission & Fusion', 'Cluster Radioactivity', 'Heavy Ion Collisions'],
    bio: 'Prominent nuclear physicist with landmark contributions to alpha decay systematics and superheavy element synthesis.',
    publicationsCount: 210,
    citations: 3900,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    type: 'faculty',
    cvUrl: '/cvs/cv_placeholder.pdf',
    socialLinks: {
      scholar: 'https://scholar.google.com/citations?user=santhoshkp_placeholder',
      linkedin: 'https://linkedin.com/in/santhoshkp_placeholder',
      orcid: 'https://orcid.org/0000-0002-8901-2345',
      researchgate: 'https://www.researchgate.net/profile/K_P_Santhosh'
    }
  },
];

export const SCHOLARS: Scholar[] = [
  {
    id: 's1',
    name: 'Ananya S. Nair',
    supervisor: 'Dr. M. R. Anantharaman',
    topic: 'Flexible Magneto-Electric Nanocomposites for Energy Harvesting',
    fellowship: 'CSIR-JRF',
    joiningYear: 2023,
    email: 'ananya.nair@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    type: 'scholar',
  },
  {
    id: 's2',
    name: 'Rahul K. Varma',
    supervisor: 'Dr. B. Pradeep',
    topic: 'Perovskite Thin Films for High-Efficiency Tandem Solar Cells',
    fellowship: 'UGC-NET JRF',
    joiningYear: 2022,
    email: 'rahul.varma@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    type: 'scholar',
  },
  {
    id: 's3',
    name: 'Meera Krishnan',
    supervisor: 'Dr. Titus K. Mathew',
    topic: 'Thermodynamic Constraints on Running Dark Energy Models',
    fellowship: 'DST-INSPIRE Fellow',
    joiningYear: 2023,
    email: 'meera.k@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    type: 'scholar',
  },
  {
    id: 's4',
    name: 'Siddharth Menon',
    supervisor: 'Dr. Ramesh Babu T.',
    topic: 'Quantum Transport Anomalies in 2D Topological Dirac Semimetals',
    fellowship: 'Prime Minister Research Fellowship (PMRF)',
    joiningYear: 2024,
    email: 'siddharth.m@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    type: 'scholar',
  },
  {
    id: 's5',
    name: 'Fathima Zakariya',
    supervisor: 'Dr. S. Jayalekshmi',
    topic: 'Graphene-Polyaniline Hybrid Supercapacitors with Ionic Liquids',
    fellowship: 'KSCSTE Research Fellowship',
    joiningYear: 2022,
    email: 'fathima.z@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    type: 'scholar',
  },
  {
    id: 's6',
    name: 'Arjun P. Das',
    supervisor: 'Dr. Asha A. S.',
    topic: 'Upconversion Nanophosphors for Bio-Imaging and Optical Sensing',
    fellowship: 'CSIR-NET JRF',
    joiningYear: 2023,
    email: 'arjun.das@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
    type: 'scholar',
  },
  {
    id: 's7',
    name: 'Gopika U.',
    supervisor: 'Dr. V. P. N. Nampoori',
    topic: 'Nonlinear Optical Dynamics in Metamaterial Waveguides',
    fellowship: 'UGC-NET JRF',
    joiningYear: 2024,
    email: 'gopika.u@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    type: 'scholar',
  },
  {
    id: 's8',
    name: 'Abhinav Joseph',
    supervisor: 'Dr. K. P. Santhosh',
    topic: 'Systematic Study of Heavy-Ion Induced Fusion-Fission Reactions',
    fellowship: 'DAE-BRNS Senior Research Fellow',
    joiningYear: 2021,
    email: 'abhinav.j@cusat.ac.in',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80',
    type: 'scholar',
  },
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Master of Science (M.Sc.) in Physics',
    code: 'PHY-MSC-101',
    level: 'MSc',
    duration: '2 Years (4 Semesters)',
    intake: 35,
    eligibility: 'B.Sc. Degree in Physics with Mathematics as subsidiary subject securing minimum 55% marks or CGPA 6.0.',
    description: 'A rigorous postgraduate program providing deep theoretical knowledge and experimental expertise across Classical Mechanics, Quantum Physics, Electrodynamics, Statistical Physics, Condensed Matter, and Photonics.',
    highlights: [
      'Choice-Based Credit System (CBCS) with advanced electives',
      'Mandatory 4th semester master research dissertation project',
      'Hands-on training in computational physics, Python, and Matlab',
      'Direct access to advanced research instrumentation laboratories',
    ],
    syllabus: [
      { semester: 'Semester 1', subjects: ['Classical Mechanics', 'Mathematical Physics I', 'Quantum Mechanics I', 'Electronics & Instrumentation', 'Physics Lab I'] },
      { semester: 'Semester 2', subjects: ['Electrodynamics & Relativity', 'Mathematical Physics II', 'Quantum Mechanics II', 'Statistical Physics', 'Physics Lab II'] },
      { semester: 'Semester 3', subjects: ['Atomic & Molecular Physics', 'Condensed Matter Physics', 'Nuclear & Particle Physics', 'Elective I (Photonics/Materials Science)', 'Advanced Lab III'] },
      { semester: 'Semester 4', subjects: ['Computational Physics', 'Elective II (Nanotechnology/Cosmology)', 'Major Master Research Project & Viva-Voce'] },
    ],
    fees: '₹12,450 per semester (Gen/OBC) | SC/ST exempted as per Govt. rules',
  },
  {
    id: 'c2',
    title: 'Doctor of Philosophy (Ph.D.) in Physics',
    code: 'PHY-PHD-900',
    level: 'PhD',
    duration: '3 to 5 Years',
    intake: 20,
    eligibility: 'M.Sc. in Physics or related discipline with minimum 55% marks AND valid GATE / CSIR-UGC NET JRF / DAT score.',
    description: 'Full-time research degree aimed at creating world-class independent researchers. Scholars work closely with faculty mentors in state-of-the-art research labs across experimental and theoretical physics.',
    highlights: [
      'Comprehensive coursework module (Course Work I: Research Methodology & Course Work II: Advanced Domain Subject)',
      'Quarterly progress seminars before Departmental Research Committee (DRC)',
      'Generous institutional & national fellowships (CSIR, UGC, INSPIRE, PMRF, KSCSTE)',
      'Funding support for presenting papers at international conferences abroad',
    ],
    syllabus: [
      { semester: 'Year 1 (Coursework)', subjects: ['Research Methodology & Scientific Writing', 'Advanced Experimental Techniques in Physics', 'Domain Specific Literature Review & Proposal'] },
      { semester: 'Years 2-4 (Research)', subjects: ['Independent Experimental / Theoretical Investigation', 'Mid-Term Progress Evaluation Seminar', 'Publication of Peer-Reviewed Papers'] },
      { semester: 'Final Phase', subjects: ['Pre-Synopsis Defense', 'Thesis Submission & Open Defense Viva-Voce'] },
    ],
    fees: '₹8,200 per semester + Laboratory Bench Fees',
  },
  {
    id: 'c3',
    title: 'Integrated M.Sc. in Physics',
    code: 'PHY-INT-501',
    level: 'Integrated MSc',
    duration: '5 Years (10 Semesters)',
    intake: 20,
    eligibility: 'Passed 10+2 / Higher Secondary Examination with Physics, Chemistry, and Mathematics securing minimum 60% aggregate.',
    description: 'Direct entry 5-year flagship program designed for bright young students after 12th standard. Integrates foundational science with advanced quantum, statistical, and materials research.',
    highlights: [
      'Exit option after 3 years with B.Sc. (Honours) in Physics degree',
      'Early exposure to research laboratories from 3rd year onwards',
      'Interdisciplinary electives in Computer Science, Applied Chemistry & Mathematics',
      'Summer internships at premier institutes (TIFR, IISc, BARC, ISRO)',
    ],
    syllabus: [
      { semester: 'Semesters 1 - 4', subjects: ['Physics Foundations', 'Calculus & Linear Algebra', 'General Chemistry', 'Computer Programming in C/Python', 'Environmental Science'] },
      { semester: 'Semesters 5 - 8', subjects: ['Advanced Quantum Physics', 'Thermal & Statistical Physics', 'Optics & Lasers', 'Solid State Physics', 'Special Relativity'] },
      { semester: 'Semesters 9 - 10', subjects: ['Specialized Elective Clusters', 'Cap-stone Research Dissertation Project'] },
    ],
    fees: '₹18,500 per semester',
  },
];

export const RESEARCH_LABS: ResearchLab[] = [
  {
    id: 'lab1',
    name: 'Cosmology - Structure Formation',
    director: 'Dr. Titus K. Mathew',
    category: 'Theoretical Physics',
    shortDesc: 'Studies of early universe evolution, structure formation, dark energy, and cosmic expansion.',
    description: 'Investigating cosmic microwave background, large scale structure, dark matter clustering, and thermodynamic properties of spacetimes.',
    equipment: ['High-Performance Computing Clusters', 'Simulation Software'],
    focusAreas: ['Early Universe', 'Dark Matter', 'Cosmic Inflation'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab2',
    name: 'Nanophotonic & Optoelectronic Devices Laboratory',
    director: 'Dr. V. P. N. Nampoori',
    category: 'Optics & Lasers',
    shortDesc: 'Pioneering light-matter interactions, integrated nanophotonics, and advanced optoelectronic systems.',
    description: 'Dedicated to studying laser propagation, nonlinear absorption, waveguide integration, and rare-earth doped photothermal sensors.',
    equipment: ['Nd:YAG Laser', 'Z-scan Setup', 'Confocal Raman Spectrometer'],
    focusAreas: ['Optical Waveguides', 'Nonlinear Optics', 'Optoelectronic Transducers'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    activeProjects: 5,
  },
  {
    id: 'lab3',
    name: 'Magnetics Laboratory',
    director: 'Dr. M. R. Anantharaman',
    category: 'Materials Physics',
    shortDesc: 'Synthesis and characterization of nanostructured magnetic materials and multiferroic thin films.',
    description: 'Pioneering investigations in soft/hard magnetic ferrites, magnetostrictive composites, and hyperthermia agents for medical applications.',
    equipment: ['VSM Magnetometer', 'High-Temp Sintering Furnaces', 'Impedance Analyzer'],
    focusAreas: ['Magnetic Nanocomposites', 'EMI Shielding', 'Spintronics'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    activeProjects: 4,
  },
  {
    id: 'lab4',
    name: 'Nanomaterials for Emerging Solid-state Technology (NEST)',
    director: 'Dr. M. R. Anantharaman',
    category: 'Materials Physics',
    shortDesc: 'Developing functional nanomaterials for advanced electronic, optical, and mechanical applications.',
    description: 'Focusing on 2D materials, quantum dots, heterostructures, and polymer nanocomposites for solid-state technology applications.',
    equipment: ['Sputtering System', 'Ball Mill', 'Spin Coater'],
    focusAreas: ['2D Materials', 'Solid-State Sensors', 'Nanocomposites'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab5',
    name: 'Applied Optics Division',
    director: 'Dr. V. P. N. Nampoori',
    category: 'Optics & Lasers',
    shortDesc: 'Optical system design, holography, laser spectroscopy, and industrial optical sensors.',
    description: 'Engaged in applied research in interferometry, diffraction gratings, spatial light modulators, and photothermal imaging.',
    equipment: ['Optical Vibration Table', 'He-Ne Lasers', 'Monochromators'],
    focusAreas: ['Holographic Data Storage', 'Laser Spectroscopy', 'Metrology'],
    image: '/dop-logo.svg',
    activeProjects: 4,
  },
  {
    id: 'lab6',
    name: 'Division for Research in Advanced materials',
    director: 'Dr. B. Pradeep',
    category: 'Materials Physics',
    shortDesc: 'Synthesis and crystal growth of novel functional materials and advanced thin film compounds.',
    description: 'Focuses on the synthesis and structural, optical, and electrical properties of bulk and nanoscale advanced electronic materials.',
    equipment: ['RF/DC Sputtering Rig', 'XRD Diffractometer', 'UV-Vis Spectrophotometer'],
    focusAreas: ['Crystal Growth', 'Advanced Alloys', 'Thin Films'],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    activeProjects: 5,
  },
  {
    id: 'lab7',
    name: 'Nano Functional Materials',
    director: 'Dr. S. Jayalekshmi',
    category: 'Materials Physics',
    shortDesc: 'Synthesis of carbon nanostructures and conducting polymers for energy storage and sensing.',
    description: 'Designing polymer-based nanodielectrics, hybrid supercapacitor electrodes, and flexible solid-state electrochemical systems.',
    equipment: ['Electrochemical Workstation', 'Electrospinning Unit', 'Vacuum Oven'],
    focusAreas: ['Supercapacitors', 'Conducting Polymers', 'Carbon Nanotubes'],
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80',
    activeProjects: 4,
  },
  {
    id: 'lab8',
    name: 'Intense Laser Interactions (ILAI) Group',
    director: 'Dr. V. P. N. Nampoori',
    category: 'Optics & Lasers',
    shortDesc: 'High-intensity laser propagation, plasma diagnostics, and multi-photon excitation studies.',
    description: 'Focused on studying light-matter interactions under extreme optical field strengths, laser ablation, and laser-induced breakdown spectroscopy.',
    equipment: ['High-Power Nd:YAG Pulsed Laser', 'Spectrometer Systems', 'Plasma Chambers'],
    focusAreas: ['Laser Ablation', 'LIBS', 'High-Harmonic Generation'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab9',
    name: 'Materials and Metallurgical Lab',
    director: 'Dr. B. Pradeep',
    category: 'Materials Physics',
    shortDesc: 'Investigation of metal oxide coatings, mechanical properties, and structural transitions.',
    description: 'Characterization of metal alloys, high-temperature corrosion, thermal properties, and structural transitions in semiconductor and engineering materials.',
    equipment: ['High Temp Furnaces', 'Hardness Testers', 'Metallurgical Microscopes'],
    focusAreas: ['Mechanical Behavior', 'Phase Diagrams', 'Protective Coatings'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab10',
    name: 'SpinMag Lab',
    director: 'Dr. M. R. Anantharaman',
    category: 'Materials Physics',
    shortDesc: 'Spintronics, magnetic tunneling junctions, and spin transport in topological materials.',
    description: 'Developing materials for memory storage devices, focusing on anomalous Hall effect, spin currents, and topological insulator heterostructures.',
    equipment: ['Magneto-Optical Kerr Effect (MOKE) Rig', 'Thin Film Deposition Systems'],
    focusAreas: ['Magnetic Memories', 'Spin Orbit Torque', 'Anomalous Hall Effect'],
    image: '/dop-logo.svg',
    activeProjects: 4,
  },
  {
    id: 'lab11',
    name: 'Gravity and Cosmology',
    director: 'Dr. Titus K. Mathew',
    category: 'Theoretical Physics',
    shortDesc: 'General relativity, modified gravity models, black hole thermodynamics, and singularity theorems.',
    description: 'Mathematical analysis of cosmological models, gravitational wave signatures, holographic dark energy, and thermodynamic properties of spacetime.',
    equipment: ['Computational Workstations'],
    focusAreas: ['General Relativity', 'Black Hole Thermodynamics', 'Dark Energy'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab12',
    name: 'Theoretical Nuclear Physics',
    director: 'Dr. K. P. Santhosh',
    category: 'Theoretical Physics',
    shortDesc: 'Nuclear structure, decay models, cluster radioactivity, and heavy ion fusion-fission physics.',
    description: 'Exploring alpha decay systematics, cluster radioactivity of superheavy nuclei, and nuclear reactions utilizing advanced theoretical models.',
    equipment: ['Computational Cluster Workstations'],
    focusAreas: ['Superheavy Elements', 'Nuclear Fission', 'Cluster Radioactivity'],
    image: '/dop-logo.svg',
    activeProjects: 4,
  },
  {
    id: 'lab13',
    name: 'Complex System Group',
    director: 'Dr. Ramesh Babu T.',
    category: 'Theoretical Physics',
    shortDesc: 'Non-linear dynamics, chaos theory, neural networks, and statistical physics of network systems.',
    description: 'Analyzing computational and mathematical models of complex systems, sync phenomena, and dynamics on network topologies.',
    equipment: ['High-Performance Workstations'],
    focusAreas: ['Chaos & Bifurcations', 'Network Science', 'Synchronization'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab14',
    name: 'Quantum Computation and Information',
    director: 'Dr. Ramesh Babu T.',
    category: 'Theoretical Physics',
    shortDesc: 'Quantum algorithms, quantum key distribution, entanglement, and quantum info theory.',
    description: 'Designing secure quantum cryptographic protocols, analyzing quantum information entropy, and modeling quantum logic gates.',
    equipment: ['Quantum Simulation Node'],
    focusAreas: ['Quantum Cryptography', 'Entanglement', 'Quantum Algorithms'],
    image: '/dop-logo.svg',
    activeProjects: 4,
  },
  {
    id: 'lab15',
    name: 'Non-equilibrium Physics Lab',
    director: 'Dr. Ramesh Babu T.',
    category: 'Theoretical Physics',
    shortDesc: 'Statistical mechanics of non-equilibrium systems, fluctuation theorems, and active matter.',
    description: 'Theoretical research on transport processes, thermodynamic systems far from equilibrium, and cooperative phenomena in active matter.',
    equipment: ['Statistical Mechanics Workstations'],
    focusAreas: ['Fluctuation Theorems', 'Active Particles', 'Transport Processes'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab16',
    name: 'Statistical Mechanics of Soft Condensed Matter',
    director: 'Dr. Ramesh Babu T.',
    category: 'Theoretical Physics',
    shortDesc: 'Thermodynamics and phase transitions of polymers, colloids, liquid crystals, and soft materials.',
    description: 'Investigating macro-molecular behaviors, packing of colloidal systems, and phase dynamics of liquid crystals using analytical and computational tools.',
    equipment: ['Simulation Cluster Node'],
    focusAreas: ['Colloidal Phase Transitions', 'Polymer dynamics', 'Liquid Crystals'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab17',
    name: 'High Energy Physics',
    director: 'Dr. Titus K. Mathew',
    category: 'Theoretical Physics',
    shortDesc: 'Standard model extensions, particle phenomenology, and quantum field theory.',
    description: 'Investigating electroweak symmetry breaking, neutrino oscillations, dark matter candidates, and quantum field theories in curved spacetimes.',
    equipment: ['Computing Clusters'],
    focusAreas: ['Neutrino Physics', 'Dark Matter Candidates', 'QFT in Curved Spacetime'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab18',
    name: 'Large Scale Structures',
    director: 'Dr. Titus K. Mathew',
    category: 'Theoretical Physics',
    shortDesc: 'Cosmic web, cluster distribution, and galaxy clustering simulations.',
    description: 'Analyzing cosmic velocity fields, cluster distribution statistics, and testing dark matter/energy models using large observational datasets.',
    equipment: ['Large Data Storage Arrays', '64-Core Computational Node'],
    focusAreas: ['Cosmic Web', 'Galaxy Redshift Surveys', 'Dark Energy Constraints'],
    image: '/dop-logo.svg',
    activeProjects: 3,
  },
  {
    id: 'lab19',
    name: 'Thin film photovoltaics and Solar Cells',
    director: 'Dr. B. Pradeep',
    category: 'Semiconductor Devices',
    shortDesc: 'Development of thin-film solar cell structures, transparent conducting oxides, and heterojunctions.',
    description: 'Fabricating high-efficiency perovskite solar cells, transition metal oxide thin films, and testing charge carrier dynamics.',
    equipment: ['Solar Simulator', 'Vacuum Sputterer', 'Thermal Evaporator'],
    focusAreas: ['Perovskite Solar Cells', 'Transparent Oxides', 'Heterojunction Diodes'],
    image: '/dop-logo.svg',
    activeProjects: 4,
  },
];


export const FACILITIES: Facility[] = [
  {
    id: 'fac1',
    name: 'X-Ray Powder Diffractometer (XRD)',
    model: 'D8 Advance Bruker',
    make: 'Bruker AXS, Germany',
    category: 'Structural Analysis',
    description: 'High-resolution powder X-ray diffractometer equipped with Cu-Kα radiation source, LynxEye ultra-fast detector, and temperature-controlled sample stage (-180°C to 1200°C).',
    specifications: [
      'Angular Range (2θ): 0.5° to 140°',
      'Detector: LynxEye 1D silicon strip detector',
      'Low & High Temperature Attachments (Anton Paar)',
      'Phase identification, Rietveld refinement & strain analysis',
    ],
    inCharge: 'Dr. B. Pradeep / Mr. K. V. Suresh (Technical Officer)',
    bookingStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    chargeInternal: '₹200 / sample',
    chargeExternal: '₹800 / sample (Academic) | ₹2,500 (Industry)',
  },
  {
    id: 'fac2',
    name: 'Field Emission Scanning Electron Microscope (FE-SEM)',
    model: 'Sigma 300 VP',
    make: 'Carl Zeiss, Germany',
    category: 'Microscopy & Imaging',
    description: 'Ultra-high resolution Schottky field emission SEM fitted with Oxford EDS (Energy Dispersive X-ray Spectroscopy) for micro-area elemental mapping and morphological study.',
    specifications: [
      'Resolution: 1.0 nm @ 15 kV | 1.6 nm @ 1 kV',
      'Magnification: 10x to 1,000,000x',
      'EDS Detector: Oxford Ultim Max 65 mm²',
      'Gold & Carbon Sputter Coater attached',
    ],
    inCharge: 'Dr. S. Jayalekshmi / Dr. A. R. Viju',
    bookingStatus: 'High Demand',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80',
    chargeInternal: '₹500 / sample',
    chargeExternal: '₹1,800 / sample (Academic) | ₹5,000 (Industry)',
  },
  {
    id: 'fac3',
    name: 'Confocal Raman Spectrometer',
    model: 'LabRAM HR Evolution',
    make: 'Horiba Jobin Yvon, France',
    category: 'Spectroscopy',
    description: 'High resolution micro-Raman system with multi-laser excitation wavelengths (532 nm, 633 nm, 785 nm) and automated XYZ mapping stage.',
    specifications: [
      'Spectral Resolution: < 0.5 cm⁻¹',
      'Excitation Lasers: 532 nm diode, 633 nm He-Ne, 785 nm diode',
      'Spatial Resolution: Sub-micron (< 0.5 µm)',
      'Photoluminescence (PL) mapping capability',
    ],
    inCharge: 'Dr. V. P. N. Nampoori',
    bookingStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    chargeInternal: '₹300 / sample',
    chargeExternal: '₹1,200 / sample (Academic) | ₹3,500 (Industry)',
  },
  {
    id: 'fac4',
    name: 'Vibrating Sample Magnetometer (VSM)',
    model: 'VSM 7404',
    make: 'Lake Shore Cryotronics, USA',
    category: 'Magnetic Characterization',
    description: 'Measures magnetic moments of solids, powders, thin films, and liquids as a function of magnetic field (up to 2.1 Tesla) and temperature (77 K to 1000 K).',
    specifications: [
      'Dynamic Range: 1 x 10⁻⁶ emu to 10³ emu',
      'Max Field: 2.15 Tesla (21.5 kG)',
      'Cryostat Range: Liquid Nitrogen (77 K) to 450 K',
      'High Temp Oven: 300 K to 1000 K',
    ],
    inCharge: 'Dr. M. R. Anantharaman',
    bookingStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    chargeInternal: '₹250 / sample',
    chargeExternal: '₹1,000 / sample (Academic) | ₹3,000 (Industry)',
  },
  {
    id: 'fac5',
    name: 'UV-Vis-NIR Spectrophotometer',
    model: 'UV-3600 Plus',
    make: 'Shimadzu, Japan',
    category: 'Optical Spectroscopy',
    description: 'Double beam spectrophotometer covering UV, Visible, and Near-Infrared regions (185 nm to 3300 nm) equipped with Integrating Sphere (ISR-3100) for diffuse reflectance.',
    specifications: [
      'Wavelength Range: 185 nm - 3300 nm',
      'Detectors: PMT, InGaAs, and cooled PbS',
      'Specular & Diffuse Reflectance Accessories',
      'Optical Bandgap determination software',
    ],
    inCharge: 'Dr. Asha A. S.',
    bookingStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80',
    chargeInternal: '₹100 / sample',
    chargeExternal: '₹400 / sample (Academic) | ₹1,200 (Industry)',
  },
  {
    id: 'fac6',
    name: 'RF / DC Magnetron Sputtering System',
    model: 'Custom Dual-Target Unit',
    make: 'HINDHIVAC, India',
    category: 'Thin Film Deposition',
    description: 'High vacuum sputtering system with 2-inch targets for fabricating oxide, metallic, and multilayer nanometer scale thin films under inert/reactive gas flows.',
    specifications: [
      'Base Pressure: 1 x 10⁻⁶ mbar (Turbo Molecular Pumped)',
      'RF Generator: 13.56 MHz, 300 W',
      'Substrate Heater: Up to 600°C with rotation',
      'Mass Flow Controllers for Ar, O2, N2',
    ],
    inCharge: 'Dr. B. Pradeep',
    bookingStatus: 'Available',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    chargeInternal: '₹400 / run',
    chargeExternal: '₹1,500 / run (Academic)',
  },
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'p1',
    title: 'Room-temperature multiferroicity and giant magnetoelectric coupling in cobalt ferrite-barium titanate nanocomposites',
    authors: ['Ananya S. Nair', 'M. R. Anantharaman', 'P. Saravanan'],
    journal: 'Physical Review B',
    year: 2026,
    volume: '107 (14), 144412',
    doi: '10.1103/PhysRevB.107.144412',
    citations: 18,
    category: 'Condensed Matter Physics',
    abstract: 'We report the observation of room-temperature multiferroic behavior and strong strain-mediated magnetoelectric coupling in core-shell CoFe2O4@BaTiO3 nanocomposites synthesized via a modified microwave-assisted sol-gel route.',
  },
  {
    id: 'p2',
    title: 'Enhanced power conversion efficiency in lead-free Cs2AgBiBr6 double perovskite solar cells via tin doping',
    authors: ['Rahul K. Varma', 'B. Pradeep', 'S. K. Ramachandran'],
    journal: 'ACS Applied Materials & Interfaces',
    year: 2025,
    volume: '17 (8), 10244–10255',
    doi: '10.1021/acsami.5b01892',
    citations: 34,
    category: 'Energy Materials',
    abstract: 'Inorganic lead-free halide double perovskites present a promising eco-friendly alternative for photovoltaics. Here we demonstrate a systematic Sn4+ substitution strategy that narrows the optical bandgap from 2.25 eV to 1.72 eV.',
  },
  {
    id: 'p3',
    title: 'Thermodynamic consistency of holographic dark energy models in an expanding FLRW universe',
    authors: ['Meera Krishnan', 'Titus K. Mathew'],
    journal: 'European Physical Journal C',
    year: 2025,
    volume: '85 (3), 289',
    doi: '10.1140/epjc/s10052-025-13912-x',
    citations: 12,
    category: 'Cosmology & Gravitation',
    abstract: 'We examine the generalized second law of thermodynamics (GSLT) for an expanding universe enclosed by the apparent horizon, assuming a non-linearly interacting holographic dark energy density.',
  },
  {
    id: 'p4',
    title: 'Observation of giant reverse saturable absorption and optical limiting in biosynthesized gold-graphene nanocomposites',
    authors: ['Gopika U.', 'V. P. N. Nampoori', 'P. Radhakrishnan'],
    journal: 'Optics Letters',
    year: 2025,
    volume: '50 (6), 1420–1423',
    doi: '10.1364/OL.50.001420',
    citations: 29,
    category: 'Photonics & Optics',
    abstract: 'Using nanosecond Z-scan spectroscopy at 532 nm, we investigate the nonlinear optical absorption mechanisms of green-synthesized gold nanoparticle decorated reduced graphene oxide nanosheets.',
  },
  {
    id: 'p5',
    title: 'Topological phase transitions and anomalous Hall conductivity in Kagome lattice Dirac semimetals',
    authors: ['Siddharth Menon', 'Ramesh Babu T.'],
    journal: 'Physical Review Letters',
    year: 2024,
    volume: '133 (2), 026601',
    doi: '10.1103/PhysRevLett.133.026601',
    citations: 52,
    category: 'Quantum Physics',
    abstract: 'First-principles density functional calculations combined with effective tight-binding model Hamiltonian reveal a pressure-induced band inversion leading to a Chern insulator state in Kagome ferromagnet Co3Sn2S2.',
  },
  {
    id: 'p6',
    title: 'All-solid-state supercapacitors based on polyaniline-functionalized carbon nanotube fiber electrodes',
    authors: ['Fathima Zakariya', 'S. Jayalekshmi'],
    journal: 'Journal of Power Sources',
    year: 2024,
    volume: '580, 233410',
    doi: '10.1016/j.jpowsour.2024.233410',
    citations: 41,
    category: 'Energy Materials',
    abstract: 'A scalable wet-spinning route is presented to fabricate lightweight carbon nanotube fiber electrodes coated with conductive polyaniline. The resulting flexible symmetric supercapacitor delivers high volumetric energy density.',
  },
  {
    id: 'p7',
    title: 'Upconversion luminescence and temperature sensing properties of Er3+/Yb3+ co-doped SrZrO3 perovskite phosphors',
    authors: ['Arjun P. Das', 'Asha A. S.'],
    journal: 'Journal of Luminescence',
    year: 2024,
    volume: '265, 120215',
    doi: '10.1016/j.jlumin.2024.120215',
    citations: 22,
    category: 'Luminescence & Sensors',
    abstract: 'Sol-gel synthesized Er3+/Yb3+ co-doped SrZrO3 powders exhibit bright green and weak red upconversion emissions under 980 nm laser excitation. Fluorescence intensity ratio (FIR) yields high thermal sensitivity.',
  },
  {
    id: 'p8',
    title: 'Theoretical evaluation of cluster decay half-lives in superheavy nuclei Z = 118–122',
    authors: ['Abhinav Joseph', 'K. P. Santhosh'],
    journal: 'Nuclear Physics A',
    year: 2024,
    volume: '1039, 122740',
    doi: '10.1016/j.nuclphysa.2024.122740',
    citations: 19,
    category: 'Nuclear Physics',
    abstract: 'Using the Coulomb and proximity potential model (CPPM), we systematically calculate cluster radioactivity decay half-lives for heavy isotopes of superheavy elements Z = 118, 120, and 122 with cluster emissions up to 50Ca.',
  },
];

export const RESEARCH_DOMAINS: ResearchDomain[] = [
  {
    id: 'rd1',
    number: '01',
    title: 'Nanostructured Materials',
    description: 'Synthesis and study of functional nanomaterials in forms such as nanoparticles, nanorods, nanoflowers, nanonails, nanofibres, nanomesh, nanopillars, and nanoshells using hydrothermal, combustion, chemical, and microwave methods.',
  },
  {
    id: 'rd2',
    number: '02',
    title: 'Materials for Photocatalytic Water Purification',
    description: 'Research on semiconductor-based photocatalysts for degradation of dyes, pharmaceuticals, pesticides, and other contaminants in water.',
  },
  {
    id: 'rd3',
    number: '03',
    title: 'Energy Storage & Conversion Devices',
    description: 'Design and fabrication of novel supercapacitors, nanodielectrics, battery electrodes, and hybrid thin-film solar cell structures for clean energy technologies.',
  },
  {
    id: 'rd4',
    number: '04',
    title: 'Nanophotonics & Optoelectronic Systems',
    description: 'Pioneering investigations in light-matter interactions, laser spectroscopy, nonlinear optical absorption, and integrated photothermal sensor devices.',
  },
  {
    id: 'rd5',
    number: '05',
    title: 'Magnetic Nanomaterials & Spintronics',
    description: 'Synthesis and characterization of soft/hard magnetic ferrites, multiferroic nanocomposites, spintronic memory junctions, and magnetic hyperthermia agents.',
  },
  {
    id: 'rd6',
    number: '06',
    title: 'Theoretical Physics & Cosmology',
    description: 'Mathematical modeling of early universe evolution, holographic dark energy, black hole thermodynamics, quantum transport, and superheavy nuclear decay systematics.',
  },
];

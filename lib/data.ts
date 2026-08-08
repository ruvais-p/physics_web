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
  fellowship: string;
  joiningYear: number;
  email: string;
  image: string;
  type: 'scholar';
}

export interface Course {
  id: string;
  title: string;
  code: string;
  level: 'MSc' | 'PhD' | 'Integrated MSc';
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
    name: 'Magnetics & Nanomaterials Research Laboratory',
    director: 'Dr. M. R. Anantharaman',
    category: 'Materials Physics',
    shortDesc: 'Synthesis and magnetic characterization of nanostructured ferrites, multiferroics, and flexible magnetic polymers.',
    description: 'The Magnetics Lab focuses on pioneering research in magnetic nanocomposites, magnetostrictive materials, multiferroic heterostructures, and magnetic fluid hyperthermia for biomedical applications.',
    equipment: ['VSM (Vibrating Sample Magnetometer)', 'High-Temp Sintering Furnaces', 'Impedance Analyzer (1MHz - 3GHz)', 'Sol-Gel Chemical Synthesis Rig'],
    focusAreas: ['Soft & Hard Ferrite Nanoparticles', 'Magneto-electric Sensors', 'Electromagnetic Interference (EMI) Shielding'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    activeProjects: 5,
  },
  {
    id: 'lab2',
    name: 'Thin Film & Photovoltaic Devices Lab',
    director: 'Dr. B. Pradeep',
    category: 'Semiconductor Devices',
    shortDesc: 'Development of transparent conducting oxide (TCO) thin films and next-gen thin-film solar cell structures.',
    description: 'Equipped with state-of-the-art physical and chemical vapor deposition systems to deposit nanometer-scale metal oxides, chalcogenides, and perovskite films for light-harvesting and optoelectronics.',
    equipment: ['RF/DC Magnetron Sputtering Unit', 'Thermal Vacuum Evaporator', 'Solar Simulator (Class AAA)', 'UV-Vis-NIR Spectrophotometer'],
    focusAreas: ['Transparent Conductive Oxides', 'Perovskite Solar Cells', 'Heterojunction Diodes'],
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80',
    activeProjects: 4,
  },
  {
    id: 'lab3',
    name: 'Theoretical Cosmology & Gravitation Group',
    director: 'Dr. Titus K. Mathew',
    category: 'Theoretical Physics',
    shortDesc: 'Mathematical modeling of dark energy, cosmological phase transitions, and modified gravity theories.',
    description: 'An active theoretical center analyzing late-time cosmic acceleration, thermodynamic stability of black holes, holographic dark energy models, and quantum gravity phenomenology.',
    equipment: ['High-Performance Computing Cluster (64-Core)', 'Mathematica & Maple Workstations', 'Cosmological Data Analytics Pipeline'],
    focusAreas: ['Accelerating Universe & Dark Energy', 'Thermodynamics of Spacetime', 'Entropic Gravity'],
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&q=80',
    activeProjects: 3,
  },
  {
    id: 'lab4',
    name: 'Photonics & Nonlinear Optics Laboratory',
    director: 'Dr. V. P. N. Nampoori',
    category: 'Optics & Lasers',
    shortDesc: 'Investigating laser-matter interactions, non-linear absorption, photothermal effects, and optical limiters.',
    description: 'Dedicated to experimental optical research including Z-scan optical nonlinearity measurements, laser thermal lens spectroscopy, fiber-optic sensors, and optical waveguide characterization.',
    equipment: ['Nd:YAG Q-Switched Laser (1064nm / 532nm)', 'Z-Scan Optical Setup', 'High-Resolution Monochromator', 'Optical Table Vibration-Isolated'],
    focusAreas: ['Nonlinear Optical Limiting', 'Laser Spectroscopy', 'Photonic Crystal Fiber Sensors'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    activeProjects: 6,
  },
  {
    id: 'lab5',
    name: 'Quantum Condensed Matter & Computational Physics',
    director: 'Dr. Ramesh Babu T.',
    category: 'Condensed Matter Theory',
    shortDesc: 'First-principles electronic structure calculations (DFT) for topological materials and quantum heterostructures.',
    description: 'Combines density functional theory (DFT), tight-binding modeling, and quantum Monte Carlo methods to predict electronic, magnetic, and topological phase transitions in novel materials.',
    equipment: ['Supercomputing Node (128 Cores, NVIDIA A100 GPU)', 'VASP, Quantum ESPRESSO & Wannier90 Software Suite'],
    focusAreas: ['Topological Insulators & Dirac Semimetals', '2D van der Waals Heterostructures', 'Spintronics'],
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
    activeProjects: 4,
  },
  {
    id: 'lab6',
    name: 'Energy Storage & Organic Electronics Lab',
    director: 'Dr. S. Jayalekshmi',
    category: 'Energy Materials',
    shortDesc: 'Synthesis of carbon nanostructures, conducting polymer nanocomposites for supercapacitors and batteries.',
    description: 'Focused on developing environmentally friendly, flexible solid-state electrochemical supercapacitors, high-capacity lithium/sodium battery electrodes, and nanodielectric materials.',
    equipment: ['Electrochemical Workstation (Biologic SP-150)', 'Glove Box System (Ar-filled)', 'Electrospinning Rig for Nanofibers'],
    focusAreas: ['Asymmetric Supercapacitors', 'Conducting Polymer Composites', 'Flexible Energy Harvesters'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    activeProjects: 5,
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

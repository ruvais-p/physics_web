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
  expiryDate?: string | null;
  type: 'scholar';
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  email?: string;
  phone?: string;
  room?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  type?: 'staff';
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
  sortOrder?: number;
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
  date?: string | null;
  externalLink?: string | null;
}

export const COURSES: Course[] = [
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
    sortOrder: 3,
  },
  {
    id: 'c4',
    title: 'M.Tech. in Advanced Materials & Nanotechnology',
    code: 'PHY-MTECH-201',
    level: 'MTech',
    duration: '2 Years (4 Semesters)',
    intake: 18,
    eligibility: 'B.Tech. in Nanotechnology/Material Science or M.Sc. in Physics/Applied Physics with minimum 60% marks and valid GATE score.',
    description: 'An interdisciplinary technological postgraduate programme designed to bridge fundamental condensed matter physics with modern semiconductor fabrication, 2D quantum materials, and industrial nanodevices.',
    highlights: [
      'Hands-on cleanroom semiconductor fabrication experience',
      'Industry internships at leading semiconductor and nano-foundries',
      'Advanced training in electron microscopy and thin-film spectroscopy',
      'Choice of specialized electives in quantum computing hardware & photovoltaics',
    ],
    syllabus: [
      { semester: 'Semester 1', subjects: ['Solid State Devices', 'Nanoscale Physics', 'Synthesis of Advanced Materials', 'Cleanroom Lab I'] },
      { semester: 'Semester 2', subjects: ['Quantum Materials', 'Nanophotonics', 'Characterization Techniques (TEM/AFM/XRD)', 'Advanced Simulation Lab'] },
      { semester: 'Semesters 3 & 4', subjects: ['Industrial Internship', 'M.Tech Research Thesis & Defense'] },
    ],
    fees: '₹25,000 per semester',
    sortOrder: 4,
  },
  {
    id: 'c5',
    title: 'PG Diploma in Scientific Instrumentation & Computational Modeling',
    code: 'PHY-PGD-301',
    level: 'Diploma',
    duration: '1 Year (2 Semesters)',
    intake: 15,
    eligibility: 'Graduate degree in Science or Engineering with Physics / Electronics / Mathematics as core subject with minimum 50% marks.',
    description: 'A career-focused professional programme providing rigorous practical training in high-end analytical equipment operation (XRD, AFM, SEM), lab automation, Python data science, and computational physics simulations.',
    highlights: [
      'Intensive laboratory hands-on training with departmental research facilities',
      'Automation using LabVIEW, Python, and microcontroller interfaces',
      'Certification for laboratory scientific officer and technical manager roles',
      'Collaborative capstone industry project',
    ],
    syllabus: [
      { semester: 'Semester 1', subjects: ['Precision Measurement & Sensors', 'Analytical Spectroscopy', 'Lab Automation with Python & LabVIEW'] },
      { semester: 'Semester 2', subjects: ['Microscopy & Diffraction Analysis', 'Computational Data Analysis', 'Hands-on Instrumentation Capstone Project'] },
    ],
    fees: '₹15,000 total',
    sortOrder: 5,
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

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
  isRetired?: boolean;
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



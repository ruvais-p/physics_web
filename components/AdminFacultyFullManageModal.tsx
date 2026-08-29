'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  KeyRound,
  Globe,
  FileText,
  FlaskConical,
  GraduationCap,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  FileCheck,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bold,
  Italic,
  List as ListIcon,
  Heading,
  Quote as QuoteIcon,
  Code,
  Link as LinkIcon,
  Users,
  UserPlus,
  RefreshCw,
  Download,
  BookOpen
} from 'lucide-react';

interface PredefinedPlatform {
  key: string;
  label: string;
  placeholder: string;
  badgeBg: string;
  badgeText: string;
}

const PREDEFINED_PLATFORMS: PredefinedPlatform[] = [
  {
    key: 'google_scholar',
    label: 'Google Scholar',
    placeholder: 'https://scholar.google.com/citations?user=...',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-400',
  },
  {
    key: 'scopus',
    label: 'Scopus',
    placeholder: 'https://www.scopus.com/authid/detail.uri?authorId=...',
    badgeBg: 'bg-[#FF6C00]/10 border-[#FF6C00]/30',
    badgeText: 'text-[#FF8C33]',
  },
  {
    key: 'orcid',
    label: 'ORCID',
    placeholder: 'https://orcid.org/0000-0000-0000-0000',
    badgeBg: 'bg-[#A6CE39]/10 border-[#A6CE39]/30',
    badgeText: 'text-[#BBE049]',
  },
  {
    key: 'moodle',
    label: 'Moodle',
    placeholder: 'https://moodle.cusat.ac.in/...',
    badgeBg: 'bg-[#F26522]/10 border-[#F26522]/30',
    badgeText: 'text-[#FF7F42]',
  },
  {
    key: 'iqac_profile',
    label: 'IQAC Profile',
    placeholder: 'https://iqac.cusat.ac.in/faculty/...',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeText: 'text-emerald-400',
  },
  {
    key: 'iris',
    label: 'IRIS',
    placeholder: 'https://iris.cusat.ac.in/profile/...',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-300',
  },
  {
    key: 'youtube',
    label: 'YouTube Channel',
    placeholder: 'https://youtube.com/@channel',
    badgeBg: 'bg-red-500/10 border-red-500/30',
    badgeText: 'text-red-400',
  },
  {
    key: 'personal_website',
    label: 'Personal Website',
    placeholder: 'https://www.mywebsite.com',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-400',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    badgeText: 'text-sky-400',
  },
];

interface CustomProfileEntry {
  id: string;
  name: string;
  url: string;
}

interface StudentItem {
  uid: string;
  facultyId: string;
  name: string;
  description: string | null;
  image: string | null;
  createdAt: string;
}

interface ProjectItem {
  id: string;
  facultyId: string;
  title: string;
  description: string | null;
  agency: string | null;
  role: string | null;
  funding: string | null;
  startDate: string | null;
  endDate: string | null;
  externalLink: string | null;
  otherFaculty: string | null;
  status: string | null;
  createdAt: string;
}

interface PublicationItem {
  id: string;
  facultyId: string;
  title: string;
  journal: string | null;
  authors: string | null;
  publicationDate: string | null;
  externalLink: string | null;
  doi: string | null;
  category: string | null;
  description: string | null;
  createdAt: string;
}

interface AdminFacultyFullManageModalProps {
  facultyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onFacultyUpdated: () => void;
}

// Simple Markdown Renderer
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-xs text-slate-500 italic">No description available.</p>;
  }

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={index} className="h-2" />);
      return;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-slate-900 mt-3 mb-1 border-b border-slate-200 pb-1">
          {trimmed.slice(2)}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-base font-bold text-indigo-600 mt-2 mb-1">
          {trimmed.slice(3)}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={index} className="ml-4 list-disc text-xs text-slate-700 my-0.5">
          {trimmed.slice(2)}
        </li>
      );
    } else {
      elements.push(
        <p key={index} className="text-xs text-slate-700 leading-relaxed my-1">
          {trimmed}
        </p>
      );
    }
  });

  return <div className="space-y-1">{elements}</div>;
}

export default function AdminFacultyFullManageModal({
  facultyId,
  isOpen,
  onClose,
  onFacultyUpdated,
}: AdminFacultyFullManageModalProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'profiles' | 'documents' | 'description' | 'students' | 'projects' | 'publications'>('account');
  const [loading, setLoading] = useState(true);

  // Account Info State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [newPredefinedPassword, setNewPredefinedPassword] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);

  // Profiles State
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [platformUrls, setPlatformUrls] = useState<Record<string, string>>({});
  const [otherProfiles, setOtherProfiles] = useState<CustomProfileEntry[]>([]);
  const [savingProfiles, setSavingProfiles] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);
  const [profilesSuccess, setProfilesSuccess] = useState<string | null>(null);

  // Documents State
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [cvPath, setCvPath] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [docSuccess, setDocSuccess] = useState<string | null>(null);

  // Description State
  const [markdownContent, setMarkdownContent] = useState('');
  const [descActiveTab, setDescActiveTab] = useState<'write' | 'preview'>('write');
  const [savingDesc, setSavingDesc] = useState(false);
  const [descError, setDescError] = useState<string | null>(null);
  const [descSuccess, setDescSuccess] = useState<string | null>(null);

  // Guided Students State
  const [studentsList, setStudentsList] = useState<StudentItem[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentDescription, setStudentDescription] = useState('');
  const [selectedStudentImageFile, setSelectedStudentImageFile] = useState<File | null>(null);
  const [studentImagePreviewUrl, setStudentImagePreviewUrl] = useState<string | null>(null);
  const [deleteStudentImageFlag, setDeleteStudentImageFlag] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentSuccess, setStudentSuccess] = useState<string | null>(null);

  // Research Projects State
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [allFacultyList, setAllFacultyList] = useState<{ id: string; name: string }[]>([]);
  const [selectedCoFacultyNames, setSelectedCoFacultyNames] = useState<string[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectAgency, setProjectAgency] = useState('');
  const [projectRole, setProjectRole] = useState('Principal Investigator');
  const [projectFunding, setProjectFunding] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [projectExternalLink, setProjectExternalLink] = useState('');
  const [projectOtherFaculty, setProjectOtherFaculty] = useState('');
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectSuccess, setProjectSuccess] = useState<string | null>(null);

  // Publications State
  const [publicationsList, setPublicationsList] = useState<PublicationItem[]>([]);
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<PublicationItem | null>(null);
  const [publicationTitle, setPublicationTitle] = useState('');
  const [publicationJournal, setPublicationJournal] = useState('');
  const [publicationAuthors, setPublicationAuthors] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [publicationExternalLink, setPublicationExternalLink] = useState('');
  const [publicationDoi, setPublicationDoi] = useState('');
  const [publicationCategory, setPublicationCategory] = useState('Journal Article');
  const [publicationDescription, setPublicationDescription] = useState('');
  const [savingPublication, setSavingPublication] = useState(false);
  const [publicationError, setPublicationError] = useState<string | null>(null);
  const [publicationSuccess, setPublicationSuccess] = useState<string | null>(null);

  // Load Faculty Record
  const fetchFacultyFullData = async () => {
    if (!facultyId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}`);
      if (!res.ok) throw new Error('Failed to load faculty record.');
      const data = await res.json();

      setName(data.name || '');
      setEmail(data.email || '');
      setDesignation(data.designation || 'Faculty Member');
      setDepartment(data.department || 'Department of Physics');
      setPhone(data.phone || data.profile?.phone || '');
      setIsActive(data.isActive);
      setNewPredefinedPassword('');

      // Profiles
      const profs = data.profile?.profiles || {};
      const sel = new Set<string>();
      const urls: Record<string, string> = {};

      PREDEFINED_PLATFORMS.forEach((p) => {
        if (profs[p.key]) {
          sel.add(p.key);
          urls[p.key] = profs[p.key];
        }
      });

      setSelectedPlatforms(sel);
      setPlatformUrls(urls);

      if (Array.isArray(profs.other)) {
        setOtherProfiles(
          profs.other.map((item: any, idx: number) => ({
            id: `custom_${idx}_${Date.now()}`,
            name: item.name || '',
            url: item.url || '',
          }))
        );
      } else {
        setOtherProfiles([]);
      }

      // Documents
      setImagePath(data.documents?.image || null);
      setCvPath(data.documents?.cv || null);

      // Description
      setMarkdownContent(data.descriptionRecord?.description || '');

      // Students
      setStudentsList(data.students || []);

      // Projects
      setProjectsList(data.projects || []);

      // Publications
      setPublicationsList(data.publications || []);
    } catch (err: any) {
      console.error('Error fetching faculty details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && facultyId) {
      fetchFacultyFullData();
    }
  }, [isOpen, facultyId]);

  useEffect(() => {
    const fetchAllFaculty = async () => {
      try {
        const res = await fetch('/api/public/faculty');
        if (res.ok) {
          const data = await res.json();
          setAllFacultyList(data.map((f: any) => ({ id: f.id, name: f.name })));
        }
      } catch (err) {
        console.error('Failed to fetch faculty list:', err);
      }
    };
    fetchAllFaculty();
  }, []);

  if (!isOpen || !facultyId) return null;

  // Handlers for Account Save
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setAccountSuccess(null);
    setSavingAccount(true);

    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          designation,
          department,
          phone,
          isActive,
          newPredefinedPassword: newPredefinedPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update account details.');

      setAccountSuccess('Account information updated successfully!');
      onFacultyUpdated();
      setTimeout(() => setAccountSuccess(null), 2500);
    } catch (err: any) {
      setAccountError(err.message || 'An error occurred.');
    } finally {
      setSavingAccount(false);
    }
  };

  // Handlers for Profiles Save
  const togglePlatform = (key: string) => {
    const next = new Set(selectedPlatforms);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedPlatforms(next);
  };

  const handleSaveProfiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilesError(null);
    setProfilesSuccess(null);
    setSavingProfiles(true);

    try {
      const profilesPayload: Record<string, any> = {};
      selectedPlatforms.forEach((key) => {
        const urlVal = (platformUrls[key] || '').trim();
        if (urlVal) profilesPayload[key] = urlVal;
      });

      const validOther = otherProfiles
        .map((op) => ({ name: op.name.trim(), url: op.url.trim() }))
        .filter((op) => op.name && op.url);

      if (validOther.length > 0) profilesPayload.other = validOther;

      const res = await fetch(`/api/admin/faculty/${facultyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          profiles: profilesPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profiles.');

      setProfilesSuccess('Academic and public profile links saved successfully!');
      onFacultyUpdated();
      setTimeout(() => setProfilesSuccess(null), 2500);
    } catch (err: any) {
      setProfilesError(err.message || 'An error occurred.');
    } finally {
      setSavingProfiles(false);
    }
  };

  // Document Upload Handlers
  const handleSaveDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocError(null);
    setDocSuccess(null);

    if (!selectedImageFile && !selectedCvFile) {
      setDocError('Please select a profile photo or CV file to upload.');
      return;
    }

    setUploadingDocs(true);

    try {
      const formData = new FormData();
      if (selectedImageFile) formData.append('image', selectedImageFile);
      if (selectedCvFile) formData.append('cv', selectedCvFile);

      const res = await fetch(`/api/admin/faculty/${facultyId}/documents`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload documents.');

      setImagePath(data.image || imagePath);
      setCvPath(data.cv || cvPath);
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setSelectedCvFile(null);

      setDocSuccess('Faculty documents uploaded successfully!');
      onFacultyUpdated();
      setTimeout(() => setDocSuccess(null), 2500);
    } catch (err: any) {
      setDocError(err.message || 'Upload failed.');
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleDeleteDocument = async (type: 'image' | 'cv') => {
    if (!confirm(`Are you sure you want to delete this ${type === 'image' ? 'photo' : 'CV PDF'}?`)) return;

    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}/documents?type=${type}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (type === 'image') setImagePath(null);
        else setCvPath(null);
        setDocSuccess(`Deleted ${type === 'image' ? 'profile photo' : 'CV document'}.`);
        onFacultyUpdated();
        setTimeout(() => setDocSuccess(null), 2500);
      }
    } catch {
      setDocError('Failed to delete document.');
    }
  };

  // Description Save Handler
  const handleSaveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setDescError(null);
    setDescSuccess(null);
    setSavingDesc(true);

    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: markdownContent }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save description.');

      setDescSuccess('Professional description updated successfully!');
      onFacultyUpdated();
      setTimeout(() => setDescSuccess(null), 2500);
    } catch (err: any) {
      setDescError(err.message || 'An error occurred.');
    } finally {
      setSavingDesc(false);
    }
  };

  // Guided Students Modal & Actions
  const openStudentModal = (student?: StudentItem) => {
    setStudentError(null);
    setStudentSuccess(null);
    if (student) {
      setEditingStudent(student);
      setStudentName(student.name);
      setStudentDescription(student.description || '');
      setSelectedStudentImageFile(null);
      setStudentImagePreviewUrl(student.image || null);
      setDeleteStudentImageFlag(false);
    } else {
      setEditingStudent(null);
      setStudentName('');
      setStudentDescription('');
      setSelectedStudentImageFile(null);
      setStudentImagePreviewUrl(null);
      setDeleteStudentImageFlag(false);
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    setStudentSuccess(null);

    if (!studentName.trim()) {
      setStudentError('Student name is required.');
      return;
    }

    setSavingStudent(true);

    try {
      const formData = new FormData();
      formData.append('name', studentName.trim());
      formData.append('description', studentDescription.trim());
      if (selectedStudentImageFile) formData.append('image', selectedStudentImageFile);
      if (deleteStudentImageFlag) formData.append('deleteImage', 'true');

      const url = editingStudent
        ? `/api/admin/faculty/${facultyId}/students/${editingStudent.uid}`
        : `/api/admin/faculty/${facultyId}/students`;
      const method = editingStudent ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save student record.');

      await fetchFacultyFullData();
      setIsStudentModalOpen(false);
      setStudentSuccess(editingStudent ? 'Student updated!' : 'Student added!');
      onFacultyUpdated();
      setTimeout(() => setStudentSuccess(null), 2500);
    } catch (err: any) {
      setStudentError(err.message || 'Failed to save student.');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}/students/${studentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchFacultyFullData();
        onFacultyUpdated();
      }
    } catch {
      console.error('Failed to delete student.');
    }
  };

  // Research Projects Modal & Actions
  const openProjectModal = (project?: ProjectItem) => {
    setProjectError(null);
    setProjectSuccess(null);
    if (project) {
      setEditingProject(project);
      setProjectTitle(project.title);
      setProjectDescription(project.description || '');
      setProjectAgency(project.agency || '');
      setProjectRole(project.role || 'Principal Investigator');
      setProjectFunding(project.funding || '');
      setProjectStartDate(project.startDate ? project.startDate.split('T')[0] : '');
      setProjectEndDate(project.endDate ? project.endDate.split('T')[0] : '');
      setProjectExternalLink(project.externalLink || '');

      if (project.otherFaculty) {
        const parts = project.otherFaculty.split(',').map((s) => s.trim()).filter(Boolean);
        const registeredNames = allFacultyList.map((f) => f.name);
        const selectedReg = parts.filter((p) => registeredNames.includes(p));
        const customParts = parts.filter((p) => !registeredNames.includes(p));

        setSelectedCoFacultyNames(selectedReg);
        setProjectOtherFaculty(customParts.join(', '));
      } else {
        setSelectedCoFacultyNames([]);
        setProjectOtherFaculty('');
      }
    } else {
      setEditingProject(null);
      setProjectTitle('');
      setProjectDescription('');
      setProjectAgency('');
      setProjectRole('Principal Investigator');
      setProjectFunding('');
      setProjectStartDate('');
      setProjectEndDate('');
      setProjectExternalLink('');
      setProjectOtherFaculty('');
      setSelectedCoFacultyNames([]);
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError(null);
    setProjectSuccess(null);

    if (!projectTitle.trim()) {
      setProjectError('Project Title is required.');
      return;
    }

    setSavingProject(true);

    try {
      const customNames = projectOtherFaculty.split(',').map((s) => s.trim()).filter(Boolean);
      const combinedOtherFaculty = Array.from(
        new Set([...selectedCoFacultyNames, ...customNames])
      ).join(', ');

      const payload = {
        title: projectTitle.trim(),
        description: projectDescription.trim() || undefined,
        agency: projectAgency.trim() || undefined,
        role: projectRole.trim() || 'Principal Investigator',
        funding: projectFunding.trim() || undefined,
        startDate: projectStartDate || undefined,
        endDate: projectEndDate || undefined,
        externalLink: projectExternalLink.trim() || undefined,
        otherFaculty: combinedOtherFaculty || undefined,
      };

      const url = editingProject
        ? `/api/admin/faculty/${facultyId}/projects/${editingProject.id}`
        : `/api/admin/faculty/${facultyId}/projects`;
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project record.');

      await fetchFacultyFullData();
      setIsProjectModalOpen(false);
      setProjectSuccess(editingProject ? 'Research project updated!' : 'Research project added!');
      onFacultyUpdated();
      setTimeout(() => setProjectSuccess(null), 2500);
    } catch (err: any) {
      setProjectError(err.message || 'Failed to save research project.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this research project?')) return;
    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchFacultyFullData();
        onFacultyUpdated();
      }
    } catch {
      console.error('Failed to delete research project.');
    }
  };

  const openAddPublicationModal = () => {
    setEditingPublication(null);
    setPublicationTitle('');
    setPublicationJournal('');
    setPublicationAuthors('');
    setPublicationDate('');
    setPublicationExternalLink('');
    setPublicationDoi('');
    setPublicationCategory('Journal Article');
    setPublicationDescription('');
    setPublicationError(null);
    setIsPublicationModalOpen(true);
  };

  const openEditPublicationModal = (pub: PublicationItem) => {
    setEditingPublication(pub);
    setPublicationTitle(pub.title || '');
    setPublicationJournal(pub.journal || '');
    setPublicationAuthors(pub.authors || '');
    setPublicationDate(pub.publicationDate ? pub.publicationDate.slice(0, 10) : '');
    setPublicationExternalLink(pub.externalLink || '');
    setPublicationDoi(pub.doi || '');
    setPublicationCategory(pub.category || 'Journal Article');
    setPublicationDescription(pub.description || '');
    setPublicationError(null);
    setIsPublicationModalOpen(true);
  };

  const handleSavePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublicationError(null);
    setPublicationSuccess(null);

    if (!publicationTitle.trim()) {
      setPublicationError('Publication Title is required.');
      return;
    }

    setSavingPublication(true);

    try {
      const payload = {
        title: publicationTitle.trim(),
        journal: publicationJournal.trim() || undefined,
        authors: publicationAuthors.trim() || undefined,
        publicationDate: publicationDate || undefined,
        externalLink: publicationExternalLink.trim() || undefined,
        doi: publicationDoi.trim() || undefined,
        category: publicationCategory.trim() || 'Journal Article',
        description: publicationDescription.trim() || undefined,
      };

      const url = editingPublication
        ? `/api/admin/faculty/${facultyId}/publications/${editingPublication.id}`
        : `/api/admin/faculty/${facultyId}/publications`;
      const method = editingPublication ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save publication.');

      await fetchFacultyFullData();
      setIsPublicationModalOpen(false);
      setPublicationSuccess(editingPublication ? 'Publication updated!' : 'Publication added!');
      onFacultyUpdated();
      setTimeout(() => setPublicationSuccess(null), 2500);
    } catch (err: any) {
      setPublicationError(err.message || 'Failed to save publication.');
    } finally {
      setSavingPublication(false);
    }
  };

  const handleDeletePublication = async (pubId: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      const res = await fetch(`/api/admin/faculty/${facultyId}/publications/${pubId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchFacultyFullData();
        onFacultyUpdated();
      }
    } catch {
      console.error('Failed to delete publication.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#faf7f2] border border-[#e8e2d5] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                <span>Manage Faculty Profile: {name || 'Faculty Member'}</span>
              </h2>
              <p className="text-xs text-indigo-600 font-mono font-medium">{email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'account'
                ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Details</span>
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profiles'
                ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Academic Links</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'documents'
                ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Photo & CV</span>
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'description'
                ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Markdown Bio</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'students'
                ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Guided Students ({studentsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'projects'
                ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Research Projects ({projectsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('publications')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'publications'
                ? 'border-indigo-600 bg-white text-indigo-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Publications ({publicationsList.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading complete faculty details...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: ACCOUNT DETAILS */}
              {activeTab === 'account' && (
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  {accountError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{accountError}</span>
                    </div>
                  )}
                  {accountSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{accountSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address (Username)
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Designation / Title
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Professor & Head"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Account Access Status
                      </label>
                      <div className="flex items-center h-10">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          <span className="ml-3 text-xs font-medium text-slate-700">
                            {isActive ? 'Active Login Access' : 'Account Deactivated'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-700">
                      Reset Password (Admin Override)
                    </label>
                    <input
                      type="password"
                      minLength={6}
                      value={newPredefinedPassword}
                      onChange={(e) => setNewPredefinedPassword(e.target.value)}
                      placeholder="Enter new password (leave blank to keep current)"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingAccount}
                      className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all"
                    >
                      {savingAccount ? 'Saving...' : 'Save Account Details'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: ACADEMIC & PUBLIC PROFILES */}
              {activeTab === 'profiles' && (
                <form onSubmit={handleSaveProfiles} className="space-y-4">
                  {profilesError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{profilesError}</span>
                    </div>
                  )}
                  {profilesSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{profilesSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PREDEFINED_PLATFORMS.map((platform) => {
                      const isSelected = selectedPlatforms.has(platform.key);
                      return (
                        <div
                          key={platform.key}
                          className={`p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-indigo-50/50 border-indigo-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <label className="flex items-center gap-2 cursor-pointer mb-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePlatform(platform.key)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${platform.badgeBg} ${platform.badgeText}`}>
                              {platform.label}
                            </span>
                          </label>
                          {isSelected && (
                            <input
                              type="url"
                              value={platformUrls[platform.key] || ''}
                              onChange={(e) =>
                                setPlatformUrls({ ...platformUrls, [platform.key]: e.target.value })
                              }
                              placeholder={platform.placeholder}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Profiles */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase text-slate-700">Custom Profile Links</h4>
                      <button
                        type="button"
                        onClick={() =>
                          setOtherProfiles([
                            ...otherProfiles,
                            { id: `custom_${Date.now()}`, name: '', url: '' },
                          ])
                        }
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Custom Link</span>
                      </button>
                    </div>

                    {otherProfiles.map((op) => (
                      <div key={op.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Platform / Link Title"
                          value={op.name}
                          onChange={(e) =>
                             setOtherProfiles(
                               otherProfiles.map((item) =>
                                 item.id === op.id ? { ...item, name: e.target.value } : item
                               )
                             )
                          }
                          className="w-1/3 p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={op.url}
                          onChange={(e) =>
                             setOtherProfiles(
                               otherProfiles.map((item) =>
                                 item.id === op.id ? { ...item, url: e.target.value } : item
                               )
                             )
                          }
                          className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setOtherProfiles(otherProfiles.filter((item) => item.id !== op.id))}
                          className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfiles}
                      className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all"
                    >
                      {savingProfiles ? 'Saving...' : 'Save Profile Links'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: DOCUMENTS & MEDIA */}
              {activeTab === 'documents' && (
                <form onSubmit={handleSaveDocuments} className="space-y-6">
                  {docError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{docError}</span>
                    </div>
                  )}
                  {docSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{docSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Photo */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <h4 className="text-xs font-semibold uppercase text-slate-700">Profile Photo</h4>

                      {imagePreviewUrl || imagePath ? (
                        <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-indigo-500/40 shadow-lg">
                          <img
                            src={imagePreviewUrl || imagePath!}
                            alt="Faculty Profile"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument('image')}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all shadow cursor-pointer"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 mx-auto rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                          <User className="w-8 h-8 mb-1" />
                          <span className="text-[10px]">No Photo</span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImageFile(file);
                            setImagePreviewUrl(URL.createObjectURL(file));
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>

                    {/* CV PDF */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <h4 className="text-xs font-semibold uppercase text-slate-700">Curriculum Vitae (CV) PDF</h4>

                      {cvPath ? (
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <span className="text-xs text-indigo-950 font-medium">CV Document Uploaded</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={cvPath}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg text-xs flex items-center gap-1 font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument('cv')}
                              className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-400">
                          <FileText className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-xs">No CV PDF Uploaded</span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSelectedCvFile(file);
                        }}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={uploadingDocs}
                      className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all"
                    >
                      {uploadingDocs ? 'Uploading...' : 'Save Selected Documents'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: MARKDOWN DESCRIPTION */}
              {activeTab === 'description' && (
                <form onSubmit={handleSaveDescription} className="space-y-4">
                  {descError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{descError}</span>
                    </div>
                  )}
                  {descSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{descSuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setDescActiveTab('write')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          descActiveTab === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Write Markdown
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescActiveTab('preview')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          descActiveTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Preview Output
                      </button>
                    </div>
                  </div>

                  {descActiveTab === 'write' ? (
                    <textarea
                      rows={12}
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      placeholder="# About Me&#10;Write detailed faculty description using markdown..."
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl min-h-[250px]">
                      {renderMarkdown(markdownContent)}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingDesc}
                      className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all"
                    >
                      {savingDesc ? 'Saving...' : 'Save Description'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: GUIDED STUDENTS */}
              {activeTab === 'students' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase text-slate-700">Guided Scholars & Students</h4>
                    <button
                      type="button"
                      onClick={() => openStudentModal()}
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Student Record</span>
                    </button>
                  </div>

                  {studentsList.length === 0 ? (
                    <div className="p-8 border border-slate-200 rounded-2xl text-center text-slate-400 space-y-2">
                      <GraduationCap className="w-8 h-8 mx-auto opacity-50" />
                      <p className="text-xs font-medium">No guided students recorded for this faculty member.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studentsList.map((st) => (
                        <div
                          key={st.uid}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {st.image ? (
                              <img src={st.image} alt={st.name} className="w-10 h-10 rounded-full object-cover border border-indigo-500/40" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-slate-900">{st.name}</div>
                              {st.description && (
                                <div className="text-[11px] text-slate-500 line-clamp-1">{st.description}</div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openStudentModal(st)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.uid)}
                              className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: RESEARCH PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase text-slate-700">Research & Sponsored Projects</h4>
                    <button
                      type="button"
                      onClick={() => openProjectModal()}
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Research Project</span>
                    </button>
                  </div>

                  {projectsList.length === 0 ? (
                    <div className="p-8 border border-slate-200 rounded-2xl text-center text-slate-400 space-y-2">
                      <FlaskConical className="w-8 h-8 mx-auto opacity-50" />
                      <p className="text-xs font-medium">No research projects recorded for this faculty member.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projectsList.map((pj) => (
                        <div
                          key={pj.id}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-slate-900">{pj.title}</span>
                                {pj.status === 'Ongoing' ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    Ongoing
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                    Completed
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                                {pj.role && <span className="font-semibold text-indigo-700">{pj.role}</span>}
                                {pj.agency && <span>Agency: <strong className="text-slate-800">{pj.agency}</strong></span>}
                                {pj.funding && <span>Grant: <strong className="text-slate-800">{pj.funding}</strong></span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {pj.externalLink && (
                                <a
                                  href={pj.externalLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                                  title="External Project Link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => openProjectModal(pj)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                                title="Edit Project"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(pj.id)}
                                className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {pj.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{pj.description}</p>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 flex-wrap gap-2">
                            <div>
                              {pj.startDate || pj.endDate ? (
                                <span>
                                  Duration: {pj.startDate ? new Date(pj.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} - {pj.endDate ? new Date(pj.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                                </span>
                              ) : null}
                            </div>
                            {pj.otherFaculty && (
                              <span>Collaborators: <strong className="text-slate-700">{pj.otherFaculty}</strong></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: PUBLICATIONS */}
              {activeTab === 'publications' && (
                <div className="space-y-4">
                  {publicationSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{publicationSuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-serif">Publications & Research Papers</h3>
                      <p className="text-xs text-slate-500 font-sans">
                        Manage journal articles, conference papers, and publication records for this faculty member.
                      </p>
                    </div>
                    <button
                      onClick={openAddPublicationModal}
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Publication</span>
                    </button>
                  </div>

                  {publicationsList.length === 0 ? (
                    <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs italic">
                      No publications added yet for this faculty member. Click "Add Publication" to create one.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {publicationsList.map((pub: any) => (
                        <div
                          key={pub.id}
                          className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start justify-between gap-4 shadow-xs"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {pub.category || 'Journal Article'}
                              </span>
                              {pub.publicationDate && (
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {new Date(pub.publicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">{pub.title}</h4>
                            {pub.authors && (
                              <p className="text-xs text-slate-600 font-medium">
                                <span className="font-semibold text-slate-700">Authors:</span> {pub.authors}
                              </p>
                            )}
                            {pub.journal && (
                              <p className="text-xs text-slate-500 italic font-serif">{pub.journal}</p>
                            )}
                            {pub.externalLink && (
                              <a
                                href={pub.externalLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-semibold"
                              >
                                <span>Link / DOI</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => openEditPublicationModal(pub)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
                              title="Edit Publication"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePublication(pub.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              title="Delete Publication"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Nested Add/Edit Student Popup Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#faf7f2] border border-[#e8e2d5] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingStudent ? 'Edit Student Record' : 'Add Guided Student'}
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {studentError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {studentError}
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ananya Nair"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Research Description / Thesis</label>
                <textarea
                  rows={3}
                  value={studentDescription}
                  onChange={(e) => setStudentDescription(e.target.value)}
                  placeholder="e.g. Ph.D. Scholar working on Quantum Photonics..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Photo</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedStudentImageFile(file);
                      setStudentImagePreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="py-2 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStudent}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                >
                  {savingStudent ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Nested Add/Edit Research Project Popup Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#faf7f2] border border-[#e8e2d5] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProject ? 'Edit Research Project' : 'Add Research Project'}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {projectError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {projectError}
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Investigation of High-Tc Superconductors"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={projectRole}
                    onChange={(e) => setProjectRole(e.target.value)}
                    placeholder="e.g. Principal Investigator"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Funding Agency</label>
                  <input
                    type="text"
                    value={projectAgency}
                    onChange={(e) => setProjectAgency(e.target.value)}
                    placeholder="e.g. DST-SERB, ISRO, CSIR"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Funding Amount / Grant</label>
                  <input
                    type="text"
                    value={projectFunding}
                    onChange={(e) => setProjectFunding(e.target.value)}
                    placeholder="e.g. ₹45,00,000"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">External Link / URL</label>
                  <input
                    type="url"
                    value={projectExternalLink}
                    onChange={(e) => setProjectExternalLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={projectStartDate}
                    onChange={(e) => setProjectStartDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={projectEndDate}
                    onChange={(e) => setProjectEndDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Other Faculty Collaborators</label>
                
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-500 font-sans font-semibold">Select Registered Department Faculty:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    {(() => {
                      const availableCoFaculty = allFacultyList.filter(
                        (fac) => fac.id !== facultyId && fac.name?.toLowerCase() !== name?.toLowerCase()
                      );
                      if (availableCoFaculty.length === 0) {
                        return <span className="text-xs text-slate-400 italic font-sans">No other registered faculty records found</span>;
                      }
                      return availableCoFaculty.map((fac) => {
                        const isSelected = selectedCoFacultyNames.includes(fac.name);
                        return (
                          <button
                            key={fac.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedCoFacultyNames(selectedCoFacultyNames.filter((n) => n !== fac.name));
                              } else {
                                setSelectedCoFacultyNames([...selectedCoFacultyNames, fac.name]);
                              }
                            }}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            <span>{fac.name}</span>
                            {isSelected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {selectedCoFacultyNames.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-600">Selected:</span>
                    {selectedCoFacultyNames.map((collabName) => (
                      <span
                        key={collabName}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-full"
                      >
                        <span>{collabName}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedCoFacultyNames(selectedCoFacultyNames.filter((n) => n !== collabName))}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 font-sans">Additional / External Collaborators (Optional):</span>
                  <input
                    type="text"
                    value={projectOtherFaculty}
                    onChange={(e) => setProjectOtherFaculty(e.target.value)}
                    placeholder="e.g. Dr. A. Kumar (IISc), Prof. B. Sharma (IIT M)"
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Summary of research objectives, methodologies, and outcomes..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="py-2 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                >
                  {savingProject ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nested Add/Edit Publication Popup Modal */}
      {isPublicationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#faf7f2] border border-[#e8e2d5] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPublication ? 'Edit Publication' : 'Add Publication'}
              </h3>
              <button onClick={() => setIsPublicationModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {publicationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {publicationError}
              </div>
            )}

            <form onSubmit={handleSavePublication} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Title *</label>
                <input
                  type="text"
                  required
                  value={publicationTitle}
                  onChange={(e) => setPublicationTitle(e.target.value)}
                  placeholder="e.g. Quantum Transport in Nanostructure Arrays"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Journal / Publisher / Venue</label>
                <input
                  type="text"
                  value={publicationJournal}
                  onChange={(e) => setPublicationJournal(e.target.value)}
                  placeholder="e.g. Physical Review B, ACS Nano, Springer"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Authors</label>
                <input
                  type="text"
                  value={publicationAuthors}
                  onChange={(e) => setPublicationAuthors(e.target.value)}
                  placeholder="e.g. A. Sharma, B. Ray, C. Kumar"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={publicationCategory}
                    onChange={(e) => setPublicationCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Journal Article">Journal Article</option>
                    <option value="Conference Paper">Conference Paper</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Preprint">Preprint</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">External Link / URL</label>
                  <input
                    type="url"
                    value={publicationExternalLink}
                    onChange={(e) => setPublicationExternalLink(e.target.value)}
                    placeholder="https://doi.org/..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DOI Number</label>
                  <input
                    type="text"
                    value={publicationDoi}
                    onChange={(e) => setPublicationDoi(e.target.value)}
                    placeholder="10.1016/j.physletb..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Abstract / Brief Summary</label>
                <textarea
                  rows={3}
                  value={publicationDescription}
                  onChange={(e) => setPublicationDescription(e.target.value)}
                  placeholder="Brief notes or abstract summary..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPublicationModalOpen(false)}
                  className="py-2 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPublication}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                >
                  {savingPublication ? 'Saving...' : 'Save Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

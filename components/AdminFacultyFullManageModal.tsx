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
  Download
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
        <h2 key={index} className="text-lg font-bold text-white mt-3 mb-1 border-b border-slate-700 pb-1">
          {trimmed.slice(2)}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-base font-bold text-indigo-300 mt-2 mb-1">
          {trimmed.slice(3)}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={index} className="ml-4 list-disc text-xs text-slate-300 my-0.5">
          {trimmed.slice(2)}
        </li>
      );
    } else {
      elements.push(
        <p key={index} className="text-xs text-slate-300 leading-relaxed my-1">
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
  const [activeTab, setActiveTab] = useState<'account' | 'profiles' | 'documents' | 'description' | 'students'>('account');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#002147] border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/80 bg-[#00142D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                <span>Manage Faculty Profile: {name || 'Faculty Member'}</span>
              </h2>
              <p className="text-xs text-indigo-300 font-mono">{email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-[#00142D]/60 border-b border-slate-700/60 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'account'
                ? 'border-indigo-500 bg-[#002147] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Details</span>
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profiles'
                ? 'border-indigo-500 bg-[#002147] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Academic Links</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-indigo-500 bg-[#002147] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Photo & CV</span>
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'description'
                ? 'border-indigo-500 bg-[#002147] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Markdown Bio</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'border-indigo-500 bg-[#002147] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Guided Students ({studentsList.length})</span>
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
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Email Address (Username)
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Designation / Title
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Professor & Head"
                        className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
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
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          <span className="ml-3 text-xs font-medium text-slate-300">
                            {isActive ? 'Active Login Access' : 'Account Deactivated'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300">
                      Reset Password (Admin Override)
                    </label>
                    <input
                      type="password"
                      minLength={6}
                      value={newPredefinedPassword}
                      onChange={(e) => setNewPredefinedPassword(e.target.value)}
                      placeholder="Enter new password (leave blank to keep current)"
                      className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-sm font-mono"
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
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{profilesError}</span>
                    </div>
                  )}
                  {profilesSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
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
                              ? 'bg-slate-800/80 border-indigo-500/60'
                              : 'bg-slate-900/40 border-slate-800'
                          }`}
                        >
                          <label className="flex items-center gap-2 cursor-pointer mb-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePlatform(platform.key)}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
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
                              className="w-full p-2 bg-[#00142D] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Profiles */}
                  <div className="pt-4 border-t border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase text-slate-300">Custom Profile Links</h4>
                      <button
                        type="button"
                        onClick={() =>
                          setOtherProfiles([
                            ...otherProfiles,
                            { id: `custom_${Date.now()}`, name: '', url: '' },
                          ])
                        }
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
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
                          className="w-1/3 p-2 bg-[#00142D] border border-slate-700 rounded-lg text-xs text-white"
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
                          className="flex-1 p-2 bg-[#00142D] border border-slate-700 rounded-lg text-xs text-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setOtherProfiles(otherProfiles.filter((item) => item.id !== op.id))}
                          className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"
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
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{docError}</span>
                    </div>
                  )}
                  {docSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{docSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Photo */}
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                      <h4 className="text-xs font-semibold uppercase text-slate-300">Profile Photo</h4>

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
                            className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-500 transition-all shadow"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 mx-auto rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
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
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 cursor-pointer"
                      />
                    </div>

                    {/* CV PDF */}
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                      <h4 className="text-xs font-semibold uppercase text-slate-300">Curriculum Vitae (CV) PDF</h4>

                      {cvPath ? (
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            <span className="text-xs text-indigo-200 font-medium">CV Document Uploaded</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={cvPath}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-indigo-300 hover:text-white bg-indigo-500/20 rounded-lg text-xs flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument('cv')}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 border-2 border-dashed border-slate-700 rounded-xl text-center text-slate-500">
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
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 cursor-pointer"
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
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{descError}</span>
                    </div>
                  )}
                  {descSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{descSuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <div className="flex items-center bg-slate-900 p-1 rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setDescActiveTab('write')}
                        className={`px-3 py-1 rounded-lg ${
                          descActiveTab === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        Write Markdown
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescActiveTab('preview')}
                        className={`px-3 py-1 rounded-lg ${
                          descActiveTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'
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
                      className="w-full p-4 bg-[#00142D] border border-slate-700 rounded-xl text-white text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="p-4 bg-[#00142D] border border-slate-700 rounded-xl min-h-[250px]">
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
                    <h4 className="text-xs font-semibold uppercase text-slate-300">Guided Scholars & Students</h4>
                    <button
                      type="button"
                      onClick={() => openStudentModal()}
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Student Record</span>
                    </button>
                  </div>

                  {studentsList.length === 0 ? (
                    <div className="p-8 border border-slate-800 rounded-2xl text-center text-slate-500 space-y-2">
                      <GraduationCap className="w-8 h-8 mx-auto opacity-50" />
                      <p className="text-xs font-medium">No guided students recorded for this faculty member.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studentsList.map((st) => (
                        <div
                          key={st.uid}
                          className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {st.image ? (
                              <img src={st.image} alt={st.name} className="w-10 h-10 rounded-full object-cover border border-indigo-500/40" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-white">{st.name}</div>
                              {st.description && (
                                <div className="text-[11px] text-slate-400 line-clamp-1">{st.description}</div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openStudentModal(st)}
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.uid)}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"
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
            </>
          )}
        </div>
      </div>

      {/* Nested Add/Edit Student Popup Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#002147] border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingStudent ? 'Edit Student Record' : 'Add Guided Student'}
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {studentError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {studentError}
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ananya Nair"
                  className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Research Description / Thesis</label>
                <textarea
                  rows={3}
                  value={studentDescription}
                  onChange={(e) => setStudentDescription(e.target.value)}
                  placeholder="e.g. Ph.D. Scholar working on Quantum Photonics..."
                  className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Photo</label>
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
                  className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:text-indigo-300 cursor-pointer"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="py-2 px-3 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStudent}
                  className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow"
                >
                  {savingStudent ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

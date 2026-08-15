'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Atom,
  LogOut,
  UserCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  FlaskConical,
  GraduationCap,
  Phone,
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Share2,
  Sparkles,
  Upload,
  FileCheck,
  FilePlus,
  Image as ImageIcon,
  Download,
  Eye,
  RefreshCw,
  User,
  Heading,
  Bold,
  Italic,
  List,
  Quote as QuoteIcon,
  Code,
  Link as LinkIcon,
  Users,
  UserPlus
} from 'lucide-react';

interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
}

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

// Markdown Parser Helper Function
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-xs text-slate-500 italic">No professional description added yet.</p>;
  }

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul_${elements.length}`} className="list-disc ml-5 space-y-1.5 my-2 text-xs text-slate-300">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol_${elements.length}`} className="list-decimal ml-5 space-y-1.5 my-2 text-xs text-slate-300">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    flushList();

    if (!trimmed) {
      elements.push(<div key={`br_${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-xl font-bold font-serif text-white mt-4 mb-2 border-b border-slate-700/60 pb-1">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-lg font-bold font-serif text-indigo-300 mt-3 mb-1.5">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mt-2.5 mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-2 border-indigo-400 pl-3 py-1.5 text-slate-300 italic text-xs my-2 bg-indigo-500/10 rounded-r-lg">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={index} className="text-xs text-slate-300 leading-relaxed my-1">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <div className="space-y-1 font-sans">{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining) {
    const linkMatch = remaining.match(/^([\s\S]*?)\[([^\]]+)\]\(([^)]+)\)([\s\S]*)$/);
    if (linkMatch) {
      const [, before, label, url, after] = linkMatch;
      if (before) parts.push(parseFormatting(before, keyIdx++));
      parts.push(
        <a key={keyIdx++} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5">
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      );
      remaining = after;
      continue;
    }

    parts.push(parseFormatting(remaining, keyIdx++));
    break;
  }

  return parts;
}

function parseFormatting(text: string, keyPrefix: number): React.ReactNode {
  const elements: React.ReactNode[] = [];
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      elements.push(<strong key={`${keyPrefix}_b_${match.index}`} className="font-bold text-white">{match[2]}</strong>);
    } else if (match[3]) {
      elements.push(<em key={`${keyPrefix}_i_${match.index}`} className="italic text-slate-200">{match[4]}</em>);
    } else if (match[5]) {
      elements.push(<code key={`${keyPrefix}_c_${match.index}`} className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono text-[11px]">{match[6]}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 ? elements[0] : <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

export default function FacultyDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Contact & Public Profiles State
  const [phone, setPhone] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [platformUrls, setPlatformUrls] = useState<Record<string, string>>({});
  const [otherProfiles, setOtherProfiles] = useState<CustomProfileEntry[]>([]);
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);
  const [savingProfiles, setSavingProfiles] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);
  const [profilesSuccess, setProfilesSuccess] = useState<string | null>(null);

  // Documents & Media State
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [cvPath, setCvPath] = useState<string | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [docSuccess, setDocSuccess] = useState<string | null>(null);

  // Professional Description (Markdown) State
  const [markdownContent, setMarkdownContent] = useState('');
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
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

  // Fetch Faculty Profile, Public Profiles, Documents, Description & Guided Students
  const fetchProfileData = async () => {
    try {
      const [meRes, profileRes, docRes, descRes, studentsRes] = await Promise.all([
        fetch('/api/faculty/me'),
        fetch('/api/faculty/profile'),
        fetch('/api/faculty/documents'),
        fetch('/api/faculty/description'),
        fetch('/api/faculty/students'),
      ]);

      let fetchedPhone = '';
      if (meRes.ok) {
        const meData = await meRes.json();
        setProfile(meData);
        fetchedPhone = meData.phone || '';
        if (meData.mustChangePassword) {
          setShowPasswordModal(true);
        }
      } else {
        router.push('/login');
        return;
      }

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setPhone(pData.phone || fetchedPhone || '');

        const profs = pData.profiles || {};
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
      }

      if (docRes.ok) {
        const dData = await docRes.json();
        setImagePath(dData.image || null);
        setCvPath(dData.cv || null);
      }

      if (descRes.ok) {
        const descData = await descRes.json();
        setMarkdownContent(descData.description || '');
      }

      if (studentsRes.ok) {
        const stData = await studentsRes.json();
        setStudentsList(stData);
      }
    } catch (err) {
      console.error('Failed to load faculty data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/faculty/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Handle Password Change
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch('/api/faculty/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setPasswordSuccess('Password updated successfully! Your account is now secure.');
      setProfile((prev) => (prev ? { ...prev, mustChangePassword: false } : null));

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'An error occurred.');
    } finally {
      setChangingPassword(false);
    }
  };

  const togglePlatform = (key: string) => {
    const next = new Set(selectedPlatforms);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedPlatforms(next);
  };

  const handleUrlChange = (key: string, value: string) => {
    setPlatformUrls((prev) => ({ ...prev, [key]: value }));
  };

  const addCustomProfile = () => {
    setOtherProfiles((prev) => [
      ...prev,
      { id: `custom_${Date.now()}`, name: '', url: '' },
    ]);
  };

  const updateCustomProfile = (id: string, field: 'name' | 'url', value: string) => {
    setOtherProfiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeCustomProfile = (id: string) => {
    setOtherProfiles((prev) => prev.filter((item) => item.id !== id));
  };

  // Save Profiles Handler
  const handleSaveProfiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilesError(null);
    setProfilesSuccess(null);
    setSavingProfiles(true);

    try {
      const profilesPayload: Record<string, any> = {};

      selectedPlatforms.forEach((key) => {
        const urlVal = (platformUrls[key] || '').trim();
        if (urlVal) {
          profilesPayload[key] = urlVal;
        }
      });

      const validOther = otherProfiles
        .map((op) => ({ name: op.name.trim(), url: op.url.trim() }))
        .filter((op) => op.name && op.url);

      if (validOther.length > 0) {
        profilesPayload.other = validOther;
      }

      const res = await fetch('/api/faculty/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          profiles: profilesPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update contact & public profiles.');
      }

      setProfilesSuccess('Contact details and public profiles updated successfully!');
      setTimeout(() => {
        setIsProfilesModalOpen(false);
        setProfilesSuccess(null);
      }, 1500);
    } catch (err: any) {
      setProfilesError(err.message || 'An error occurred while saving profiles.');
    } finally {
      setSavingProfiles(false);
    }
  };

  // Profile Image Selection Handler
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setDocError('Invalid image type. Please select a JPG, PNG, or WebP file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocError('Image file size exceeds the 5MB limit.');
      return;
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  // CV File Selection Handler
  const handleCvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setDocError('Invalid CV document format. Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setDocError('CV file size exceeds the 10MB limit.');
      return;
    }

    setSelectedCvFile(file);
  };

  // Save Document Uploads Handler
  const handleSaveDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocError(null);
    setDocSuccess(null);

    if (!selectedImageFile && !selectedCvFile) {
      setDocError('Please select a profile image or CV PDF file to upload.');
      return;
    }

    setUploadingDocs(true);

    try {
      const formData = new FormData();
      if (selectedImageFile) formData.append('image', selectedImageFile);
      if (selectedCvFile) formData.append('cv', selectedCvFile);

      const res = await fetch('/api/faculty/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload documents.');
      }

      setImagePath(data.image || imagePath);
      setCvPath(data.cv || cvPath);
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setSelectedCvFile(null);

      setDocSuccess('Professional documents uploaded and saved successfully!');
      setTimeout(() => {
        setIsDocModalOpen(false);
        setDocSuccess(null);
      }, 1500);
    } catch (err: any) {
      setDocError(err.message || 'An error occurred during file upload.');
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleDeleteDocument = async (type: 'image' | 'cv') => {
    const typeLabel = type === 'image' ? 'profile image' : 'CV document';
    if (!confirm(`Are you sure you want to delete your current ${typeLabel}?`)) return;

    setDocError(null);
    setDocSuccess(null);

    try {
      const res = await fetch(`/api/faculty/documents?type=${type}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to delete ${typeLabel}.`);
      }

      if (type === 'image') {
        setImagePath(null);
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
      } else {
        setCvPath(null);
        setSelectedCvFile(null);
      }

      setDocSuccess(`Successfully deleted ${typeLabel}.`);
      setTimeout(() => setDocSuccess(null), 2000);
    } catch (err: any) {
      setDocError(err.message || `Failed to delete ${typeLabel}.`);
    }
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdown-editor-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end) || 'text';

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);

    setMarkdownContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Save Description Handler
  const handleSaveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setDescError(null);
    setDescSuccess(null);
    setSavingDesc(true);

    try {
      const res = await fetch('/api/faculty/description', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: markdownContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save professional description.');
      }

      setDescSuccess('Professional description updated and saved successfully!');
      setTimeout(() => {
        setIsDescModalOpen(false);
        setDescSuccess(null);
      }, 1500);
    } catch (err: any) {
      setDescError(err.message || 'An error occurred while saving description.');
    } finally {
      setSavingDesc(false);
    }
  };

  // Student Image File Select Handler
  const handleStudentImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setStudentError('Invalid image type. Please select a JPG, PNG, or WebP file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStudentError('Student image file size exceeds the 5MB limit.');
      return;
    }

    setSelectedStudentImageFile(file);
    setStudentImagePreviewUrl(URL.createObjectURL(file));
    setDeleteStudentImageFlag(false);
  };

  // Open Student Modal (Create or Edit)
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

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
    setSelectedStudentImageFile(null);
    setStudentImagePreviewUrl(null);
  };

  // Save Student (Create or Edit)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    setStudentSuccess(null);

    if (!studentName.trim()) {
      setStudentError('Student Name is required.');
      return;
    }

    setSavingStudent(true);

    try {
      const formData = new FormData();
      formData.append('name', studentName.trim());
      formData.append('description', studentDescription.trim());
      if (selectedStudentImageFile) {
        formData.append('image', selectedStudentImageFile);
      }
      if (deleteStudentImageFlag) {
        formData.append('deleteImage', 'true');
      }

      const url = editingStudent
        ? `/api/faculty/students/${editingStudent.uid}`
        : '/api/faculty/students';
      const method = editingStudent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save student record.');
      }

      if (editingStudent) {
        setStudentsList((prev) =>
          prev.map((s) => (s.uid === editingStudent.uid ? data : s))
        );
        setStudentSuccess('Student record updated successfully!');
      } else {
        setStudentsList((prev) => [data, ...prev]);
        setStudentSuccess('Guided student added successfully!');
      }

      setTimeout(() => {
        closeStudentModal();
        setStudentSuccess(null);
      }, 1200);
    } catch (err: any) {
      setStudentError(err.message || 'An error occurred while saving student.');
    } finally {
      setSavingStudent(false);
    }
  };

  // Delete Student Handler
  const handleDeleteStudent = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this guided student record?')) return;

    try {
      const res = await fetch(`/api/faculty/students/${uid}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStudentsList((prev) => prev.filter((s) => s.uid !== uid));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete student record.');
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00142D] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading Faculty Portal...</span>
        </div>
      </div>
    );
  }

  const activePredefinedProfiles = PREDEFINED_PLATFORMS.filter(
    (p) => selectedPlatforms.has(p.key) && platformUrls[p.key]?.trim()
  );

  return (
    <div className="min-h-screen bg-[#00142D] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="bg-[#002147] border-b border-slate-700/60 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-white">Department of Physics</h1>
            <p className="text-xs text-indigo-300">Faculty Portal • Logged in as {profile?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setPasswordError(null);
              setPasswordSuccess(null);
              setNewPassword('');
              setConfirmPassword('');
              setShowPasswordModal(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Security Warning Banner if Predefined Password hasn't been changed */}
      {profile?.mustChangePassword && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between text-amber-200 text-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Security Notice:</strong> You are currently using a predefined initial password. Please update your password to maintain account security.
            </span>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-oxford-dark font-bold rounded-lg text-xs transition-all shadow"
          >
            Change Password Now
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#002147] to-[#003366] border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            {/* Profile Avatar Display */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 overflow-hidden shadow-lg flex items-center justify-center text-indigo-300 shrink-0">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt={profile?.name || 'Faculty Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <button
                onClick={() => setIsDocModalOpen(true)}
                className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow text-[10px] transition-all"
                title="Upload or Update Image"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <UserCheck className="w-3.5 h-3.5" /> Authenticated Faculty Account
              </span>
              <h2 className="text-2xl font-bold font-serif text-white">
                Welcome, {profile?.name}
              </h2>
              <p className="text-slate-300 text-xs md:text-sm">
                {profile?.designation || 'Faculty Member'} • {profile?.department || 'Department of Physics, CUSAT'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => openStudentModal()}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Guided Student</span>
            </button>
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image & CV</span>
            </button>
            <button
              onClick={() => setIsDescModalOpen(true)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-semibold rounded-xl text-xs transition-all shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Edit Biography</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Guided Students & Research Scholars Module */}
        <div className="bg-[#002147]/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">Guided Students & Research Scholars</h3>
                <p className="text-xs text-slate-400">
                  Manage Ph.D. scholars, MSc project students, research descriptions, and profile photos.
                </p>
              </div>
            </div>

            <button
              onClick={() => openStudentModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/40 rounded-xl text-xs font-semibold shadow transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>

          {studentsList.length === 0 ? (
            <div className="bg-[#00142D] border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 space-y-3">
              <Users className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">No guided students added yet</p>
              <p className="text-slate-500 max-w-sm mx-auto">
                Add research scholars or project students associated with your lab to showcase them on your public profile.
              </p>
              <button
                onClick={() => openStudentModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-all mt-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add First Student</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentsList.map((student) => (
                <div key={student.uid} className="bg-[#00142D] border border-slate-700/70 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 overflow-hidden flex items-center justify-center text-emerald-400 shrink-0">
                        {student.image ? (
                          <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-serif">{student.name}</h4>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded inline-block mt-0.5">
                          Guided Student
                        </span>
                      </div>
                    </div>

                    {student.description ? (
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {student.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No description added.</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openStudentModal(student)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 rounded-lg transition-all"
                      title="Edit student record"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.uid)}
                      className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                      title="Delete student record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Professional Description & Biography Card (Markdown) */}
        <div className="bg-[#002147]/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">Professional Biography & Description</h3>
                <p className="text-xs text-slate-400">
                  Formatted using Markdown syntax (.md) for headings, lists, bold text, and links.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDescModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/40 rounded-xl text-xs font-semibold shadow transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Description (.md)</span>
            </button>
          </div>

          <div className="bg-[#00142D] border border-slate-700/70 rounded-xl p-5 min-h-[120px]">
            {renderMarkdown(markdownContent)}
          </div>
        </div>

        {/* SECTION 3: Professional Documents & Media Card */}
        <div className="bg-[#002147]/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">Professional Documents & Media</h3>
                <p className="text-xs text-slate-400">
                  Manage profile image avatar and Curriculum Vitae (CV PDF format).
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDocModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl text-xs font-medium transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Manage Image & CV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#00142D] border border-slate-700/70 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/30 overflow-hidden flex items-center justify-center text-indigo-400 shrink-0">
                  {imagePath ? (
                    <img src={imagePath} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-slate-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Profile Image</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {imagePath ? 'Image uploaded and active' : 'No profile image uploaded yet'}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1">Formats: JPG, PNG, WebP (Max 5MB)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {imagePath && (
                  <button
                    onClick={() => handleDeleteDocument('image')}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs transition-all"
                    title="Delete current image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsDocModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all"
                >
                  {imagePath ? 'Replace' : 'Upload'}
                </button>
              </div>
            </div>

            <div className="bg-[#00142D] border border-slate-700/70 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">Curriculum Vitae (CV)</h4>
                    {cvPath && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                        PDF Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cvPath ? 'Official PDF resume document attached' : 'No CV uploaded yet'}
                  </p>
                  <span className="text-[10px] text-slate-500 block mt-1">Format: PDF (Max 10MB)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cvPath && (
                  <>
                    <a
                      href={cvPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs transition-all flex items-center gap-1"
                      title="View / Download CV PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteDocument('cv')}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs transition-all"
                      title="Delete current CV"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsDocModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all"
                >
                  {cvPath ? 'Replace' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Contact Information & Public Profiles Card */}
        <div className="bg-[#002147]/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">Contact & Professional Profiles</h3>
                <p className="text-xs text-slate-400">
                  Manage phone contact details and academic/research profiles visible on the public portal.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsProfilesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl text-xs font-medium transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Links & Phone</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#00142D] border border-slate-700/70 rounded-xl p-4 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Primary Contact Number
              </span>
              {phone ? (
                <div className="flex items-center gap-2.5 text-white font-mono text-sm font-semibold">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>{phone}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>No phone number provided yet</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Public Profiles ({activePredefinedProfiles.length + otherProfiles.filter(o => o.url).length})
              </span>

              {activePredefinedProfiles.length === 0 && otherProfiles.filter(o => o.url).length === 0 ? (
                <div className="bg-[#00142D] border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-500 space-y-2">
                  <Share2 className="w-6 h-6 mx-auto text-slate-600" />
                  <p>No public profiles linked yet.</p>
                  <button
                    onClick={() => setIsProfilesModalOpen(true)}
                    className="inline-flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
                  >
                    <span>Click here to select and add profiles</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {activePredefinedProfiles.map((p) => (
                    <a
                      key={p.key}
                      href={platformUrls[p.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 ${p.badgeBg} ${p.badgeText}`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ))}

                  {otherProfiles
                    .filter((op) => op.url && op.name)
                    .map((op) => (
                      <a
                        key={op.id}
                        href={op.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 bg-purple-500/10 border-purple-500/30 text-purple-300"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>{op.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5: Research & Publications Placeholder */}
        <div className="bg-[#002147]/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all opacity-80">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white font-serif">Research & Publications</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit research paper titles, journal citations, patents, and active lab projects.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 font-medium">
            Faculty Module Coming Soon
          </div>
        </div>
      </main>

      {/* ADD / EDIT GUIDED STUDENT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#002147] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 sticky top-0 bg-[#002147] z-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {editingStudent ? 'Edit Guided Student' : 'Add New Guided Student'}
                </h3>
              </div>

              <button
                onClick={closeStudentModal}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {studentError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{studentError}</span>
              </div>
            )}

            {studentSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{studentSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4 text-sm">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-serif"
                />
              </div>

              {/* Research / Project Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Research / Project Description
                </label>
                <textarea
                  rows={4}
                  value={studentDescription}
                  onChange={(e) => setStudentDescription(e.target.value)}
                  placeholder="e.g. Ph.D. Scholar working on Quantum Key Distribution & Photonics materials."
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                />
              </div>

              {/* Student Image Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Student Image Upload (Optional)
                  </label>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP (Max 5MB)</span>
                </div>

                <div className="flex items-center space-x-4 bg-[#00142D] p-3 rounded-xl border border-slate-700/80">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 overflow-hidden flex items-center justify-center text-emerald-400 shrink-0">
                    {studentImagePreviewUrl ? (
                      <img src={studentImagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all">
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>{selectedStudentImageFile || studentImagePreviewUrl ? 'Change Image' : 'Select Image'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleStudentImageSelect}
                        className="hidden"
                      />
                    </label>

                    {(studentImagePreviewUrl || selectedStudentImageFile) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudentImageFile(null);
                          setStudentImagePreviewUrl(null);
                          setDeleteStudentImageFlag(true);
                        }}
                        className="text-[11px] text-red-400 hover:underline block"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-700/60 sticky bottom-0 bg-[#002147] py-2">
                <button
                  type="button"
                  onClick={closeStudentModal}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStudent}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  {savingStudent ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingStudent ? 'Update Record' : 'Save Student'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFESSIONAL DESCRIPTION MODAL */}
      {isDescModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#002147] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 relative max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  Edit Professional Description (.md)
                </h3>
              </div>

              <button
                onClick={() => setIsDescModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {descError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{descError}</span>
              </div>
            )}

            {descSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 shrink-0">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{descSuccess}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3 shrink-0">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('## ', '')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center gap-1"
                  title="Heading 2"
                >
                  <Heading className="w-3 h-3" /> H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('### ', '')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center gap-1"
                  title="Heading 3"
                >
                  <Heading className="w-3 h-3" /> H3
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('**', '**')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                  title="Bold"
                >
                  <Bold className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('*', '*')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                  title="Italic"
                >
                  <Italic className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('- ', '')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                  title="Bullet List"
                >
                  <List className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('[', '](https://example.com)')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                  title="Insert Link"
                >
                  <LinkIcon className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('> ', '')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                  title="Quote"
                >
                  <QuoteIcon className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center bg-[#00142D] p-1 rounded-xl border border-slate-700/80 text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setDescActiveTab('write')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    descActiveTab === 'write'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Write (.md)
                </button>
                <button
                  type="button"
                  onClick={() => setDescActiveTab('preview')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    descActiveTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveDescription} className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex-1 min-h-[260px] overflow-y-auto">
                {descActiveTab === 'write' ? (
                  <textarea
                    id="markdown-editor-textarea"
                    rows={12}
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    placeholder="## About Me&#10;Write your professional biography using Markdown syntax...&#10;&#10;### Research Interests&#10;- Artificial Intelligence&#10;- Photonics & Quantum Computing"
                    className="w-full h-full p-4 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs leading-relaxed resize-none"
                  />
                ) : (
                  <div className="bg-[#00142D] border border-slate-700/80 rounded-xl p-5 min-h-[260px]">
                    {renderMarkdown(markdownContent)}
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-700/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDescModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDesc}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  {savingDesc ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Description</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE DOCUMENTS & MEDIA MODAL */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#002147] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 sticky top-0 bg-[#002147] z-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  Manage Profile Image & CV Document
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsDocModalOpen(false);
                  setSelectedImageFile(null);
                  setImagePreviewUrl(null);
                  setSelectedCvFile(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            <form onSubmit={handleSaveDocuments} className="space-y-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300">
                    Profile Image Upload
                  </label>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WebP (Max 5MB)</span>
                </div>

                <div className="flex items-center space-x-4 bg-[#00142D] p-4 rounded-xl border border-slate-700/80">
                  <div className="w-16 h-16 rounded-xl bg-indigo-500/10 border border-indigo-500/30 overflow-hidden flex items-center justify-center text-indigo-400 shrink-0">
                    {imagePreviewUrl ? (
                      <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : imagePath ? (
                      <img src={imagePath} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all">
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>{selectedImageFile ? 'Change File' : 'Select Image File'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageFileSelect}
                        className="hidden"
                      />
                    </label>

                    {selectedImageFile && (
                      <p className="text-xs text-indigo-300 font-mono truncate">
                        Selected: {selectedImageFile.name} ({(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-700/60 pt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Curriculum Vitae (CV) PDF Upload
                  </label>
                  <span className="text-[10px] text-slate-400">PDF Only (Max 10MB)</span>
                </div>

                <div className="bg-[#00142D] p-4 rounded-xl border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          {cvPath ? 'Current CV PDF attached' : 'No CV document uploaded'}
                        </span>
                        {cvPath && (
                          <a
                            href={cvPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>View current file</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{selectedCvFile ? 'Change PDF' : 'Select PDF'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleCvFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {selectedCvFile && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 font-mono truncate">
                      Selected CV PDF: {selectedCvFile.name} ({(selectedCvFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-700/60 sticky bottom-0 bg-[#002147] py-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDocModalOpen(false);
                    setSelectedImageFile(null);
                    setImagePreviewUrl(null);
                    setSelectedCvFile(null);
                  }}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDocs || (!selectedImageFile && !selectedCvFile)}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  {uploadingDocs ? (
                    <span>Uploading & Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Documents</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE CONTACT & PUBLIC PROFILES MODAL */}
      {isProfilesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#002147] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 sticky top-0 bg-[#002147] z-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  Manage Contact & Public Profiles
                </h3>
              </div>

              <button
                onClick={() => setIsProfilesModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            <form onSubmit={handleSaveProfiles} className="space-y-6 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-700/60 pt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300">
                    Select Public Profiles
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click to enable or disable platforms. URL fields will appear dynamically below.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatforms.has(platform.key);
                    return (
                      <button
                        key={platform.key}
                        type="button"
                        onClick={() => togglePlatform(platform.key)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? `${platform.badgeBg} ${platform.badgeText} shadow-md`
                            : 'bg-[#00142D] border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span>{platform.label}</span>
                        {isSelected && <CheckCircle2 className="w-3 h-3 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedPlatforms.size > 0 && (
                <div className="space-y-3 border-t border-slate-700/60 pt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Enter URLs for Selected Platforms
                  </label>

                  <div className="grid grid-cols-1 gap-3">
                    {PREDEFINED_PLATFORMS.filter((p) => selectedPlatforms.has(p.key)).map((p) => (
                      <div key={p.key} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${p.badgeText}`}>{p.label} URL</span>
                          <button
                            type="button"
                            onClick={() => togglePlatform(p.key)}
                            className="text-[10px] text-slate-500 hover:text-red-400 underline"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="url"
                          value={platformUrls[p.key] || ''}
                          onChange={(e) => handleUrlChange(p.key, e.target.value)}
                          placeholder={p.placeholder}
                          className="w-full p-2.5 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 border-t border-slate-700/60 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300">
                      Other Custom Profiles
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Add additional professional platforms (e.g. ResearchGate, GitHub, Publons).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addCustomProfile}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Profile</span>
                  </button>
                </div>

                {otherProfiles.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No custom profiles added.</p>
                ) : (
                  <div className="space-y-3">
                    {otherProfiles.map((custom) => (
                      <div key={custom.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center bg-[#00142D] p-3 rounded-xl border border-slate-700/80">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={custom.name}
                            onChange={(e) => updateCustomProfile(custom.id, 'name', e.target.value)}
                            placeholder="Platform Name (e.g. ResearchGate)"
                            className="w-full p-2 bg-[#002147] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="url"
                            value={custom.url}
                            onChange={(e) => updateCustomProfile(custom.id, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2 bg-[#002147] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs font-mono"
                          />
                        </div>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => removeCustomProfile(custom.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Remove custom profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end space-x-3 border-t border-slate-700/60 sticky bottom-0 bg-[#002147] py-2">
                <button
                  type="button"
                  onClick={() => setIsProfilesModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfiles}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  {savingProfiles ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Profiles</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#002147] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {profile?.mustChangePassword ? 'First Login: Change Password' : 'Update Password'}
                </h3>
              </div>

              {!profile?.mustChangePassword && (
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {profile?.mustChangePassword && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  As part of department security, you must update your predefined password to a new personal password on initial login.
                </span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  New Personal Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-3 bg-[#00142D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-700/60">
                {!profile?.mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  {changingPassword ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Password & Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

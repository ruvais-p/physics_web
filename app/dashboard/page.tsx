'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LogOut,
  Bell,
  FlaskConical,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  RefreshCw,
  LayoutDashboard,
  Users,
  UserPlus,
  Atom,
  UserCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  GraduationCap,
  Phone,
  Globe,
  BookOpen,
  Share2,
  Upload,
  FileCheck,
  FilePlus,
  Image as ImageIcon,
  Download,
  User,
  Heading,
  Bold,
  Italic,
  List,
  Quote as QuoteIcon,
  Code,
  Link as LinkIcon,
  Edit3,
  ChevronUp,
  ChevronDown,
  Sliders,
  Calendar,
  Wrench,
  GripVertical,
  ArrowUpDown,
  Mail,
  Building2,
  Check,
  Award,
  Info,
  ArrowRight,
} from 'lucide-react';
import AdminFacultyFullManageModal from '@/components/AdminFacultyFullManageModal';
import EventGallerySection from '@/components/EventGallerySection';
import CurriculumManagementSection from '@/components/CurriculumManagementSection';
import ResearchLabManagementSection from '@/components/ResearchLabManagementSection';
import FacilityManagementSection from '@/components/FacilityManagementSection';

// Import Shadcn UI elements
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Types for Admin View
interface NotificationItem {
  id: string;
  title: string;
  category: string;
  link: string | null;
  content: string | null;
  isActive: boolean;
  date: string;
  createdAt: string;
}

interface FacultyItem {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

// Types for Faculty View
interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  mustChangePassword: boolean;
  isActive: boolean;
  phone?: string | null;
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
    badgeBg: 'bg-blue-50 border-blue-200',
    badgeText: 'text-blue-700',
  },
  {
    key: 'scopus',
    label: 'Scopus',
    placeholder: 'https://www.scopus.com/authid/detail.uri?authorId=...',
    badgeBg: 'bg-amber-50 border-amber-200',
    badgeText: 'text-amber-700',
  },
  {
    key: 'orcid',
    label: 'ORCID',
    placeholder: 'https://orcid.org/0000-0000-0000-0000',
    badgeBg: 'bg-lime-50 border-lime-200',
    badgeText: 'text-lime-800',
  },
  {
    key: 'moodle',
    label: 'Moodle',
    placeholder: 'https://moodle.cusat.ac.in/...',
    badgeBg: 'bg-orange-50 border-orange-200',
    badgeText: 'text-orange-700',
  },
  {
    key: 'iqac_profile',
    label: 'IQAC Profile',
    placeholder: 'https://iqac.cusat.ac.in/faculty/...',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    badgeText: 'text-emerald-700',
  },
  {
    key: 'iris',
    label: 'IRIS',
    placeholder: 'https://iris.cusat.ac.in/profile/...',
    badgeBg: 'bg-purple-50 border-purple-200',
    badgeText: 'text-purple-700',
  },
  {
    key: 'youtube',
    label: 'YouTube Channel',
    placeholder: 'https://youtube.com/@channel',
    badgeBg: 'bg-red-50 border-red-200',
    badgeText: 'text-red-700',
  },
  {
    key: 'personal_website',
    label: 'Personal Website',
    placeholder: 'https://www.mywebsite.com',
    badgeBg: 'bg-cyan-50 border-cyan-200',
    badgeText: 'text-cyan-700',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    badgeBg: 'bg-sky-50 border-sky-200',
    badgeText: 'text-sky-700',
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
  faculty?: { id: string; name: string; email: string } | null;
}

// Markdown Parser Helper Function for Faculty Description & About Us
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-sm text-slate-500 italic">No professional description added yet.</p>;
  }

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul_${elements.length}`} className="list-disc ml-5 space-y-1.5 my-2 text-sm text-slate-800">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol_${elements.length}`} className="list-decimal ml-5 space-y-1.5 my-2 text-sm text-slate-800">
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

    if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
      elements.push(<hr key={index} className="my-4 border-slate-200" />);
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-2xl font-bold font-serif text-slate-900 mt-5 mb-2 border-b border-slate-200 pb-1.5">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-xl font-bold font-serif text-oxford mt-4 mb-2">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-base font-bold text-cyan-800 mt-3 mb-1 font-sans">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('#### ')) {
      elements.push(
        <h5 key={index} className="text-sm font-semibold text-slate-800 mt-2 mb-1">
          {parseInlineMarkdown(trimmed.slice(5))}
        </h5>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-oxford pl-4 py-2 text-slate-700 italic text-sm my-2.5 bg-slate-100/80 rounded-r-lg">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={index} className="text-sm text-slate-800 leading-relaxed my-1.5">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <div className="space-y-1 font-sans text-slate-800">{elements}</div>;
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
        <a key={keyIdx++} href={url} target="_blank" rel="noopener noreferrer" className="text-oxford hover:text-cyan-700 underline font-semibold inline-flex items-center gap-1">
          <span>{label}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
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
      elements.push(<strong key={`${keyPrefix}_b_${match.index}`} className="font-bold text-slate-900">{match[2]}</strong>);
    } else if (match[3]) {
      elements.push(<em key={`${keyPrefix}_i_${match.index}`} className="italic text-slate-700">{match[4]}</em>);
    } else if (match[5]) {
      elements.push(<code key={`${keyPrefix}_c_${match.index}`} className="bg-slate-200 text-oxford px-1.5 py-0.5 rounded font-mono text-xs font-semibold">{match[6]}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 ? elements[0] : <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

interface HeroSlideItem {
  id: number;
  image: string;
  title: string;
  description: string;
  is_visible: boolean;
  order: number;
  createdAt: string;
}

export default function UnifiedDashboardPage() {
  const router = useRouter();

  // Unified Session State
  const [loadingSession, setLoadingSession] = useState(true);
  const [role, setRole] = useState<'admin' | 'faculty' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // -------------------------------------------------------------
  // ADMIN DASHBOARD STATES & HANDLERS
  // -------------------------------------------------------------
  const [adminTab, setAdminTab] = useState<'dashboard' | 'about' | 'hero' | 'events' | 'notifications' | 'faculty' | 'curriculum' | 'labs' | 'facilities'>('dashboard');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Events Management States
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    apply_link: '',
    imageFile: null as File | null,
    imageUrl: '',
  });
  const [eventSaving, setEventSaving] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEventsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const openEventModal = (ev?: any) => {
    setEventError(null);
    if (ev) {
      setEditingEvent(ev);
      const d = new Date(ev.date);
      const isoLocal = !isNaN(d.getTime()) ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
      setEventFormData({
        title: ev.title || '',
        description: ev.description || '',
        date: isoLocal,
        venue: ev.venue || '',
        apply_link: ev.apply_link || '',
        imageFile: null,
        imageUrl: ev.image || '',
      });
      setEventImagePreview(ev.image || null);
    } else {
      setEditingEvent(null);
      setEventFormData({
        title: '',
        description: '',
        date: new Date().toISOString().slice(0, 16),
        venue: '',
        apply_link: '',
        imageFile: null,
        imageUrl: '',
      });
      setEventImagePreview(null);
    }
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setEventImagePreview(null);
  };

  const handleEventSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventError(null);

    if (!eventFormData.title.trim()) {
      setEventError('Event Title is required');
      return;
    }
    if (!eventFormData.description.trim()) {
      setEventError('Event Description is required');
      return;
    }
    if (!eventFormData.date.trim()) {
      setEventError('Event Date is required');
      return;
    }
    if (!editingEvent && !eventFormData.imageFile && !eventFormData.imageUrl.trim()) {
      setEventError('Please provide an Image File or Image URL');
      return;
    }

    setEventSaving(true);

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('title', eventFormData.title.trim());
      formData.append('description', eventFormData.description.trim());
      formData.append('date', eventFormData.date);
      formData.append('venue', eventFormData.venue.trim());
      formData.append('apply_link', eventFormData.apply_link.trim());

      if (eventFormData.imageFile) {
        formData.append('image', eventFormData.imageFile);
      } else if (eventFormData.imageUrl) {
        formData.append('imageUrl', eventFormData.imageUrl.trim());
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save event');
      }

      await fetchEvents();
      closeEventModal();
    } catch (err: any) {
      setEventError(err.message || 'An error occurred while saving event.');
    } finally {
      setEventSaving(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEventsList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // About Us CMS States
  const [aboutContent, setAboutContent] = useState('');
  const [aboutImagePath, setAboutImagePath] = useState<string | null>(null);
  const [aboutActiveTab, setAboutActiveTab] = useState<'write' | 'preview'>('write');
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [aboutSuccess, setAboutSuccess] = useState<string | null>(null);
  const [selectedAboutImageFile, setSelectedAboutImageFile] = useState<File | null>(null);
  const [aboutImageUrlInput, setAboutImageUrlInput] = useState('');
  const [aboutImagePreviewUrl, setAboutImagePreviewUrl] = useState<string | null>(null);

  const fetchCmsAbout = async () => {
    setLoadingAbout(true);
    try {
      const res = await fetch('/api/cms/about');
      if (res.ok) {
        const data = await res.json();
        setAboutContent(data.content || '');
        setAboutImagePath(data.image || null);
        setAboutImageUrlInput(data.image || '');
        setAboutImagePreviewUrl(data.image || null);
      }
    } catch (err) {
      console.error('Failed to fetch CMS about us:', err);
    } finally {
      setLoadingAbout(false);
    }
  };

  const insertAboutMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('aboutMarkdownTextarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = aboutContent.substring(start, end) || 'Sample text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = aboutContent.substring(0, start) + replacement + aboutContent.substring(end);
    setAboutContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const handleSaveAboutUs = async (e: React.FormEvent) => {
    e.preventDefault();
    setAboutError(null);
    setAboutSuccess(null);

    if (!aboutContent.trim()) {
      setAboutError('About Us content cannot be empty.');
      return;
    }

    setSavingAbout(true);

    try {
      const formData = new FormData();
      formData.append('content', aboutContent.trim());
      if (selectedAboutImageFile) {
        formData.append('image', selectedAboutImageFile);
      } else if (aboutImageUrlInput.trim()) {
        formData.append('imageUrl', aboutImageUrlInput.trim());
      }

      const res = await fetch('/api/cms/about', {
        method: 'POST',
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => '');
        throw new Error(res.ok ? 'Failed to parse response from server.' : `Server error (${res.status}): ${text.substring(0, 100)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save About Us content.');
      }

      if (data.data?.image) {
        setAboutImagePath(data.data.image);
        setAboutImagePreviewUrl(data.data.image);
      }
      setSelectedAboutImageFile(null);
      setAboutSuccess('About Us page content and department hero image updated successfully!');
      setTimeout(() => setAboutSuccess(null), 4000);
    } catch (err: any) {
      setAboutError(err.message || 'An error occurred while saving About Us content.');
    } finally {
      setSavingAbout(false);
    }
  };

  // Hero Carousel States
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>([]);
  const [loadingHero, setLoadingHero] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlideItem | null>(null);
  const [heroFormData, setHeroFormData] = useState({
    title: '',
    description: '',
    imageFile: null as File | null,
    imageUrl: '',
    is_visible: true,
  });
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroFormError, setHeroFormError] = useState<string | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  const fetchHeroSlides = async () => {
    setLoadingHero(true);
    try {
      const res = await fetch('/api/cms/hero');
      if (res.ok) {
        const data = await res.json();
        setHeroSlides(data);
      }
    } catch (err) {
      console.error('Failed to fetch hero slides:', err);
    } finally {
      setLoadingHero(false);
    }
  };

  const openHeroModal = (slide?: HeroSlideItem) => {
    setHeroFormError(null);
    if (slide) {
      setEditingHeroSlide(slide);
      setHeroFormData({
        title: slide.title,
        description: slide.description,
        imageFile: null,
        imageUrl: slide.image,
        is_visible: slide.is_visible,
      });
      setHeroImagePreview(slide.image);
    } else {
      setEditingHeroSlide(null);
      setHeroFormData({
        title: '',
        description: '',
        imageFile: null,
        imageUrl: '',
        is_visible: true,
      });
      setHeroImagePreview(null);
    }
    setIsHeroModalOpen(true);
  };

  const closeHeroModal = () => {
    setIsHeroModalOpen(false);
    setEditingHeroSlide(null);
    setHeroImagePreview(null);
  };

  const handleHeroSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroFormError(null);

    if (!heroFormData.title.trim()) {
      setHeroFormError('Title is required');
      return;
    }

    if (heroFormData.title.trim().length > 80) {
      setHeroFormError('Title cannot exceed 80 characters');
      return;
    }

    if (heroFormData.description.trim().length > 200) {
      setHeroFormError('Description cannot exceed 200 characters');
      return;
    }

    if (!editingHeroSlide && !heroFormData.imageFile && !heroFormData.imageUrl.trim()) {
      setHeroFormError('Please provide an image file or image URL');
      return;
    }

    setHeroSaving(true);

    try {
      const url = editingHeroSlide
        ? `/api/cms/hero/${editingHeroSlide.id}`
        : '/api/cms/hero';
      const method = editingHeroSlide ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('title', heroFormData.title.trim());
      formData.append('description', heroFormData.description.trim());
      formData.append('is_visible', String(heroFormData.is_visible));

      if (heroFormData.imageFile) {
        formData.append('image', heroFormData.imageFile);
      } else if (heroFormData.imageUrl) {
        formData.append('imageUrl', heroFormData.imageUrl.trim());
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save hero slide');
      }

      await fetchHeroSlides();
      closeHeroModal();
    } catch (err: any) {
      setHeroFormError(err.message || 'An error occurred while saving hero slide.');
    } finally {
      setHeroSaving(false);
    }
  };

  const toggleHeroVisibility = async (slide: HeroSlideItem) => {
    try {
      const res = await fetch(`/api/cms/hero/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_visible: !slide.is_visible,
        }),
      });

      if (res.ok) {
        setHeroSlides((prev) =>
          prev.map((item) =>
            item.id === slide.id ? { ...item, is_visible: !item.is_visible } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle hero slide visibility:', err);
    }
  };

  const handleDeleteHeroSlide = async (id: number) => {
    if (!confirm('Are you sure you want to delete this Hero slide?')) return;

    try {
      const res = await fetch(`/api/cms/hero/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHeroSlides((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete hero slide:', err);
    }
  };

  const moveHeroSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;

    const newSlides = [...heroSlides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const itemsToUpdate = newSlides.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));

    setHeroSlides(newSlides.map((item, idx) => ({ ...item, order: idx + 1 })));

    try {
      await fetch('/api/cms/hero/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });
    } catch (err) {
      console.error('Failed to reorder hero slides:', err);
      fetchHeroSlides();
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<NotificationItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    link: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [facultyList, setFacultyList] = useState<FacultyItem[]>([]);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [facultySearchTerm, setFacultySearchTerm] = useState('');

  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyItem | null>(null);
  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: 'Faculty Member',
    department: 'Department of Physics',
    isActive: true,
    newPredefinedPassword: '',
  });
  const [facultySaving, setFacultySaving] = useState(false);
  const [facultyFormError, setFacultyFormError] = useState<string | null>(null);
  const [fullManageFacultyId, setFullManageFacultyId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // FACULTY DASHBOARD STATES & HANDLERS
  // -------------------------------------------------------------
  const [facultyTab, setFacultyTab] = useState<'overview' | 'profile' | 'scholars' | 'projects' | 'publications' | 'hero' | 'events' | 'curriculum' | 'labs' | 'facilities'>('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [phone, setPhone] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [platformUrls, setPlatformUrls] = useState<Record<string, string>>({});
  const [otherProfiles, setOtherProfiles] = useState<CustomProfileEntry[]>([]);
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);
  const [savingProfiles, setSavingProfiles] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);
  const [profilesSuccess, setProfilesSuccess] = useState<string | null>(null);

  const [imagePath, setImagePath] = useState<string | null>(null);
  const [cvPath, setCvPath] = useState<string | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [docSuccess, setDocSuccess] = useState<string | null>(null);

  const [markdownContent, setMarkdownContent] = useState('');
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [descActiveTab, setDescActiveTab] = useState<'write' | 'preview'>('write');
  const [savingDesc, setSavingDesc] = useState(false);
  const [descError, setDescError] = useState<string | null>(null);
  const [descSuccess, setDescSuccess] = useState<string | null>(null);

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

  // Faculty Projects State & Handlers
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [allDbFaculty, setAllDbFaculty] = useState<{ id: string; name: string; designation?: string }[]>([]);
  const [selectedCoFacultyNames, setSelectedCoFacultyNames] = useState<string[]>([]);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    role: 'Principal Investigator',
    agency: '',
    funding: '',
    startDate: '',
    endDate: '',
    externalLink: '',
    otherFaculty: '',
  });
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  // Faculty Publications State & Handlers
  const [publicationsList, setPublicationsList] = useState<PublicationItem[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(false);
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<PublicationItem | null>(null);
  const [publicationFormData, setPublicationFormData] = useState({
    title: '',
    journal: '',
    authors: '',
    publicationDate: '',
    externalLink: '',
    doi: '',
    category: 'Journal Article',
    description: '',
  });
  const [savingPublication, setSavingPublication] = useState(false);
  const [publicationError, setPublicationError] = useState<string | null>(null);

  const fetchPublications = async () => {
    setLoadingPublications(true);
    try {
      const res = await fetch('/api/faculty/publications');
      if (res.ok) {
        const data = await res.json();
        setPublicationsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch faculty publications:', err);
    } finally {
      setLoadingPublications(false);
    }
  };

  const openPublicationModal = (pub?: PublicationItem) => {
    setPublicationError(null);
    if (pub) {
      setEditingPublication(pub);
      setPublicationFormData({
        title: pub.title || '',
        journal: pub.journal || '',
        authors: pub.authors || '',
        publicationDate: pub.publicationDate ? new Date(pub.publicationDate).toISOString().slice(0, 10) : '',
        externalLink: pub.externalLink || '',
        doi: pub.doi || '',
        category: pub.category || 'Journal Article',
        description: pub.description || '',
      });
    } else {
      setEditingPublication(null);
      setPublicationFormData({
        title: '',
        journal: '',
        authors: '',
        publicationDate: '',
        externalLink: '',
        doi: '',
        category: 'Journal Article',
        description: '',
      });
    }
    setIsPublicationModalOpen(true);
  };

  const handlePublicationSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublicationError(null);

    if (!publicationFormData.title.trim()) {
      setPublicationError('Publication Title is required.');
      return;
    }

    setSavingPublication(true);

    try {
      const url = editingPublication
        ? `/api/faculty/publications/${editingPublication.id}`
        : '/api/faculty/publications';
      const method = editingPublication ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: publicationFormData.title.trim(),
          journal: publicationFormData.journal.trim() || undefined,
          authors: publicationFormData.authors.trim() || undefined,
          publicationDate: publicationFormData.publicationDate || undefined,
          externalLink: publicationFormData.externalLink.trim() || undefined,
          doi: publicationFormData.doi.trim() || undefined,
          category: publicationFormData.category.trim() || 'Journal Article',
          description: publicationFormData.description.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save publication.');
      }

      await fetchPublications();
      setIsPublicationModalOpen(false);
      setEditingPublication(null);
    } catch (err: any) {
      setPublicationError(err.message || 'Failed to save publication.');
    } finally {
      setSavingPublication(false);
    }
  };

  const handleDeletePublication = async (pubId: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      const res = await fetch(`/api/faculty/publications/${pubId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchPublications();
      }
    } catch (err) {
      console.error('Failed to delete publication:', err);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch('/api/faculty/projects');
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch faculty projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const openProjectModal = (proj?: ProjectItem) => {
    setProjectError(null);
    if (proj) {
      setEditingProject(proj);
      setProjectFormData({
        title: proj.title || '',
        description: proj.description || '',
        role: proj.role || 'Principal Investigator',
        agency: proj.agency || '',
        funding: proj.funding || '',
        startDate: proj.startDate ? new Date(proj.startDate).toISOString().slice(0, 10) : '',
        endDate: proj.endDate ? new Date(proj.endDate).toISOString().slice(0, 10) : '',
        externalLink: proj.externalLink || '',
        otherFaculty: proj.otherFaculty || '',
      });

      if (proj.otherFaculty) {
        const parts = proj.otherFaculty.split(',').map((s) => s.trim()).filter(Boolean);
        const dbNames = allDbFaculty.map((f) => f.name);
        const selected = parts.filter((p) => dbNames.includes(p));
        setSelectedCoFacultyNames(selected);
      } else {
        setSelectedCoFacultyNames([]);
      }
    } else {
      setEditingProject(null);
      setProjectFormData({
        title: '',
        description: '',
        role: 'Principal Investigator',
        agency: '',
        funding: '',
        startDate: '',
        endDate: '',
        externalLink: '',
        otherFaculty: '',
      });
      setSelectedCoFacultyNames([]);
    }
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError(null);

    if (!projectFormData.title.trim()) {
      setProjectError('Project Title is required');
      return;
    }

    setSavingProject(true);

    const combinedCoFaculty = selectedCoFacultyNames.join(', ');

    try {
      const url = editingProject
        ? `/api/faculty/projects/${editingProject.id}`
        : '/api/faculty/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectFormData.title.trim(),
          description: projectFormData.description.trim(),
          role: projectFormData.role.trim(),
          agency: projectFormData.agency.trim(),
          funding: projectFormData.funding.trim(),
          startDate: projectFormData.startDate || null,
          endDate: projectFormData.endDate || null,
          externalLink: projectFormData.externalLink.trim(),
          otherFaculty: combinedCoFaculty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save research project.');
      }

      await fetchProjects();
      closeProjectModal();
    } catch (err: any) {
      setProjectError(err.message || 'An error occurred while saving project.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research project record?')) return;

    try {
      const res = await fetch(`/api/faculty/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjectsList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete research project:', err);
    }
  };

  // -------------------------------------------------------------
  // INITIAL SESSION FETCH
  // -------------------------------------------------------------
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setRole(data.role);
        setCurrentUser(data.user);

        if (data.role === 'admin') {
          fetchNotifications();
          fetchFaculty();
          fetchHeroSlides();
          fetchCmsAbout();
          fetchEvents();
        } else if (data.role === 'faculty') {
          fetchFacultySelfData(data.user);
          fetchHeroSlides();
          fetchEvents();
        }
      } catch (err) {
        console.error('Session check failed:', err);
        router.push('/login');
      } finally {
        setLoadingSession(false);
      }
    }

    checkAuthSession();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      setLoggingOut(false);
    }
  };

  // -------------------------------------------------------------
  // ADMIN FETCH & HANDLERS
  // -------------------------------------------------------------
  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const fetchFaculty = async () => {
    setLoadingFaculty(true);
    try {
      const res = await fetch('/api/admin/faculty');
      if (res.ok) {
        const data = await res.json();
        setFacultyList(data);
      }
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
    } finally {
      setLoadingFaculty(false);
    }
  };

  const openModal = (notif?: NotificationItem) => {
    setFormError(null);
    if (notif) {
      setEditingNotif(notif);
      setFormData({
        title: notif.title,
        category: notif.category || 'General',
        link: notif.link || '',
        isActive: notif.isActive,
      });
    } else {
      setEditingNotif(null);
      setFormData({
        title: '',
        category: 'General',
        link: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotif(null);
  };

  const handleSaveNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const url = editingNotif
        ? `/api/admin/notifications/${editingNotif.id}`
        : '/api/admin/notifications';
      const method = editingNotif ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save notification');
      }

      await fetchNotifications();
      closeModal();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActiveStatus = async (notif: NotificationItem) => {
    try {
      const res = await fetch(`/api/admin/notifications/${notif.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notif,
          isActive: !notif.isActive,
        }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notif.id ? { ...item, isActive: !item.isActive } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const openFacultyModal = (faculty?: FacultyItem) => {
    setFacultyFormError(null);
    if (faculty) {
      setEditingFaculty(faculty);
      setFacultyFormData({
        name: faculty.name,
        email: faculty.email,
        password: '',
        designation: faculty.designation || 'Faculty Member',
        department: faculty.department || 'Department of Physics',
        isActive: faculty.isActive,
        newPredefinedPassword: '',
      });
    } else {
      setEditingFaculty(null);
      setFacultyFormData({
        name: '',
        email: '',
        password: '',
        designation: 'Professor',
        department: 'Department of Physics',
        isActive: true,
        newPredefinedPassword: '',
      });
    }
    setIsFacultyModalOpen(true);
  };

  const closeFacultyModal = () => {
    setIsFacultyModalOpen(false);
    setEditingFaculty(null);
  };

  const handleFacultySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyFormError(null);

    if (!facultyFormData.name.trim()) {
      setFacultyFormError('Faculty Name is required');
      return;
    }

    if (!facultyFormData.email.trim()) {
      setFacultyFormError('Faculty Email is required');
      return;
    }

    if (!editingFaculty && (!facultyFormData.password || facultyFormData.password.length < 6)) {
      setFacultyFormError('Predefined Password must be at least 6 characters long');
      return;
    }

    setFacultySaving(true);

    try {
      const url = editingFaculty
        ? `/api/admin/faculty/${editingFaculty.id}`
        : '/api/admin/faculty';
      const method = editingFaculty ? 'PUT' : 'POST';

      const payload: any = {
        name: facultyFormData.name,
        email: facultyFormData.email,
        designation: facultyFormData.designation,
        department: facultyFormData.department,
        isActive: facultyFormData.isActive,
      };

      if (!editingFaculty) {
        payload.password = facultyFormData.password;
      } else if (facultyFormData.newPredefinedPassword) {
        payload.newPredefinedPassword = facultyFormData.newPredefinedPassword;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save faculty record');
      }

      await fetchFaculty();
      closeFacultyModal();
    } catch (err: any) {
      setFacultyFormError(err.message || 'An error occurred while saving faculty account.');
    } finally {
      setFacultySaving(false);
    }
  };

  const toggleFacultyStatus = async (faculty: FacultyItem) => {
    try {
      const res = await fetch(`/api/admin/faculty/${faculty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !faculty.isActive,
        }),
      });

      if (res.ok) {
        setFacultyList((prev) =>
          prev.map((item) =>
            item.id === faculty.id ? { ...item, isActive: !item.isActive } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle faculty active status:', err);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty account record?')) return;

    try {
      const res = await fetch(`/api/admin/faculty/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFacultyList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete faculty record:', err);
    }
  };

  // Faculty Drag and Drop Reordering Handlers
  const [draggedFacultyIndex, setDraggedFacultyIndex] = useState<number | null>(null);
  const [dragOverFacultyIndex, setDragOverFacultyIndex] = useState<number | null>(null);
  const [isReorderingFaculty, setIsReorderingFaculty] = useState(false);

  const handleFacultyDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedFacultyIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleFacultyDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverFacultyIndex !== index) {
      setDragOverFacultyIndex(index);
    }
  };

  const handleFacultyDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedFacultyIndex === null || draggedFacultyIndex === targetIndex) {
      setDraggedFacultyIndex(null);
      setDragOverFacultyIndex(null);
      return;
    }

    const updatedList = [...facultyList];
    const [draggedItem] = updatedList.splice(draggedFacultyIndex, 1);
    updatedList.splice(targetIndex, 0, draggedItem);

    const itemsToUpdate = updatedList.map((item, idx) => ({
      id: item.id,
      sortOrder: idx + 1,
    }));

    setFacultyList(updatedList.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));
    setDraggedFacultyIndex(null);
    setDragOverFacultyIndex(null);
    setIsReorderingFaculty(true);

    try {
      const res = await fetch('/api/admin/faculty/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) {
        throw new Error('Failed to save faculty order');
      }
    } catch (err) {
      console.error('Failed to reorder faculty:', err);
      fetchFaculty();
    } finally {
      setIsReorderingFaculty(false);
    }
  };

  const handleFacultyDragEnd = () => {
    setDraggedFacultyIndex(null);
    setDragOverFacultyIndex(null);
  };

  const moveFaculty = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= facultyList.length) return;

    const updatedList = [...facultyList];
    const temp = updatedList[index];
    updatedList[index] = updatedList[targetIndex];
    updatedList[targetIndex] = temp;

    const itemsToUpdate = updatedList.map((item, idx) => ({
      id: item.id,
      sortOrder: idx + 1,
    }));

    setFacultyList(updatedList.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));
    setIsReorderingFaculty(true);

    try {
      const res = await fetch('/api/admin/faculty/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      if (!res.ok) {
        throw new Error('Failed to save faculty order');
      }
    } catch (err) {
      console.error('Failed to reorder faculty:', err);
      fetchFaculty();
    } finally {
      setIsReorderingFaculty(false);
    }
  };

  // -------------------------------------------------------------
  // FACULTY FETCH & HANDLERS
  // -------------------------------------------------------------
  const fetchFacultySelfData = async (userData?: any) => {
    try {
      const [profileRes, docRes, descRes, studentsRes, projectsRes, publicationsRes, allFacultyRes] = await Promise.all([
        fetch('/api/faculty/profile'),
        fetch('/api/faculty/documents'),
        fetch('/api/faculty/description'),
        fetch('/api/faculty/students'),
        fetch('/api/faculty/projects'),
        fetch('/api/faculty/publications'),
        fetch('/api/public/faculty'),
      ]);

      if (userData?.mustChangePassword) {
        setShowPasswordModal(true);
      }

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setPhone(pData.phone || userData?.phone || '');

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

      if (projectsRes.ok) {
        const prData = await projectsRes.json();
        setProjectsList(prData);
      }

      if (publicationsRes.ok) {
        const pubData = await publicationsRes.json();
        setPublicationsList(pubData);
      }

      if (allFacultyRes.ok) {
        const afData = await allFacultyRes.json();
        setAllDbFaculty(afData.map((f: any) => ({ id: f.id, name: f.name, designation: f.designation })));
      }
    } catch (err) {
      console.error('Failed to load faculty self data:', err);
    }
  };

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
      setCurrentUser((prev: any) => (prev ? { ...prev, mustChangePassword: false } : null));

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

      setStudentSuccess(
        editingStudent
          ? 'Student research profile updated successfully!'
          : 'Guided student record created successfully!'
      );

      const fetchStudentsRes = await fetch('/api/faculty/students');
      if (fetchStudentsRes.ok) {
        const stData = await fetchStudentsRes.json();
        setStudentsList(stData);
      }

      setTimeout(() => {
        closeStudentModal();
        setStudentSuccess(null);
      }, 1200);
    } catch (err: any) {
      setStudentError(err.message || 'An error occurred while saving student profile.');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDeleteStudent = async (uid: string) => {
    if (!confirm('Are you sure you want to remove this guided student from your profile?')) return;

    try {
      const res = await fetch(`/api/faculty/students/${uid}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStudentsList((prev) => prev.filter((s) => s.uid !== uid));
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  // -------------------------------------------------------------
  // RENDER LOADING STATE
  // -------------------------------------------------------------
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center space-y-4 font-serif text-slate-800">
        <div className="w-12 h-12 border-4 border-oxford border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-semibold text-oxford">Verifying Session & Loading Dashboard...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER ADMIN DASHBOARD (IF ROLE IS ADMIN)
  // -------------------------------------------------------------
  if (role === 'admin') {
    const filteredNotifs = notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFaculty = facultyList.filter(
      (f) =>
        f.name.toLowerCase().includes(facultySearchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(facultySearchTerm.toLowerCase()) ||
        (f.designation && f.designation.toLowerCase().includes(facultySearchTerm.toLowerCase()))
    );

    return (
      <Tabs value={adminTab} onValueChange={(val) => setAdminTab(val as any)} className="min-h-screen bg-[#faf7f2] text-slate-900 flex flex-col md:flex-row font-serif selection:bg-oxford selection:text-white">
        {/* Left Sidebar */}
        <aside className="w-full md:w-80 lg:w-[320px] bg-oxford border-none text-white flex flex-col justify-between shrink-0 h-auto md:h-screen md:sticky md:top-0 p-4 sm:p-5 lg:p-6 shadow-2xl z-40 overflow-hidden">
          {/* Portal Branding Header */}
          <div className="shrink-0 flex items-center gap-3.5 px-2 pt-1 pb-5 border-b border-white/10">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-accent shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-serif leading-tight">Admin Portal</h1>
                <Badge className="bg-cyan-accent text-oxford font-sans font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md">
                  CMS
                </Badge>
              </div>
              <p className="text-xs text-indigo-200/90 truncate mt-0.5" title={currentUser?.email}>{currentUser?.email || 'System Admin'}</p>
            </div>
          </div>

          {/* Navigation List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden my-3 pr-1 space-y-2">
            <p className="text-[11px] font-sans font-bold text-indigo-300 uppercase tracking-widest px-2 mb-2 sticky top-0 bg-oxford py-1 z-10">Main Navigation</p>
            <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1.5 w-full border-none rounded-none shadow-none">
              <TabsTrigger
                value="dashboard"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="about"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <FileText className="w-4 h-4" />
                  <span>About Us</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="hero"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <Sliders className="w-4 h-4" />
                  <span>Hero Carousel</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                  {heroSlides.length}/10
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="events"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <Calendar className="w-4 h-4" />
                  <span>Events Management</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                  {eventsList.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                  {notifications.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="faculty"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <Users className="w-4 h-4" />
                  <span>Faculty Accounts</span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                  {facultyList.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="curriculum"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Curriculum & Regulations</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="labs"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <FlaskConical className="w-4 h-4" />
                  <span>Research Laboratories</span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="facilities"
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
              >
                <div className="flex items-center gap-3.5">
                  <Wrench className="w-4 h-4" />
                  <span>Facilities Management</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Sidebar Footer / Logout */}
          <div className="shrink-0 pt-4 border-t border-white/10 space-y-3">
            <Button
              variant="destructive"
              size="default"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 border-none text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-rose-900/30"
            >
              <LogOut className="w-4 h-4" />
              <span>{loggingOut ? 'Logging out...' : 'Logout Session'}</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-12">
          {/* OVERVIEW TAB */}
          <TabsContent value="dashboard" className="space-y-12 animate-fadeIn mt-0">
            <Card className="bg-transparent border-none rounded-none p-0 shadow-none relative overflow-visible">
              <CardContent className="p-0">
                <CardTitle className="text-3xl font-bold font-serif text-slate-900 leading-none mb-2">Welcome, Administrator ({currentUser?.name || 'Admin'})</CardTitle>
                <CardDescription className="text-slate-600 text-base mt-1">
                  Manage department announcements, faculty member accounts, and research profiles in real time.
                </CardDescription>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Module 1: About Us */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">About Us Page</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Manage department history, research text (Markdown), and top hero background banner image.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('about')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Manage About Us</span>
                </Button>
              </Card>

              {/* Module 2: Hero Carousel */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                      {heroSlides.length}/10
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Hero Carousel</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Manage home page background slides with titles, descriptions, visibility toggles, and reordering.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('hero')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Manage Hero</span>
                </Button>
              </Card>

              {/* Module 3: Events Management */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                      {eventsList.length}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Events Management</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Publish department events, schedules, locations, and multi-photo event highlight galleries.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('events')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Manage Events</span>
                </Button>
              </Card>

              {/* Module 4: Notifications */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                      {notifications.length}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Notifications</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Post announcements and urgent student alerts broadcasted to the home page marquee ticker.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('notifications')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </Button>
              </Card>

              {/* Module 5: Faculty Accounts */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                      {facultyList.length}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Faculty Accounts</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Create faculty logins, manage profile details, and monitor account status.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('faculty')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Faculty Accounts</span>
                </Button>
              </Card>

              {/* Module 6: Curriculum & Regulations */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Curriculum & Regulations</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Manage academic courses, degree levels, syllabus outlines, and regulation scheme PDF uploads.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('curriculum')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Curriculum & Schemes</span>
                </Button>
              </Card>

              {/* Module 7: Research Laboratories */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Research Laboratories</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Create research laboratory entries, research objectives, hero images, and associated faculty.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('labs')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Research Labs</span>
                </Button>
              </Card>

              {/* Module 8: Facilities Management */}
              <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Facilities Management</CardTitle>
                  <CardDescription className="text-sm text-slate-600 leading-normal">
                    Manage central instrumentation facilities, technical specifications, and faculty in-charge assignments.
                  </CardDescription>
                </CardContent>
                <Button
                  variant="default"
                  onClick={() => setAdminTab('facilities')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Central Facilities</span>
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* ABOUT US TAB */}
          <TabsContent value="about" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <FileText className="w-7 h-7 text-oxford" />
                  <span>About Us Page & Department Hero Banner</span>
                </h2>
                <p className="text-slate-600 text-base mt-1 font-sans">
                  Edit the department overview markdown text and upload the hero background image displayed on the public About page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchCmsAbout}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Content"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingAbout ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveAboutUs}
                  disabled={savingAbout}
                  className="py-3 px-6 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <span>{savingAbout ? 'Saving Changes...' : 'Save About Us Page'}</span>
                </Button>
              </div>
            </div>

            {aboutError && (
              <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 font-sans font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{aboutError}</span>
              </div>
            )}

            {aboutSuccess && (
              <div className="p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 font-sans font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{aboutSuccess}</span>
              </div>
            )}

            {/* Department Hero Image Uploader */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-oxford" />
                  <span>Department Banner Image (About Hero Section)</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  This image will be displayed as the main background banner in the hero section of the public About Us page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Upload Image File</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedAboutImageFile(file);
                          setAboutImagePreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                    />
                  </div>

                  <div className="text-xs text-slate-400 text-center font-bold">OR</div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Image URL</label>
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={aboutImageUrlInput}
                      onChange={(e) => {
                        setAboutImageUrlInput(e.target.value);
                        setAboutImagePreviewUrl(e.target.value);
                      }}
                      className="w-full text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block font-sans">Current Hero Banner Preview</label>
                  <div className="w-full h-40 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative shadow-inner">
                    <img
                      src={aboutImagePreviewUrl || '/campus.jpg'}
                      alt="Department Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Markdown Text Editor & Live Preview */}
            <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-oxford" />
                    <span>About Us Content (Markdown Editor)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Use full markdown formatting for paragraphs, headings, bullet lists, bold emphasis, and links.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl font-sans">
                  <button
                    type="button"
                    onClick={() => setAboutActiveTab('write')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      aboutActiveTab === 'write' ? 'bg-white text-oxford shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Write (Markdown)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAboutActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      aboutActiveTab === 'preview' ? 'bg-white text-oxford shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {aboutActiveTab === 'write' ? (
                <div className="space-y-3 font-sans">
                  {/* Markdown Format Insert Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('# ')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('## ')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('**', '**')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold"
                      title="Bold text"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('*', '*')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 italic"
                      title="Italic text"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('- ')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800"
                      title="Bullet list"
                    >
                      Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAboutMarkdownSyntax('[', '](https://example.com)')}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800"
                      title="Add link"
                    >
                      Link
                    </button>
                  </div>

                  <textarea
                    id="aboutMarkdownTextarea"
                    rows={16}
                    placeholder="Enter About Us description using Markdown..."
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                    className="w-full bg-white border border-[#e8e2d5] rounded-xl p-4 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[360px] text-sm text-slate-800 leading-relaxed font-sans">
                  {renderMarkdown(aboutContent)}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* HERO CAROUSEL TAB */}
          <TabsContent value="hero" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Sliders className="w-7 h-7 text-oxford" />
                  <span>Home Page Hero Carousel</span>
                  <Badge variant="outline" className="ml-2 font-mono text-xs border-oxford text-oxford">
                    {heroSlides.length}/10 Records
                  </Badge>
                </h2>
                <p className="text-slate-600 text-base mt-1">
                  Manage home page hero slides (Max 10 records). Dynamic slides with ON status are displayed on the public site.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchHeroSlides}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Hero List"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingHero ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  disabled={heroSlides.length >= 10}
                  onClick={() => openHeroModal()}
                  className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>{heroSlides.length >= 10 ? 'Max 10 Limit Reached' : 'Add Hero Item'}</span>
                </Button>
              </div>
            </div>

            {heroSlides.length >= 10 && (
              <div className="p-3.5 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 font-sans font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>Maximum limit of 10 Hero records reached. Delete or edit an existing slide to create space for a new item.</span>
              </div>
            )}

            <div className="bg-transparent border-none overflow-visible shadow-none">
              {loadingHero ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                  <span>Loading hero slides...</span>
                </div>
              ) : heroSlides.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200">
                  <Sliders className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-base font-semibold text-slate-800">No dynamic hero slides in database</p>
                  <p className="text-xs text-slate-500">
                    The public homepage will display default fallback slides until you create a custom hero slide.
                  </p>
                  <Button onClick={() => openHeroModal()} className="mt-2 text-xs">
                    <Plus className="w-4 h-4 mr-1" /> Add First Hero Slide
                  </Button>
                </div>
              ) : (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-bold w-16">Order</TableHead>
                      <TableHead className="text-base font-bold">Image Preview</TableHead>
                      <TableHead className="text-base font-bold">Title (Max 80)</TableHead>
                      <TableHead className="text-base font-bold">Description (Max 200)</TableHead>
                      <TableHead className="text-base font-bold">Status (Visibility)</TableHead>
                      <TableHead className="text-base font-bold text-center">Reorder</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heroSlides.map((slide, idx) => (
                      <TableRow key={slide.id} className="hover:bg-slate-50/40">
                        <TableCell className="font-bold text-slate-700 py-4 font-mono">
                          #{idx + 1}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="w-20 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 max-w-xs text-base py-4">
                          <div className="line-clamp-2">{slide.title}</div>
                          <span className="text-[11px] font-mono text-slate-400 font-normal">({slide.title.length}/80 chars)</span>
                        </TableCell>
                        <TableCell className="text-slate-600 max-w-sm text-sm py-4 font-sans">
                          <div className="line-clamp-2">{slide.description || '—'}</div>
                          <span className="text-[11px] font-mono text-slate-400">({slide.description.length}/200 chars)</span>
                        </TableCell>
                        <TableCell className="text-base py-4">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 font-bold text-base hover:underline focus:outline-none cursor-pointer transition-all"
                            onClick={() => toggleHeroVisibility(slide)}
                          >
                            {slide.is_visible ? (
                              <span className="text-emerald-600 flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>ON</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <EyeOff className="w-4 h-4" />
                                <span>OFF</span>
                              </span>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveHeroSlide(idx, 'up')}
                              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === heroSlides.length - 1}
                              onClick={() => moveHeroSlide(idx, 'down')}
                              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap py-4">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openHeroModal(slide)}
                            className="h-9 w-9 text-slate-600 hover:text-slate-900"
                            title="Edit Hero Item"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteHeroSlide(slide.id)}
                            className="h-9 w-9"
                            title="Delete Hero Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Bell className="w-7 h-7 text-cyan-accent" />
                  <span>Notifications Management</span>
                </h2>
                <p className="text-slate-600 text-base mt-1">
                  Active notifications are broadcasted to the home page marquee ticker.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchNotifications}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh List"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingNotifs ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={() => openModal()}
                  className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Notification</span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 text-base h-12"
              />
            </div>

            <div className="bg-transparent border-none overflow-visible shadow-none">
              {loadingNotifs ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                  <span>Loading notifications...</span>
                </div>
              ) : filteredNotifs.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <Bell className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-base font-semibold text-slate-800">No notifications found</p>
                </div>
              ) : (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-bold">Status</TableHead>
                      <TableHead className="text-base font-bold">Title</TableHead>
                      <TableHead className="text-base font-bold">Category</TableHead>
                      <TableHead className="text-base font-bold">Redirect Link</TableHead>
                      <TableHead className="text-base font-bold">Date</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifs.map((notif) => (
                      <TableRow key={notif.id} className="hover:bg-slate-50/40">
                        <TableCell className="text-base py-4">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 font-bold text-base hover:underline focus:outline-none cursor-pointer transition-all"
                            onClick={() => toggleActiveStatus(notif)}
                          >
                            {notif.isActive ? (
                              <span className="text-emerald-600 flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <EyeOff className="w-4 h-4" />
                                <span>Inactive</span>
                              </span>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 max-w-md text-base py-4">
                          <span className="line-clamp-2">{notif.title}</span>
                        </TableCell>
                        <TableCell className="text-base py-4">
                          <span className="font-semibold text-base text-cyan-700">
                            {notif.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600 text-base py-4">
                          {notif.link ? (
                            <a
                              href={notif.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-base text-cyan-accent hover:underline max-w-[150px] truncate font-medium"
                            >
                              <span>{notif.link}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-base text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-base text-slate-600 whitespace-nowrap font-mono py-4">
                          {new Date(notif.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap py-4">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openModal(notif)}
                            className="h-9 w-9 text-slate-600 hover:text-slate-900"
                            title="Edit Notification"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="h-9 w-9"
                            title="Delete Notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* FACULTY ACCOUNTS TAB */}
          <TabsContent value="faculty" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 rounded-none shadow-none">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Users className="w-7 h-7 text-oxford" />
                  <span>Faculty Account Management</span>
                </h2>
                <p className="text-slate-600 text-base mt-1">
                  Create faculty login accounts, manage profiles, and drag &amp; drop rows to rearrange public display order.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchFaculty}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Faculty Records"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingFaculty ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={() => openFacultyModal()}
                  className="flex items-center gap-2 py-3 px-5 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Faculty Account</span>
                </Button>
              </div>
            </div>

            {/* Drag & Drop Instruction Badge & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search faculty by name, email, or designation..."
                  value={facultySearchTerm}
                  onChange={(e) => setFacultySearchTerm(e.target.value)}
                  className="pl-11 text-base h-12 w-full"
                />
              </div>
              {!facultySearchTerm && filteredFaculty.length > 1 && (
                <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-200/80 rounded-xl text-indigo-800 text-xs font-sans font-medium whitespace-nowrap shadow-xs">
                  <GripVertical className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Drag rows to reorder public ranking</span>
                </div>
              )}
            </div>

            <div className="bg-transparent border-none overflow-visible shadow-none">
              {loadingFaculty ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                  <span>Loading faculty member records...</span>
                </div>
              ) : filteredFaculty.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <Users className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-base font-semibold text-slate-800">No faculty accounts found</p>
                </div>
              ) : (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32 text-base font-bold">Order</TableHead>
                      <TableHead className="text-base font-bold">Faculty Name & Title</TableHead>
                      <TableHead className="text-base font-bold">Username / Email</TableHead>
                      <TableHead className="text-base font-bold">Account Status</TableHead>
                      <TableHead className="text-base font-bold">First-Time Login Status</TableHead>
                      <TableHead className="text-base font-bold">Created On</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaculty.map((faculty, idx) => {
                      const isDragging = draggedFacultyIndex === idx;
                      const isDragOver = dragOverFacultyIndex === idx && draggedFacultyIndex !== idx;

                      return (
                        <TableRow
                          key={faculty.id}
                          draggable={!facultySearchTerm}
                          onDragStart={(e) => handleFacultyDragStart(e, idx)}
                          onDragOver={(e) => handleFacultyDragOver(e, idx)}
                          onDrop={(e) => handleFacultyDrop(e, idx)}
                          onDragEnd={handleFacultyDragEnd}
                          className={`transition-all duration-200 select-none ${
                            isDragging
                              ? 'opacity-30 bg-slate-200 scale-[0.99] border-2 border-dashed border-oxford'
                              : isDragOver
                              ? 'border-t-4 border-oxford bg-oxford/10 shadow-lg'
                              : 'hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Drag Handle & Order Controls */}
                          <TableCell className="py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {/* Grip Icon */}
                              <div
                                className={`p-1 rounded transition-colors ${
                                  facultySearchTerm
                                    ? 'opacity-30 cursor-not-allowed text-slate-300'
                                    : 'cursor-grab active:cursor-grabbing text-slate-400 hover:text-oxford hover:bg-slate-200/60'
                                }`}
                                title={facultySearchTerm ? 'Clear search filter to reorder' : 'Drag to reorder faculty'}
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>

                              {/* Order Badge */}
                              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-2xs">
                                #{idx + 1}
                              </span>

                              {/* Quick Move Up/Down Buttons */}
                              {!facultySearchTerm && (
                                <div className="flex flex-col -space-y-0.5 ml-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0 || isReorderingFaculty}
                                    onClick={() => moveFaculty(idx, 'up')}
                                    className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                    aria-label={`Move ${faculty.name} up`}
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === filteredFaculty.length - 1 || isReorderingFaculty}
                                    onClick={() => moveFaculty(idx, 'down')}
                                    className="text-slate-400 hover:text-oxford disabled:opacity-20 disabled:hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
                                    aria-label={`Move ${faculty.name} down`}
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="font-bold text-slate-900">{faculty.name}</div>
                            <div className="text-sm text-slate-500 font-sans">{faculty.designation || 'Faculty Member'}</div>
                          </TableCell>

                          <TableCell className="font-mono text-sm text-slate-700 py-4">
                            {faculty.email}
                          </TableCell>

                          <TableCell className="py-4">
                            <button
                              type="button"
                              className="flex items-center gap-1.5 font-bold text-base hover:underline focus:outline-none cursor-pointer transition-all"
                              onClick={() => toggleFacultyStatus(faculty)}
                            >
                              {faculty.isActive ? (
                                <span className="text-emerald-600 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="text-rose-500 flex items-center gap-1.5">
                                  <AlertCircle className="w-4 h-4" />
                                  <span>Disabled</span>
                                </span>
                              )}
                            </button>
                          </TableCell>

                          <TableCell className="py-4">
                            {faculty.mustChangePassword ? (
                              <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-800 font-sans font-medium text-xs">
                                Pending Password Reset
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-emerald-400 bg-emerald-50 text-emerald-800 font-sans font-medium text-xs">
                                Password Set & Active
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-base text-slate-600 whitespace-nowrap font-mono py-4">
                            {new Date(faculty.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </TableCell>

                          <TableCell className="text-right space-x-2 whitespace-nowrap py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFullManageFacultyId(faculty.id)}
                              className="bg-oxford/5 border-oxford/20 text-oxford hover:bg-oxford hover:text-white transition-all text-xs font-semibold px-3 py-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" />
                              <span>Manage Profile</span>
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => openFacultyModal(faculty)}
                              className="h-9 w-9 text-slate-600 hover:text-slate-900 cursor-pointer"
                              title="Edit Account Credentials"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteFaculty(faculty.id)}
                              className="h-9 w-9 cursor-pointer"
                              title="Delete Faculty Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* EVENTS MANAGEMENT TAB */}
          <TabsContent value="events" className="space-y-10 animate-fadeIn mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent py-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Calendar className="w-7 h-7 text-oxford" />
                  <span>Department Events & Seminars</span>
                </h2>
                <p className="text-slate-600 text-base mt-1 font-sans">
                  Publish, edit, and manage department events, workshops, endowment lectures, and conferences.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchEvents}
                  className="h-11 w-11 text-slate-700 hover:text-slate-950"
                  title="Refresh Events"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingEvents ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="default"
                  onClick={() => openEventModal()}
                  className="flex items-center gap-2 py-3 px-6 font-semibold rounded-xl shadow-xs transition-all text-base cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              {eventsList.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Calendar className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-base font-semibold text-slate-800">No events found in database</p>
                  <Button variant="outline" onClick={() => openEventModal()} className="mt-2">
                    Create First Event
                  </Button>
                </div>
              ) : (
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-bold">Cover Image</TableHead>
                      <TableHead className="text-base font-bold">Event Title & ID</TableHead>
                      <TableHead className="text-base font-bold">Event Date</TableHead>
                      <TableHead className="text-base font-bold">Apply Link</TableHead>
                      <TableHead className="text-right text-base font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventsList.map((ev) => (
                      <TableRow key={ev.id} className="hover:bg-slate-50/40">
                        <TableCell className="py-3">
                          <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-200">
                            <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                          </div>
                        </TableCell>

                        <TableCell className="py-3 max-w-xs">
                          <div className="font-bold text-slate-900 truncate" title={ev.title}>{ev.title}</div>
                          <div className="text-xs text-slate-500 font-mono">ID: {ev.id}</div>
                        </TableCell>

                        <TableCell className="font-mono text-sm text-slate-700 py-3 whitespace-nowrap">
                          {new Date(ev.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>

                        <TableCell className="py-3">
                          {ev.apply_link ? (
                            <a
                              href={ev.apply_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <span>Registration URL</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 font-sans italic">None</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right space-x-2 whitespace-nowrap py-3">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openEventModal(ev)}
                            className="h-9 w-9 text-slate-600 hover:text-slate-900"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="h-9 w-9"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* CURRICULUM TAB */}
          <TabsContent value="curriculum" className="space-y-10 animate-fadeIn mt-0">
            <CurriculumManagementSection />
          </TabsContent>

          {/* RESEARCH LABS TAB */}
          <TabsContent value="labs" className="space-y-10 animate-fadeIn mt-0">
            <ResearchLabManagementSection />
          </TabsContent>

          {/* FACILITIES TAB */}
          <TabsContent value="facilities" className="space-y-10 animate-fadeIn mt-0">
            <FacilityManagementSection />
          </TabsContent>
        </main>

        {/* ADMIN MODALS */}
        {/* Event Create / Edit Modal */}
        <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
          <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <Calendar className="w-5 h-5 text-oxford" />
                <span>{editingEvent ? 'Edit Event' : 'Add New Event'}</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEventSave} className="space-y-5 pt-4">
              {eventError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {eventError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Event Title *</label>
                <Input
                  type="text"
                  placeholder="e.g. 15th Department Endowment Oration Lecture"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full text-base font-serif"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Event Date & Time *</label>
                  <Input
                    type="datetime-local"
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Event Venue (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. Department Auditorium, CUSAT"
                    value={eventFormData.venue}
                    onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                    className="w-full text-sm font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Apply / Registration URL (Optional)</label>
                <Input
                  type="url"
                  placeholder="https://forms.gle/..."
                  value={eventFormData.apply_link}
                  onChange={(e) => setEventFormData({ ...eventFormData, apply_link: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cover Image File OR Image URL *</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEventFormData({ ...eventFormData, imageFile: file, imageUrl: '' });
                        setEventImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-oxford file:text-white hover:file:bg-cyan-accent hover:file:text-oxford transition-all"
                  />

                  <div className="text-center text-xs text-slate-400 font-sans">OR</div>

                  <Input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={eventFormData.imageUrl}
                    onChange={(e) => {
                      setEventFormData({ ...eventFormData, imageUrl: e.target.value, imageFile: null });
                      setEventImagePreview(e.target.value);
                    }}
                    className="w-full text-xs font-mono"
                  />
                </div>

                {eventImagePreview && (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2 group">
                    <img src={eventImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setEventFormData({ ...eventFormData, imageFile: null, imageUrl: '' });
                        setEventImagePreview(null);
                      }}
                      className="absolute top-2.5 right-2.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                      title="Remove Cover Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Image</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Full Description (Text / Markdown) *</label>
                <textarea
                  rows={6}
                  placeholder="Enter event details, schedule, key topics, resource persons..."
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                />
              </div>

              {/* Event Gallery Management Section */}
              <EventGallerySection eventId={editingEvent ? editingEvent.id : null} />

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeEventModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={eventSaving} className="px-5 font-semibold">
                  {eventSaving ? 'Saving Event...' : editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Notification Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif">
            <DialogHeader className="flex items-center justify-between border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif">
                {editingNotif ? 'Edit Notification' : 'Create New Notification'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveNotification} className="space-y-5 pt-4">
              {formError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Notification Title *</label>
                <Input
                  type="text"
                  placeholder="e.g. National Physics Seminar 2026 Registration Open"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Category Tag</label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="w-full text-base">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Admissions">Admissions</SelectItem>
                    <SelectItem value="Research">Research & Conferences</SelectItem>
                    <SelectItem value="Exams">Exams & Timetables</SelectItem>
                    <SelectItem value="Events">Events & Workshops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Destination Link (Optional)</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full text-base font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Display Status</span>
                  <span className="text-xs text-slate-500">Show immediately in header ticker</span>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="px-5 font-semibold">
                  {saving ? 'Saving...' : editingNotif ? 'Update Notification' : 'Create Notification'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Faculty Modal */}
        <Dialog open={isFacultyModalOpen} onOpenChange={setIsFacultyModalOpen}>
          <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif">
                {editingFaculty ? 'Edit Faculty Credentials' : 'Register New Faculty Account'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleFacultySave} className="space-y-4 pt-4">
              {facultyFormError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {facultyFormError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Faculty Full Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={facultyFormData.name}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, name: e.target.value })}
                  className="w-full text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Email Address (Username) *</label>
                <Input
                  type="email"
                  placeholder="e.g. ramesh@cusat.ac.in"
                  value={facultyFormData.email}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, email: e.target.value })}
                  className="w-full text-base font-mono"
                />
              </div>

              {!editingFaculty ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Predefined Initial Password *</label>
                  <Input
                    type="text"
                    placeholder="e.g. facultyPass123"
                    value={facultyFormData.password}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, password: e.target.value })}
                    className="w-full text-base font-mono"
                  />
                  <p className="text-xs text-slate-500">
                    Faculty will be forced to change this password on their first login.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Reset Predefined Password (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Leave empty to keep existing password"
                    value={facultyFormData.newPredefinedPassword}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, newPredefinedPassword: e.target.value })}
                    className="w-full text-base font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Designation</label>
                  <Input
                    type="text"
                    value={facultyFormData.designation}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, designation: e.target.value })}
                    className="w-full text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Department</label>
                  <Input
                    type="text"
                    value={facultyFormData.department}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, department: e.target.value })}
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Account Active</span>
                  <span className="text-xs text-slate-500">Enable or disable login access</span>
                </div>
                <Switch
                  checked={facultyFormData.isActive}
                  onCheckedChange={(checked) => setFacultyFormData({ ...facultyFormData, isActive: checked })}
                />
              </div>

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeFacultyModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={facultySaving} className="px-5 font-semibold">
                  {facultySaving ? 'Saving...' : editingFaculty ? 'Update Account' : 'Register Account'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Hero Item Create/Edit Modal */}
        <Dialog open={isHeroModalOpen} onOpenChange={setIsHeroModalOpen}>
          <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <Sliders className="w-5 h-5 text-oxford" />
                <span>{editingHeroSlide ? 'Edit Hero Slide' : 'Add New Hero Slide (Max 10)'}</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleHeroSave} className="space-y-5 pt-4">
              {heroFormError && (
                <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {heroFormError}
                </div>
              )}

              {/* Title Input with live char counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Slide Title *</label>
                  <span className={`text-xs font-mono font-semibold ${heroFormData.title.length > 80 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                    {heroFormData.title.length}/80 chars
                  </span>
                </div>
                <Input
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Quantum Frontiers & Nanomaterials Research"
                  value={heroFormData.title}
                  onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                  className="w-full text-base font-serif"
                />
              </div>

              {/* Description Input with live char counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Slide Subtitle / Description</label>
                  <span className={`text-xs font-mono font-semibold ${heroFormData.description.length > 200 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                    {heroFormData.description.length}/200 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  placeholder="Pioneering research in magnetic nanocomposites, quantum transport..."
                  value={heroFormData.description}
                  onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                  className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford"
                />
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Upload Image File OR Image URL *</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setHeroFormData({ ...heroFormData, imageFile: file });
                        setHeroImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                  />
                  <div className="text-xs text-slate-400 text-center font-bold font-sans">OR</div>
                  <Input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={heroFormData.imageUrl}
                    onChange={(e) => {
                      setHeroFormData({ ...heroFormData, imageUrl: e.target.value });
                      setHeroImagePreview(e.target.value);
                    }}
                    className="w-full text-xs font-mono"
                  />
                </div>

                {heroImagePreview && (
                  <div className="mt-2 w-full h-24 rounded-xl border border-slate-200 overflow-hidden relative">
                    <img src={heroImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Visibility Status Switch */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-sm font-bold text-slate-900 block font-serif">Public Visibility</span>
                  <span className="text-xs text-slate-500 font-sans">Show on public homepage slideshow</span>
                </div>
                <Switch
                  checked={heroFormData.is_visible}
                  onCheckedChange={(checked) => setHeroFormData({ ...heroFormData, is_visible: checked })}
                />
              </div>

              <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
                <Button variant="outline" type="button" onClick={closeHeroModal} className="px-4">
                  Cancel
                </Button>
                <Button type="submit" disabled={heroSaving} className="px-5 font-semibold">
                  {heroSaving ? 'Saving...' : editingHeroSlide ? 'Update Hero Slide' : 'Create Hero Slide'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Full Faculty Profile Management Modal */}
        {fullManageFacultyId && (
          <AdminFacultyFullManageModal
            facultyId={fullManageFacultyId}
            isOpen={!!fullManageFacultyId}
            onClose={() => setFullManageFacultyId(null)}
            onFacultyUpdated={fetchFaculty}
          />
        )}
      </Tabs>
    );
  }

  // -------------------------------------------------------------
  // RENDER FACULTY DASHBOARD (IF ROLE IS FACULTY)
  // -------------------------------------------------------------
  return (
    <Tabs value={facultyTab} onValueChange={(val) => setFacultyTab(val as any)} className="min-h-screen bg-[#faf7f2] text-slate-900 flex flex-col md:flex-row font-sans selection:bg-oxford selection:text-white">
      {/* Left Sidebar */}
      <aside className="w-full md:w-80 lg:w-[320px] bg-oxford border-none text-white flex flex-col justify-between shrink-0 h-auto md:h-screen md:sticky md:top-0 p-4 sm:p-5 lg:p-6 shadow-2xl z-40 font-sans overflow-hidden">
        {/* Portal Branding Header */}
        <div className="shrink-0 flex items-center gap-3.5 px-2 pt-1 pb-5 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-accent shrink-0 shadow-inner">
            <Atom className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-serif leading-tight">Faculty Portal</h1>
              <Badge className="bg-cyan-accent text-oxford font-sans font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md">
                Faculty
              </Badge>
            </div>
            <p className="text-xs text-indigo-200/90 truncate mt-0.5" title={currentUser?.name}>{currentUser?.name || 'Faculty Member'}</p>
          </div>
        </div>

        {/* Navigation List (4 Options) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden my-3 pr-1 space-y-2">
          <p className="text-[11px] font-sans font-bold text-indigo-300 uppercase tracking-widest px-2 mb-2 sticky top-0 bg-oxford py-1 z-10">Faculty Menu</p>
          <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1.5 w-full border-none rounded-none shadow-none">
            {/* Option 1: Overview */}
            <TabsTrigger
              value="overview"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </TabsTrigger>

            {/* Option 2: Profile (contact, cv, photo, bio) */}
            <TabsTrigger
              value="profile"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <User className="w-4 h-4" />
                <span>Profile & Details</span>
              </div>
            </TabsTrigger>

            {/* Option 3: Research Scholars Page */}
            <TabsTrigger
              value="scholars"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <GraduationCap className="w-4 h-4" />
                <span>Research Scholars</span>
              </div>
              <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                {studentsList.length}
              </Badge>
            </TabsTrigger>

            {/* Option: Research Projects Page */}
            <TabsTrigger
              value="projects"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <FlaskConical className="w-4 h-4" />
                <span>Research Projects</span>
              </div>
              <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                {projectsList.length}
              </Badge>
            </TabsTrigger>

            {/* Option: Publications Page */}
            <TabsTrigger
              value="publications"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <BookOpen className="w-4 h-4" />
                <span>Publications</span>
              </div>
              <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                {publicationsList.length}
              </Badge>
            </TabsTrigger>

            {/* Option 4: Hero Section Page */}
            <TabsTrigger
              value="hero"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <Sliders className="w-4 h-4" />
                <span>Hero Section</span>
              </div>
              <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                {heroSlides.length}/10
              </Badge>
            </TabsTrigger>

            {/* Option 5: Events Management Page */}
            <TabsTrigger
              value="events"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <Calendar className="w-4 h-4" />
                <span>Events Management</span>
              </div>
              <Badge variant="outline" className="font-mono text-[11px] border-white/20 text-cyan-accent bg-white/5 px-2 py-0.5 rounded-md">
                {eventsList.length}
              </Badge>
            </TabsTrigger>

            {/* Option 6: Curriculum & Regulations Management */}
            <TabsTrigger
              value="curriculum"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <BookOpen className="w-4 h-4" />
                <span>Curriculum & Regulations</span>
              </div>
            </TabsTrigger>

            {/* Option 7: Research Laboratories Management */}
            <TabsTrigger
              value="labs"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <FlaskConical className="w-4 h-4" />
                <span>Research Laboratories</span>
              </div>
            </TabsTrigger>

            {/* Option 8: Central Facilities Management */}
            <TabsTrigger
              value="facilities"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 data-[state=active]:bg-white data-[state=active]:text-oxford data-[state=active]:font-bold data-[state=active]:shadow-lg border-none"
            >
              <div className="flex items-center gap-3.5">
                <Wrench className="w-4 h-4" />
                <span>Central Facilities</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Sidebar Footer / Account Actions */}
        <div className="shrink-0 pt-4 border-t border-white/10 space-y-2.5">
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center gap-2 text-xs font-semibold rounded-xl py-3 cursor-pointer shadow-xs transition-all"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-accent" />
            <span>Change Password</span>
          </Button>

          <Button
            variant="destructive"
            size="default"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 border-none text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-rose-900/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Logging out...' : 'Logout Session'}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-12">
        {/* OPTION 1: OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8 animate-fadeIn mt-0">
          <Card className="bg-transparent border-none rounded-none p-0 shadow-none relative overflow-visible flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
            <CardContent className="p-0 space-y-1">
              <CardTitle className="text-3xl font-bold font-serif text-slate-900 leading-none">
                Welcome back, {currentUser?.name}
              </CardTitle>
              <CardDescription className="text-slate-600 text-base mt-1">
                {currentUser?.designation || 'Faculty Member'} • {currentUser?.department || 'Department of Physics'}
              </CardDescription>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Module 1: Profile & Details */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Profile & Details</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Update contact numbers, social/academic links, upload profile photo & CV, and format research biography.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('profile')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Manage Profile</span>
              </Button>
            </Card>

            {/* Module 2: Research Scholars */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{studentsList.length}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Research Scholars</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Add, edit, or remove Ph.D., M.Phil, and Master research scholars under your active supervision.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('scholars')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Manage Scholars</span>
              </Button>
            </Card>

            {/* Module 3: Research Projects */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{projectsList.length}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Research Projects</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Manage sponsored and funded research projects, collaborator faculty, funding agency, and dates.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('projects')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Manage Projects</span>
              </Button>
            </Card>

            {/* Module 4: Publications */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{publicationsList.length}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Publications</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Manage journal articles, conference papers, publication dates, and external links or DOIs.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('publications')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Manage Publications</span>
              </Button>
            </Card>

            {/* Module 5: Hero Section */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{heroSlides.length}/10</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Hero Section</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Upload home page hero slides, reorder slides, and toggle banner visibility on the public site.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('hero')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Sliders className="w-4 h-4" />
                <span>Manage Hero</span>
              </Button>
            </Card>

            {/* Module 6: Events Management */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{eventsList.length}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Events Management</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Publish, edit, or remove department seminars, workshops, and endowment lectures.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('events')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Manage Events</span>
              </Button>
            </Card>

            {/* Module 7: Curriculum & Regulations */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Curriculum & Regulations</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Manage academic programs, degree levels, syllabus outlines, and regulation scheme PDF uploads.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('curriculum')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Curriculum & Schemes</span>
              </Button>
            </Card>

            {/* Module 8: Research Laboratories */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Research Laboratories</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Manage departmental laboratory profiles, research themes, facility photos, and faculty members.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('labs')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Research Labs</span>
              </Button>
            </Card>

            {/* Module 9: Central Facilities */}
            <Card className="bg-transparent border-none rounded-none p-0 flex flex-col justify-between space-y-4 shadow-none group">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-none">Central Facilities</CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-normal font-sans">
                  Manage advanced analytical equipment, instrumentation facilities, user charges, and in-charge faculty.
                </CardDescription>
              </CardContent>
              <Button
                variant="default"
                onClick={() => setFacultyTab('facilities')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Wrench className="w-4 h-4" />
                <span>Central Facilities</span>
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* OPTION 2: PROFILE TAB (Contact, Photo, CV, Bio) */}
        <TabsContent value="profile" className="space-y-8 animate-fadeIn mt-0">
          {/* Top Title */}
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 flex items-center gap-2.5">
              <User className="w-7 h-7 text-oxford shrink-0" />
              <span>Faculty Profile & Identity Management</span>
            </h2>
            <p className="text-slate-600 text-sm mt-1 font-sans">
              Manage your public faculty profile, academic credentials, research network links, curriculum vitae, and biography.
            </p>
          </div>

          {/* FACULTY HERO CARD */}
          <Card className="bg-gradient-to-br from-white via-slate-50/50 to-cyan-50/20 rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
            {/* Subtle decorative background glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-oxford/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8 justify-between">
              {/* Left: Avatar + Identity */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                {/* Avatar with interactive hover overlay */}
                <div className="relative group shrink-0">
                  <div
                    onClick={() => setIsDocModalOpen(true)}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-slate-200/90 shadow-md overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:border-oxford group-hover:shadow-lg relative"
                    title="Click to update profile photo"
                  >
                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={currentUser?.name || 'Faculty Avatar'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-oxford to-slate-800 flex items-center justify-center text-white">
                        <User className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-oxford/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-[11px] font-sans font-medium">
                      <Upload className="w-4 h-4" />
                      <span>Change</span>
                    </div>
                  </div>
                </div>

                {/* Identity Info */}
                <div className="space-y-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                    {currentUser?.name || 'Faculty Member'}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 font-sans">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-oxford/10 text-oxford border border-oxford/20">
                      {currentUser?.designation || 'Faculty Member'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentUser?.department || 'Department of Physics'}</span>
                    </span>
                  </div>

                  {/* Contact Badges Row */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1 font-sans text-xs">
                    {currentUser?.email && (
                      <a
                        href={`mailto:${currentUser.email}`}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-oxford hover:underline bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-oxford" />
                        <span>{currentUser.email}</span>
                      </a>
                    )}
                    <button
                      onClick={() => setIsProfilesModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-oxford bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-700" />
                      <span>{phone || 'Add Phone Number'}</span>
                    </button>
                    {cvPath ? (
                      <a
                        href={cvPath}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-800 bg-cyan-50/80 hover:bg-cyan-100/80 px-2.5 py-1 rounded-lg border border-cyan-200 shadow-2xs font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Official CV (PDF)</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setIsDocModalOpen(true)}
                        className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs transition-colors cursor-pointer"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>CV not uploaded</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Quick Action Controls */}
              <div className="flex md:flex-col items-center sm:items-stretch gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                <Button
                  onClick={() => setIsDescModalOpen(true)}
                  className="w-full justify-center bg-oxford hover:bg-oxford-dark text-white shadow-xs font-sans text-xs font-bold py-2.5 h-auto rounded-xl cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Edit Biography</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDocModalOpen(true)}
                  className="w-full justify-center border-slate-300 text-slate-700 hover:bg-slate-100 font-sans text-xs font-semibold py-2.5 h-auto rounded-xl cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-oxford" />
                  <span>Update Photo & CV</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsProfilesModalOpen(true)}
                  className="w-full justify-center border-slate-300 text-slate-700 hover:bg-slate-100 font-sans text-xs font-semibold py-2.5 h-auto rounded-xl cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-cyan-700" />
                  <span>Manage Links</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* QUICK HIGHLIGHTS / METRICS STRIP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setFacultyTab('scholars')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-oxford/50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 font-sans uppercase tracking-wider">Guided Scholars</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-oxford group-hover:text-white group-hover:border-oxford transition-all">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                {studentsList.length}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1 flex items-center gap-1 group-hover:text-oxford">
                <span>Supervised researchers</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>

            <div
              onClick={() => setFacultyTab('projects')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-oxford/50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 font-sans uppercase tracking-wider">Research Projects</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-oxford group-hover:text-white group-hover:border-oxford transition-all">
                  <FlaskConical className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                {projectsList.length}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1 flex items-center gap-1 group-hover:text-oxford">
                <span>Funded grants & projects</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>

            <div
              onClick={() => setFacultyTab('publications')}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-oxford/50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 font-sans uppercase tracking-wider">Publications</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-oxford group-hover:text-white group-hover:border-oxford transition-all">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                {publicationsList.length}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1 flex items-center gap-1 group-hover:text-oxford">
                <span>Articles & book chapters</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>

            <div
              onClick={() => setIsProfilesModalOpen(true)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-oxford/50 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 font-sans uppercase tracking-wider">Linked Profiles</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-oxford group-hover:text-white group-hover:border-oxford transition-all">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                {selectedPlatforms.size + otherProfiles.filter((op) => op.name && op.url).length}
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1 flex items-center gap-1 group-hover:text-oxford">
                <span>Academic & web networks</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </div>

          {/* TWO COLUMN DEEP DIVE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Links, Documents & Department Info (4 of 12 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Academic & Digital Profiles */}
              <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-oxford/10 flex items-center justify-center text-oxford">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-serif text-slate-900">
                        Academic Networks
                      </h3>
                      <p className="text-[11px] text-slate-500 font-sans">
                        {selectedPlatforms.size + otherProfiles.filter((o) => o.name && o.url).length} profiles configured
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsProfilesModalOpen(true)}
                    className="h-7 text-xs font-semibold px-2.5 rounded-lg border-slate-300 hover:border-oxford cursor-pointer"
                  >
                    Edit
                  </Button>
                </div>

                {selectedPlatforms.size === 0 && otherProfiles.filter((o) => o.name && o.url).length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-50/80 rounded-xl border border-dashed border-slate-200 space-y-3">
                    <Globe className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700 font-sans">No Academic Profiles Linked</p>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Connect your Google Scholar, ORCID, and Scopus profiles so visitors can discover your publications.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsProfilesModalOpen(true)}
                      className="text-xs font-semibold h-8 bg-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-oxford" />
                      <span>Add Profiles</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1 font-sans">
                    {/* Predefined Platforms */}
                    {Array.from(selectedPlatforms).map((key) => {
                      const platform = PREDEFINED_PLATFORMS.find((p) => p.key === key);
                      if (!platform || !platformUrls[key]) return null;
                      return (
                        <a
                          key={key}
                          href={platformUrls[key]}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-oxford/60 hover:shadow-xs transition-all group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              key === 'google_scholar' ? 'bg-blue-500' :
                              key === 'orcid' ? 'bg-[#A6CE39]' :
                              key === 'scopus' ? 'bg-[#FF6C00]' :
                              key === 'iqac_profile' ? 'bg-emerald-500' :
                              key === 'iris' ? 'bg-purple-500' :
                              key === 'linkedin' ? 'bg-sky-600' : 'bg-oxford'
                            }`} />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 group-hover:text-oxford transition-colors">
                                {platform.label}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                                {platformUrls[key]}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-oxford transition-colors shrink-0 ml-2" />
                        </a>
                      );
                    })}

                    {/* Custom Profiles */}
                    {otherProfiles.filter((op) => op.name && op.url).map((op) => (
                      <a
                        key={op.id}
                        href={op.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-oxford/60 hover:shadow-xs transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-oxford transition-colors">
                              {op.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                              {op.url}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-oxford transition-colors shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* RIGHT COLUMN: Professional Overview & Research Biography (8 of 12 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-oxford/10 flex items-center justify-center text-oxford shrink-0">
                      <FileText className="w-5 h-5 text-oxford" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                          Professional Overview & Research Biography
                        </h3>
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-sans bg-slate-100 text-slate-600 border border-slate-200">
                          <Code className="w-3 h-3 text-slate-500" />
                          <span>Markdown</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">
                        Displayed on your public faculty page for prospective scholars, collaborators, and visitors.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsDescModalOpen(true)}
                    className="bg-oxford hover:bg-oxford-dark text-white text-xs font-semibold h-8 px-3.5 rounded-xl shrink-0 shadow-2xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    <span>Edit Bio</span>
                  </Button>
                </div>

                {/* Info Callout */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-600 font-sans flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    You can include your academic qualifications, research interests, laboratory activities, awards, and course details. The text editor supports Markdown formatting including headers, lists, links, and bold styling.
                  </p>
                </div>

                {/* Rendered Bio Display Container */}
                <div className="bg-slate-50/40 rounded-2xl border border-slate-200/90 p-6 sm:p-8 min-h-[380px]">
                  {markdownContent && markdownContent.trim() ? (
                    <div className="prose max-w-none font-sans leading-relaxed">
                      {renderMarkdown(markdownContent)}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="space-y-1.5 max-w-md">
                        <h4 className="text-base font-bold font-serif text-slate-800">
                          No Professional Biography Added Yet
                        </h4>
                        <p className="text-xs text-slate-500 font-sans leading-relaxed">
                          Introduce yourself, highlight your research areas, academic credentials, honors, and research projects to visitors and prospective students.
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsDescModalOpen(true)}
                        className="bg-oxford hover:bg-oxford-dark text-white font-sans text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        <span>Write Biography</span>
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* OPTION 3: RESEARCH SCHOLARS TAB */}
        <TabsContent value="scholars" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-oxford" />
                <span>Guided Scholars & Research Students ({studentsList.length})</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Manage research scholars, Ph.D. candidates, and project students under your supervision.
              </p>
            </div>
            <Button onClick={() => openStudentModal()} className="flex items-center gap-2 py-3 px-5 font-semibold">
              <Plus className="w-4 h-4" />
              <span>Add Research Scholar</span>
            </Button>
          </div>

          <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {studentsList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <GraduationCap className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No guided scholars listed yet.</p>
                <p className="text-xs text-slate-500 font-sans">Click "Add Research Scholar" to register student research profiles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {studentsList.map((st) => (
                  <div key={st.uid} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3 relative group shadow-xs hover:bg-white hover:border-slate-300 transition-all">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                      {st.image ? (
                        <img src={st.image} alt={st.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-2 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1 pr-6 font-serif">
                      <p className="text-base font-bold text-slate-900">{st.name}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 font-sans">{st.description || 'Research Scholar'}</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                      <button onClick={() => openStudentModal(st)} className="p-1 text-slate-500 hover:text-slate-900" title="Edit Scholar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteStudent(st.uid)} className="p-1 text-rose-600 hover:text-rose-700" title="Delete Scholar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* OPTION: RESEARCH PROJECTS TAB */}
        <TabsContent value="projects" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-7 h-7 text-oxford" />
                <span>Sponsored & Funded Research Projects ({projectsList.length})</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Manage your research projects, funding agencies, role, timelines, and collaborators.
              </p>
            </div>
            <Button onClick={() => openProjectModal()} className="flex items-center gap-2 py-3 px-5 font-semibold">
              <Plus className="w-4 h-4" />
              <span>Add Research Project</span>
            </Button>
          </div>

          <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {projectsList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <FlaskConical className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No research projects listed yet.</p>
                <p className="text-xs text-slate-500 font-sans">Click "Add Research Project" to record sponsored research grants.</p>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {projectsList.map((pj) => (
                  <div key={pj.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 relative group hover:bg-white hover:border-slate-300 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-bold text-slate-900 font-serif">{pj.title}</span>
                          <Badge variant={pj.status === 'Ongoing' ? 'default' : 'secondary'} className="text-[10px]">
                            {pj.status || 'Ongoing'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 font-sans">
                          {pj.role && <strong className="text-oxford">{pj.role}</strong>}
                          {pj.agency && <span> • Agency: <strong>{pj.agency}</strong></span>}
                          {pj.funding && <span> • Grant: <strong>{pj.funding}</strong></span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {pj.externalLink && (
                          <a href={pj.externalLink} target="_blank" rel="noreferrer" className="p-1.5 text-indigo-600 hover:text-indigo-800">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => openProjectModal(pj)} className="p-1.5 text-slate-500 hover:text-slate-900" title="Edit Project">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProject(pj.id)} className="p-1.5 text-rose-600 hover:text-rose-700" title="Delete Project">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {pj.description && <p className="text-xs text-slate-600 leading-relaxed font-sans">{pj.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* OPTION: PUBLICATIONS TAB */}
        <TabsContent value="publications" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-oxford" />
                <span>Publications & Research Papers ({publicationsList.length})</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Manage your peer-reviewed journal papers, conference articles, publication dates, and external links / DOIs.
              </p>
            </div>
            <Button onClick={() => openPublicationModal()} className="flex items-center gap-2 py-3 px-5 font-semibold">
              <Plus className="w-4 h-4" />
              <span>Add Publication</span>
            </Button>
          </div>

          <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {publicationsList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No publications listed yet.</p>
                <p className="text-xs text-slate-500 font-sans">Click "Add Publication" to add your research publications.</p>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {publicationsList.map((pub) => (
                  <div key={pub.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 relative group hover:bg-white hover:border-slate-300 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {pub.category || 'Journal Article'}
                          </span>
                          {pub.publicationDate && (
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(pub.publicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 font-serif leading-snug">{pub.title}</h4>
                        {pub.authors && (
                          <p className="text-xs text-slate-700 font-medium">
                            <span className="font-semibold text-slate-800">Authors:</span> {pub.authors}
                          </p>
                        )}
                        {pub.journal && (
                          <p className="text-xs text-slate-600 italic font-serif">{pub.journal}</p>
                        )}
                        {pub.description && (
                          <p className="text-xs text-slate-600 leading-relaxed pt-1">{pub.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {pub.externalLink && (
                          <a href={pub.externalLink} target="_blank" rel="noreferrer" className="p-1.5 text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg" title="External Link / DOI">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => openPublicationModal(pub)} className="p-1.5 text-slate-500 hover:text-slate-900" title="Edit Publication">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeletePublication(pub.id)} className="p-1.5 text-rose-600 hover:text-rose-700" title="Delete Publication">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* OPTION 4: HERO SECTION TAB */}
        <TabsContent value="hero" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Sliders className="w-7 h-7 text-amber-700" />
                <span>Home Page Hero Carousel Section</span>
                <Badge variant="outline" className="ml-2 font-mono text-xs border-amber-700 text-amber-800 bg-amber-50">
                  {heroSlides.length}/10 Records
                </Badge>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Add, edit, reorder, and toggle visibility of home page hero slides.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={fetchHeroSlides} className="h-10 w-10">
                <RefreshCw className={`w-4 h-4 ${loadingHero ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={() => openHeroModal()} disabled={heroSlides.length >= 10} className="flex items-center gap-2 font-semibold">
                <Plus className="w-4 h-4" />
                <span>Add Hero Item ({heroSlides.length}/10)</span>
              </Button>
            </div>
          </div>

          <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {heroSlides.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <Sliders className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No hero items available.</p>
              </div>
            ) : (
              <Table className="text-sm font-sans">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold w-12 text-xs">Order</TableHead>
                    <TableHead className="font-bold text-xs">Preview</TableHead>
                    <TableHead className="font-bold text-xs">Title (Max 80)</TableHead>
                    <TableHead className="font-bold text-xs">Description (Max 200)</TableHead>
                    <TableHead className="font-bold text-xs">Status</TableHead>
                    <TableHead className="font-bold text-xs text-center">Reorder</TableHead>
                    <TableHead className="text-right font-bold text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heroSlides.map((slide, idx) => (
                    <TableRow key={slide.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-bold text-slate-700 font-mono text-xs py-3">#{idx + 1}</TableCell>
                      <TableCell className="py-3">
                        <div className="w-16 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 max-w-[200px] text-xs py-3">
                        <div className="line-clamp-2">{slide.title}</div>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">({slide.title.length}/80)</span>
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-[240px] text-xs py-3">
                        <div className="line-clamp-2">{slide.description || '—'}</div>
                        <span className="text-[10px] font-mono text-slate-400">({slide.description.length}/200)</span>
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        <button type="button" className="flex items-center gap-1 font-bold text-xs hover:underline cursor-pointer" onClick={() => toggleHeroVisibility(slide)}>
                          {slide.is_visible ? (
                            <span className="text-emerald-600 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /><span>ON</span></span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1"><EyeOff className="w-3.5 h-3.5" /><span>OFF</span></span>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <div className="inline-flex items-center gap-0.5 bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                          <button type="button" disabled={idx === 0} onClick={() => moveHeroSlide(idx, 'up')} className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                          <button type="button" disabled={idx === heroSlides.length - 1} onClick={() => moveHeroSlide(idx, 'down')} className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openHeroModal(slide)} className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteHeroSlide(slide.id)} className="h-8 w-8 text-rose-600 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* OPTION 5: EVENTS MANAGEMENT TAB */}
        <TabsContent value="events" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Calendar className="w-7 h-7 text-oxford" />
                <span>Events Management Portal</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Add, edit, or remove department seminars, workshops, endowment lectures, and conferences.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchEvents}
                className="h-10 w-10 text-slate-700 hover:text-slate-950"
                title="Refresh Events"
              >
                <RefreshCw className={`w-4 h-4 ${loadingEvents ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="default"
                onClick={() => openEventModal()}
                className="flex items-center gap-2 py-2.5 px-5 font-semibold rounded-xl transition-all text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Event</span>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            {eventsList.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Calendar className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No events found in database</p>
                <Button variant="outline" onClick={() => openEventModal()} className="mt-2">
                  Create First Event
                </Button>
              </div>
            ) : (
              <Table className="text-base">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-bold">Cover Image</TableHead>
                    <TableHead className="text-base font-bold">Event Title & ID</TableHead>
                    <TableHead className="text-base font-bold">Event Date</TableHead>
                    <TableHead className="text-base font-bold">Apply Link</TableHead>
                    <TableHead className="text-right text-base font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventsList.map((ev) => (
                    <TableRow key={ev.id} className="hover:bg-slate-50/40">
                      <TableCell className="py-3">
                        <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-200">
                          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>

                      <TableCell className="py-3 max-w-xs">
                        <div className="font-bold text-slate-900 truncate" title={ev.title}>{ev.title}</div>
                        <div className="text-xs text-slate-500 font-mono">ID: {ev.id}</div>
                      </TableCell>

                      <TableCell className="font-mono text-sm text-slate-700 py-3 whitespace-nowrap">
                        {new Date(ev.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>

                      <TableCell className="py-3">
                        {ev.apply_link ? (
                          <a
                            href={ev.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <span>Registration URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-sans italic">None</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right space-x-2 whitespace-nowrap py-3">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => openEventModal(ev)}
                          className="h-9 w-9 text-slate-600 hover:text-slate-900"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="h-9 w-9"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* RESEARCH PROJECTS TAB CONTENT */}
        <TabsContent value="projects" className="space-y-8 animate-fadeIn mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-7 h-7 text-oxford" />
                <span>Sponsored & Funded Research Projects ({projectsList.length})</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Add, edit, or remove research projects, co-faculty collaborators, funding agencies, grants, and dates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchProjects}
                className="h-10 w-10 text-slate-700 hover:text-slate-950"
                title="Refresh Projects"
              >
                <RefreshCw className={`w-4 h-4 ${loadingProjects ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => openProjectModal()}
                className="flex items-center gap-2 py-3 px-5 font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Create Project</span>
              </Button>
            </div>
          </div>

          <Card className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {loadingProjects ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-oxford border-t-transparent rounded-full animate-spin" />
                <span>Loading research projects...</span>
              </div>
            ) : projectsList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <FlaskConical className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">No research projects added yet.</p>
                <p className="text-xs text-slate-500 font-sans">Click "Create Project" to record sponsored or funded research projects.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projectsList.map((proj) => {
                  const isOngoing = !proj.endDate || (proj.status ? proj.status === 'Ongoing' : new Date(proj.endDate) >= new Date());
                  const isOwner = proj.facultyId === currentUser?.id;

                  return (
                    <div
                      key={proj.id}
                      className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 font-sans"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                              isOngoing
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {isOngoing ? 'Ongoing' : 'Completed'}
                            </span>

                            {!isOwner && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                Co-Faculty Project
                              </span>
                            )}
                          </div>

                          {proj.agency && (
                            <span className="text-xs font-bold text-slate-700 bg-slate-200/70 border border-slate-300/80 px-2.5 py-1 rounded">
                              {proj.agency}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold font-serif text-oxford leading-snug">
                          {proj.title}
                        </h3>

                        {proj.description && (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                            {proj.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-sans pt-3 border-t border-slate-200/80">
                          <div>
                            <span className="font-semibold text-oxford">Role:</span>{' '}
                            <span>{isOwner ? (proj.role || 'Principal Investigator') : `Co-Investigator (PI: ${proj.faculty?.name || 'Faculty Member'})`}</span>
                          </div>

                          {proj.funding && (
                            <div>
                              <span className="font-semibold text-oxford">Funding:</span>{' '}
                              <span>{proj.funding}</span>
                            </div>
                          )}

                          {proj.startDate && (
                            <div>
                              <span className="font-semibold text-oxford">Start Date:</span>{' '}
                              <span>{new Date(proj.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                            </div>
                          )}

                          <div>
                            <span className="font-semibold text-oxford">End Date:</span>{' '}
                            <span>{proj.endDate ? new Date(proj.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'None (Ongoing)'}</span>
                          </div>
                        </div>

                        {proj.otherFaculty && (
                          <div className="text-xs text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-sans">
                            <span className="font-semibold text-oxford">Co-Faculty / Team:</span> {proj.otherFaculty}
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                          {proj.externalLink ? (
                            <a
                              href={proj.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                            >
                              <span>External Project Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : <div />}

                          {isOwner ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openProjectModal(proj)}
                                className="h-8 text-xs px-3"
                              >
                                <Edit className="w-3.5 h-3.5 mr-1" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProject(proj.id)}
                                className="h-8 text-xs px-3"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                <span>Delete</span>
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-sans italic">
                              Managed by PI ({proj.faculty?.name || 'Faculty Member'})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* FACULTY CURRICULUM TAB */}
        <TabsContent value="curriculum" className="space-y-10 animate-fadeIn mt-0">
          <CurriculumManagementSection />
        </TabsContent>

        {/* FACULTY RESEARCH LABS TAB */}
        <TabsContent value="labs" className="space-y-10 animate-fadeIn mt-0">
          <ResearchLabManagementSection />
        </TabsContent>

        {/* FACULTY FACILITIES TAB */}
        <TabsContent value="facilities" className="space-y-10 animate-fadeIn mt-0">
          <FacilityManagementSection />
        </TabsContent>
      </main>

      {/* FACULTY MODALS (LIGHT WARM THEME) */}
      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Lock className="w-5 h-5 text-oxford" />
              <span>Change Account Password</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 pt-4">
            {passwordError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">New Password *</label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Confirm New Password *</label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-base"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              {!currentUser?.mustChangePassword && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4"
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={changingPassword} className="px-5 font-semibold">
                {changingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profiles Modal */}
      <Dialog open={isProfilesModalOpen} onOpenChange={setIsProfilesModalOpen}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[88vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Globe className="w-5 h-5 text-oxford" />
              <span>Contact Info & Academic Profiles</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProfiles} className="space-y-5 pt-4 font-sans">
            {profilesError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {profilesError}
              </div>
            )}
            {profilesSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profilesSuccess}</span>
              </div>
            )}

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Office Phone / Contact Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="+91 484 2575500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 text-sm font-mono rounded-xl"
                />
              </div>
            </div>

            {/* Predefined Platforms */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Academic & Scholarly Networks</label>
                <span className="text-[11px] text-slate-500">{selectedPlatforms.size} active</span>
              </div>
              <p className="text-xs text-slate-500">
                Click a platform to enable/disable it, then paste your public profile URL below.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PREDEFINED_PLATFORMS.map((p) => {
                  const isSel = selectedPlatforms.has(p.key);
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => togglePlatform(p.key)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between font-medium cursor-pointer ${
                        isSel
                          ? 'bg-oxford/10 border-oxford text-oxford font-bold shadow-2xs'
                          : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{p.label}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-oxford shrink-0 ml-1 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {Array.from(selectedPlatforms).map((key) => {
                const platform = PREDEFINED_PLATFORMS.find((p) => p.key === key);
                if (!platform) return null;
                return (
                  <div key={key} className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>{platform.label} URL</span>
                      <button
                        type="button"
                        onClick={() => togglePlatform(key)}
                        className="text-[11px] text-rose-600 hover:underline font-normal cursor-pointer"
                      >
                        Remove
                      </button>
                    </label>
                    <Input
                      type="url"
                      placeholder={platform.placeholder}
                      value={platformUrls[key] || ''}
                      onChange={(e) => handleUrlChange(key, e.target.value)}
                      className="w-full text-xs font-mono rounded-xl"
                    />
                  </div>
                );
              })}
            </div>

            {/* Custom Other Links */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Custom Profiles & Websites</label>
                  <p className="text-xs text-slate-500">Add other links like ResearchGate, GitHub, personal blogs, or lab pages.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomProfile}
                  className="h-7 text-xs font-semibold px-2.5 rounded-lg border-slate-300 text-oxford cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Link</span>
                </Button>
              </div>

              {otherProfiles.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  {otherProfiles.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Platform / Label (e.g. ResearchGate)"
                          value={item.name}
                          onChange={(e) => updateCustomProfile(item.id, 'name', e.target.value)}
                          className="w-1/2 text-xs rounded-lg bg-white"
                        />
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={item.url}
                          onChange={(e) => updateCustomProfile(item.id, 'url', e.target.value)}
                          className="w-1/2 text-xs font-mono rounded-lg bg-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomProfile(item.id)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsProfilesModalOpen(false)} className="px-4 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={savingProfiles} className="px-5 font-semibold bg-oxford hover:bg-oxford-dark text-white cursor-pointer">
                {savingProfiles ? 'Saving...' : 'Save Profiles & Links'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Upload Modal */}
      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Upload className="w-5 h-5 text-oxford" />
              <span>Upload Photo & Curriculum Vitae</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveDocuments} className="space-y-5 pt-4 font-sans">
            {docError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {docError}
              </div>
            )}
            {docSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{docSuccess}</span>
              </div>
            )}

            {/* Profile Photo Section */}
            <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Profile Photo (JPG, PNG, WebP &lt; 5MB)</label>
                {imagePath && (
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument('image')}
                    className="text-[11px] text-rose-600 hover:underline font-medium cursor-pointer"
                  >
                    Delete current
                  </button>
                )}
              </div>

              {(imagePreviewUrl || imagePath) && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <img src={imagePreviewUrl || imagePath!} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">{selectedImageFile ? 'New photo selected' : 'Current photo'}</p>
                    <p className="text-slate-500">{selectedImageFile ? selectedImageFile.name : 'Active on profile'}</p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageFileSelect}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-oxford/10 file:text-oxford hover:file:bg-oxford/20 cursor-pointer"
              />
            </div>

            {/* CV Document Section */}
            <div className="space-y-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Curriculum Vitae (PDF &lt; 10MB)</label>
                {cvPath && (
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument('cv')}
                    className="text-[11px] text-rose-600 hover:underline font-medium cursor-pointer"
                  >
                    Delete current
                  </button>
                )}
              </div>

              {cvPath && (
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-oxford" />
                    <span className="font-medium text-slate-800">Current CV document is active</span>
                  </div>
                  <a
                    href={cvPath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-800 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {selectedCvFile && (
                <div className="p-2 bg-white rounded-xl border border-cyan-200 text-xs text-cyan-800 font-medium">
                  Selected new file: {selectedCvFile.name}
                </div>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={handleCvFileSelect}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-oxford/10 file:text-oxford hover:file:bg-oxford/20 cursor-pointer"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsDocModalOpen(false)} className="px-4 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={uploadingDocs} className="px-5 font-semibold bg-oxford hover:bg-oxford-dark text-white cursor-pointer">
                {uploadingDocs ? 'Uploading...' : 'Save Documents'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Description Markdown Modal */}
      <Dialog open={isDescModalOpen} onOpenChange={setIsDescModalOpen}>
        <DialogContent className="max-w-3xl bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[88vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-oxford" />
              <span>Edit Professional Overview & Research Biography</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveDescription} className="space-y-4 pt-3 font-sans">
            {descError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {descError}
              </div>
            )}
            {descSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{descSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDescActiveTab('write')}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                    descActiveTab === 'write' ? 'bg-oxford text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                  }`}
                >
                  Write Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setDescActiveTab('preview')}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                    descActiveTab === 'preview' ? 'bg-oxford text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                  }`}
                >
                  Live Preview
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                {markdownContent.length} characters
              </span>
            </div>

            {descActiveTab === 'write' ? (
              <div className="space-y-2">
                {/* Markdown Formatting Quick Bar */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80 text-xs">
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('## ', '')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 border border-slate-200 cursor-pointer"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('### ', '')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 border border-slate-200 cursor-pointer"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('**', '**')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 font-bold text-slate-700 border border-slate-200 cursor-pointer"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('*', '*')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 italic text-slate-700 border border-slate-200 cursor-pointer"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('- ', '')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                    title="Bullet list"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('> ', '')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                    title="Blockquote"
                  >
                    “ Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('`', '`')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 font-mono text-slate-700 border border-slate-200 cursor-pointer"
                    title="Inline Code"
                  >
                    &lt;/&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('[', '](https://...)')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                    title="Web Link"
                  >
                    🔗 Link
                  </button>
                </div>

                <textarea
                  id="markdown-editor-textarea"
                  rows={13}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="Write your research interests, educational background, honors, and laboratory summary using Markdown..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
                />
              </div>
            ) : (
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-6 min-h-[300px] text-xs font-sans text-slate-900 leading-relaxed overflow-y-auto max-h-[400px]">
                {renderMarkdown(markdownContent)}
              </div>
            )}

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsDescModalOpen(false)} className="px-4 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={savingDesc} className="px-5 font-semibold bg-oxford hover:bg-oxford-dark text-white cursor-pointer">
                {savingDesc ? 'Saving...' : 'Save Biography'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Modal */}
      <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-oxford" />
              <span>{editingStudent ? 'Edit Scholar Profile' : 'Add Guided Research Scholar'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveStudent} className="space-y-4 pt-4">
            {studentError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {studentError}
              </div>
            )}
            {studentSuccess && (
              <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                {studentSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Student Name *</label>
              <Input
                type="text"
                placeholder="e.g. Ananya Nair"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Research Topic / Degree</label>
              <textarea
                rows={3}
                placeholder="e.g. Ph.D. Scholar working on Quantum Photonics"
                value={studentDescription}
                onChange={(e) => setStudentDescription(e.target.value)}
                className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Scholar Photo (Optional)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleStudentImageSelect}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={closeStudentModal} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={savingStudent} className="px-5 font-semibold">
                {savingStudent ? 'Saving...' : editingStudent ? 'Update Scholar' : 'Add Scholar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Faculty Project Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-oxford" />
              <span>{editingProject ? 'Edit Research Project' : 'Add Research Project'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleProjectSave} className="space-y-4 pt-3 font-sans">
            {projectError && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {projectError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Project Title *</label>
              <Input
                type="text"
                required
                value={projectFormData.title}
                onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                placeholder="e.g. Investigation of High-Tc Superconductors"
                className="w-full text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Role</label>
                <Input
                  type="text"
                  value={projectFormData.role}
                  onChange={(e) => setProjectFormData({ ...projectFormData, role: e.target.value })}
                  placeholder="e.g. Principal Investigator"
                  className="w-full text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Funding Agency</label>
                <Input
                  type="text"
                  value={projectFormData.agency}
                  onChange={(e) => setProjectFormData({ ...projectFormData, agency: e.target.value })}
                  placeholder="e.g. DST-SERB, ISRO, CSIR"
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Grant / Funding Amount</label>
                <Input
                  type="text"
                  value={projectFormData.funding}
                  onChange={(e) => setProjectFormData({ ...projectFormData, funding: e.target.value })}
                  placeholder="e.g. ₹45,00,000"
                  className="w-full text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">External Link / URL</label>
                <Input
                  type="url"
                  value={projectFormData.externalLink}
                  onChange={(e) => setProjectFormData({ ...projectFormData, externalLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Start Date</label>
                <Input
                  type="date"
                  value={projectFormData.startDate}
                  onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                  className="w-full text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">End Date (Leave blank if Ongoing)</label>
                <Input
                  type="date"
                  value={projectFormData.endDate}
                  onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value })}
                  className="w-full text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Project Description</label>
              <textarea
                rows={3}
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                placeholder="Summary of research objectives, methodologies, and outcomes..."
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-oxford"
              />
            </div>

            <DialogFooter className="pt-3 flex gap-2 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingProject} className="font-semibold">
                {savingProject ? 'Saving...' : 'Save Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Faculty Publication Modal */}
      <Dialog open={isPublicationModalOpen} onOpenChange={setIsPublicationModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-oxford" />
              <span>{editingPublication ? 'Edit Publication' : 'Add New Publication'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePublicationSave} className="space-y-4 pt-3 font-sans">
            {publicationError && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {publicationError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Publication Title *</label>
              <Input
                type="text"
                required
                value={publicationFormData.title}
                onChange={(e) => setPublicationFormData({ ...publicationFormData, title: e.target.value })}
                placeholder="e.g. Quantum Transport in Nanostructure Arrays"
                className="w-full text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Journal / Publisher / Venue</label>
              <Input
                type="text"
                value={publicationFormData.journal}
                onChange={(e) => setPublicationFormData({ ...publicationFormData, journal: e.target.value })}
                placeholder="e.g. Physical Review B, ACS Nano"
                className="w-full text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Authors</label>
              <Input
                type="text"
                value={publicationFormData.authors}
                onChange={(e) => setPublicationFormData({ ...publicationFormData, authors: e.target.value })}
                placeholder="e.g. A. Sharma, B. Ray, C. Kumar"
                className="w-full text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Publication Date</label>
                <Input
                  type="date"
                  value={publicationFormData.publicationDate}
                  onChange={(e) => setPublicationFormData({ ...publicationFormData, publicationDate: e.target.value })}
                  className="w-full text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Category</label>
                <Select
                  value={publicationFormData.category}
                  onValueChange={(val) => setPublicationFormData({ ...publicationFormData, category: val })}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Journal Article">Journal Article</SelectItem>
                    <SelectItem value="Conference Paper">Conference Paper</SelectItem>
                    <SelectItem value="Book Chapter">Book Chapter</SelectItem>
                    <SelectItem value="Preprint">Preprint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">External Link / URL</label>
                <Input
                  type="url"
                  value={publicationFormData.externalLink}
                  onChange={(e) => setPublicationFormData({ ...publicationFormData, externalLink: e.target.value })}
                  placeholder="https://doi.org/..."
                  className="w-full text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">DOI Number</label>
                <Input
                  type="text"
                  value={publicationFormData.doi}
                  onChange={(e) => setPublicationFormData({ ...publicationFormData, doi: e.target.value })}
                  placeholder="10.1016/j.physletb..."
                  className="w-full text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Abstract / Brief Notes</label>
              <textarea
                rows={3}
                value={publicationFormData.description}
                onChange={(e) => setPublicationFormData({ ...publicationFormData, description: e.target.value })}
                placeholder="Brief summary or notes..."
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-oxford"
              />
            </div>

            <DialogFooter className="pt-3 flex gap-2 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsPublicationModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingPublication} className="font-semibold">
                {savingPublication ? 'Saving...' : 'Save Publication'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Create / Edit Modal for Faculty */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <Calendar className="w-5 h-5 text-oxford" />
              <span>{editingEvent ? 'Edit Event' : 'Add New Event'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEventSave} className="space-y-5 pt-4">
            {eventError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {eventError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Event Title *</label>
              <Input
                type="text"
                placeholder="e.g. 15th Department Endowment Oration Lecture"
                value={eventFormData.title}
                onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                className="w-full text-base font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Event Date & Time *</label>
                <Input
                  type="datetime-local"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Event Venue (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. Department Auditorium, CUSAT"
                  value={eventFormData.venue}
                  onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                  className="w-full text-sm font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Apply / Registration URL (Optional)</label>
              <Input
                type="url"
                placeholder="https://forms.gle/..."
                value={eventFormData.apply_link}
                onChange={(e) => setEventFormData({ ...eventFormData, apply_link: e.target.value })}
                className="w-full text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Cover Image File OR Image URL *</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEventFormData({ ...eventFormData, imageFile: file, imageUrl: '' });
                      setEventImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-oxford file:text-white hover:file:bg-cyan-accent hover:file:text-oxford transition-all"
                />

                <div className="text-center text-xs text-slate-400 font-sans">OR</div>

                <Input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={eventFormData.imageUrl}
                  onChange={(e) => {
                    setEventFormData({ ...eventFormData, imageUrl: e.target.value, imageFile: null });
                    setEventImagePreview(e.target.value);
                  }}
                  className="w-full text-xs font-mono"
                />
              </div>

              {eventImagePreview && (
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mt-2 group">
                  <img src={eventImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setEventFormData({ ...eventFormData, imageFile: null, imageUrl: '' });
                      setEventImagePreview(null);
                    }}
                    className="absolute top-2.5 right-2.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                    title="Remove Cover Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Full Description (Text / Markdown) *</label>
              <textarea
                rows={6}
                placeholder="Enter event details, schedule, key topics, resource persons..."
                value={eventFormData.description}
                onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
              />
            </div>

            {/* Event Gallery Management Section */}
            <EventGallerySection eventId={editingEvent ? editingEvent.id : null} />

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={closeEventModal} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={eventSaving} className="px-5 font-semibold">
                {eventSaving ? 'Saving Event...' : editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Create / Edit Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-xl font-serif text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-oxford" />
              <span>{editingProject ? 'Edit Research Project' : 'Create New Research Project'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleProjectSave} className="space-y-4 pt-4 font-sans">
            {projectError && (
              <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                {projectError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Project Title *</label>
              <Input
                type="text"
                placeholder="e.g. Development of Advanced Functional Materials"
                value={projectFormData.title}
                onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                className="w-full text-base font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Faculty Role</label>
                <Input
                  type="text"
                  placeholder="e.g. Principal Investigator / Co-PI"
                  value={projectFormData.role}
                  onChange={(e) => setProjectFormData({ ...projectFormData, role: e.target.value })}
                  className="w-full text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Funding Agency</label>
                <Input
                  type="text"
                  placeholder="e.g. DST-SERB, CSIR, UGC-DAE CSR"
                  value={projectFormData.agency}
                  onChange={(e) => setProjectFormData({ ...projectFormData, agency: e.target.value })}
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Grant / Funding</label>
                <Input
                  type="text"
                  placeholder="e.g. ₹48.50 Lakhs"
                  value={projectFormData.funding}
                  onChange={(e) => setProjectFormData({ ...projectFormData, funding: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Start Date</label>
                <Input
                  type="date"
                  value={projectFormData.startDate}
                  onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                  className="w-full text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">End Date</label>
                <Input
                  type="date"
                  value={projectFormData.endDate}
                  onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value })}
                  className="w-full text-sm font-mono"
                />
                <p className="text-[11px] text-slate-500 italic">If empty, Status = Ongoing</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Co-Faculty Members / Collaborators</label>
              
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-sans font-semibold">Select Faculty from Department DB:</span>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {(() => {
                    const availableCoFaculty = allDbFaculty.filter(
                      (fac) => fac.id !== currentUser?.id && fac.name?.toLowerCase() !== currentUser?.name?.toLowerCase()
                    );
                    if (availableCoFaculty.length === 0) {
                      return <span className="text-xs text-slate-400 italic font-sans">No other department faculty records found</span>;
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
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-oxford text-white border-oxford font-bold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <span>{fac.name}</span>
                          {isSelected ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-accent" />
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
                  <span className="text-xs font-semibold text-oxford">Selected:</span>
                  {selectedCoFacultyNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-full"
                    >
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCoFacultyNames(selectedCoFacultyNames.filter((n) => n !== name))}
                        className="hover:text-rose-600 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">External Project Link (Optional)</label>
              <Input
                type="url"
                placeholder="https://..."
                value={projectFormData.externalLink}
                onChange={(e) => setProjectFormData({ ...projectFormData, externalLink: e.target.value })}
                className="w-full text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Description / Abstract</label>
              <textarea
                rows={4}
                placeholder="Enter project summary, objectives, or key achievements..."
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                className="w-full bg-white border border-[#e8e2d5] rounded-xl p-3 text-sm text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-oxford leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button variant="outline" type="button" onClick={closeProjectModal} className="px-4">
                Cancel
              </Button>
              <Button type="submit" disabled={savingProject} className="px-5 font-semibold">
                {savingProject ? 'Saving Project...' : editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}